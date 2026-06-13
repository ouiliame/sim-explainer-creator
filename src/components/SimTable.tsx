import React from "react";
import {COLUMN_TYPE_ICON, PlayGlyph} from "./TableIcons";

// Verbatim static port of Sim's Tables grid. Markup and class strings are
// copied from the product (apps/sim/.../table-grid: constants.ts,
// table-grid.tsx, data-row.tsx, table-primitives.tsx) with interactivity
// stripped. It renders at the product's native metrics — 160px columns,
// py-[7px] cells, h-[22px] cell content, 13px text — and is scaled up as a
// whole via transform, so every proportion matches the real product.
//
// Custom theme tokens are expanded to their literal values (text-small → 13px,
// text-xs → 11px, size-3 → 12px, rounded-xs → 2px). CSS variables come from
// src/index.css, ported from Sim's globals.css.

// ── class strings from table-grid/constants.ts ──────────────────────────────
const CELL = "border-[var(--border)] border-r border-b px-2 py-[7px] align-middle select-none";
const CELL_HEADER =
	"border-[var(--border)] border-r border-b bg-[var(--bg)] px-2 py-[7px] text-left align-middle";
const CELL_ROWNUM =
	"border-[var(--border)] border-r border-b bg-[var(--bg)] px-1 py-[7px] text-center align-middle select-none";
const CELL_CONTENT =
	"relative flex h-[22px] min-w-0 items-center overflow-clip text-ellipsis whitespace-nowrap text-[13px]";
const SELECTION_TINT_BG = "bg-[rgba(37,99,235,0.06)]";

// Native metrics (product scale)
export const SIM_TABLE_COL_W = 160; // COL_WIDTH
export const SIM_TABLE_ROWNUM_W = 40;
export const SIM_TABLE_ROW_H = 36; // py-[7px] ×2 + h-[22px]
export const SIM_TABLE_HEADER_H = 34; // py-[7px] ×2 + h-[20px]

export type SimColumnType = "text" | "number" | "boolean" | "date" | "json";

export type SimColumn = {
	name: string;
	type?: SimColumnType;
	workflow?: boolean; // workflow-output column → play glyph (real fallback icon)
};

export type SimCell = {text?: string};

type Props = {
	columns: SimColumn[];
	rows: SimCell[][];
	showRowNumbers?: boolean;
	/** Uniform scale-up for video legibility. Product proportions preserved. */
	scale?: number;
	// Frame-derived per-cell/per-column controls (all 0..1), used by scenes.
	cellHighlight?: (col: number, row: number) => number; // real selection treatment
	cellOpacity?: (col: number, row: number) => number;
	colHeaderHighlight?: (col: number) => number;
	colOpacity?: (col: number) => number;
	/** Subtle teaching tint, styled like the product's selection tint. */
	cellTint?: (col: number, row: number) => "input" | "output" | null;
	/**
	 * Opacity of the cell's TEXT only (grid chrome unaffected) — for value
	 * reveals and dip-swaps inside cells. Combine with a text switch at 0 for
	 * a DipSwap: fade out, swap, fade in.
	 */
	cellTextOpacity?: (col: number, row: number) => number;
};

const TINT_BG: Record<"input" | "output", string> = {
	input: "rgba(51,180,255,0.07)",
	output: "rgba(51,196,130,0.08)",
};

export const SimTable: React.FC<Props> = ({
	columns,
	rows,
	showRowNumbers = true,
	scale = 2,
	cellHighlight,
	cellOpacity,
	colHeaderHighlight,
	colOpacity,
	cellTint,
	cellTextOpacity,
}) => {
	const naturalW = (showRowNumbers ? SIM_TABLE_ROWNUM_W : 0) + columns.length * SIM_TABLE_COL_W;
	const naturalH = SIM_TABLE_HEADER_H + rows.length * SIM_TABLE_ROW_H;

	return (
		<div style={{width: naturalW * scale, height: naturalH * scale}}>
			<div
				style={{transform: `scale(${scale})`, transformOrigin: "top left", width: naturalW}}
				className="overflow-hidden rounded-[8px] border border-[var(--border)] bg-[var(--bg)]"
			>
				<table className="w-full border-separate border-spacing-0" style={{tableLayout: "fixed"}}>
					<colgroup>
						{showRowNumbers ? <col style={{width: SIM_TABLE_ROWNUM_W}} /> : null}
						{columns.map((_, i) => (
							<col key={i} style={{width: SIM_TABLE_COL_W}} />
						))}
					</colgroup>
					<thead>
						<tr>
							{showRowNumbers ? <th className={CELL_ROWNUM} /> : null}
							{columns.map((c, ci) => {
								const TypeIcon = c.type ? COLUMN_TYPE_ICON[c.type] : null;
								const headerHi = colHeaderHighlight ? colHeaderHighlight(ci) : 0;
								const op = colOpacity ? colOpacity(ci) : 1;
								return (
									<th key={ci} className={CELL_HEADER} style={{opacity: op, position: "relative"}}>
										<div className="flex h-[20px] min-w-0 items-center gap-1.5">
											{c.workflow ? (
												<span className="shrink-0 text-[var(--text-icon)]">
													<PlayGlyph size={10} color="currentColor" />
												</span>
											) : TypeIcon ? (
												<span className="shrink-0 text-[var(--text-icon)]">
													<TypeIcon size={12} color="currentColor" />
												</span>
											) : null}
											<span className="truncate font-medium text-[13px] text-[var(--text-primary)]">
												{c.name}
											</span>
										</div>
										{headerHi > 0 ? (
											<div
												className="pointer-events-none absolute -top-px -right-px -bottom-px -left-px z-[5] border-[2px] border-[var(--selection)]"
												style={{opacity: headerHi}}
											/>
										) : null}
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody>
						{rows.map((row, ri) => (
							<tr key={ri}>
								{showRowNumbers ? (
									<td className={CELL_ROWNUM}>
										<div className="flex min-h-[20px] items-center justify-center">
											<span className="text-[11px] text-[var(--text-tertiary)] tabular-nums">
												{ri + 1}
											</span>
										</div>
									</td>
								) : null}
								{columns.map((c, ci) => {
									const hiAt = (cc: number, rr: number) =>
										cellHighlight && cc >= 0 && cc < columns.length && rr >= 0 && rr < rows.length
											? cellHighlight(cc, rr)
											: 0;
									const cell = row[ci] ?? {};
									const hi = hiAt(ci, ri);
									const op =
										(cellOpacity ? cellOpacity(ci, ri) : 1) * (colOpacity ? colOpacity(ci) : 1);
									const tint = cellTint ? cellTint(ci, ri) : null;
									// Range outline like the product: contiguous highlighted cells share
									// one outline — suppress edges that face another highlighted cell.
									const bw = {
										top: hiAt(ci, ri - 1) > 0 ? 0 : 2,
										right: hiAt(ci + 1, ri) > 0 ? 0 : 2,
										bottom: hiAt(ci, ri + 1) > 0 ? 0 : 2,
										left: hiAt(ci - 1, ri) > 0 ? 0 : 2,
									};
									return (
										<td
											key={ci}
											className={`${CELL} ${hi > 0.5 ? SELECTION_TINT_BG : ""}`}
											style={{
												opacity: op,
												position: "relative",
												backgroundColor: hi > 0.5 ? undefined : tint ? TINT_BG[tint] : undefined,
											}}
										>
											<div className={CELL_CONTENT}>
												{cell.text ? (
													<span
														className="truncate text-[var(--text-primary)]"
														style={
															cellTextOpacity ? {opacity: cellTextOpacity(ci, ri)} : undefined
														}
													>
														{cell.text}
													</span>
												) : null}
											</div>
											{hi > 0 ? (
												<div
													className="pointer-events-none absolute -top-px -right-px -bottom-px -left-px z-[5] border-[var(--selection)]"
													style={{
														opacity: hi,
														borderStyle: "solid",
														borderWidth: `${bw.top}px ${bw.right}px ${bw.bottom}px ${bw.left}px`,
													}}
												/>
											) : null}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
