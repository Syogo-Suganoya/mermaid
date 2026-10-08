import { describe, it, expect, vi, afterEach } from 'vitest';
import * as diagramAPI from '../../diagram-api/diagramAPI.js';
import type { BlockDB } from './blockDB.js';
import type { Block } from './blockTypes.js';
import { calculateBlockPosition, layout } from './layout.js';

describe('Layout', function () {
  it('should calculate position correctly', () => {
    expect(calculateBlockPosition(2, 0)).toEqual({ px: 0, py: 0 });
    expect(calculateBlockPosition(2, 1)).toEqual({ px: 1, py: 0 });
    expect(calculateBlockPosition(2, 2)).toEqual({ px: 0, py: 1 });
    expect(calculateBlockPosition(2, 3)).toEqual({ px: 1, py: 1 });
    expect(calculateBlockPosition(2, 4)).toEqual({ px: 0, py: 2 });
    expect(calculateBlockPosition(1, 3)).toEqual({ px: 0, py: 3 });
  });
});

describe('layout runtime config', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should read block.padding from config at call time, not at import time', () => {
    const makeRoot = (): Block => ({
      id: 'root',
      type: 'square',
      columns: 2,
      children: [
        { id: 'b1', type: 'square', children: [], size: { width: 100, height: 50, x: 0, y: 0 } },
        { id: 'b2', type: 'square', children: [], size: { width: 100, height: 50, x: 0, y: 0 } },
      ],
    });

    const makeDb = (root: Block): BlockDB =>
      ({ getBlock: (id: string) => (id === 'root' ? root : undefined) }) as unknown as BlockDB;

    vi.spyOn(diagramAPI, 'getConfig').mockReturnValue({ block: { padding: 4 } } as any);
    const result1 = layout(makeDb(makeRoot()));

    vi.spyOn(diagramAPI, 'getConfig').mockReturnValue({ block: { padding: 20 } } as any);
    const result2 = layout(makeDb(makeRoot()));

    // padding=4:  width = 2*(100+4)+4 = 212
    // padding=20: width = 2*(100+20)+20 = 260
    // If padding were cached at module load time both calls would return the same value.
    expect(result1).not.toEqual(result2);
    expect(result1!.width).toBeLessThan(result2!.width);
  });
});

// cspell:ignore dbconn Websphere
describe('nested blocks with column spans (issue #7731)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const leaf = (id: string, widthInColumns = 1, width = 100, height = 40): Block => ({
    id,
    type: 'square',
    children: [],
    widthInColumns,
    size: { width, height, x: 0, y: 0 },
  });
  const space = (widthInColumns: number): Block => ({
    id: `space-${widthInColumns}`,
    type: 'space',
    children: [],
    widthInColumns,
    size: { width: 0, height: 0, x: 0, y: 0 },
  });

  /**
   * block
   *   columns 5
   *   was["Websphere application server"]:5
   *   block:app:4
   *     columns 4
   *     m1:2  m2:2
   *     space:4
   *     block:dbconn:2
   *       columns 2
   *       vdb:2  tb1  tb2
   *     end
   *     jms:2
   *   end
   *   xam["XA Transaction Manager"]
   */
  const layoutIssueDiagram = (padding = 8) => {
    const dbconn: Block = {
      id: 'dbconn',
      type: 'composite',
      columns: 2,
      widthInColumns: 2,
      children: [leaf('vdb', 2), leaf('tb1'), leaf('tb2')],
    };
    const app: Block = {
      id: 'app',
      type: 'composite',
      columns: 4,
      widthInColumns: 4,
      children: [leaf('m1', 2), leaf('m2', 2), space(4), dbconn, leaf('jms', 2)],
    };
    const root: Block = {
      id: 'root',
      type: 'composite',
      columns: 5,
      children: [leaf('was', 5, 200), app, leaf('xam', 1, 160)],
    };
    const blocks = new Map<string, Block>();
    const collect = (block: Block) => {
      blocks.set(block.id, block);
      block.children.forEach(collect);
    };
    collect(root);

    vi.spyOn(diagramAPI, 'getConfig').mockReturnValue({ block: { padding } } as any);
    const bounds = layout({ getBlock: (id: string) => blocks.get(id) } as unknown as BlockDB);
    const box = (id: string) => {
      const { x, y, width, height } = blocks.get(id)!.size!;
      return {
        left: x - width / 2,
        right: x + width / 2,
        top: y - height / 2,
        bottom: y + height / 2,
      };
    };
    return { blocks, bounds, box };
  };

  it('gives a nested block the full width of the columns it spans', () => {
    const padding = 8;
    const { blocks, box } = layoutIssueDiagram(padding);
    const cell = blocks.get('xam')!.size!.width;
    // app spans 4 of the 5 root columns
    expect(blocks.get('app')!.size!.width).toBeCloseTo(4 * cell + 3 * padding);
    // was spans all 5 columns: its right edge lines up with xam's
    expect(box('was').right).toBeCloseTo(box('xam').right);
    expect(box('was').left).toBeCloseTo(box('app').left);
  });

  it('fills a nested block with its children', () => {
    const padding = 8;
    const { blocks, box } = layoutIssueDiagram(padding);
    const app = box('app');
    // m1 and m2 (2 + 2 of 4 columns) and dbconn and jms (2 + 2) each fill a row of app
    expect(box('m1').left).toBeCloseTo(app.left + padding);
    expect(box('m2').right).toBeCloseTo(app.right - padding);
    expect(box('dbconn').left).toBeCloseTo(app.left + padding);
    expect(box('jms').right).toBeCloseTo(app.right - padding);
    expect(blocks.get('dbconn')!.size!.width).toBeCloseTo(blocks.get('jms')!.size!.width);
    // and vdb spans both columns of dbconn
    expect(box('vdb').left).toBeCloseTo(box('dbconn').left + padding);
    expect(box('vdb').right).toBeCloseTo(box('dbconn').right - padding);
  });

  it('does not overlap siblings', () => {
    const { box } = layoutIssueDiagram();
    expect(box('dbconn').right).toBeLessThan(box('jms').left);
    expect(box('app').right).toBeLessThan(box('xam').left);
    expect(box('m1').right).toBeLessThan(box('m2').left);
    expect(box('tb1').right).toBeLessThan(box('tb2').left);
  });

  it('sizes each row by its own content', () => {
    const { blocks, box } = layoutIssueDiagram();
    // was is not stretched to the height of the app row
    expect(blocks.get('was')!.size!.height).toBe(40);
    expect(box('was').bottom).toBeLessThan(box('app').top);
    // xam fills the row it shares with app
    expect(blocks.get('xam')!.size!.height).toBe(blocks.get('app')!.size!.height);
    // the row holding only a space keeps the height of a regular block
    expect(box('dbconn').top - box('m1').bottom).toBeGreaterThan(40);
  });
});
