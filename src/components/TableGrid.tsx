import React from "react";
import {SIM_TABLE_COL_W, SIM_TABLE_ROWNUM_W, SimTable, type SimCell, type SimColumn, type SimColumnType} from "./SimTable";

// Back-compat facade over SimTable (the verbatim product table). Kept so
// existing call sites (use-cases scenes) continue to work; new code should
// use SimTable directly.
export type CellTone = "empty" | "filled" | "input" | "output";

export type Column = {
	header: string;
	type?: "text" | "number" | "boolean" | "date" | "json";
	workflow?: boolean;
	tone?: "input" | "output";
};

export type Cell = {
	value?: string;
	tone?: CellTone;
	highlight?: boolean;
};

type Props = {
	columns: Column[];
	rows: Cell[][];
	colWidth?: number;
	width?: number;
	rowHeight?: number; // accepted for back-compat; product row height is used
	showRowNumbers?: boolean;
	showTypeChips?: boolean; // accepted for back-compat; type icons always render
	dimColIndices?: number[];
};

export const TableGrid: React.FC<Props> = ({
	columns,
	rows,
	colWidth,
	width,
	showRowNumbers = true,
	dimColIndices = [],
}) => {
	const dim = new Set(dimColIndices);
	// Resolve the scale from either a per-column width or a total width budget.
	const naturalW = (showRowNumbers ? SIM_TABLE_ROWNUM_W : 0) + columns.length * SIM_TABLE_COL_W;
	const scale = colWidth
		? colWidth / SIM_TABLE_COL_W
		: width
			? width / naturalW
			: 1.5;

	const simColumns: SimColumn[] = columns.map((c) => ({
		name: c.header,
		type: c.type as SimColumnType | undefined,
		workflow: c.workflow,
	}));
	const simRows: SimCell[][] = rows.map((row) => row.map((cell) => ({text: cell.value})));

	return (
		<SimTable
			columns={simColumns}
			rows={simRows}
			scale={scale}
			showRowNumbers={showRowNumbers}
			colOpacity={(ci) => (dim.has(ci) ? 0.3 : 1)}
			cellHighlight={(ci, ri) => (rows[ri]?.[ci]?.highlight ? 1 : 0)}
			cellTint={(ci, ri) => {
				const t = rows[ri]?.[ci]?.tone ?? columns[ci]?.tone;
				return t === "input" || t === "output" ? t : null;
			}}
		/>
	);
};
