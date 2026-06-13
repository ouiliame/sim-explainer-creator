import React from "react";
import {COLORS, useTheme} from "../theme";

// Verbatim port of the product's "Create Agent Tool" modal — the custom-tool
// editor with its Schema | Code tabs. Provenance:
//
// - apps/sim/app/workspace/[workspaceId]/w/[workflowId]/components/panel/
//   components/editor/components/sub-block/components/tool-input/components/
//   custom-tool-modal/custom-tool-modal.tsx
//   (header "Create Agent Tool", tabs Schema/Code, "JSON Schema"/"Code"
//   labels, "Generate" button, "Available parameters:" row, footers
//   Cancel/Next and Back/Cancel/Save Tool; editors get bg-[var(--bg)]).
// - apps/sim/components/emcn/components/modal/modal.tsx — chrome metrics:
//   size xl max-w-[800px], rounded-xl ring-1 ring-foreground/10; header
//   px-4 pt-4 pb-2, title text-base font-medium leading-none + 16px close X;
//   tabs px-4 pt-1 gap-4, triggers px-1 pb-2 text-small font-medium with a
//   1px bottom indicator; body px-4 pt-3 pb-4 (content pb-2.5); footer
//   border-t px-4 py-3 on 50% surface-3.
// - apps/sim/components/emcn/components/code/code.tsx + code.css —
//   CODE_LINE_HEIGHT_PX = 21, gutter width 20 (≤2-digit lines) pr-0.5
//   pt-[8.5px] text-xs tabular-nums, code rows pl-2 pr-2 text-small (13px)
//   font-medium leading-[21px]; container rounded-sm border border-1;
//   Prism token colors for both themes; param/{{ENV}} blue.
// - apps/sim/components/emcn/components/button/button.tsx — variants
//   default/active/primary, size md px-2 py-1.5 text-12, rounded-[5px].
// - apps/sim/components/emcn/components/badge/badge.tsx — blue-secondary
//   rounded-md, size sm px-[7px] py-[1px] text-xs.
// - apps/sim/app/_styles/globals.css (.dark / :root) — every variable below
//   re-derived from the CURRENT file, not from memory.
//
// Rendered at native metrics inside a scale() wrapper; all animation enters
// via numeric props (0..1) computed by scenes — the component never animates
// itself.

export const TOOL_EDITOR_W = 800; // modal size xl

const MONO =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';
const FONT =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif';

const LINE_H = 21; // CODE_LINE_HEIGHT_PX
const GUTTER_W = 20; // calculateGutterWidth(≤99 lines)
const EDITOR_PAD_TOP = 8.5; // gutter paddingTop (product literal)

// Prism token colors from code.css (.dark block / light block) + the
// text-blue-500 override used for schema params and {{ENV}} placeholders.
type TokenPalette = {
	fg: string;
	lineNumber: string;
	prop: string;
	str: string;
	pun: string;
	kw: string;
	fn: string;
	num: string;
	blue: string;
	selection: string;
	badgeBg: string;
	badgeText: string;
};

const TOKENS: Record<"dark" | "light", TokenPalette> = {
	dark: {
		fg: "#eeeeee", // --code-foreground
		lineNumber: "#a8a8a8", // --code-line-number
		prop: "#4fc3f7",
		str: "#f39c6b",
		pun: "#d4d4d4",
		kw: "#2fa1ff",
		fn: "#fbbf24",
		num: "#a5d6a7",
		blue: "#35b6ff",
		selection: "#264f78", // --selection-dark
		badgeBg: "rgba(51, 180, 255, 0.2)", // --badge-blue-secondary-bg
		badgeText: "#7dd3fc",
	},
	light: {
		fg: "#1a1a1a",
		lineNumber: "#737373",
		prop: "#0891b2",
		str: "#b45309",
		pun: "#383838",
		kw: "#2f55ff",
		fn: "#ca8a04",
		num: "#16a34a",
		blue: "#1d4ed8",
		selection: "#add6ff", // --selection-bg
		badgeBg: "#bae6fd",
		badgeText: "#0369a1",
	},
} as const;

export type CodeTokenKind = "plain" | "prop" | "str" | "pun" | "kw" | "fn" | "num" | "blue";

export type CodeSpan = {
	t: string;
	k?: CodeTokenKind;
	/** highlight-group name — `glow[hl]` paints the selection wash behind it */
	hl?: string;
};

export type EditorLine = {
	/** line number; omit for a soft-wrap continuation row */
	num?: number;
	spans: CodeSpan[];
	/** line-level highlight group (full-row selection wash) */
	hl?: string;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type ButtonKind = "default" | "active" | "primary";

const Btn: React.FC<{kind: ButtonKind; label: string; press?: number}> = ({
	kind,
	label,
	press = 0,
}) => {
	const style: React.CSSProperties = {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 5,
		padding: "6px 8px",
		fontFamily: FONT,
		fontSize: 12,
		fontWeight: 500,
		lineHeight: "12px",
		transform: press > 0 ? `scale(${1 - 0.06 * Math.sin(clamp01(press) * Math.PI)})` : undefined,
		filter: press > 0 ? `brightness(${1 - 0.18 * Math.sin(clamp01(press) * Math.PI)})` : undefined,
	};
	if (kind === "primary") {
		// dark: bg-white text-[var(--bg)]
		return <span style={{...style, backgroundColor: COLORS.text, color: COLORS.bg}}>{label}</span>;
	}
	if (kind === "active") {
		return (
			<span
				style={{
					...style,
					backgroundColor: COLORS.surface5,
					border: `1px solid ${COLORS.border1}`,
					color: COLORS.text,
					padding: "2px 8px", // h-5 px-2 py-0 override in the modal
					fontSize: 12,
				}}
			>
				{label}
			</span>
		);
	}
	return (
		<span
			style={{
				...style,
				backgroundColor: COLORS.surface4,
				border: `1px solid ${COLORS.border}`,
				color: COLORS.textSecondary,
			}}
		>
			{label}
		</span>
	);
};

const Editor: React.FC<{
	lines: EditorLine[];
	height: number;
	reveal: number; // 0..1 — staggered top-to-bottom line reveal
	glow: Record<string, number>;
	tokens: TokenPalette;
}> = ({lines, height, reveal, glow, tokens}) => {
	const n = lines.length;
	return (
		<div
			style={{
				position: "relative",
				height,
				borderRadius: 4,
				border: `1px solid ${COLORS.border1}`,
				backgroundColor: COLORS.bg, // modal passes bg-[var(--bg)]
				overflow: "hidden",
				fontFamily: MONO,
				fontWeight: 500,
				boxSizing: "border-box",
			}}
		>
			{/* gutter */}
			<div
				style={{
					position: "absolute",
					top: 0,
					bottom: 0,
					left: 0,
					width: GUTTER_W,
					paddingTop: EDITOR_PAD_TOP,
					textAlign: "right",
					boxSizing: "border-box",
					paddingRight: 2,
				}}
			>
				{lines.map((line, i) => {
					const o = clamp01(reveal * (n + 2) - i);
					return (
						<div
							key={i}
							style={{
								height: LINE_H,
								lineHeight: `${LINE_H}px`,
								fontSize: 12,
								fontVariantNumeric: "tabular-nums",
								color: tokens.lineNumber,
								opacity: o,
							}}
						>
							{line.num ?? ""}
						</div>
					);
				})}
			</div>
			{/* code */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: GUTTER_W,
					right: 0,
					paddingTop: EDITOR_PAD_TOP,
				}}
			>
				{lines.map((line, i) => {
					const o = clamp01(reveal * (n + 2) - i);
					const lineWash = line.hl ? clamp01(glow[line.hl] ?? 0) : 0;
					if (o <= 0) return null;
					return (
						<div
							key={i}
							style={{
								position: "relative",
								height: LINE_H,
								lineHeight: `${LINE_H}px`,
								paddingLeft: 8,
								paddingRight: 8,
								fontSize: 13,
								color: tokens.fg,
								whiteSpace: "pre",
								opacity: o,
							}}
						>
							{lineWash > 0 ? (
								<div
									style={{
										position: "absolute",
										inset: "0 4px 0 0",
										backgroundColor: tokens.selection,
										opacity: 0.55 * lineWash,
										borderRadius: 2,
									}}
								/>
							) : null}
							<span style={{position: "relative"}}>
								{line.spans.map((span, j) => {
									const spanWash = span.hl ? clamp01(glow[span.hl] ?? 0) : 0;
									const kind = span.k ?? "plain";
									return (
										<span
											key={j}
											style={{
												color: kind === "plain" ? tokens.fg : tokens[kind],
												...(spanWash > 0
													? {
															backgroundColor: tokens.selection,
															boxShadow: `0 0 0 2px ${tokens.selection}`,
															borderRadius: 2,
															opacity: 1,
														}
													: null),
											}}
										>
											{span.t}
										</span>
									);
								})}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

type Props = {
	x: number;
	y: number;
	scale?: number;
	opacity?: number;
	/** 0..1 entrance — the panel rises slightly as it appears. */
	slide?: number;
	/** 0 = Schema tab, 1 = Code tab; fractional crossfades. */
	tab?: number;
	schemaLines: EditorLine[];
	codeLines: EditorLine[];
	/** badge labels for the Code tab's "Available parameters:" row */
	params: string[];
	schemaReveal?: number;
	codeReveal?: number;
	/** highlight-group → 0..1 selection wash (lines and spans) */
	glow?: Record<string, number>;
	/** param-badge name → 0..1 pulse */
	paramGlow?: Record<string, number>;
	/** 0..1 — Save Tool press dip */
	savePress?: number;
};

// Fixed editor heights so the panel never changes height across the tab
// morph (equal-heights rule). Schema: 22 docs lines at 21px + top/bottom
// padding. Code: same total minus the params row block (36 + 8 margin).
export const SCHEMA_EDITOR_H = 22 * LINE_H + 17; // 479
const PARAMS_ROW_H = 36;
const PARAMS_ROW_MB = 8;
export const CODE_EDITOR_H = SCHEMA_EDITOR_H - PARAMS_ROW_H - PARAMS_ROW_MB; // 435

export const ToolEditorPanel: React.FC<Props> = ({
	x,
	y,
	scale = 1,
	opacity = 1,
	slide = 1,
	tab = 0,
	schemaLines,
	codeLines,
	params,
	schemaReveal = 1,
	codeReveal = 1,
	glow = {},
	paramGlow = {},
	savePress = 0,
}) => {
	const theme = useTheme();
	const tokens = TOKENS[theme];
	// Stacked crossfade over the middle of the tab transit — the canonical
	// morph-swap treatment (Route↔Triage), never a dip to blank.
	const schemaOp = clamp01((0.7 - tab) / 0.4);
	const codeOp = clamp01((tab - 0.3) / 0.4);

	const tabLabel = (label: string, active: number) => (
		<span
			style={{
				padding: "0 4px 8px",
				fontFamily: FONT,
				fontSize: 13,
				fontWeight: 500,
				color: COLORS.textSecondary,
				position: "relative",
			}}
		>
			<span style={{position: "absolute", inset: 0, padding: "0 4px 8px", color: COLORS.text, opacity: active}}>
				{label}
			</span>
			<span style={{opacity: 1 - active}}>{label}</span>
		</span>
	);

	// The 1px active-tab indicator slides between the two triggers. Trigger
	// boxes: px-1 around the 13px labels; gap-4 between. Positions measured
	// from a render (Schema ≈ 55px wide, Code ≈ 41px at 13px/500) — the
	// indicator interpolates left/width between them.
	const SCHEMA_TAB_W = 55;
	const CODE_TAB_W = 41;
	const indLeft = 16 + tab * (SCHEMA_TAB_W + 16);
	const indWidth = SCHEMA_TAB_W + (CODE_TAB_W - SCHEMA_TAB_W) * tab;

	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y + (1 - slide) * 36,
				width: TOOL_EDITOR_W,
				opacity,
				transform: `scale(${scale})`,
				transformOrigin: "top left",
				backgroundColor: COLORS.bg,
				borderRadius: 12,
				boxShadow: `0 0 0 1px ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}, 0 16px 48px rgba(0,0,0,0.4)`,
				overflow: "hidden",
			}}
		>
			{/* header — px-4 pt-4 pb-2, title text-base font-medium leading-none */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: "16px 16px 8px",
				}}
			>
				<span style={{fontFamily: FONT, fontSize: 16, fontWeight: 500, lineHeight: 1, color: COLORS.text}}>
					Create Agent Tool
				</span>
				<svg
					width={16}
					height={16}
					viewBox="0 0 24 24"
					fill="none"
					stroke={COLORS.textSecondary}
					strokeWidth="2"
					strokeLinecap="round"
				>
					<path d="M18 6 6 18M6 6l12 12" />
				</svg>
			</div>

			{/* tabs — px-4 pt-1, gap-4, 1px bottom indicator on the active trigger */}
			<div style={{position: "relative", padding: "4px 16px 0", display: "flex", gap: 16}}>
				{tabLabel("Schema", 1 - tab)}
				{tabLabel("Code", tab)}
				<div
					style={{
						position: "absolute",
						bottom: 0,
						left: indLeft,
						width: indWidth,
						height: 1,
						borderRadius: 99,
						backgroundColor: COLORS.text,
					}}
				/>
			</div>

			{/* body — px-4 pt-3 pb-4, tab content pb-2.5 */}
			<div style={{position: "relative", padding: "12px 16px 16px"}}>
				{/* Schema tab — stays in flow at opacity 0 so the body keeps its
				    height (the panel must never change size across the tab morph) */}
				<div style={{opacity: schemaOp}}>
					<div
						style={{
							minHeight: 24,
							marginBottom: 4,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<span style={{fontFamily: FONT, fontSize: 13, fontWeight: 500, color: COLORS.text}}>
							JSON Schema
						</span>
						<Btn kind="active" label="Generate" />
					</div>
					<Editor
						lines={schemaLines}
						height={SCHEMA_EDITOR_H}
						reveal={schemaReveal}
						glow={glow}
						tokens={tokens}
					/>
					<div style={{height: 10}} />
				</div>

				{/* Code tab — absolutely stacked over the schema tab */}
				{codeOp > 0 ? (
					<div style={{position: "absolute", inset: "12px 16px 16px", opacity: codeOp}}>
						<div
							style={{
								minHeight: 24,
								marginBottom: 4,
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<span style={{fontFamily: FONT, fontSize: 13, fontWeight: 500, color: COLORS.text}}>
								Code
							</span>
							<Btn kind="active" label="Generate" />
						</div>
						<div
							style={{
								height: PARAMS_ROW_H,
								marginBottom: PARAMS_ROW_MB,
								borderRadius: 6,
								border: `1px solid ${COLORS.border}`,
								backgroundColor: COLORS.surface2,
								padding: "0 8px",
								display: "flex",
								alignItems: "center",
								gap: 6,
								boxSizing: "border-box",
							}}
						>
							<span
								style={{fontFamily: FONT, fontSize: 12, fontWeight: 500, color: COLORS.textTertiary}}
							>
								Available parameters:
							</span>
							{params.map((p) => {
								const pulse = clamp01(paramGlow[p] ?? 0);
								return (
									<span
										key={p}
										style={{
											borderRadius: 6,
											padding: "1px 7px",
											fontFamily: FONT,
											fontSize: 12,
											backgroundColor: tokens.badgeBg,
											color: tokens.badgeText,
											transform: `scale(${1 + 0.12 * Math.sin(pulse * Math.PI)})`,
											boxShadow: pulse > 0 ? `0 0 0 ${1.5 * pulse}px ${COLORS.secondary}` : undefined,
										}}
									>
										{p}
									</span>
								);
							})}
							<span style={{fontFamily: FONT, fontSize: 12, color: COLORS.textTertiary}}>
								Start typing a parameter name for autocomplete.
							</span>
						</div>
						<Editor
							lines={codeLines}
							height={CODE_EDITOR_H}
							reveal={codeReveal}
							glow={glow}
							tokens={tokens}
						/>
					</div>
				) : null}
			</div>

			{/* footer — border-t, 50% surface-3 wash, px-4 py-3 */}
			<div
				style={{
					position: "relative",
					borderTop: `1px solid ${COLORS.border}`,
					backgroundColor: theme === "dark" ? "rgba(36,36,36,0.5)" : "rgba(247,247,247,0.5)",
					padding: "12px 16px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				{/* left: spacer (schema) ↔ Back (code) */}
				<span style={{position: "relative"}}>
					<span style={{opacity: codeOp}}>
						<Btn kind="default" label="Back" />
					</span>
				</span>
				{/* right: Cancel + Next (schema) ↔ Cancel + Save Tool (code).
				    "Save Tool" (the wider label) owns the layout box; "Next"
				    overlays right-aligned so nothing clips at the footer edge. */}
				<span style={{display: "flex", gap: 8, position: "relative"}}>
					<Btn kind="default" label="Cancel" />
					<span style={{position: "relative"}}>
						<span style={{opacity: codeOp, display: "inline-flex"}}>
							<Btn kind="primary" label="Save Tool" press={savePress} />
						</span>
						<span
							style={{
								position: "absolute",
								top: 0,
								right: 0,
								opacity: schemaOp,
								whiteSpace: "nowrap",
							}}
						>
							<Btn kind="primary" label="Next" />
						</span>
					</span>
				</span>
			</div>
		</div>
	);
};
