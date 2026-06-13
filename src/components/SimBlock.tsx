import React from "react";
import {interpolateColors} from "remotion";
import {COLORS, usePalette} from "../theme";
import {chipNaturalWidth} from "./measure";

// Pixel-faithful port of Sim's PreviewBlockNode (landing-preview-workflow/
// preview-block-node.tsx), scaled ×1.5 for 1080p video legibility.
// Real spec at 1×: 250px wide, bg #232323, border #3d3d3d radius 8px;
// header p-2 with a 24px rounded-6px colored icon square (white glyph) +
// 16px medium name; rows of 14px #b3b3b3 title / #e6e6e6 value; tool chips
// bg #2a2a2a; #454545 connection handles (7×20) at top:20px.
//
// Branch anatomy (docs preview-block-node.tsx): a Condition/Router renders
// its branches as rows styled exactly like config rows (label left, value
// right, "-" when empty), each with its OWN 7×20 source handle at
// right −16px native (vs −8px for the header handle), vertically centered
// on the row; the header source handle is suppressed whenever branches
// exist. The product's error handle (red, −16px) is deliberately not
// ported — out of scope for the explainers.

const S = 1.5; // scale factor

export const SIM_BLOCK_W = 250 * S;
export const SIM_HANDLE_Y = 20 * S; // vertical center of handles from block top

// Canonical block colors from the real registry (apps/sim/blocks/blocks/*.ts,
// cross-checked against apps/docs block-display-specs.ts). Agent resolves
// var(--brand) = #33c482.
export const BLOCK_COLORS = {
	start: "#2FB3FF",
	agent: "#33C482",
	response: "#2F55FF",
	knowledge: "#00B0B0",
	tool: "#6366F1",
	workflow: "#6366F1",
	slack: "#611f69",
	gmail: "#E0E0E0",
	schedule: "#6366F1",
	webhook: "#10B981",
	table: "#10B981",
	file: "#40916C",
	function: "#FF402F",
	condition: "#FF752F",
	// Router is its own green (apps/sim/blocks/blocks/router.ts:157) —
	// NOT agent green #33C482.
	router: "#28C43F",
	// Memory block pink (apps/sim/blocks/blocks/memory.ts bgColor, re-derived
	// for the memory-v1 build; same value in docs/tools/memory.mdx).
	memory: "#F64F9E",
	// Human in the Loop (apps/sim/blocks/blocks/human_in_the_loop.ts:12).
	human: "#10B981",
	api: "#2F55FF",
	error: "#ef4444",
} as const;

// Theme-aware via the product CSS variables (set by ThemeProvider; dark
// values match the original verbatim port: #232323 / #3d3d3d / #e6e6e6 /
// #b3b3b3 / #2a2a2a / #454545).
const C = {
	bg: COLORS.surface2,
	border: COLORS.border1,
	text: COLORS.text,
	muted: COLORS.textTertiary,
	chipBg: COLORS.chipBg,
	handle: COLORS.wire,
	ring: COLORS.secondary,
};

export type SimBlockRow = {
	/** ReactNode so in-place block morphs can DipSwap the row title too
	 *  (webhooks: Input → Webhook URL). Plain strings everywhere else. */
	title: React.ReactNode;
	value: React.ReactNode;
	/** 0..1 — row reveal (frame-derived); the block grows as rows appear. */
	opacity?: number;
	/** 0..1 — faint selection-blue tint over the row ("being read/checked"). */
	glow?: number;
};

export type SimBlockBranch = {
	/** Branch label (left), e.g. "If" / "else" / a route name. ReactNode so
	 *  morphs can DipSwap it. */
	label: React.ReactNode;
	/** Branch value (right). The product renders "-" when empty. */
	value?: React.ReactNode;
	/** 0..1 — branch-row reveal at exact slot height (the block grows). */
	opacity?: number;
	/** 0..1 — blue tint: this branch is being checked. */
	glow?: number;
	/** 0..1 — green tint: this branch matched. */
	match?: number;
	/** 0..1 — row dims toward 0.35: not matched / never checked. */
	dim?: number;
	/** 0..1 — the branch's own source handle blends #454545 → #33b4ff. */
	handleGlow?: number;
};
export type SimBlockTool = {
	name: string;
	color: string;
	glyph?: React.ReactNode;
	/** 0..1 — selection ring on this chip (the agent chose this tool). */
	ring?: number;
	/** 0..1 — chip reveal. */
	opacity?: number;
};

type Props = {
	name: React.ReactNode;
	color: string; // header icon square bg
	glyph?: React.ReactNode; // white glyph inside the icon square
	/** In-place header identity crossfade (morph-swap archetype): the chip
	 *  blends to `color`/`glyph` at mix 1. Pair with a DipSwap `name`. */
	headerMorph?: {color: string; glyph?: React.ReactNode; mix: number};
	rows?: SimBlockRow[];
	/** Branch rows (Condition/Router). Rendered after config rows, each with
	 *  its own source handle; suppresses the header source handle. */
	branches?: SimBlockBranch[];
	tools?: SimBlockTool[];
	width?: number;
	hideTargetHandle?: boolean;
	hideSourceHandle?: boolean;
	highlighted?: boolean;
	/** error/success state ring (visual state, no words) */
	state?: "none" | "error" | "ok";
	dimmed?: number; // 0..1 opacity multiplier
	/** 0..1 — smooth reveal of the whole Tools row (block grows, no pop). */
	toolsReveal?: number;
	/** 0..1 — reveal of the chips' wrap line when a new chip forces line 2. */
	toolsWrapReveal?: number;
	/** Render the Tools row after this row index (product order puts Tools
	 *  between Model and Skills). Default: after all rows. */
	toolsRowAfter?: number;
	/** 0..1 — reveal of the whole content box (vertical padding + header
	 *  divider). Lets a header-only block grow into a configured block with
	 *  no 25px padding pop: drive it alongside the first row's reveal. At 0
	 *  the block is pixel-identical to a header-only block (content renders
	 *  null); at 1 it is the exact natural layout. */
	bodyReveal?: number;
};

// Native row line box: 14px text at the inherited Tailwind-preflight 1.5
// line-height → 21px native, ×S. Used only while a row is mid-reveal.
const ROW_LINE_H = 14 * 1.5 * S;
const ROW_GAP = 8 * S;

// ── Vertical geometry (scaled), exported so layouts can anchor branch
// edges exactly. Block top → content area: 1px border + header (8px pad ×2
// + 24px chip = 40 native → 60) + 1px border-b + 8px pad (12).
export const SIM_BLOCK_CONTENT_TOP = 1 + 40 * S + 1 + 8 * S; // 74
export const SIM_BLOCK_ROW_H = ROW_LINE_H; // 31.5
export const SIM_BLOCK_ROW_GAP = ROW_GAP; // 12
/** Block height for a plain header + n full-reveal rows (no tools). */
export const simBlockHeight = (n: number) =>
	n <= 0
		? 2 + 40 * S
		: SIM_BLOCK_CONTENT_TOP + n * SIM_BLOCK_ROW_H + (n - 1) * SIM_BLOCK_ROW_GAP + 8 * S + 1;

/**
 * Center Y (from block top) of content item `index`, given every item's
 * reveal (rows first, then branches — the render order). A mid-reveal item
 * occupies height H·r with the flex gap cancelled (−GAP·(1−r) margin), so
 * each item above contributes (H+GAP)·r to the offset.
 */
export const simBlockItemCenterY = (reveals: number[], index: number) => {
	let y = SIM_BLOCK_CONTENT_TOP;
	for (let i = 0; i < index; i++) {
		y += (SIM_BLOCK_ROW_H + SIM_BLOCK_ROW_GAP) * (reveals[i] ?? 1);
	}
	return y + (SIM_BLOCK_ROW_H * (reveals[index] ?? 1)) / 2;
};

// Branch handles use the SAME offset convention as the header handles
// (±8 native, flush against the border). The docs' ReactFlow `-16px` is a
// different box model — ported literally it floated the pills ~13px off
// the block edge (caught by the director on a render).
export const SIM_BRANCH_HANDLE_OUT = 8 * S; // 12

// Smooth-growth wrapper for a revealing row: animates the row's slot height
// and cancels the flex gap so the block never pops when a row mounts.
const revealStyle = (reveal: number): React.CSSProperties =>
	reveal >= 1
		? {}
		: {
				height: ROW_LINE_H * reveal,
				marginTop: -ROW_GAP * (1 - reveal),
				overflow: "hidden",
				opacity: reveal,
			};

export const SimBlock: React.FC<Props> = ({
	name,
	color,
	glyph,
	headerMorph,
	rows = [],
	branches = [],
	tools = [],
	width = SIM_BLOCK_W,
	hideTargetHandle = false,
	hideSourceHandle = false,
	highlighted = false,
	state = "none",
	dimmed = 1,
	toolsReveal = 1,
	toolsWrapReveal = 1,
	toolsRowAfter,
	bodyReveal = 1,
}) => {
	// Concrete hexes for color MATH only — C.* are CSS variables now.
	const pal = usePalette();
	const hasBranches = branches.some((b) => (b.opacity ?? 1) > 0);
	const hasContent = (rows.length > 0 || hasBranches || tools.length > 0) && bodyReveal > 0;
	// A block with branch handles emits from them, not from the header handle
	// (docs preview-block-node.tsx: showHeaderSource = !hideSourceHandle &&
	// !hasBranches).
	const showHeaderSource = !hideSourceHandle && branches.length === 0;
	const ringColor = state === "error" ? "#ef4444" : state === "ok" ? "#22c55e" : C.ring;
	const showRing = highlighted || state !== "none";
	// Reveal list in render order (rows, then branches) for handle anchoring.
	const itemReveals = [...rows.map((r) => r.opacity ?? 1), ...branches.map((b) => b.opacity ?? 1)];

	// Natural chip line box, MEASURED from a render (pixel-diff of a boundary
	// pair): 40px at full scale. The arithmetic (text 27 + padding 9 + border
	// 2 = 38) under-counts by 2 — trust the rasterizer, not the math. Must
	// match exactly so a mid-reveal never clips chip borders or shifts the
	// block bottom.
	const CHIP_LINE_H = 40;
	const renderTools =
		tools.length > 0 && toolsReveal > 0 ? (
			<div
				style={{
					display: "flex",
					alignItems: "flex-start",
					gap: 8 * S,
					...(toolsReveal < 1
						? {
								height: CHIP_LINE_H * toolsReveal,
								marginTop: -ROW_GAP * (1 - toolsReveal),
								overflow: "hidden",
								opacity: toolsReveal,
							}
						: {}),
				}}
			>
				<span
					style={{
						fontFamily:
							'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
						fontWeight: 400,
						fontSize: 14 * S,
						color: C.muted,
						flexShrink: 0,
					}}
				>
					Tools
				</span>
				<div
					style={{
						flex: 1,
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "flex-end",
						// Lines stack from the top — never redistributed by a fixed
						// height (align-content: stretch squeezes line 1 upward).
						alignContent: "flex-start",
						gap: 5 * S,
						...(toolsWrapReveal < 1
							? {
									// Exactly one natural line at 0, exactly two at 1.
									height: CHIP_LINE_H + (CHIP_LINE_H + 5 * S) * toolsWrapReveal,
									overflow: "hidden",
								}
							: {}),
					}}
				>
					{tools.map((tool) => {
						const chipOp = tool.opacity ?? 1;
						if (chipOp <= 0) return null;
						return (
						<div
							key={tool.name}
							style={{
								position: "relative",
								display: "flex",
								alignItems: "center",
								gap: 5 * S,
								borderRadius: 5 * S,
								border: `1px solid ${C.border}`,
								backgroundColor: C.chipBg,
								padding: `${3 * S}px ${6 * S}px`,
								opacity: chipOp,
								// Mid-reveal: the chip grows in width so it never displaces
								// its line-mates with a pop (culled entirely at 0). Target
								// width is MEASURED (@remotion/layout-utils), not guessed.
								...(chipOp < 1
									? {
											maxWidth: chipNaturalWidth(tool.name) * chipOp,
											marginLeft: -5 * S * (1 - chipOp),
											overflow: "hidden",
											whiteSpace: "nowrap",
										}
									: {}),
							}}
						>
							<div
								style={{
									width: 16 * S,
									height: 16 * S,
									borderRadius: 4 * S,
									background: tool.color,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								{tool.glyph}
							</div>
							<span
								style={{
									fontFamily:
										'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
									fontSize: 12 * S,
									color: C.text,
								}}
							>
								{tool.name}
							</span>
							{(tool.ring ?? 0) > 0 ? (
								<div
									style={{
										position: "absolute",
										inset: -1,
										borderRadius: 5 * S,
										boxShadow: `inset 0 0 0 ${1.5 * S}px ${C.ring}`,
										opacity: tool.ring,
										pointerEvents: "none",
									}}
								/>
							) : null}
						</div>
						);
					})}
				</div>
			</div>
		) : null;

	return (
		<div style={{position: "relative", width, opacity: dimmed}}>
			{/* Target handle (left) */}
			{!hideTargetHandle ? (
				<div
					style={{
						position: "absolute",
						left: -8 * S,
						top: SIM_HANDLE_Y - 10 * S,
						width: 7 * S,
						height: 20 * S,
						backgroundColor: C.handle,
						borderRadius: `${2 * S}px 0 0 ${2 * S}px`,
					}}
				/>
			) : null}

			<div
				style={{
					width: "100%",
					backgroundColor: C.bg,
					border: `1px solid ${C.border}`,
					borderRadius: 8 * S,
					boxSizing: "border-box",
					overflow: "hidden",
					position: "relative",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 10 * S,
						padding: 8 * S,
						borderBottom: hasContent ? `1px solid ${C.border}` : "none",
					}}
				>
					<div
						style={{
							position: "relative",
							width: 24 * S,
							height: 24 * S,
							borderRadius: 6 * S,
							background: color,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						<span style={{display: "flex", opacity: headerMorph ? 1 - headerMorph.mix : 1}}>
							{glyph}
						</span>
						{headerMorph && headerMorph.mix > 0 ? (
							<div
								style={{
									position: "absolute",
									inset: 0,
									borderRadius: 6 * S,
									background: headerMorph.color,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									opacity: headerMorph.mix,
								}}
							>
								{headerMorph.glyph}
							</div>
						) : null}
					</div>
					<span
						style={{
							fontFamily:
								'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
							fontWeight: 500,
							fontSize: 16 * S,
							color: C.text,
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						{name}
					</span>
				</div>

				{/* Rows + tools (tools row can interleave via toolsRowAfter) */}
				{hasContent ? (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 8 * S,
							padding: `${8 * S * bodyReveal}px ${8 * S}px`,
							...(bodyReveal < 1 ? {overflow: "hidden", opacity: bodyReveal} : {}),
						}}
					>
						{rows.map((row, ri) =>
							(row.opacity ?? 1) <= 0 ? null : (
							<React.Fragment key={ri}>
							<div
								style={{
									position: "relative",
									display: "flex",
									alignItems: "center",
									gap: 8 * S,
									...revealStyle(row.opacity ?? 1),
								}}
							>
								{(row.glow ?? 0) > 0 ? (
									<div
										style={{
											position: "absolute",
											inset: `${-3 * S}px ${-4 * S}px`,
											borderRadius: 4 * S,
											backgroundColor: `rgba(51, 180, 255, ${0.14 * (row.glow ?? 0)})`,
											pointerEvents: "none",
										}}
									/>
								) : null}
								<span
									style={{
										fontFamily:
											'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
										fontWeight: 400,
										fontSize: 14 * S,
										color: C.muted,
										textTransform: "capitalize",
										flexShrink: 0,
									}}
								>
									{row.title}
								</span>
								<span
									style={{
										flex: 1,
										textAlign: "right",
										fontFamily:
											'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
										fontWeight: 400,
										fontSize: 14 * S,
										color: C.text,
										whiteSpace: "nowrap",
										overflow: "hidden",
										textOverflow: "ellipsis",
									}}
								>
									{row.value}
								</span>
							</div>
							{toolsRowAfter === ri ? renderTools : null}
							</React.Fragment>
						))}
						{branches.map((branch, bi) => {
							const reveal = branch.opacity ?? 1;
							if (reveal <= 0) return null;
							const dimOp = 1 - 0.65 * (branch.dim ?? 0);
							return (
								<div
									key={`branch-${bi}`}
									style={{
										position: "relative",
										display: "flex",
										alignItems: "center",
										gap: 8 * S,
										opacity: dimOp,
										...revealStyle(reveal),
									}}
								>
									{(branch.glow ?? 0) > 0 || (branch.match ?? 0) > 0 ? (
										<div
											style={{
												position: "absolute",
												inset: `${-3 * S}px ${-4 * S}px`,
												borderRadius: 4 * S,
												backgroundColor: `rgba(51, 180, 255, ${0.14 * (branch.glow ?? 0)})`,
												boxShadow:
													(branch.match ?? 0) > 0
														? `inset 0 0 0 999px rgba(34, 197, 94, ${0.16 * (branch.match ?? 0)})`
														: undefined,
												pointerEvents: "none",
											}}
										/>
									) : null}
									<span
										style={{
											fontFamily:
												'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
											fontWeight: 400,
											fontSize: 14 * S,
											color: C.muted,
											textTransform: "capitalize",
											flexShrink: 0,
										}}
									>
										{branch.label}
									</span>
									<span
										style={{
											flex: 1,
											textAlign: "right",
											fontFamily:
												'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
											fontWeight: 400,
											fontSize: 14 * S,
											color: C.text,
											whiteSpace: "nowrap",
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{branch.value ?? "-"}
									</span>
								</div>
							);
						})}
						{toolsRowAfter === undefined ? renderTools : null}
					</div>
				) : null}
				{/* State / highlight ring */}
				{showRing ? (
					<div
						style={{
							position: "absolute",
							inset: 0,
							borderRadius: 8 * S,
							boxShadow: `inset 0 0 0 ${1.75 * S}px ${ringColor}`,
							pointerEvents: "none",
						}}
					/>
				) : null}
			</div>

			{/* Source handle (right) */}
			{showHeaderSource ? (
				<div
					style={{
						position: "absolute",
						right: -8 * S,
						top: SIM_HANDLE_Y - 10 * S,
						width: 7 * S,
						height: 20 * S,
						backgroundColor: C.handle,
						borderRadius: `0 ${2 * S}px ${2 * S}px 0`,
					}}
				/>
			) : null}

			{/* Per-branch source handles (right −16px native). Rendered in the
			    outer wrapper (the card clips overflow); Y comes from the same
			    reveal math layouts use to anchor branch edges. */}
			{branches.map((branch, bi) => {
				if ((branch.opacity ?? 1) <= 0) return null;
				const cy = simBlockItemCenterY(itemReveals, rows.length + bi);
				return (
					<div
						key={`branch-handle-${bi}`}
						style={{
							position: "absolute",
							right: -SIM_BRANCH_HANDLE_OUT,
							top: cy - 10 * S,
							width: 7 * S,
							height: 20 * S,
							backgroundColor: interpolateColors(
								branch.handleGlow ?? 0,
								[0, 1],
								[pal.wire, pal.secondary],
							),
							borderRadius: `0 ${2 * S}px ${2 * S}px 0`,
							opacity: branch.opacity ?? 1,
						}}
					/>
				);
			})}
		</div>
	);
};

// --- White header glyphs (from Sim's icons.tsx) -----------------------------

export const StartGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg width={size} height={(size * 16) / 26} viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M7.8 13C9.23 13 10.45 12.49 11.47 11.47C12.49 10.45 13 9.23 13 7.8C13 6.37 12.49 5.15 11.47 4.13C10.45 3.11 9.23 2.6 7.8 2.6C6.37 2.6 5.15 3.11 4.13 4.13C3.11 5.15 2.6 6.37 2.6 7.8C2.6 9.23 3.11 10.45 4.13 11.47C5.15 12.49 6.37 13 7.8 13ZM7.8 15.6C5.63 15.6 3.79 14.84 2.28 13.33C0.76 11.81 0 9.97 0 7.8C0 5.63 0.76 3.79 2.28 2.28C3.79 0.76 5.63 0 7.8 0C9.75 0 11.45 0.62 12.89 1.85C14.33 3.09 15.2 4.64 15.5 6.5H24.7C25.07 6.5 25.38 6.62 25.63 6.87C25.88 7.12 26 7.43 26 7.8C26 8.17 25.87 8.48 25.63 8.73C25.38 8.98 25.07 9.1 24.7 9.1H15.5C15.2 10.96 14.33 12.51 12.89 13.75C11.44 14.98 9.75 15.6 7.8 15.6Z"
			fill="#ffffff"
		/>
	</svg>
);

export const AgentGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg width={(size * 21) / 24} height={size} viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M15.67 9.25H4.67C2.64 9.25 1 10.89 1 12.92V18.42C1 20.44 2.64 22.08 4.67 22.08H15.67C17.69 22.08 19.33 20.44 19.33 18.42V12.92C19.33 10.89 17.69 9.25 15.67 9.25Z"
			stroke="#ffffff"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M10.17 5.58C11.18 5.58 12 4.76 12 3.75C12 2.74 11.18 1.92 10.17 1.92C9.15 1.92 8.33 2.74 8.33 3.75C8.33 4.76 9.15 5.58 10.17 5.58Z"
			stroke="#ffffff"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M10.17 5.59V9.25M7.42 16.59V14.75M12.92 14.75V16.59"
			stroke="#ffffff"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

// HumanInTheLoopIcon (apps/sim/components/icons.tsx:4005), white stroke.
export const HumanGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ffffff"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
		<circle cx="12" cy="7" r="4" />
	</svg>
);

export const ResponseGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M4 7 Q4 4 7 4 H17 Q20 4 20 7 V13 Q20 16 17 16 H11 L7 20 V16 Q4 16 4 13 Z"
			stroke="#ffffff"
			strokeWidth="2"
			strokeLinejoin="round"
			strokeLinecap="round"
		/>
	</svg>
);

export const DatabaseGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg width={size} height={size} viewBox="-1 -2 24 24" fill="none" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
		<ellipse cx="10.25" cy="3.75" rx="8.5" ry="3" />
		<path d="M1.75 3.75V9.75C1.75 11.41 5.55 12.75 10.25 12.75C14.95 12.75 18.75 11.41 18.75 9.75V3.75" />
		<path d="M1.75 9.75V15.75C1.75 17.41 5.55 18.75 10.25 18.75C14.95 18.75 18.75 17.41 18.75 15.75V9.75" />
	</svg>
);

export const ScheduleGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ffffff"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M8 2v4" />
		<path d="M16 2v4" />
		<rect width="18" height="18" x="3" y="4" rx="2" />
		<path d="M3 10h18" />
	</svg>
);

export const WebhookGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
		<path d="M17.97 7A4.97 4.97 0 0 0 18 6.5a5.5 5.5 0 1 0-8.67 4.49L7.18 15.11A2.43 2.43 0 0 0 6.5 15 2.5 2.5 0 1 0 9 17.5a2.36 2.36 0 0 0-.93-1.92l2.58-4.94-.41-.241A4.5 4.5 0 1 1 17 6.5a4.8 4.8 0 0 1-.22.45zM6.5 19a1.5 1.5 0 1 1 1.5-1.5A1.52 1.52 0 0 1 6.5 19zM18.5 12a5.74 5.74 0 0 0-1.45.157l-2.74-3.94A2.41 2.41 0 0 0 15 6.5a2.54 2.54 0 1 0-1.52 2.28l3.17 4.56.36-.13A4.27 4.27 0 0 1 18.5 13a4.5 4.5 0 1 1-.008 9h-.006a4.68 4.68 0 0 1-3.12-1.35l-.703.71A5.65 5.65 0 0 0 18.49 23h.011a5.5 5.5 0 0 0 0-11zM11 6.5A1.5 1.5 0 1 1 12.5 8 1.51 1.51 0 0 1 11 6.5zM18.5 20a2.5 2.5 0 1 0-2.45-3h-5.05l-.3.5A4.55 4.55 0 0 1 6.5 22 4.53 4.53 0 0 1 2 17.5a4.6 4.6 0 0 1 3.15-4.37l-.296-.954A5.61 5.61 0 0 0 1 17.5 5.53 5.53 0 0 0 6.5 23a5.57 5.57 0 0 0 5.48-5h4.08a2.49 2.49 0 0 0 2.44 2zm0-4a1.5 1.5 0 1 1-1.5 1.5 1.51 1.51 0 0 1 1.5-1.5z" />
	</svg>
);

export const SearchGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ffffff"
		strokeWidth="2.5"
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="11" cy="11" r="7" />
		<path d="m21 21-4.3-4.3" />
	</svg>
);

// HubSpot sprocket mark, simplified to a white glyph.
export const HubSpotGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ffffff"
		strokeWidth="2.25"
		strokeLinecap="round"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="14" cy="14" r="5.5" />
		<path d="M14 8.5V3.5" />
		<path d="M14 3.5a1.6 1.6 0 1 0-.01 0" fill="#ffffff" stroke="none" />
		<path d="m9.9 10.2-5.4-4" />
		<path d="M4.5 6.2a1.6 1.6 0 1 0-.01 0" fill="#ffffff" stroke="none" />
		<path d="m10.3 17.9-3.6 3.4" />
	</svg>
);

// Memory block's brain mark (apps/sim/components/icons.tsx BrainIcon —
// lucide brain, stroke-based), white — sits on the #F64F9E chip.
export const BrainGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ffffff"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M12 5a3 3 0 1 0-6.125 4 4 0 0 0-2.53 5.77 4 4 0 0 0 .556 6.59A4 4 0 1 0 12 18Z" />
		<path d="M12 5a3 3 0 1 1 6.125 4 4 0 0 1 2.53 5.77 4 4 0 0 1-.556 6.59A4 4 0 1 1 12 18Z" />
		<path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
		<path d="M17.6 6.5a3 3 0 0 0 .399-1.37" />
		<path d="M6 5.13A3 3 0 0 0 6.4 6.5" />
		<path d="M3.48 10.9a4 4 0 0 1 .585-.396" />
		<path d="M19.94 10.5a4 4 0 0 1 .585.4" />
		<path d="M6 18a4 4 0 0 1-1.97-.516" />
		<path d="M19.97 17.48A4 4 0 0 1 18 18" />
	</svg>
);

// Slack pinwheel mark (the real logo path), white — sits on the #611f69 chip.
export const SlackGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path
			fill="#ffffff"
			d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
		/>
	</svg>
);

// Gmail brand glyph (multicolor — sits on the light #E0E0E0 chip like the docs).
export const GmailGlyphFull: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
		<path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.66,0,3-1.34,3-3V16.2z" />
		<path fill="#1e88e5" d="M3,16.2l3.61,1.71L13,23.7V40H6c-1.66,0-3-1.34-3-3V16.2z" />
		<polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
		<path fill="#c62828" d="M3,12.3V16.2l10,7.5V11.2L9.88,8.86C9.13,8.3,8.23,8,7.3,8h0C4.92,8,3,9.92,3,12.3z" />
		<path
			fill="#fbc02d"
			d="M45,12.3V16.2l-10,7.5V11.2l3.12-2.34C38.87,8.3,39.77,8,40.7,8h0 C43.08,8,45,9.92,45,12.3z"
		/>
	</svg>
);

// Condition block glyph (apps/sim/components/icons.tsx ConditionalIcon),
// white — sits on the #FF752F chip.
export const ConditionGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg
		width={size}
		height={(size * 29) / 28}
		viewBox="0 0 28 29"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M23.1 1.02C22.18 1.01 21.29 1.34 20.59 1.93C19.89 2.52 19.41 3.34 19.26 4.25C19.1 5.15 19.27 6.09 19.74 6.88C20.2 7.67 20.93 8.27 21.8 8.58V12.72H6.2V8.58C7.07 8.27 7.8 7.67 8.26 6.87C8.73 6.08 8.9 5.15 8.74 4.24C8.59 3.33 8.12 2.51 7.41 1.92C6.71 1.33 5.82 1 4.9 1C3.98 1 3.09 1.33 2.39 1.92C1.68 2.51 1.21 3.33 1.06 4.24C0.9 5.15 1.07 6.08 1.54 6.87C2 7.67 2.73 8.27 3.6 8.58V12.72C3.6 13.41 3.87 14.07 4.36 14.56C4.85 15.04 5.51 15.32 6.2 15.32H12.7V20.76C11.83 21.06 11.1 21.67 10.64 22.46C10.17 23.25 10 24.19 10.16 25.09C10.31 26 10.78 26.82 11.49 27.42C12.19 28.01 13.08 28.33 14 28.33C14.92 28.33 15.81 28.01 16.51 27.42C17.22 26.82 17.69 26 17.85 25.09C18 24.19 17.83 23.25 17.36 22.46C16.9 21.67 16.17 21.06 15.3 20.76V15.32H21.8C22.49 15.32 23.15 15.04 23.64 14.56C24.13 14.07 24.4 13.41 24.4 12.72V8.58C25.27 8.27 26 7.67 26.46 6.88C26.93 6.09 27.1 5.15 26.94 4.25C26.79 3.34 26.32 2.52 25.61 1.93C24.91 1.34 24.02 1.01 23.1 1.02ZM4.9 6.22C4.64 6.22 4.39 6.14 4.18 6C3.96 5.85 3.8 5.65 3.7 5.41C3.6 5.18 3.58 4.91 3.63 4.66C3.68 4.41 3.8 4.18 3.98 4C4.16 3.82 4.39 3.69 4.65 3.64C4.9 3.59 5.16 3.62 5.4 3.72C5.64 3.81 5.84 3.98 5.98 4.19C6.12 4.41 6.2 4.66 6.2 4.92C6.2 5.26 6.06 5.59 5.82 5.84C5.58 6.08 5.25 6.22 4.9 6.22ZM14 25.72C13.74 25.72 13.49 25.64 13.28 25.5C13.06 25.36 12.9 25.15 12.8 24.92C12.7 24.68 12.68 24.42 12.73 24.16C12.78 23.91 12.9 23.68 13.08 23.5C13.26 23.32 13.5 23.19 13.75 23.14C14 23.09 14.26 23.12 14.5 23.22C14.74 23.32 14.94 23.48 15.08 23.7C15.22 23.91 15.3 24.16 15.3 24.42C15.3 24.76 15.16 25.09 14.92 25.34C14.68 25.58 14.35 25.72 14 25.72ZM23.1 6.22C22.84 6.22 22.59 6.14 22.38 6C22.17 5.85 22 5.65 21.9 5.41C21.8 5.18 21.78 4.91 21.83 4.66C21.88 4.41 22 4.18 22.18 4C22.36 3.82 22.6 3.69 22.85 3.64C23.1 3.59 23.36 3.62 23.6 3.72C23.84 3.81 24.04 3.98 24.18 4.19C24.33 4.41 24.4 4.66 24.4 4.92C24.4 5.26 24.26 5.59 24.02 5.84C23.78 6.08 23.45 6.22 23.1 6.22Z"
			fill="#ffffff"
			stroke="#ffffff"
			strokeWidth="0.25"
		/>
	</svg>
);

// Router block glyph (apps/sim/components/icons.tsx ConnectIcon), white —
// sits on the #28C43F chip.
export const RouterGlyphW: React.FC<{size?: number}> = ({size = 16 * S}) => (
	<svg width={size} height={size} viewBox="-2 -2 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M24 16C24 17.47 23.48 18.72 22.43 19.77C21.39 20.81 20.13 21.33 18.67 21.33H7.77C7.48 22.11 6.99 22.75 6.32 23.25C5.64 23.75 4.87 24 4 24C2.89 24 1.94 23.61 1.17 22.83C0.39 22.06 0 21.11 0 20C0 18.89 0.39 17.94 1.17 17.17C1.94 16.39 2.89 16 4 16C4.87 16 5.64 16.25 6.32 16.75C7 17.25 7.48 17.89 7.77 18.67H18.67C19.4 18.67 20.03 18.41 20.55 17.88C21.07 17.36 21.33 16.73 21.33 16C21.33 15.27 21.07 14.64 20.55 14.12C20.03 13.59 19.4 13.33 18.67 13.33L5.33 13.33C3.87 13.33 2.61 12.81 1.57 11.77C0.52 10.72 0 9.47 0 8C0 6.53 0.52 5.28 1.57 4.23C2.61 3.19 3.87 2.67 5.33 2.67H16.23C16.52 1.89 17.01 1.25 17.68 0.75C18.36 0.25 19.13 0 20 3.58e-06C21.11 3.58e-06 22.06 0.39 22.83 1.17C23.61 1.94 24 2.89 24 4C24 5.11 23.61 6.06 22.83 6.83C22.06 7.61 21.11 8 20 8C19.13 8 18.36 7.75 17.67 7.25C16.98 6.75 16.5 6.11 16.23 5.33H5.33C4.6 5.33 3.97 5.59 3.45 6.12C2.93 6.64 2.67 7.27 2.67 8C2.67 8.73 2.93 9.36 3.45 9.88C3.97 10.4 4.6 10.66 5.33 10.67L18.67 10.67C20.13 10.67 21.39 11.19 22.43 12.23C23.48 13.28 24 14.53 24 16ZM5.33 20C5.33 19.62 5.21 19.31 4.95 19.05C4.69 18.79 4.38 18.67 4 18.67C3.62 18.67 3.31 18.8 3.05 19.05C2.79 19.31 2.67 19.62 2.67 20C2.67 20.38 2.79 20.69 3.05 20.95C3.31 21.2 3.62 21.33 4 21.33C4.38 21.33 4.69 21.21 4.95 20.95C5.21 20.69 5.34 20.38 5.33 20ZM21.33 4C21.33 3.62 21.21 3.31 20.95 3.05C20.69 2.79 20.38 2.67 20 2.67C19.62 2.67 19.31 2.8 19.05 3.05C18.79 3.31 18.67 3.62 18.67 4C18.67 4.38 18.79 4.69 19.05 4.95C19.31 5.2 19.62 5.33 20 5.33C20.38 5.33 20.69 5.21 20.95 4.95C21.21 4.69 21.34 4.38 21.33 4Z"
			fill="#ffffff"
		/>
	</svg>
);

// Smooth-step edge between two points, matching React Flow's getSmoothStepPath
// look (rounded 90° turns). Draw progress 0..1 via strokeDasharray.
// Native docs stroke is 1.5px on var(--wp-edge); at the ×1.5 block scale that
// is 2.25. Highlighted edges are #33b4ff at 2.5 native (3.75 scaled).
/**
 * The smooth-step path SimEdgePath draws, as data: `d` plus the EXACT path
 * length (straight runs minus the corner cuts plus two quarter arcs), so
 * pulses can ride the path with dash math. Same geometry as SimEdgePath.
 */
export const simEdgeD = (
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	radius = 12,
): {d: string; len: number} => {
	const midX = (x1 + x2) / 2;
	const dy = y2 - y1;
	const r = Math.min(radius, Math.abs(dy) / 2, Math.abs(x2 - x1) / 2);
	const sy = Math.sign(dy) || 0;
	if (sy === 0) {
		return {d: `M ${x1} ${y1} L ${x2} ${y2}`, len: Math.abs(x2 - x1)};
	}
	const d = `M ${x1} ${y1} L ${midX - r} ${y1} Q ${midX} ${y1} ${midX} ${y1 + r * sy} L ${midX} ${y2 - r * sy} Q ${midX} ${y2} ${midX + r} ${y2} L ${x2} ${y2}`;
	// Quadratic quarter-turn arc length ≈ 1.55r (vs πr/2 = 1.57r for a circle).
	const len = Math.abs(x2 - x1) + Math.abs(dy) - 4 * r + 2 * 1.55 * r;
	return {d, len};
};

export const SimEdgePath: React.FC<{
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	progress?: number;
	color?: string;
	thickness?: number;
	radius?: number;
}> = ({x1, y1, x2, y2, progress = 1, color = C.handle, thickness = 2.25, radius = 12}) => {
	// A zero-length dash with a round linecap still rasterizes a dot — draw
	// nothing until the edge actually starts.
	if (progress <= 0) return null;
	const midX = (x1 + x2) / 2;
	const dy = y2 - y1;
	const r = Math.min(radius, Math.abs(dy) / 2, Math.abs(x2 - x1) / 2);
	const sy = Math.sign(dy) || 0;

	const d =
		sy === 0
			? `M ${x1} ${y1} L ${x2} ${y2}`
			: `M ${x1} ${y1} L ${midX - r} ${y1} Q ${midX} ${y1} ${midX} ${y1 + r * sy} L ${midX} ${y2 - r * sy} Q ${midX} ${y2} ${midX + r} ${y2} L ${x2} ${y2}`;

	// approximate length for dash animation
	const len = Math.abs(x2 - x1) + Math.abs(y2 - y1) + 20;

	return (
		<path
			d={d}
			fill="none"
			// style, not attribute: SVG presentation attributes don't resolve
			// var(), and `color` is usually a theme CSS variable now.
			style={{stroke: color}}
			strokeWidth={thickness}
			strokeDasharray={`${len * progress} 99999`}
			strokeLinecap="round"
		/>
	);
};
