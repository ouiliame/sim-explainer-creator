import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {CAM_TABLE} from "../layoutV2";
import {CATEGORY_COL} from "../dataV2";
import {pulseWindow, Stage} from "./_v2";

// v2 scene 2 — rows-and-fields (selection grammar). Row 2 takes the
// product's range selection across the row (one outline + tint): a record.
// It releases; then the empty `category` column takes a column selection:
// a field waiting to be filled. Everything releases before exit.
// Enter == scene 1 exit; exit == scene 3 enter (CAM_TABLE, no selections).

const FOCUS_ROW = 1; // Bluefin

export const RowsAndFieldsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const rowHi = pulseWindow(t, 0.6, 1.0, 2.6, 3.1);
	const colHi = pulseWindow(t, 3.7, 4.1, 5.8, 6.3);

	const cellHi = (c: number, r: number) => {
		const fromRow = r === FOCUS_ROW ? rowHi : 0;
		const fromCol = c === CATEGORY_COL ? colHi : 0;
		return Math.max(fromRow, fromCol);
	};

	return <Stage cam={CAM_TABLE} chainOn={false} cellHi={cellHi} />;
};
