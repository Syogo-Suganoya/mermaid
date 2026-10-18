import type { BlockDB } from './blockDB.js';
import type { Block } from './blockTypes.js';
import { log } from '../../logger.js';
import { getConfig } from '../../diagram-api/diagramAPI.js';

interface BlockPosition {
  px: number;
  py: number;
}

export function calculateBlockPosition(columns: number, position: number): BlockPosition {
  // log.debug('calculateBlockPosition abc89', columns, position);
  // Ensure that columns is a positive integer
  if (columns === 0 || !Number.isInteger(columns)) {
    throw new Error('Columns must be an integer !== 0.');
  }

  // Ensure that position is a non-negative integer
  if (position < 0 || !Number.isInteger(position)) {
    throw new Error('Position must be a non-negative integer.' + position);
  }

  if (columns < 0) {
    // Auto columns is set
    return { px: position, py: 0 };
  }
  if (columns === 1) {
    // Auto columns is set
    return { px: 0, py: position };
  }
  // Calculate posX and posY
  const px = position % columns;
  const py = Math.floor(position / columns);
  // log.debug('calculateBlockPosition abc89', columns, position, '=> (', px, py, ')');
  return { px, py };
}

interface ChildPlacement {
  child: Block;
  /** The row of the grid the child is placed in. */
  row: number;
  /** The number of columns the child occupies, clamped to the end of its row. */
  span: number;
}

/**
 * Assigns the children of a block to rows of its grid.
 *
 * Shared by sizing and positioning so the two always agree on where a child goes. A child
 * spanning more columns than are left in its row is clamped to the end of that row.
 *
 * @param block - The block whose children are placed.
 * @returns The placement of every child, in order.
 */
export function placeChildren(block: Block): ChildPlacement[] {
  const columns = block.columns ?? -1;
  const placements: ChildPlacement[] = [];
  let columnPos = 0;
  for (const child of block.children ?? []) {
    const { py } = calculateBlockPosition(columns, columnPos);
    let span = child.widthInColumns ?? 1;
    if (columns > 0) {
      // Make sure overflowing lines do not affect later lines
      span = Math.min(span, columns - (columnPos % columns));
    }
    placements.push({ child, row: py, span });
    columnPos += span;
  }
  return placements;
}

/**
 * The number of columns of a block's grid: its `columns` setting, or the number of columns its
 * children take up in a single row when it has no setting (or more columns than children).
 */
const getGridColumns = (block: Block, placements: ChildPlacement[]) => {
  const usedColumns = placements.reduce((sum, { span }) => sum + span, 0);
  const columns = block.columns ?? -1;
  return Math.max(1, columns > 0 ? Math.min(columns, usedColumns) : usedColumns);
};

/** The width of a child spanning `span` cells of `cellWidth`, including the gaps between them. */
const getSpanWidth = (cellWidth: number, span: number, padding: number) =>
  cellWidth * span + padding * (span - 1);

/** The width of a cell in a grid of `columns` columns that is `width` wide. */
const getCellWidth = (width: number, columns: number, padding: number) =>
  (width - padding - columns * padding) / columns;

/**
 * Widens a block to `width`, spreading the extra width over the cells of its grid so that nested
 * blocks fill the space they span.
 */
function setBlockWidth(block: Block, width: number, padding: number) {
  block.size ??= { width: 0, height: 0, x: 0, y: 0 };
  block.size.width = width;
  if (!block.children?.length) {
    return;
  }
  const placements = placeChildren(block);
  const cellWidth = getCellWidth(width, getGridColumns(block, placements), padding);
  for (const { child, span } of placements) {
    setBlockWidth(child, getSpanWidth(cellWidth, span, padding), padding);
  }
}

/**
 * Sizes a block from its children, bottom-up.
 *
 * Every column of a grid gets the same cell width: the widest child per column it spans. Each
 * child is then widened to the cells it spans (nested blocks re-spread that width over their own
 * cells). Each row gets the height of its tallest child, so a short row is not stretched to the
 * height of a tall one elsewhere in the grid.
 */
function setBlockSizes(block: Block, db: BlockDB, padding = 8) {
  block.size ??= { width: 0, height: 0, x: 0, y: 0 };
  if (!block.children?.length) {
    return;
  }

  for (const child of block.children) {
    setBlockSizes(child, db, padding);
  }

  const placements = placeChildren(block);
  const columns = getGridColumns(block, placements);

  let cellWidth = 0;
  for (const { child, span } of placements) {
    if (child.type === 'space' || !child.size) {
      continue;
    }
    cellWidth = Math.max(cellWidth, (child.size.width - padding * (span - 1)) / span);
  }
  // Keep the block at least as wide as it was measured, e.g. to fit its own label.
  const width = Math.max(columns * (cellWidth + padding) + padding, block.size.width);
  cellWidth = getCellWidth(width, columns, padding);

  // A row holding only spaces gets the height of a regular block.
  let blockHeight = 0;
  const rowHeights = new Map<number, number>();
  for (const { child, row } of placements) {
    if (child.type === 'space' || !child.size) {
      continue;
    }
    if (!child.children?.length) {
      blockHeight = Math.max(blockHeight, child.size.height);
    }
    rowHeights.set(row, Math.max(rowHeights.get(row) ?? 0, child.size.height));
  }

  for (const { child, row, span } of placements) {
    setBlockWidth(child, getSpanWidth(cellWidth, span, padding), padding);
    const rowHeight = rowHeights.get(row) ?? blockHeight;
    rowHeights.set(row, rowHeight);
    child.size!.height = Math.max(child.size!.height, rowHeight);
    if (!child.children?.length) {
      // Plain blocks fill their row; nested blocks keep their content at the top.
      child.size!.height = rowHeight;
    }
  }

  let height = padding;
  for (const rowHeight of rowHeights.values()) {
    height += rowHeight + padding;
  }

  block.size = { width, height, x: 0, y: 0 };
  log.debug('setBlockSizes (done)', block.id, block.size);
}

function layoutBlocks(block: Block, db: BlockDB, padding = 8) {
  log.debug(
    `abc85 layout blocks (=>layoutBlocks) ${block.id} x: ${block?.size?.x} y: ${block?.size?.y} width: ${block?.size?.width}`
  );
  const columns = block.columns ?? -1;
  log.debug('layoutBlocks columns abc95', block.id, '=>', columns, block);
  if (
    block.children && // find max width of children
    block.children.length > 0
  ) {
    const placements = placeChildren(block);

    // Per-row max heights so y-positioning accounts for rows of different heights
    const rowHeights = new Map<number, number>();
    for (const { child, row } of placements) {
      if (child.size && child.size.height > (rowHeights.get(row) ?? 0)) {
        rowHeights.set(row, child.size.height);
      }
    }
    const rowYOffsets = new Map<number, number>();
    {
      let offset = 0;
      const rows = [...rowHeights.keys()].sort((a, b) => a - b);
      for (const row of rows) {
        rowYOffsets.set(row, offset);
        offset += (rowHeights.get(row) ?? 0) + padding;
      }
    }

    log.debug('abc91 block?.size?.x', block.id, block?.size?.x);
    let startingPosX = block?.size?.x ? block?.size?.x + (-block?.size?.width / 2 || 0) : -padding;
    let rowPos = 0;
    for (const { child, row: py } of placements) {
      const parent = block;

      if (!child.size) {
        continue;
      }
      const { width, height } = child.size;
      if (py != rowPos) {
        rowPos = py;
        startingPosX = block?.size?.x ? block?.size?.x + (-block?.size?.width / 2 || 0) : -padding;
        log.debug('New row in layout for block', block.id, ' and child ', child.id, rowPos);
      }
      log.debug(
        `abc89 layout blocks (child) id: ${child.id} row: ${py} (${parent?.size?.x},${parent?.size?.y}) parent: ${parent.id} width: ${width}${padding}`
      );
      if (parent.size) {
        const halfWidth = width / 2;
        child.size.x = startingPosX + padding + halfWidth;

        // cspell:ignore pyid
        log.debug(
          `abc91 layout blocks (calc) px, pyid:${
            child.id
          } startingPos=X${startingPosX} new startingPosX${
            child.size.x
          } ${halfWidth} padding=${padding} width=${width} halfWidth=${halfWidth} => x:${
            child.size.x
          } y:${child.size.y} ${child.widthInColumns} (width * (child?.w || 1)) / 2 ${
            (width * (child?.widthInColumns ?? 1)) / 2
          }`
        );

        startingPosX = child.size.x + halfWidth;

        const rowYOffset = rowYOffsets.get(py) ?? 0;
        const rowHeight = rowHeights.get(py) ?? height;
        child.size.y =
          parent.size.y - parent.size.height / 2 + rowYOffset + rowHeight / 2 + padding;

        log.debug(
          `abc88 layout blocks (calc) px, pyid:${
            child.id
          }startingPosX${startingPosX}${padding}${halfWidth}=>x:${child.size.x}y:${child.size.y}${
            child.widthInColumns
          }(width * (child?.w || 1)) / 2${(width * (child?.widthInColumns ?? 1)) / 2}`
        );
      }
      if (child.children) {
        layoutBlocks(child, db, padding);
      }
    }
  }
  log.debug(
    `layout blocks (<==layoutBlocks) ${block.id} x: ${block?.size?.x} y: ${block?.size?.y} width: ${block?.size?.width}`
  );
}

function findBounds(
  block: Block,
  { minX, minY, maxX, maxY } = { minX: 0, minY: 0, maxX: 0, maxY: 0 }
) {
  if (block.size && block.id !== 'root') {
    const { x, y, width, height } = block.size;
    if (x - width / 2 < minX) {
      minX = x - width / 2;
    }
    if (y - height / 2 < minY) {
      minY = y - height / 2;
    }
    if (x + width / 2 > maxX) {
      maxX = x + width / 2;
    }
    if (y + height / 2 > maxY) {
      maxY = y + height / 2;
    }
  }
  if (block.children) {
    for (const child of block.children) {
      ({ minX, minY, maxX, maxY } = findBounds(child, { minX, minY, maxX, maxY }));
    }
  }
  return { minX, minY, maxX, maxY };
}

export function layout(db: BlockDB) {
  const root = db.getBlock('root');
  if (!root) {
    return;
  }

  const padding = getConfig()?.block?.padding ?? 8;
  setBlockSizes(root, db, padding);
  layoutBlocks(root, db, padding);
  // Position blocks relative to parents
  // positionBlock(root, root, db);
  log.debug('getBlocks', JSON.stringify(root, null, 2));

  const { minX, minY, maxX, maxY } = findBounds(root);

  const height = maxY - minY;
  const width = maxX - minX;
  return { x: minX, y: minY, width, height };
}
