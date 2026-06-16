import React from "react";
import {interpolate, interpolateColors} from "remotion";
import {COLORS, usePalette, type Palette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	DipSwap,
	ResolvedTag,
	SimBlock,
	SimEdgePath,
	StartGlyphW,
	Tag,
	simEdgeD,
} from "../../../components";
import {
	CONT_H,
	CONT_HEADER_H,
	CONT_W,
	CONT_X,
	CONT_Y,
	EDGE0,
	EDGE_EXIT,
	FN_X,
	PILL_FONT,
	PILL_H,
	PILL_HANDLE_H,
	PILL_HANDLE_W,
	PILL_LINE_H,
	PILL_W,
	PILL_X,
	PILL_Y,
	START_X,
	START_Y,
	STAGE_H,
	STAGE_W,
	SUM_X,
	SUM_Y,
	cameraTo,
	innerEdge,
	instY,
} from "../layout";

// The whole video is this one set piece: Start → container (Loop ⇄
// Parallel) holding Function 1 → Summary. Shape from the docs' own
// LOOP_WORKFLOW / PARALLEL_WORKFLOW; container anatomy from the docs'
// preview-container-node.tsx cross-checked against the app's subflow node;
// identities from the app's subflow tool configs (Loop #2FB3FF RepeatIcon,
// Parallel #FEE12B SplitIcon); inner content from the product's own
// mechanism screenshots (loop-2.png / parallel-2.png). `phase` drives the
// single morph (chip color+glyph, name, the two reference tags) — nothing
// else changes between the identities, which is the lesson.

const S = 1.5;

// Container identities — the app's subflow tool configs (the registry
// analog for containers): subflows/loop/loop-config.ts and
// subflows/parallel/parallel-config.ts.
export const LOOP_COLOR = "#2FB3FF";
export const PARALLEL_COLOR = "#FEE12B";

// The product-authored collection (parallel-2.png; applied to both phases
// per script assumption 2).
export const ITEMS = ['"x"', '"y"', '"z"'] as const;
export const COLLECTION = '["x", "y", "z"]';

// Shared, founders-toggle-gated dot grid (default OFF).
export {CanvasDots} from "../../../components";

/** Camera transform over the unchanged layout (lean-in archetype). */
export const Camera: React.FC<{px: number; py: number; s: number; children: React.ReactNode}> = ({
	px,
	py,
	s,
	children,
}) => {
	const {tx, ty} = cameraTo(px, py, s);
	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				transform: `translate(${tx}px, ${ty}px) scale(${s})`,
				transformOrigin: "0 0",
			}}
		>
			{children}
		</div>
	);
};

// ── Glyphs ───────────────────────────────────────────────────────────────────
// Lucide RepeatIcon / SplitIcon — the app's own container icons
// (loop-config.ts / parallel-config.ts import them from lucide-react).
// Stroke ports at 24×24, strokeWidth 2, round caps/joins.
const lucide = (size: number, color: string, paths: string[]) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		{paths.map((d) => (
			<path key={d} d={d} />
		))}
	</svg>
);

export const RepeatGlyph: React.FC<{size?: number; color?: string}> = ({
	size = 24,
	color = "white",
}) =>
	lucide(size, color, [
		"m17 2 4 4-4 4",
		"M3 11v-1a4 4 0 0 1 4-4h14",
		"m7 22-4-4 4-4",
		"M21 13v1a4 4 0 0 1-4 4H3",
	]);

export const SplitGlyph: React.FC<{size?: number; color?: string}> = ({
	size = 24,
	color = "white",
}) =>
	lucide(size, color, [
		"M16 3h5v5",
		"M8 3H3v5",
		"M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3",
		"m15 9 6-6",
	]);

// Function block glyph — CodeIcon (apps/sim/components/icons.tsx:527),
// white stroke, native 30×27 viewBox.
export const CodeGlyphW: React.FC<{size?: number}> = ({size = 22}) => (
	<svg width={size} height={(size * 27) / 30} viewBox="0 0 30 27" fill="none">
		<path
			d="M23.26 6.83L23.64 7.2C26.54 10.11 28 11.56 28 13.37C28 15.18 26.54 16.63 23.64 19.54L23.26 19.91M18.04 2L11.95 24.74M6.73 6.83L6.36 7.2C3.45 10.11 2 11.56 2 13.37C2 15.18 3.45 16.63 6.36 19.54L6.73 19.91"
			stroke="white"
			strokeWidth="2.6"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

// ── Shared state types (branching's grammar) ───────────────────────────────
export type BlockVis = {
	opacity?: number;
	dim?: number;
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
};
export type EdgeVis = {progress?: number; hi?: number; opacity?: number};

export const visOpacity = (v?: BlockVis) => (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));
const edgeColor = (hi: number, pal: Palette) =>
	interpolateColors(hi, [0, 1], [pal.wire, pal.secondary]);

const clamp01 = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const sub = (p: number, lo: number, hi: number) => interpolate(p, [lo, hi], [0, 1], clamp01);

/** The morph's internal stagger, derived from one phase value so the
 *  reverse morph (scene 7) is the same move played backward. */
export const morphCurves = (phase: number) => ({
	headerMix: sub(phase, 0.0, 0.4),
	tagMix: sub(phase, 0.3, 0.7),
	resultsMix: sub(phase, 0.55, 0.95),
});

/** WirePulse's streak language carried along a smooth-step path via dash
 *  math — no cargo, absorbed before the destination (branching's device). */
export const PathPulse: React.FC<{
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	p: number;
	streak?: number;
}> = ({x1, y1, x2, y2, p, streak = 80}) => {
	if (p <= 0 || p >= 1) return null;
	const {d, len} = simEdgeD(x1, y1, x2, y2);
	const head = p * len;
	const s = Math.min(streak, head);
	if (s <= 0) return null;
	const op = p > 0.82 ? (1 - p) / 0.18 : 1;
	const dash = `${s} ${len + streak}`;
	return (
		<>
			<path
				d={d}
				fill="none"
				stroke="rgba(51,180,255,0.35)"
				strokeWidth={9}
				strokeLinecap="round"
				strokeDasharray={dash}
				strokeDashoffset={s - head}
				opacity={op}
			/>
			<path
				d={d}
				fill="none"
				stroke="#33b4ff"
				strokeWidth={4}
				strokeLinecap="round"
				strokeDasharray={dash}
				strokeDashoffset={s - head}
				opacity={op}
			/>
		</>
	);
};

// ── The container node ───────────────────────────────────────────────────────
// Pixel port of the docs' preview-container-node.tsx ×1.5 (header py-2
// pl-2 pr-3, 24px chip rounded-6, 16px medium name, border-b; body fill
// --wp-container-fill; Start pill left-4 top-[56px] px-3 py-1.5 13px
// medium with its own 7×16 source handle; container handles 7×20 at the
// vertical center). Ring treatment matches SimBlock (inset 1.75×S).
type ContainerProps = {
	name: React.ReactNode;
	chipMix: number; // 0 = Loop blue/Repeat, 1 = Parallel yellow/Split
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
	dimmed?: number;
	/** 0..1 — blue blip ring on the inner Start pill (an iteration fires). */
	pillBlip?: number;
	children?: React.ReactNode;
};

export const SubflowContainer: React.FC<ContainerProps> = ({
	name,
	chipMix,
	highlighted = false,
	state = "none",
	dimmed = 1,
	pillBlip = 0,
	children,
}) => {
	const pal = usePalette();
	const chipBg = interpolateColors(chipMix, [0, 1], [LOOP_COLOR, PARALLEL_COLOR]);
	const ringColor = state === "error" ? "#ef4444" : state === "ok" ? "#22c55e" : COLORS.secondary;
	const showRing = highlighted || state !== "none";
	// rgba(255,255,255,0.02) dark / rgba(0,0,0,0.02) light — global.css
	// .wp-scope --wp-container-fill.
	const fill = pal.bg === "#1b1b1b" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";

	return (
		<div
			style={{
				position: "absolute",
				left: CONT_X,
				top: CONT_Y,
				width: CONT_W,
				height: CONT_H,
				opacity: dimmed,
			}}
		>
			{/* Target handle (left, vertical center) */}
			<div
				style={{
					position: "absolute",
					left: -8 * S,
					top: CONT_H / 2 - 10 * S,
					width: 7 * S,
					height: 20 * S,
					backgroundColor: COLORS.wire,
					borderRadius: `${2 * S}px 0 0 ${2 * S}px`,
				}}
			/>
			{/* Source handle (right, vertical center) */}
			<div
				style={{
					position: "absolute",
					right: -8 * S,
					top: CONT_H / 2 - 10 * S,
					width: 7 * S,
					height: 20 * S,
					backgroundColor: COLORS.wire,
					borderRadius: `0 ${2 * S}px ${2 * S}px 0`,
				}}
			/>

			<div
				style={{
					width: "100%",
					height: "100%",
					border: `1px solid ${COLORS.border1}`,
					borderRadius: 8 * S,
					backgroundColor: fill,
					boxSizing: "border-box",
					overflow: "hidden",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 10 * S,
						height: CONT_HEADER_H,
						boxSizing: "border-box",
						padding: `0 ${12 * S}px 0 ${8 * S}px`,
						borderBottom: `1px solid ${COLORS.border1}`,
						backgroundColor: COLORS.surface3,
					}}
				>
					<div
						style={{
							position: "relative",
							width: 24 * S,
							height: 24 * S,
							borderRadius: 6 * S,
							background: chipBg,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexShrink: 0,
						}}
					>
						{/* Loop glyph: white on the blue chip. */}
						<span style={{display: "flex", opacity: 1 - chipMix}}>
							<RepeatGlyph size={16 * S} color="white" />
						</span>
						{/* Parallel glyph: dark on the light yellow chip — the
						    product's own luminance rule (iconClassFor). */}
						{chipMix > 0 ? (
							<span style={{display: "flex", position: "absolute", opacity: chipMix}}>
								<SplitGlyph size={16 * S} color="#1c1c1c" />
							</span>
						) : null}
					</div>
					<span
						style={{
							fontFamily:
								'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
							fontWeight: 500,
							fontSize: 16 * S,
							color: COLORS.text,
							whiteSpace: "nowrap",
						}}
					>
						{name}
					</span>
				</div>
			</div>

			{/* Inner Start pill (absolute over the body, like the product) */}
			<div
				style={{
					position: "absolute",
					left: PILL_X - CONT_X,
					top: PILL_Y - CONT_Y,
					width: PILL_W,
					height: PILL_H,
					boxSizing: "border-box",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					borderRadius: 8 * S,
					border: `1px solid ${COLORS.border1}`,
					backgroundColor: COLORS.surface2,
				}}
			>
				<span
					style={{
						fontFamily:
							'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
						fontWeight: 500,
						fontSize: PILL_FONT,
						lineHeight: `${PILL_LINE_H}px`,
						color: COLORS.text,
					}}
				>
					Start
				</span>
				{/* Pill source handle (7×16 native, right −8) */}
				<div
					style={{
						position: "absolute",
						right: -8 * S,
						top: PILL_H / 2 - PILL_HANDLE_H / 2,
						width: PILL_HANDLE_W,
						height: PILL_HANDLE_H,
						backgroundColor: COLORS.wire,
						borderRadius: `0 ${2 * S}px ${2 * S}px 0`,
					}}
				/>
				{pillBlip > 0 ? (
					<div
						style={{
							position: "absolute",
							inset: 0,
							borderRadius: 8 * S,
							boxShadow: `inset 0 0 0 ${1.75 * S}px ${COLORS.secondary}`,
							opacity: pillBlip,
						}}
					/>
				) : null}
			</div>

			{/* Children (the inner instance blocks) live inside the box */}
			{children}

			{/* State ring — same treatment as SimBlock (inset 1.75×S). */}
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
	);
};

// ── The full rig ─────────────────────────────────────────────────────────────
export type TagState = {glow?: number; resolve?: number};

type InstanceState = BlockVis & {
	tag?: TagState;
	/** Which item this instance resolves (index into ITEMS). */
	item?: number;
};

type RigProps = {
	/** 0 = Loop … 1 = Parallel (drives the whole morph). */
	phase: number;
	start?: BlockVis;
	container?: BlockVis;
	summary?: BlockVis;
	/** Middle instance — THE Function 1 block. */
	fn?: InstanceState;
	/** 0..1 — the parallel fan: ghost instances separate from the middle. */
	fan?: number;
	fnTop?: InstanceState;
	fnBot?: InstanceState;
	edge0?: EdgeVis;
	edgeIn?: EdgeVis;
	edgeExit?: EdgeVis;
	/** <loop.results> / <parallel.results> in Summary's row. */
	resultsTag?: TagState;
	pillBlip?: number;
	pulse0?: number;
	pulseIn?: number;
	pulseInTop?: number;
	pulseInBot?: number;
	pulseExit?: number;
};

export const Rig: React.FC<RigProps> = ({
	phase,
	start,
	container,
	summary,
	fn,
	fan = 0,
	fnTop,
	fnBot,
	edge0,
	edgeIn,
	edgeExit,
	resultsTag,
	pillBlip = 0,
	pulse0 = 0,
	pulseIn = 0,
	pulseInTop = 0,
	pulseInBot = 0,
	pulseExit = 0,
}) => {
	const pal = usePalette();
	const m = morphCurves(phase);
	const ys = instY(fan);
	const eMid = innerEdge(fan, "mid");
	const eTop = innerEdge(fan, "top");
	const eBot = innerEdge(fan, "bot");

	// A reference that can glow and resolve in place; renders a plain Tag
	// when no resolution is in flight.
	const tagNode = (tagStr: string, value: string, t?: TagState) =>
		(t?.resolve ?? 0) > 0 ? (
			<ResolvedTag tag={tagStr} value={value} glow={t?.glow ?? 0} resolve={t?.resolve ?? 0} />
		) : (
			<Tag text={tagStr} glow={t?.glow ?? 0} />
		);

	// Function row value: `return <currentItem>` — the tag morphs with the
	// container identity and resolves in place during runs (loop-2.png /
	// parallel-2.png authored the code; the items are the collection's).
	// The identity choice keys off the morph mix (NOT raw phase) so the
	// stagger never leaks the other identity early.
	const itemValue = (inst?: InstanceState) => {
		const t = inst?.tag;
		const item = ITEMS[inst?.item ?? 0];
		return (
			<>
				return{" "}
				<DipSwap
					a={tagNode("<loop.currentItem>", item, t)}
					b={tagNode("<parallel.currentItem>", item, t)}
					mix={m.tagMix}
				/>
			</>
		);
	};

	// Consumer row value — both phases docs-verbatim (LOOP_WORKFLOW's
	// Summary agent ⇄ PARALLEL_WORKFLOW's Aggregate function).
	const resultsValue = (
		<DipSwap
			a={<>Summarize {tagNode("<loop.results>", COLLECTION, resultsTag)}</>}
			b={<>merge({tagNode("<parallel.results>", COLLECTION, resultsTag)})</>}
			mix={m.resultsMix}
		/>
	);

	const instance = (
		key: string,
		top: number,
		inst: InstanceState | undefined,
		extraOpacity: number,
	) =>
		extraOpacity <= 0 ? null : (
			<div
				key={key}
				style={{
					position: "absolute",
					left: FN_X - CONT_X,
					top,
					opacity: visOpacity(inst) * extraOpacity,
				}}
			>
				<SimBlock
					name="Function 1"
					color={BLOCK_COLORS.function}
					glyph={<CodeGlyphW size={20} />}
					rows={[{title: "Code", value: itemValue(inst)}]}
					hideSourceHandle
					highlighted={inst?.highlighted}
					state={inst?.state}
				/>
			</div>
		);

	return (
		<>
			{/* Outer edges + pulses (under the blocks) */}
			<svg
				width={STAGE_W}
				height={STAGE_H}
				viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
				style={{position: "absolute", inset: 0, pointerEvents: "none"}}
			>
				<g opacity={edge0?.opacity ?? 1}>
					<SimEdgePath
						x1={EDGE0.x1}
						y1={EDGE0.y}
						x2={EDGE0.x2}
						y2={EDGE0.y}
						progress={edge0?.progress ?? 1}
						color={edgeColor(edge0?.hi ?? 0, pal)}
						thickness={2.25 + 1.25 * (edge0?.hi ?? 0)}
					/>
				</g>
				<g opacity={edgeExit?.opacity ?? 1}>
					<SimEdgePath
						x1={EDGE_EXIT.x1}
						y1={EDGE_EXIT.y}
						x2={EDGE_EXIT.x2}
						y2={EDGE_EXIT.y}
						progress={edgeExit?.progress ?? 1}
						color={edgeColor(edgeExit?.hi ?? 0, pal)}
						thickness={2.25 + 1.25 * (edgeExit?.hi ?? 0)}
					/>
				</g>
				<PathPulse x1={EDGE0.x1} y1={EDGE0.y} x2={EDGE0.x2} y2={EDGE0.y} p={pulse0} />
				<PathPulse
					x1={EDGE_EXIT.x1}
					y1={EDGE_EXIT.y}
					x2={EDGE_EXIT.x2}
					y2={EDGE_EXIT.y}
					p={pulseExit}
				/>
			</svg>

			{/* Start trigger — header-only (see grounding: Input/Inputs drift) */}
			<div style={{position: "absolute", left: START_X, top: START_Y, opacity: visOpacity(start)}}>
				<SimBlock
					name="Start"
					color={BLOCK_COLORS.start}
					glyph={<StartGlyphW size={22} />}
					hideTargetHandle
					highlighted={start?.highlighted}
					state={start?.state}
				/>
			</div>

			{/* The container — one element, two identities */}
			<SubflowContainer
				name={<DipSwap a="Loop" b="Parallel" mix={m.headerMix} />}
				chipMix={m.headerMix}
				highlighted={container?.highlighted}
				state={container?.state ?? "none"}
				dimmed={visOpacity(container)}
				pillBlip={pillBlip}
			>
				{/* Inner edges + pulses, in container-local coordinates */}
				<svg
					width={CONT_W}
					height={CONT_H}
					viewBox={`${CONT_X} ${CONT_Y} ${CONT_W} ${CONT_H}`}
					style={{position: "absolute", inset: 0, pointerEvents: "none"}}
				>
					{fan > 0 ? (
						<>
							<g opacity={fan * (edgeIn?.opacity ?? 1)}>
								<SimEdgePath
									x1={eTop.x1}
									y1={eTop.y1}
									x2={eTop.x2}
									y2={eTop.y2}
									color={edgeColor(edgeIn?.hi ?? 0, pal)}
								/>
								<SimEdgePath
									x1={eBot.x1}
									y1={eBot.y1}
									x2={eBot.x2}
									y2={eBot.y2}
									color={edgeColor(edgeIn?.hi ?? 0, pal)}
								/>
							</g>
							<PathPulse x1={eTop.x1} y1={eTop.y1} x2={eTop.x2} y2={eTop.y2} p={pulseInTop} />
							<PathPulse x1={eBot.x1} y1={eBot.y1} x2={eBot.x2} y2={eBot.y2} p={pulseInBot} />
						</>
					) : null}
					<g opacity={edgeIn?.opacity ?? 1}>
						<SimEdgePath
							x1={eMid.x1}
							y1={eMid.y1}
							x2={eMid.x2}
							y2={eMid.y2}
							progress={edgeIn?.progress ?? 1}
							color={edgeColor(edgeIn?.hi ?? 0, pal)}
							thickness={2.25 + 1.25 * (edgeIn?.hi ?? 0)}
						/>
					</g>
					<PathPulse x1={eMid.x1} y1={eMid.y1} x2={eMid.x2} y2={eMid.y2} p={pulseIn} />
				</svg>

				{/* Instances (positions in container-local space) */}
				{instance("top", ys.top - CONT_Y, fnTop, fan)}
				{instance("bot", ys.bot - CONT_Y, fnBot, fan)}
				{instance("mid", ys.mid - CONT_Y, fn, 1)}
			</SubflowContainer>

			{/* The consumer — both docs after-blocks as one element's two
			    identities: Summary agent (LOOP_WORKFLOW) ⇄ Aggregate function
			    (PARALLEL_WORKFLOW). Equal row counts; the morph dips it in
			    sync with the container identity. */}
			<div style={{position: "absolute", left: SUM_X, top: SUM_Y, opacity: visOpacity(summary)}}>
				<SimBlock
					name={<DipSwap a="Summary" b="Aggregate" mix={m.resultsMix} />}
					color={BLOCK_COLORS.agent}
					glyph={<AgentGlyphW size={22} />}
					headerMorph={{
						color: BLOCK_COLORS.function,
						glyph: <CodeGlyphW size={20} />,
						mix: m.resultsMix,
					}}
					rows={[
						{
							title: <DipSwap a="Messages" b="Code" mix={m.resultsMix} />,
							value: resultsValue,
						},
					]}
					hideSourceHandle
					highlighted={summary?.highlighted}
					state={summary?.state}
				/>
			</div>
		</>
	);
};
