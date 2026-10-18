import type { Edge, LayoutData, Node } from '../../types.js';

/** Horizontal gap between a note and the node it annotates. */
export const SIDE_NOTE_GAP = 30;

const VERTICAL_DIRECTIONS = new Set(['TB', 'TD', 'BT']);

/** A note declared with `left of` / `right of` another node. */
export interface SideNote {
  note: Node;
  /** The node the note annotates. */
  anchor: Node;
  /** The edge joining the note to its anchor. */
  edge: Edge;
  /** The group wrapping only the notes of the anchor, if any (state diagrams add one). */
  group?: Node;
  side: 'left' | 'right';
}

/**
 * Finds the notes that have to be placed to the left or right of the node they annotate.
 *
 * Layered layouts put the two ends of an edge on different layers, so a note joined to its node
 * by an edge ends up above or below it under a top-down direction, and on the opposite side under
 * a right-to-left one. Notes found here are taken out of the ELK graph instead, the space they need
 * is reserved beside their node (see {@link reserveSideNoteSpace}), and they are put there once the
 * layout has run (see {@link placeSideNotes}).
 *
 * Only simple cases are handled: a leaf note joined to a leaf node by exactly one edge, optionally
 * wrapped in a group holding nothing but notes of that node. Anything else is left to the regular
 * layout.
 *
 * @param data4Layout - The layout data.
 * @returns The notes to place beside their nodes.
 */
export function collectSideNotes(data4Layout: LayoutData): SideNote[] {
  const nodeById = new Map(data4Layout.nodes.map((node) => [node.id, node]));
  const sideNotes: SideNote[] = [];
  const used = new Set<string>();

  // The reserved space only keeps other nodes away across the flow of the layout. Along the flow
  // (left to right, or right to left) the note is already put beside its node by the edge, so only
  // vertical flows are handled, and only when no container on the way up runs another direction.
  const isVertical = (dir?: string) => dir === undefined || VERTICAL_DIRECTIONS.has(dir);
  const flowsVertically = (node: Node) => {
    const seen = new Set<Node>();
    let parent = node.parentId ? nodeById.get(node.parentId) : undefined;
    while (parent && !seen.has(parent)) {
      if (!isVertical(parent.dir)) {
        return false;
      }
      seen.add(parent);
      parent = parent.parentId ? nodeById.get(parent.parentId) : undefined;
    }
    return true;
  };
  if (!isVertical((data4Layout as { direction?: string }).direction)) {
    return sideNotes;
  }

  for (const note of data4Layout.nodes) {
    if (note.isGroup || (note.position !== 'left of' && note.position !== 'right of')) {
      continue;
    }
    const edges = data4Layout.edges.filter(
      (edge) => edge.start === note.id || edge.end === note.id
    );
    if (edges.length !== 1) {
      continue;
    }
    const [edge] = edges;
    const anchorId = edge.start === note.id ? edge.end : edge.start;
    const anchor = anchorId ? nodeById.get(anchorId) : undefined;
    if (!anchor || anchor === note || anchor.isGroup || !flowsVertically(anchor)) {
      continue;
    }

    let group: Node | undefined;
    const parent = note.parentId ? nodeById.get(note.parentId) : undefined;
    if (parent) {
      // State diagrams wrap all notes of a state in one group.
      const onlyHoldsNotesOfAnchor = data4Layout.nodes.every(
        (node) =>
          node.parentId !== parent.id ||
          (!node.isGroup &&
            data4Layout.edges.some(
              (other) =>
                (other.start === node.id && other.end === anchor.id) ||
                (other.end === node.id && other.start === anchor.id)
            ))
      );
      const isTargeted = data4Layout.edges.some(
        (other) => other.start === parent.id || other.end === parent.id
      );
      if (!parent.isGroup || !onlyHoldsNotesOfAnchor || isTargeted) {
        continue;
      }
      group = parent;
      // The group stands in for the note in its parent; the anchor has to live there too, or
      // the note would be drawn outside the container it belongs to.
      if (group.parentId !== anchor.parentId) {
        continue;
      }
    } else if (note.parentId !== anchor.parentId) {
      continue;
    }

    // One reserved slot per side of a node.
    const side = note.position === 'right of' ? 'right' : 'left';
    const key = `${anchor.id}:${side}`;
    if (used.has(key)) {
      continue;
    }
    used.add(key);
    sideNotes.push({ note, anchor, edge, group, side });
  }

  return sideNotes;
}

/**
 * Returns a view of the layout data without the side notes, their groups and their edges.
 *
 * @param data4Layout - The layout data.
 * @param sideNotes - The notes found by {@link collectSideNotes}.
 * @returns The layout data to hand to ELK.
 */
export function withoutSideNotes(data4Layout: LayoutData, sideNotes: SideNote[]): LayoutData {
  if (sideNotes.length === 0) {
    return data4Layout;
  }
  const removedNodes = new Set<Node>(sideNotes.map(({ note }) => note));
  for (const { group } of sideNotes) {
    if (
      group &&
      data4Layout.nodes.every((node) => node.parentId !== group.id || removedNodes.has(node))
    ) {
      removedNodes.add(group);
    }
  }
  const removedEdges = new Set<Edge>(sideNotes.map(({ edge }) => edge));
  return {
    ...data4Layout,
    nodes: data4Layout.nodes.filter((node) => !removedNodes.has(node)),
    edges: data4Layout.edges.filter((edge) => !removedEdges.has(edge)),
  };
}

const sizeOf = ({ note, group }: SideNote) => {
  const padding = group ? (group.padding ?? 0) : 0;
  return {
    width: (note.width ?? 0) + 2 * padding,
    height: (note.height ?? 0) + 2 * padding,
  };
};

/**
 * Reserves the space for each side note next to its anchor in the ELK graph.
 *
 * The reservation is an outside node label: ELK's layered algorithm counts those as part of the
 * node's margins, so it keeps the space free of other nodes and edges, while edges still attach to
 * the node itself.
 *
 * @param elkNodes - The ELK nodes by id.
 * @param sideNotes - The notes found by {@link collectSideNotes}.
 */
export function reserveSideNoteSpace(
  elkNodes: Record<string, { labels?: unknown[] }>,
  sideNotes: SideNote[]
): void {
  for (const sideNote of sideNotes) {
    const elkNode = elkNodes[sideNote.anchor.id];
    if (!elkNode) {
      continue;
    }
    const { width, height } = sizeOf(sideNote);
    elkNode.labels = [
      ...(elkNode.labels ?? []),
      {
        id: `${sideNote.note.id}-reserved-space`,
        text: '',
        width: width + SIDE_NOTE_GAP,
        height,
        layoutOptions: {
          'org.eclipse.elk.nodeLabels.placement': `OUTSIDE V_CENTER H_${sideNote.side.toUpperCase()}`,
        },
      },
    ];
  }
}

/**
 * Puts each side note (and its group) in the space reserved beside its anchor, and draws the edge
 * joining them as a straight line.
 *
 * Positions are centre-based and absolute, as written back by the ELK layout. Nodes and edges are
 * updated in place.
 *
 * @param sideNotes - The notes found by {@link collectSideNotes}.
 */
export function placeSideNotes(sideNotes: SideNote[]): void {
  const groupBoxes = new Map<Node, { left: number; right: number; top: number; bottom: number }>();
  for (const sideNote of sideNotes) {
    const { note, anchor, edge, group } = sideNote;
    // The reservation is an ELK detail; it must not reach the painted node.
    delete (anchor as { labels?: unknown }).labels;
    if (
      anchor.x === undefined ||
      anchor.y === undefined ||
      anchor.width === undefined ||
      note.width === undefined
    ) {
      continue;
    }
    const direction = sideNote.side === 'right' ? 1 : -1;
    const { width, height } = sizeOf(sideNote);
    const x = anchor.x + direction * (anchor.width / 2 + SIDE_NOTE_GAP + width / 2);
    const y = anchor.y;

    note.x = x;
    note.y = y;
    if (group) {
      const box = {
        left: x - width / 2,
        right: x + width / 2,
        top: y - height / 2,
        bottom: y + height / 2,
      };
      const previous = groupBoxes.get(group);
      groupBoxes.set(
        group,
        previous
          ? {
              left: Math.min(previous.left, box.left),
              right: Math.max(previous.right, box.right),
              top: Math.min(previous.top, box.top),
              bottom: Math.max(previous.bottom, box.bottom),
            }
          : box
      );
    }

    const anchorSide = { x: anchor.x + (direction * anchor.width) / 2, y };
    const noteSide = { x: x - (direction * note.width) / 2, y };
    edge.points = edge.start === anchor.id ? [anchorSide, noteSide] : [noteSide, anchorSide];
  }

  for (const [group, box] of groupBoxes) {
    group.x = (box.left + box.right) / 2;
    group.y = (box.top + box.bottom) / 2;
    group.width = box.right - box.left;
    group.height = box.bottom - box.top;
  }
}

/**
 * Orients the edge joining a `left of` / `right of` note to its node along a horizontal flow.
 *
 * Along a left-to-right or right-to-left flow the note is put beside its node by the layered
 * layout itself: the source of an edge comes first in the flow. The edge is declared from the left
 * element to the right one, which only matches a left-to-right flow, so under a right-to-left flow
 * it is handed to ELK reversed (and restored once routed).
 *
 * @param data4Layout - The layout data handed to ELK.
 * @param elkEdges - The ELK edges built from it.
 */
export function orientSideNoteEdges(
  data4Layout: LayoutData,
  elkEdges: { id: string; sources: string[]; targets: string[]; layoutReversed?: boolean }[]
): void {
  if ((data4Layout as { direction?: string }).direction !== 'RL') {
    return;
  }
  const nodeById = new Map(data4Layout.nodes.map((node) => [node.id, node]));
  const isRightToLeft = (node: Node) => {
    const seen = new Set<Node>();
    let parent = node.parentId ? nodeById.get(node.parentId) : undefined;
    while (parent && !seen.has(parent)) {
      if (parent.dir !== undefined && parent.dir !== 'RL') {
        return false;
      }
      seen.add(parent);
      parent = parent.parentId ? nodeById.get(parent.parentId) : undefined;
    }
    return true;
  };
  const edgeById = new Map(data4Layout.edges.map((edge) => [edge.id, edge]));
  for (const elkEdge of elkEdges) {
    const edge = edgeById.get(elkEdge.id);
    const start = edge?.start ? nodeById.get(edge.start) : undefined;
    const end = edge?.end ? nodeById.get(edge.end) : undefined;
    const note = [start, end].find(
      (node) => node?.position === 'left of' || node?.position === 'right of'
    );
    if (!note || elkEdge.layoutReversed || !isRightToLeft(note)) {
      continue;
    }
    [elkEdge.sources, elkEdge.targets] = [elkEdge.targets, elkEdge.sources];
    elkEdge.layoutReversed = true;
  }
}
