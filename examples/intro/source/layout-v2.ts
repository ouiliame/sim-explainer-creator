// Intro v2 — shared layout. The set piece is the workspace tile field; this
// file owns every configuration it passes through (4×2 grid → clusters →
// hub-and-spokes ring → zoom target → the chain canvas) so scenes only
// interpolate between named positions and never hardcode geometry.

import type {ObjectKind} from "../../components";

export const STAGE_W = 1920;
export const STAGE_H = 1080;
export const CENTER_X = STAGE_W / 2;
export const CENTER_Y = STAGE_H / 2;

export const TILE = {w: 240, h: 200};

// ---------------------------------------------------------------------------
// Scene 1 — the workspace grid. 8 tiles, 4×2, centered. Same gaps as the
// module-1 grid so the two videos read as the same room.
// ---------------------------------------------------------------------------
const GRID_GAP_X = 64;
const GRID_GAP_Y = 72;
// Workflow sits in the rightmost column so its scene-2 glide (to the right
// cluster) never crosses the resources gliding left.
const ROW1: ObjectKind[] = ["mothership", "table", "knowledge", "workflow"];
const ROW2: ObjectKind[] = ["file", "tool", "logs", "deployment"];

const rowW = (row: ObjectKind[]) => row.length * TILE.w + (row.length - 1) * GRID_GAP_X;
const gridH = 2 * TILE.h + GRID_GAP_Y;
const gridY = (STAGE_H - gridH) / 2;

export const WORKSPACE_GRID: {kind: ObjectKind; x: number; y: number}[] = [
	...ROW1.map((kind, i) => ({
		kind,
		x: (STAGE_W - rowW(ROW1)) / 2 + i * (TILE.w + GRID_GAP_X),
		y: gridY,
	})),
	...ROW2.map((kind, i) => ({
		kind,
		x: (STAGE_W - rowW(ROW2)) / 2 + i * (TILE.w + GRID_GAP_X),
		y: gridY + TILE.h + GRID_GAP_Y,
	})),
];

export const gridPos = (kind: ObjectKind) => {
	const t = WORKSPACE_GRID.find((o) => o.kind === kind)!;
	return {x: t.x, y: t.y};
};

// ---------------------------------------------------------------------------
// Scene 2 — the split. Resources stack in a column on the left, the workflow
// stands alone on the right (module-1's proven balanced geometry). The four
// non-members exit during the split and re-enter on the ring in scene 3.
// ---------------------------------------------------------------------------
const RES_GAP = 44;
export const RESOURCES: ObjectKind[] = ["table", "knowledge", "file"];
export const NON_MEMBERS: ObjectKind[] = ["mothership", "tool", "logs", "deployment"];
const resStackH = RESOURCES.length * TILE.h + (RESOURCES.length - 1) * RES_GAP;

export const RES_POS: Record<string, {x: number; y: number}> = Object.fromEntries(
	RESOURCES.map((kind, i) => [
		kind,
		{x: 430, y: (STAGE_H - resStackH) / 2 + i * (TILE.h + RES_GAP)},
	]),
);

export const WF_POS = {x: 1270, y: (STAGE_H - TILE.h) / 2};

export const RES_BOUNDS = {
	x: RES_POS.table.x - 56,
	y: RES_POS.table.y - 56,
	w: TILE.w + 112,
	h: resStackH + 112,
};
export const WF_BOUNDS = {
	x: WF_POS.x - 56,
	y: WF_POS.y - 56,
	w: TILE.w + 112,
	h: TILE.h + 112,
};

// ---------------------------------------------------------------------------
// Scenes 3–5 — the hub. Workflow tile dead center; seven satellites on an
// ellipse, mirror-symmetric about the vertical axis, Mothership at the top
// (the builder sits above the system). Bottom stays open.
// ---------------------------------------------------------------------------
export const HUB_POS = {x: CENTER_X - TILE.w / 2, y: CENTER_Y - TILE.h / 2};
export const HUB_CENTER = {x: CENTER_X, y: CENTER_Y};

const SPOKE_RX = 620;
const SPOKE_RY = 350;

// Resource ring slots follow the scene-2 stack order top→bottom (table 223°,
// knowledge 180°, file 137°) so the stack→ring glides stay parallel and the
// tiles never cross paths.
export const SPOKES: {kind: ObjectKind; angle: number}[] = [
	{kind: "mothership", angle: 270},
	{kind: "table", angle: 223},
	{kind: "knowledge", angle: 180},
	{kind: "file", angle: 137},
	{kind: "tool", angle: 43},
	{kind: "deployment", angle: 0},
	{kind: "logs", angle: 317},
];

export const spokeCenter = (angle: number) => ({
	x: HUB_CENTER.x + SPOKE_RX * Math.cos((angle * Math.PI) / 180),
	y: HUB_CENTER.y + SPOKE_RY * Math.sin((angle * Math.PI) / 180),
});
export const spokePos = (angle: number) => {
	const c = spokeCenter(angle);
	return {x: c.x - TILE.w / 2, y: c.y - TILE.h / 2};
};
export const spokeAngle = (kind: ObjectKind) => SPOKES.find((s) => s.kind === kind)!.angle;

// Distance from a tile's center to its rectangular edge along the spoke
// direction — so wire light starts/ends just outside the tiles instead of
// underneath them.
export const tileEdgeDist = (angle: number) => {
	const dx = Math.abs(Math.cos((angle * Math.PI) / 180));
	const dy = Math.abs(Math.sin((angle * Math.PI) / 180));
	return 1 / Math.max(dx / (TILE.w / 2), dy / (TILE.h / 2));
};

// The visible span of a spoke (hub edge → satellite edge), in distance along
// the spoke from the hub center. Used by both the spoke lines and SpokePulse.
export const spokeSpan = (angle: number) => {
	const c = spokeCenter(angle);
	const len = Math.hypot(c.x - HUB_CENTER.x, c.y - HUB_CENTER.y);
	const inset = 8; // breathing room off both tile borders
	return {
		from: tileEdgeDist(angle) + inset,
		to: len - tileEdgeDist(angle) - inset,
		len,
	};
};

// ---------------------------------------------------------------------------
// Scene 5 — zoom-through target + the chain canvas. The camera pushes into
// the hub tile (which sits at stage center, so the push is a pure scale) and
// the canvas underneath carries module-1's chain at module-1's geometry —
// the exact frame module 1 opens on.
// ---------------------------------------------------------------------------
export const ZOOM_SCALE = 5.2;
