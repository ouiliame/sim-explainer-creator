// Shared layout for the Intro video. The 9 core objects live at fixed grid
// positions so they stay put across scenes (object-model → system-combines).

export const STAGE_W = 1920;
export const STAGE_H = 1080;

import type {ObjectKind} from "../../components";

// 3×3 grid of object tiles, centered. Tile = 240×200 with 56px gaps.
const TILE_W = 240;
const TILE_H = 200;
const GAP_X = 80;
const GAP_Y = 56;
const COLS = 3;
const ROWS = 3;
const GRID_W = COLS * TILE_W + (COLS - 1) * GAP_X;
const GRID_H = ROWS * TILE_H + (ROWS - 1) * GAP_Y;
const GRID_X = (STAGE_W - GRID_W) / 2;
const GRID_Y = (STAGE_H - GRID_H) / 2 + 20;

export const OBJECT_GRID: {kind: ObjectKind; x: number; y: number; appearAt: number}[] = [
	{kind: "mothership", ...cell(0, 0), appearAt: 0.3},
	{kind: "workflow", ...cell(1, 0), appearAt: 0.5},
	{kind: "table", ...cell(2, 0), appearAt: 0.7},
	{kind: "knowledge", ...cell(0, 1), appearAt: 0.9},
	{kind: "file", ...cell(1, 1), appearAt: 1.1},
	{kind: "agent", ...cell(2, 1), appearAt: 1.3},
	{kind: "tool", ...cell(0, 2), appearAt: 1.5},
	{kind: "logs", ...cell(1, 2), appearAt: 1.7},
	{kind: "deployment", ...cell(2, 2), appearAt: 1.9},
];

export const TILE = {w: TILE_W, h: TILE_H};

function cell(col: number, row: number) {
	return {
		x: GRID_X + col * (TILE_W + GAP_X),
		y: GRID_Y + row * (TILE_H + GAP_Y),
	};
}

// Center of a tile by kind — for drawing connector lines in system-combines.
export const tileCenter = (kind: ObjectKind) => {
	const t = OBJECT_GRID.find((o) => o.kind === kind)!;
	return {x: t.x + TILE_W / 2, y: t.y + TILE_H / 2};
};

// The "system" that lights up in scene 3: workflow at the hub, reading KB,
// writing table, saving file, emitting logs.
export const SYSTEM_HUB: ObjectKind = "workflow";
export const SYSTEM_SPOKES: ObjectKind[] = ["knowledge", "table", "file", "logs"];
