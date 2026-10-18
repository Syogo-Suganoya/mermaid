import { describe, expect, it } from 'vitest';
import type { Edge, LayoutData, Node } from '../../../types.js';
import {
  collectSideNotes,
  orientSideNoteEdges,
  placeSideNotes,
  reserveSideNoteSpace,
  SIDE_NOTE_GAP,
  withoutSideNotes,
} from '../placeSideNotes.js';

const node = (id: string, extra: Partial<Node> = {}): Node =>
  ({ id, width: 100, height: 40, isGroup: false, ...extra }) as Node;

const edge = (id: string, start: string, end: string): Edge => ({ id, start, end }) as Edge;

/** The data a state diagram produces for `note right of A` / `note left of B` (issue #6108). */
const stateData = (direction = 'TB'): LayoutData =>
  ({
    direction,
    nodes: [
      node('A'),
      node('A-parent', { isGroup: true, padding: 16, position: 'right of' }),
      node('A-note', { parentId: 'A-parent', position: 'right of', width: 150, height: 60 }),
      node('B'),
      node('B-parent', { isGroup: true, padding: 16, position: 'left of' }),
      node('B-note', { parentId: 'B-parent', position: 'left of', width: 150, height: 60 }),
    ],
    edges: [edge('A-B', 'A', 'B'), edge('A-note', 'A', 'A-note'), edge('note-B', 'B-note', 'B')],
  }) as unknown as LayoutData;

describe('side notes', () => {
  it('collects notes placed left or right of a node in a vertical layout', () => {
    const sideNotes = collectSideNotes(stateData());
    expect(sideNotes.map(({ note, anchor, side, group }) => [note.id, anchor.id, side, group?.id]))
      .toMatchInlineSnapshot(`
      [
        [
          "A-note",
          "A",
          "right",
          "A-parent",
        ],
        [
          "B-note",
          "B",
          "left",
          "B-parent",
        ],
      ]
    `);
  });

  it('leaves notes alone in a horizontal layout, where the edge already places them', () => {
    expect(collectSideNotes(stateData('LR'))).toEqual([]);
    expect(collectSideNotes(stateData('RL'))).toEqual([]);
  });

  it('leaves notes alone inside a container running another direction', () => {
    const data = stateData();
    data.nodes.push(node('C', { isGroup: true, dir: 'LR' }));
    for (const n of data.nodes) {
      if (['A', 'A-parent'].includes(n.id)) {
        n.parentId = 'C';
      }
    }
    expect(collectSideNotes(data).map(({ note }) => note.id)).toEqual(['B-note']);
  });

  it('hands ELK the graph without the notes, their groups and their edges', () => {
    const data = stateData();
    const view = withoutSideNotes(data, collectSideNotes(data));
    expect(view.nodes.map(({ id }) => id)).toEqual(['A', 'B']);
    expect(view.edges.map(({ id }) => id)).toEqual(['A-B']);
    expect(data.nodes).toHaveLength(6);
  });

  it('reserves the space beside the anchor as an outside label on that side', () => {
    const data = stateData();
    const elkNodes: Record<string, { labels?: any[] }> = { A: {}, B: {} };
    reserveSideNoteSpace(elkNodes, collectSideNotes(data));
    expect(elkNodes.A.labels?.[0]).toMatchObject({
      width: 150 + 2 * 16 + SIDE_NOTE_GAP,
      height: 60 + 2 * 16,
      layoutOptions: { 'org.eclipse.elk.nodeLabels.placement': 'OUTSIDE V_CENTER H_RIGHT' },
    });
    expect(elkNodes.B.labels?.[0].layoutOptions).toEqual({
      'org.eclipse.elk.nodeLabels.placement': 'OUTSIDE V_CENTER H_LEFT',
    });
  });

  it('places each note beside its anchor, vertically centred, with a straight edge', () => {
    const data = stateData();
    const sideNotes = collectSideNotes(data);
    const byId = new Map(data.nodes.map((n) => [n.id, n]));
    Object.assign(byId.get('A')!, { x: 200, y: 50, labels: [{}] });
    Object.assign(byId.get('B')!, { x: 200, y: 150 });

    placeSideNotes(sideNotes);

    const aNote = byId.get('A-note')!;
    const bNote = byId.get('B-note')!;
    const groupWidth = 150 + 2 * 16;
    expect(aNote.x).toBe(200 + 50 + SIDE_NOTE_GAP + groupWidth / 2);
    expect(aNote.y).toBe(50);
    expect(bNote.x).toBe(200 - 50 - SIDE_NOTE_GAP - groupWidth / 2);
    expect(bNote.y).toBe(150);
    expect(byId.get('A-parent')).toMatchObject({ x: aNote.x, y: 50, width: groupWidth });
    expect((byId.get('A') as { labels?: unknown }).labels).toBeUndefined();

    const noteEdge = data.edges.find(({ id }) => id === 'A-note')!;
    expect(noteEdge.points).toEqual([
      { x: 250, y: 50 },
      { x: aNote.x! - 75, y: 50 },
    ]);
  });

  it('sizes a group holding a note on each side of the same state around both', () => {
    const data = {
      direction: 'TB',
      nodes: [
        node('A', { x: 200, y: 50 }),
        node('P', { isGroup: true, padding: 0 }),
        node('L', { parentId: 'P', position: 'left of' }),
        node('R', { parentId: 'P', position: 'right of' }),
      ],
      edges: [edge('l', 'L', 'A'), edge('r', 'A', 'R')],
    } as unknown as LayoutData;
    const sideNotes = collectSideNotes(data);
    expect(sideNotes).toHaveLength(2);
    expect(withoutSideNotes(data, sideNotes).nodes.map(({ id }) => id)).toEqual(['A']);

    placeSideNotes(sideNotes);
    const group = data.nodes[1];
    expect(group.x).toBe(200);
    expect(group.width).toBe(2 * (50 + SIDE_NOTE_GAP + 100));
  });

  it('reverses note edges for ELK in a right-to-left layout', () => {
    const data = stateData('RL');
    const elkEdges = data.edges.map(({ id, start, end }) => ({
      id,
      sources: [start!],
      targets: [end!],
      layoutReversed: undefined as boolean | undefined,
    }));
    orientSideNoteEdges(data, elkEdges);
    expect(
      elkEdges.map(({ id, sources, layoutReversed }) => [id, sources[0], layoutReversed])
    ).toEqual([
      ['A-B', 'A', undefined],
      ['A-note', 'A-note', true],
      ['note-B', 'B', true],
    ]);
  });

  it('does not touch note edges in a left-to-right layout', () => {
    const data = stateData('LR');
    const elkEdges = data.edges.map(({ id, start, end }) => ({
      id,
      sources: [start!],
      targets: [end!],
    }));
    orientSideNoteEdges(data, elkEdges);
    expect(elkEdges.map(({ sources }) => sources[0])).toEqual(['A', 'A', 'B-note']);
  });
});
