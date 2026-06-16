import React from "react";
import {interpolate, interpolateColors} from "remotion";
import {usePalette, type Palette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	ConditionGlyphW,
	DipSwap,
	ResolvedTag,
	RouterGlyphW,
	SimBlock,
	SimEdgePath,
	StartGlyphW,
	Tag,
	simEdgeD,
	type SimBlockBranch,
} from "../../../components";
import {
	branchEdge,
	cameraTo,
	deciderReveals,
	destY,
	DEC_X,
	DEC_Y,
	EDGE0,
	STAGE_H,
	STAGE_W,
	START_X,
	START_Y,
	DEST_X,
} from "../layout";

// The whole video is this one set piece. Content is the docs' own examples,
// verbatim: CONDITION_ROUTE_WORKFLOW at phase 0, ROUTER_TRIAGE_WORKFLOW at
// phase 1 (examples.ts:235 / :494). `phase` drives the single morph (header
// identity, branch labels, Context/Model/Billing row growth, 2→3 lane
// glide, Billing's lane appearing) — built once, run forward in scene 4 and
// in reverse in scene 7. Everything else is per-frame state props.

// Shared, founders-toggle-gated dot grid (default OFF).
export {CanvasDots} from "../../../components";

export type BlockVis = {
	opacity?: number;
	dim?: number;
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
};
export type EdgeVis = {progress?: number; hi?: number; opacity?: number};
export type BranchState = {
	/** 0..1 — blue tint: being checked. */
	glow?: number;
	/** 0..1 — green tint: matched. */
	match?: number;
	/** 0..1 — row dims: not matched / never checked. */
	dim?: number;
	/** 0..1 — the row's own source handle lights blue (the port firing). */
	handleGlow?: number;
};

const visOpacity = (v?: BlockVis) => (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));
const edgeColor = (hi: number, pal: Palette) =>
	interpolateColors(hi, [0, 1], [pal.wire, pal.secondary]);

const clamp01 = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const sub = (p: number, lo: number, hi: number) => interpolate(p, [lo, hi], [0, 1], clamp01);

/** The morph's internal stagger, all derived from one phase value so the
 *  reverse morph (scene 7) is the same move played backward. */
export const morphCurves = (phase: number) => ({
	headerMix: sub(phase, 0.0, 0.18),
	labelMix: sub(phase, 0.1, 0.3),
	ctxReveal: sub(phase, 0.3, 0.5),
	modelReveal: sub(phase, 0.45, 0.65),
	branchCReveal: sub(phase, 0.6, 0.8),
	laneMix: sub(phase, 0.55, 0.85),
	destCMix: sub(phase, 0.78, 1),
});

/**
 * WirePulse's light-streak language carried along the smooth-step branch
 * path via dash math — no cargo, absorbed before the destination.
 */
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

type ForkProps = {
	/** 0 = Condition fork (2 lanes) … 1 = Router fork (3 lanes). */
	phase: number;
	start?: BlockVis;
	decider?: BlockVis;
	destA?: BlockVis; // Escalate / Sales
	destB?: BlockVis; // Reply / Support
	destC?: BlockVis; // Billing (router phase)
	edge0?: EdgeVis;
	edgeA?: EdgeVis;
	edgeB?: EdgeVis;
	edgeC?: EdgeVis;
	branchA?: BranchState; // If / Sales row
	branchB?: BranchState; // else / Support row
	branchC?: BranchState; // Billing row
	/** <start.priority> inside the If expression (glow + in-place resolve). */
	ifTag?: {glow?: number; resolve?: number};
	/** <start.input> in the Context row (the Router reading it). */
	ctxTagGlow?: number;
	/** Model row tint — where the Router's decision happens. */
	modelGlow?: number;
	/** Pulses riding the wires (travel progress 0..1 each). */
	pulse0?: number;
	pulseA?: number;
	pulseB?: number;
	pulseC?: number;
};

export const Fork: React.FC<ForkProps> = ({
	phase,
	start,
	decider,
	destA,
	destB,
	destC,
	edge0,
	edgeA,
	edgeB,
	edgeC,
	branchA,
	branchB,
	branchC,
	ifTag,
	ctxTagGlow = 0,
	modelGlow = 0,
	pulse0 = 0,
	pulseA = 0,
	pulseB = 0,
	pulseC = 0,
}) => {
	const m = morphCurves(phase);
	const reveals = deciderReveals(m.ctxReveal, m.modelReveal, m.branchCReveal);
	const dy = destY(m.laneMix);

	const ifValue = (
		<>
			<ResolvedTag
				tag="<start.priority>"
				value="'high'"
				glow={ifTag?.glow ?? 0}
				resolve={ifTag?.resolve ?? 0}
			/>
			{" === 'high'"}
		</>
	);

	const branches: SimBlockBranch[] = [
		{
			label: <DipSwap a="If" b="Sales" mix={m.labelMix} />,
			value: <DipSwap a={ifValue} b="-" mix={m.labelMix} />,
			...branchA,
		},
		{
			label: <DipSwap a="else" b="Support" mix={m.labelMix} />,
			value: "-",
			...branchB,
		},
		{label: "Billing", value: "-", opacity: m.branchCReveal, ...branchC},
	];

	const eA = branchEdge(reveals, m.laneMix, 0);
	const eB = branchEdge(reveals, m.laneMix, 1);
	const eC = branchEdge(reveals, m.laneMix, 2);
	const destCOp = visOpacity(destC) * m.destCMix;
	const pal = usePalette();
	const edgeCOp = (edgeC?.opacity ?? 1) * m.destCMix;

	return (
		<>
			{/* Edges + pulses (under the blocks, like the canvas) */}
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
				<g opacity={edgeA?.opacity ?? 1}>
					<SimEdgePath
						x1={eA.x1}
						y1={eA.y1}
						x2={eA.x2}
						y2={eA.y2}
						progress={edgeA?.progress ?? 1}
						color={edgeColor(edgeA?.hi ?? 0, pal)}
						thickness={2.25 + 1.25 * (edgeA?.hi ?? 0)}
					/>
				</g>
				<g opacity={edgeB?.opacity ?? 1}>
					<SimEdgePath
						x1={eB.x1}
						y1={eB.y1}
						x2={eB.x2}
						y2={eB.y2}
						progress={edgeB?.progress ?? 1}
						color={edgeColor(edgeB?.hi ?? 0, pal)}
						thickness={2.25 + 1.25 * (edgeB?.hi ?? 0)}
					/>
				</g>
				{edgeCOp > 0 ? (
					<g opacity={edgeCOp}>
						<SimEdgePath
							x1={eC.x1}
							y1={eC.y1}
							x2={eC.x2}
							y2={eC.y2}
							progress={edgeC?.progress ?? 1}
							color={edgeColor(edgeC?.hi ?? 0, pal)}
							thickness={2.25 + 1.25 * (edgeC?.hi ?? 0)}
						/>
					</g>
				) : null}
				<PathPulse x1={EDGE0.x1} y1={EDGE0.y} x2={EDGE0.x2} y2={EDGE0.y} p={pulse0} />
				<PathPulse x1={eA.x1} y1={eA.y1} x2={eA.x2} y2={eA.y2} p={pulseA} />
				<PathPulse x1={eB.x1} y1={eB.y1} x2={eB.x2} y2={eB.y2} p={pulseB} />
				<PathPulse x1={eC.x1} y1={eC.y1} x2={eC.x2} y2={eC.y2} p={pulseC} />
			</svg>

			{/* Start — byte-identical in both acts (docs: Input | Ticket) */}
			<div style={{position: "absolute", left: START_X, top: START_Y, opacity: visOpacity(start)}}>
				<SimBlock
					name="Start"
					color={BLOCK_COLORS.start}
					glyph={<StartGlyphW size={22} />}
					rows={[{title: "Input", value: "Ticket"}]}
					hideTargetHandle
					highlighted={start?.highlighted}
					state={start?.state}
				/>
			</div>

			{/* The decider — one block, two identities */}
			<div style={{position: "absolute", left: DEC_X, top: DEC_Y, opacity: visOpacity(decider)}}>
				<SimBlock
					name={<DipSwap a="Condition" b="Router" mix={m.headerMix} />}
					color={BLOCK_COLORS.condition}
					glyph={<ConditionGlyphW size={22} />}
					headerMorph={{
						color: BLOCK_COLORS.router,
						glyph: <RouterGlyphW size={22} />,
						mix: m.headerMix,
					}}
					rows={[
						{
							title: "Context",
							value: <Tag text="<start.input>" glow={ctxTagGlow} />,
							opacity: m.ctxReveal,
						},
						{
							title: "Model",
							value: "claude-sonnet-4-6",
							opacity: m.modelReveal,
							glow: modelGlow,
						},
					]}
					branches={branches}
					highlighted={decider?.highlighted}
					state={decider?.state}
				/>
			</div>

			{/* Destination lanes (agents; docs Messages rows, dip-swapped by the morph) */}
			<div style={{position: "absolute", left: DEST_X, top: dy.a, opacity: visOpacity(destA)}}>
				<SimBlock
					name={<DipSwap a="Escalate" b="Sales" mix={m.labelMix} />}
					color={BLOCK_COLORS.agent}
					glyph={<AgentGlyphW size={22} />}
					rows={[
						{
							title: "Messages",
							value: (
								<DipSwap a="Escalate this ticket" b="Answer the pricing question" mix={m.labelMix} />
							),
						},
					]}
					hideSourceHandle
					highlighted={destA?.highlighted}
					state={destA?.state}
				/>
			</div>
			<div style={{position: "absolute", left: DEST_X, top: dy.b, opacity: visOpacity(destB)}}>
				<SimBlock
					name={<DipSwap a="Reply" b="Support" mix={m.labelMix} />}
					color={BLOCK_COLORS.agent}
					glyph={<AgentGlyphW size={22} />}
					rows={[
						{
							title: "Messages",
							value: (
								<DipSwap a="Draft a standard reply" b="Help with the issue" mix={m.labelMix} />
							),
						},
					]}
					hideSourceHandle
					highlighted={destB?.highlighted}
					state={destB?.state}
				/>
			</div>
			{destCOp > 0 ? (
				<div style={{position: "absolute", left: DEST_X, top: dy.c, opacity: destCOp}}>
					<SimBlock
						name="Billing"
						color={BLOCK_COLORS.agent}
						glyph={<AgentGlyphW size={22} />}
						rows={[{title: "Messages", value: "Resolve the billing question"}]}
						hideSourceHandle
						highlighted={destC?.highlighted}
						state={destC?.state}
					/>
				</div>
			) : null}
		</>
	);
};
