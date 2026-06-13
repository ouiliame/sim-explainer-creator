import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, TABLE_COLS} from "../layout";
import {STATUS_COL} from "../data";
import {Stage, ramp} from "./_rig";

// Scene 7 — the-write-back [THE MONEY SHOT]. A pulse exits the container
// along edge 2; the Table block takes the live ring and its
// <parallel.results> tag glows. Then the record lands: six rows insert
// top-to-bottom in result order — each row's chrome fades in and its cells
// sweep left→right (company, contact, title, signal, the DIFFERENT 2-line
// opener, then status dips in `sent`), each with a green pulse decaying to
// the status residue. The message column becomes six distinct openers; the
// status column becomes a wall of `sent`. The Table block settles ok once
// the last row has landed.
// Exit: all six rows landed + status residue, Table block ok, CAM_ALL.

// Row r starts landing at START + r * STAGGER (top-to-bottom, result order).
const START = 2.0;
const STAGGER = 1.25;
const rowAt = (r: number) => START + r * STAGGER;

// Within a row: the cell sweep walks left→right, one beat per column.
const COL_STEP = 0.16;
const cellAt = (c: number, r: number) => rowAt(r) + 0.15 + c * COL_STEP;

// Green write pulse per cell: peaks as the cell fills, decays to the
// residue — 0 everywhere except the status column's 0.12 (the sent wall).
const PEAK = 0.7;
const residueOf = (c: number) => (c === STATUS_COL ? 0.12 : 0);

export const TheWriteBackScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// The pulse exits the container; the Table block goes live; its Rows
	// reference <parallel.results> glows while it writes.
	const pulse2 = ramp(t, 0.5, 1.5, EASING.inOut);
	const edge2Hi = ramp(t, 0.7, 1.3) * (1 - ramp(t, 11.0, 11.6));
	const wbLive = t >= 1.4;
	const wbOk = t >= 11.6;
	const wbTagGlow = 0.9 * Math.min(ramp(t, 1.5, 2.1), 1 - ramp(t, 10.6, 11.4));

	// Rows land: chrome fades in, then the cells sweep left→right.
	const rowLand = (r: number) => ramp(t, rowAt(r), rowAt(r) + 0.4, EASING.out);
	const cellFill = (c: number, r: number) => ramp(t, cellAt(c, r), cellAt(c, r) + 0.35, EASING.out);

	const cellTint = (c: number, r: number) => {
		if (c >= TABLE_COLS) return 0;
		const up = ramp(t, cellAt(c, r), cellAt(c, r) + 0.35);
		const down = ramp(t, rowAt(r) + 1.6, rowAt(r) + 2.8);
		return up * (PEAK - (PEAK - residueOf(c)) * down);
	};

	return (
		<Stage
			cam={CAM_ALL}
			rowLand={rowLand}
			cellFill={cellFill}
			cellTint={cellTint}
			apollo={{state: "ok"}}
			cont={{state: "ok"}}
			wb={{highlighted: wbLive && !wbOk, state: wbOk ? "ok" : "none"}}
			pulse2={pulse2}
			edge2={{hi: edge2Hi}}
			wbTagGlow={wbTagGlow}
			fan={0}
			lanes={{2: {enr: {state: "ok"}, pers: {state: "ok"}, send: {state: "ok"}}}}
			itemTag={{resolve: 1}}
			contactTag={{resolve: 1}}
		/>
	);
};
