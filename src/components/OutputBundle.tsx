import React from "react";
import {interpolateColors} from "remotion";
import {usePalette, useTheme} from "../theme";

// Verbatim static port of Sim's docs run-inspector miniature
// (apps/docs/components/workflow-preview/output-bundle.tsx): the Logs list
// beside the Output panel's typed tree. Markup, metrics and the dark-mode
// wp-scope palette are copied 1:1 and rendered at native size, then scaled as
// a unit — same strategy as SimTable.
//
// The docs' wp-scope tokens map 1:1 onto the theme variables ThemeProvider
// sets (dark resolves to the original literals: panel #1e1e1e, border
// #333333, divider #393939, active #2c2c2c, text ramp #e6e6e6/#cccccc/
// #787878/#7d7d7d).

const P = {
	panel: "var(--surface-1)",
	border: "var(--border)",
	divider: "var(--divider)",
	active: "var(--surface-active)",
	text: "var(--text-primary)",
	text2: "var(--text-secondary)",
	muted: "var(--text-muted)",
	subtle: "var(--text-subtle)",
	highlight: "#33b4ff",
};

export type OutputValueType = "string" | "number" | "boolean" | "object" | "array" | "null";

// Type badges (string=green, number=blue, …) — both themes from the docs'
// wp-badge tokens in global.css.
const BADGE_COLORS = {
	dark: {
		string: {bg: "rgba(34,197,94,0.2)", text: "#86efac"},
		number: {bg: "rgba(59,130,246,0.2)", text: "#93c5fd"},
		boolean: {bg: "rgba(249,115,22,0.2)", text: "#fdba74"},
		array: {bg: "rgba(168,85,247,0.2)", text: "#d8b4fe"},
		object: {bg: "#3a3a3a", text: "#a8a8a8"},
		null: {bg: "#3a3a3a", text: "#a8a8a8"},
	},
	light: {
		string: {bg: "#bbf7d0", text: "#15803d"},
		number: {bg: "#bfdbfe", text: "#1d4ed8"},
		boolean: {bg: "#fed7aa", text: "#c2410c"},
		array: {bg: "#e9d5ff", text: "#7c3aed"},
		object: {bg: "#e7e5e4", text: "#57534e"},
		null: {bg: "#e7e5e4", text: "#57534e"},
	},
} satisfies Record<string, Record<OutputValueType, {bg: string; text: string}>>;

export type OutputNode = {
	key: string;
	type?: OutputValueType;
	/** Primitive value shown beneath the key when expanded. ReactNode so a
	 *  traced value can glow or hold a ResolvedTag (module-7 v2). */
	value?: React.ReactNode;
	/** Nested fields for object/array nodes. */
	children?: OutputNode[];
	/** 0..1 — key color blends to selection blue. */
	highlight?: number;
	/** 0..1 — row opacity (frame-derived reveal). */
	reveal?: number;
};

export type OutputLogRow = {
	name: string;
	color: string;
	glyph?: React.ReactNode; // white glyph inside the 18px chip
	/** ReactNode so a duration can glow (frame-derived color). */
	duration?: React.ReactNode;
	/** boolean, or 0..1 for an animatable selection background. */
	selected?: boolean | number;
	reveal?: number; // 0..1
};

export const OUTPUT_BUNDLE_W = 640; // native max-w
const LOGS_COL_W = 210;

const FONT =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif';

const Chevron: React.FC<{collapsed?: boolean}> = ({collapsed = false}) => (
	<svg
		width={9}
		height={7}
		viewBox="0 0 24 24"
		fill="none"
		strokeWidth="3"
		strokeLinecap="round"
		strokeLinejoin="round"
		style={{stroke: P.muted, flexShrink: 0, transform: collapsed ? "rotate(-90deg)" : undefined}}
	>
		<path d="m6 9 6 6 6-6" />
	</svg>
);

const HeaderGlyph: React.FC<{d: string | string[]}> = ({d}) => (
	<svg
		width={12}
		height={12}
		viewBox="0 0 24 24"
		fill="none"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		style={{stroke: P.subtle}}
	>
		{(Array.isArray(d) ? d : [d]).map((p, i) => (
			<path key={i} d={p} />
		))}
	</svg>
);

const TypeBadge: React.FC<{type: OutputValueType}> = ({type}) => {
	const c = BADGE_COLORS[useTheme()][type];
	return (
		<span
			style={{
				borderRadius: 4,
				padding: "1px 5px",
				fontSize: 10,
				lineHeight: "14px",
				fontFamily: FONT,
				background: c.bg,
				color: c.text,
				flexShrink: 0,
			}}
		>
			{type}
		</span>
	);
};

const TreeNode: React.FC<{node: OutputNode}> = ({node}) => {
	const type = node.type ?? "string";
	const reveal = node.reveal ?? 1;
	const hi = node.highlight ?? 0;
	const pal = usePalette();
	const keyColor =
		hi > 0 ? interpolateColors(hi, [0, 1], [pal.text, pal.secondary]) : P.text;
	const hasBody = Boolean(node.children) || node.value !== undefined;

	return (
		<div style={{display: "flex", flexDirection: "column", minWidth: 0, opacity: reveal}}>
			<div
				style={{
					display: "flex",
					minHeight: 26,
					alignItems: "center",
					gap: 8,
					borderRadius: 6,
					padding: "0 4px",
				}}
			>
				<span style={{fontSize: 13, fontFamily: FONT, color: keyColor}}>{node.key}</span>
				<TypeBadge type={type} />
				<Chevron collapsed={!hasBody} />
			</div>
			{hasBody ? (
				<div
					style={{
						marginTop: 2,
						marginLeft: 5,
						display: "flex",
						flexDirection: "column",
						gap: 2,
						minWidth: 0,
						borderLeft: `1px solid ${P.divider}`,
						paddingLeft: 10,
					}}
				>
					{node.children ? (
						node.children.map((child) => <TreeNode key={child.key} node={child} />)
					) : (
						<div style={{padding: "2px 0", fontSize: 13, fontFamily: FONT, color: P.text2}}>
							{node.value}
						</div>
					)}
				</div>
			) : null}
		</div>
	);
};

type Props = {
	logs: OutputLogRow[];
	values: OutputNode[];
	/** Uniform scale-up for video legibility. Product proportions preserved. */
	scale?: number;
	/** 0..1 — panel opacity (use for entrances). */
	opacity?: number;
	/** 0..1 — header-tab emphasis blend: 0 = Output active (default, the
	 *  port's original look), 1 = Input active. */
	inputTab?: number;
	/** Native px — pins the values column's min height so the panel outline
	 *  never pops while trees dip-swap (module-7 v2 trace). */
	minBodyH?: number;
};

/**
 * The app's run inspector in miniature: which blocks ran (Logs) and what the
 * selected block produced (Output) — named, typed values remembered under the
 * block's name.
 */
export const OutputBundle: React.FC<Props> = ({
	logs,
	values,
	scale = 2,
	opacity = 1,
	inputTab = 0,
	minBodyH,
}) => {
	// interpolateColors cannot parse the CSS var() strings in P — blend the
	// tab emphasis with the resolved palette literals instead.
	const pal = usePalette();
	return (
		<div style={{width: OUTPUT_BUNDLE_W * scale, opacity}}>
			<div
				style={{
					transform: `scale(${scale})`,
					transformOrigin: "top left",
					width: OUTPUT_BUNDLE_W,
					display: "flex",
					overflow: "hidden",
					borderRadius: 12,
					border: `1px solid ${P.border}`,
					background: P.panel,
				}}
			>
				{/* Logs column */}
				<div
					style={{
						width: LOGS_COL_W,
						flexShrink: 0,
						display: "flex",
						flexDirection: "column",
						borderRight: `1px solid ${P.border}`,
						padding: 8,
					}}
				>
					<div
						style={{
							padding: "0 8px 8px",
							fontSize: 12,
							fontFamily: FONT,
							color: P.muted,
						}}
					>
						Logs
					</div>
					{logs.map((row, i) => {
						const sel =
							typeof row.selected === "number" ? row.selected : row.selected ? 1 : 0;
						return (
						<div
							key={`${row.name}-${i}`}
							style={{
								display: "flex",
								height: 30,
								alignItems: "center",
								gap: 8,
								borderRadius: 6,
								padding: "0 8px",
								// rgba(44,44,44,1) === P.active over the panel bg.
								background: sel > 0 ? `rgba(44, 44, 44, ${sel})` : undefined,
								opacity: row.reveal ?? 1,
							}}
						>
							<div
								style={{
									width: 18,
									height: 18,
									flexShrink: 0,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: 5,
									background: row.color,
								}}
							>
								{row.glyph}
							</div>
							<span
								style={{
									fontSize: 13,
									fontFamily: FONT,
									color: P.text,
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}
							>
								{row.name}
							</span>
							{row.duration ? (
								<span
									style={{
										marginLeft: "auto",
										fontSize: 12,
										fontFamily: FONT,
										color: P.muted,
									}}
								>
									{row.duration}
								</span>
							) : null}
						</div>
						);
					})}
				</div>

				{/* Output panel */}
				<div
					style={{
						minWidth: 0,
						flex: 1,
						display: "flex",
						flexDirection: "column",
						padding: "8px 12px",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 12,
							paddingBottom: 8,
						}}
					>
						<span
							style={{
								fontSize: 13,
								fontFamily: FONT,
								color:
									inputTab > 0
										? interpolateColors(inputTab, [0, 1], [pal.text, pal.textMuted])
										: P.text,
							}}
						>
							Output
						</span>
						<span
							style={{
								fontSize: 13,
								fontFamily: FONT,
								color:
									inputTab > 0
										? interpolateColors(inputTab, [0, 1], [pal.textMuted, pal.text])
										: P.muted,
							}}
						>
							Input
						</span>
						<span
							style={{
								marginLeft: "auto",
								display: "flex",
								alignItems: "center",
								gap: 8,
							}}
						>
							{/* search / clipboard / download / chevron-down (lucide) */}
							<HeaderGlyph d={["M21 21l-4.34-4.34", "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"]} />
							<HeaderGlyph
								d={[
									"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
									"M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z",
								]}
							/>
							<HeaderGlyph d={["M12 15V3", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "m7 10 5 5 5-5"]} />
							<HeaderGlyph d="m6 9 6 6 6-6" />
						</span>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 2,
							minWidth: 0,
							minHeight: minBodyH,
						}}
					>
						{values.map((node) => (
							<TreeNode key={node.key} node={node} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};
