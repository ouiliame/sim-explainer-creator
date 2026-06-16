// Shared layout for the Tables module video. The TableGrid is the persistent
// element across most scenes — its geometry lives here so cross-scene cuts line
// up and the grid never teleports. Columns/rows are addressed by index.

export const STAGE_W = 1920;
export const STAGE_H = 1080;

// ─── TableGrid geometry ──────────────────────────────────────────────────────
// A grid is drawn from a top-left origin with fixed column widths + row height.
// Header row sits above the body rows.
// Metrics are the product's native table metrics × TABLE_SCALE (=2), so the
// grid renders with Sim's exact proportions (160px cols, 36px rows, 34px header,
// 40px row-number gutter).
export const TABLE_SCALE = 2;
// Row pitch includes the 1px border-b each cell draws (37px natural);
// header includes its border-b plus the container's 1px top border (36px).
export const CELL_H = 37 * TABLE_SCALE; // 74
export const HEADER_H = 36 * TABLE_SCALE; // 72
export const ROWNUM_W = 40 * TABLE_SCALE; // 80

// The canonical 4-column grid used by most scenes (anatomy, tickets, dashboard).
export const GRID_COLS = 4;
export const GRID_ROWS = 5;
export const COL_W = 160 * TABLE_SCALE; // 320
export const GRID_W = ROWNUM_W + GRID_COLS * COL_W;
export const GRID_H = HEADER_H + GRID_ROWS * CELL_H;

// Centered on stage, nudged down slightly so a title tile can sit above.
export const GRID_X = (STAGE_W - GRID_W) / 2;
export const GRID_Y = (STAGE_H - GRID_H) / 2 + 30;

// Cell address helpers (col/row are 0-based; row -1 = header).
export const cellX = (col: number, colW = COL_W) => GRID_X + ROWNUM_W + col * colW;
export const cellY = (row: number) => GRID_Y + HEADER_H + row * CELL_H;
export const headerY = () => GRID_Y;

// Center of a column header — for drawing connectors into a column.
export const colHeaderCenter = (col: number, colW = COL_W) => ({
	x: GRID_X + ROWNUM_W + col * colW + colW / 2,
	y: GRID_Y + HEADER_H / 2,
});

// Center of the whole grid — for Zoom origins.
export const gridCenter = () => ({x: GRID_X + GRID_W / 2, y: GRID_Y + GRID_H / 2});

// ─── Title tile (the ObjectNode that labels the table) ───────────────────────
export const TITLE_TILE = {w: 300, h: 92};
export const titleTilePos = () => ({
	x: GRID_X,
	y: GRID_Y - TITLE_TILE.h - 28,
});

// ─── Workflow chain position (work-vs-inspectable, read-rows, write-back) ────
// The chain sits to the LEFT of the grid in the two-sided scenes; in those
// scenes the grid shifts right to make room.
export const TWO_UP_GRID_X = STAGE_W - GRID_W - 140;
export const CHAIN_X = 140;
export const CHAIN_Y = STAGE_H / 2 - 54;
