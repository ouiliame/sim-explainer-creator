import React from "react";
import {COLORS, RADIUS, SHADOW, TYPE} from "../../../theme";
import {
	SIM_TABLE_COL_W,
	SimTable,
	type SimCell,
	type SimColumn,
	type SimColumnType,
} from "../../../components";
import {COL_W} from "../layout";

// ─────────────────────────────────────────────────────────────────────────────
// TableGrid — the keystone shape for the whole module. A structured datatable:
// header row (column name + optional type chip + optional workflow glyph) over
// body rows of typed cells. Cells can be filled or empty, tinted as input /
// output, and individually highlighted. Built local because it's video-specific.
// ─────────────────────────────────────────────────────────────────────────────

export type CellTone = "default" | "input" | "output";

export type ColumnSpec = {
	name: string;
	type?: string; // type chip text: "text" / "number" / "boolean" / "date" / "JSON"
	tone?: CellTone;
	workflow?: boolean; // render a workflow glyph in the header (active column)
};

export type CellState = {
	text?: string; // undefined / "" => empty cell
	tone?: CellTone;
};

type GridProps = {
	columns: ColumnSpec[];
	rows: CellState[][]; // rows[r][c]
	colW?: number;
	// per-cell highlight + dim controls (frame-derived by the caller)
	cellHighlight?: (col: number, row: number) => number; // 0..1 glow
	cellOpacity?: (col: number, row: number) => number; // 0..1
	colHeaderHighlight?: (col: number) => number; // 0..1 glow on header
	colOpacity?: (col: number) => number; // dim whole column incl. header
};

export const TableGrid: React.FC<GridProps> = ({
	columns,
	rows,
	colW = COL_W,
	cellHighlight,
	cellOpacity,
	colHeaderHighlight,
	colOpacity,
}) => {
	// Thin wrapper over the verbatim product table (SimTable). The product
	// renders at native metrics and is scaled so one column = colW.
	const scale = colW / SIM_TABLE_COL_W;
	const simColumns: SimColumn[] = columns.map((c) => ({
		name: c.name,
		type: c.type ? (c.type.toLowerCase() as SimColumnType) : undefined,
		workflow: c.workflow,
	}));
	const simRows: SimCell[][] = rows.map((row) => row.map((cell) => ({text: cell.text})));
	const tint = (ci: number, ri: number): "input" | "output" | null => {
		const t = rows[ri]?.[ci]?.tone ?? columns[ci]?.tone;
		return t === "input" || t === "output" ? t : null;
	};
	return (
		<SimTable
			columns={simColumns}
			rows={simRows}
			scale={scale}
			cellHighlight={cellHighlight}
			cellOpacity={cellOpacity}
			colHeaderHighlight={colHeaderHighlight}
			colOpacity={colOpacity}
			cellTint={tint}
		/>
	);
};

// ─────────────────────────────────────────────────────────────────────────────
// RecordStack — a column of look-alike record cards. Used in the cold open to
// frame "a list of records" before the table noun is introduced.
// ─────────────────────────────────────────────────────────────────────────────

type RecordStackProps = {
	count: number;
	width?: number;
	rowH?: number;
	gap?: number;
	accent?: string;
	// optional left-edge label per row (e.g. lead name)
	labels?: string[];
	opacityFor?: (i: number) => number;
};

export const RecordStack: React.FC<RecordStackProps> = ({
	count,
	width = 520,
	rowH = 72,
	gap = 16,
	accent = COLORS.accent,
	labels,
	opacityFor,
}) => {
	return (
		<div style={{display: "flex", flexDirection: "column", gap}}>
			{Array.from({length: count}).map((_, i) => (
				<div
					key={i}
					style={{
						width,
						height: rowH,
						backgroundColor: COLORS.surface3,
						border: `1px solid ${COLORS.border1}`,
						borderLeft: `3px solid ${accent}`,
						borderRadius: RADIUS.sm,
						boxShadow: SHADOW.subtle,
						display: "flex",
						alignItems: "center",
						gap: 16,
						padding: "0 20px",
						boxSizing: "border-box",
						opacity: opacityFor ? opacityFor(i) : 1,
					}}
				>
					<div
						style={{
							width: 34,
							height: 34,
							borderRadius: RADIUS.sm,
							backgroundColor: accent + "22",
							border: `1px solid ${accent}66`,
							flexShrink: 0,
						}}
					/>
					{labels ? (
						<div style={{...TYPE.label, fontSize: 22, color: COLORS.text, whiteSpace: "nowrap"}}>
							{labels[i]}
						</div>
					) : null}
					<div style={{flex: 1, display: "flex", gap: 12}}>
						<div style={{flex: 2, height: 12, borderRadius: 3, backgroundColor: COLORS.surface5}} />
						<div style={{flex: 1, height: 12, borderRadius: 3, backgroundColor: COLORS.surface4}} />
					</div>
				</div>
			))}
		</div>
	);
};

// Small connector line drawn in SVG space — shared by several scenes.
export const Connector: React.FC<{
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	t: number; // 0..1 draw progress
	color?: string;
	width?: number;
}> = ({x1, y1, x2, y2, t, color = COLORS.secondary, width = 3}) => {
	const len = Math.hypot(x2 - x1, y2 - y1);
	return (
		<line
			x1={x1}
			y1={y1}
			x2={x2}
			y2={y2}
			stroke={color}
			strokeWidth={width}
			strokeOpacity={t > 0 ? 0.9 : 0}
			strokeLinecap="round"
			strokeDasharray={`${len * t} 9999`}
		/>
	);
};
