import React from "react";
import {interpolate} from "remotion";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	DatabaseGlyphW,
	DipSwap,
	ResolvedTag,
	SearchGlyphW,
	SimBlock,
	SlackGlyphW,
	StartGlyphW,
	type SimBlockTool,
} from "../../../components";
import {ToolGlyph, WorkflowGlyph} from "../../../components/ObjectIcons";
import {blockX, CHAIN_Y} from "../layout";
import {LaneEdge, type BlockVis} from "./_local";

// v3 (orientation cut) pieces — the SUPPORT TRIAGE example, the docs' own
// running example (Classify <start.input>). The middle rung starts as a
// deterministic keyword router and morphs in place into the Agent block;
// both have exactly two rows so the morph never changes block height.
//
// Data-travel language (no cargo on wires): values resolve INSIDE rows via
// DipSwap (Start's Input shows the actual message; Response's Data resolves
// to the actual category); the only thing that moves on a wire is WirePulse.

const CodeGlyphW: React.FC<{size?: number}> = ({size = 22}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ffffff"
		strokeWidth="2.25"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="m16 18 6-6-6-6" />
		<path d="m8 6-6 6 6 6" />
	</svg>
);

/** Workflow-as-tool chip for the preview beat (a real support sub-flow).
 *  Short name so it provably shares the wrap line with Search. */
export const CHIP_WORKFLOW: SimBlockTool = {
	name: "Refunds",
	color: "#6366F1",
	glyph: <WorkflowGlyph size={14} color="#ffffff" />,
};

// v3 chips = the REAL run's toolset (Knowledge search, customerLookup, Exa),
// with names short enough that all three provably sit on ONE line. The chat
// aside uses the full tool names where there's room.
export const CHIP_DOCS: SimBlockTool = {
	name: "Docs",
	color: "#00B0B0",
	glyph: <DatabaseGlyphW size={14} />,
};
export const CHIP_CRM: SimBlockTool = {
	name: "CRM",
	color: "#6366F1",
	glyph: <ToolGlyph size={14} color="#ffffff" />,
};
export const CHIP_SEARCH_V3: SimBlockTool = {
	name: "Search",
	color: "#1F40ED",
	glyph: <SearchGlyphW size={14} />,
};

const visOpacity = (v?: BlockVis) =>
	v?.hidden ? 0 : (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));

type EdgeVis = {progress?: number; hi?: number; opacity?: number};

export type TriageGifts = {
	tools?: SimBlockTool[];
	toolsReveal?: number;
	toolsWrapReveal?: number;
	skillsReveal?: number;
};

type TriageChainProps = {
	start?: BlockVis;
	mid?: BlockVis;
	response?: BlockVis;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	/** 0 = Route (Function), 1 = Triage (Agent). Crossfades in place; the
	 *  Response Data tag follows (<route.result> → <triage.content>). */
	morph?: number;
	tagGlowMsg?: number;
	tagGlowResp?: number;
	/** The actual customer message resolving into Start's Input row. */
	inputResolve?: {text: string; mix: number};
	/** The agent's Messages tag resolving to the actual message (ResolvedTag). */
	msgResolve?: {text: string; mix: number};
	/** The actual category resolving into the Response Data row's TAG —
	 *  the JSON template stays; only the reference substitutes. */
	respResolve?: {text: string; mix: number};
	gifts?: TriageGifts;
};

export const TriageChain: React.FC<TriageChainProps> = ({
	start,
	mid,
	response,
	edge1,
	edge2,
	morph = 0,
	tagGlowMsg = 0,
	tagGlowResp = 0,
	inputResolve,
	msgResolve,
	respResolve,
	gifts = {},
}) => {
	const fnOp = interpolate(morph, [0.3, 0.7], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const agOp = interpolate(morph, [0.3, 0.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const midOp = visOpacity(mid);
	const {
		tools = [],
		toolsReveal = tools.length > 0 ? 1 : 0,
		toolsWrapReveal = 1,
		skillsReveal = 0,
	} = gifts;

	// The Slack Message tag follows the morph; a run resolves the tag to the
	// actual posted text — the agent's words landing in the next block.
	const tagStr = morph < 0.5 ? "<route.result>" : "<triage.content>";
	const morphDip = Math.min(1, Math.abs(morph - 0.5) * 4);
	const messageValue = (
		<span style={{opacity: morphDip}}>
			<ResolvedTag
				tag={tagStr}
				value={respResolve?.text ?? ""}
				glow={tagGlowResp}
				resolve={respResolve?.mix ?? 0}
			/>
		</span>
	);

	const inputValue = inputResolve ? (
		<DipSwap a="Customer message" b={inputResolve.text} mix={inputResolve.mix} />
	) : (
		"Customer message"
	);

	return (
		<>
			<LaneEdge i={0} {...edge1} />
			<LaneEdge i={1} {...edge2} />
			<div style={{position: "absolute", left: blockX(0), top: CHAIN_Y, opacity: visOpacity(start)}}>
				<SimBlock
					name="Start"
					color={BLOCK_COLORS.start}
					glyph={<StartGlyphW size={22} />}
					rows={[{title: "Input", value: inputValue}]}
					hideTargetHandle
					highlighted={start?.highlighted}
					state={start?.state}
				/>
			</div>

			{/* The middle rung: keyword router ↔ Triage agent */}
			{fnOp > 0 ? (
				<div style={{position: "absolute", left: blockX(1), top: CHAIN_Y, opacity: midOp * fnOp}}>
					<SimBlock
						name="Route"
						color={BLOCK_COLORS.function}
						glyph={<CodeGlyphW size={22} />}
						rows={[
							{title: "Language", value: "JavaScript"},
							{title: "Code", value: 'msg.includes("refund") ? "billing"…'},
						]}
						highlighted={mid?.highlighted}
						state={mid?.state}
					/>
				</div>
			) : null}
			{agOp > 0 ? (
				<div style={{position: "absolute", left: blockX(1), top: CHAIN_Y, opacity: midOp * agOp}}>
					<SimBlock
						name="Triage"
						color={BLOCK_COLORS.agent}
						glyph={<AgentGlyphW size={22} />}
						rows={[
							{
								title: "Messages",
								value: (
									<>
										{"Classify: "}
										<ResolvedTag
											tag="<start.message>"
											value={msgResolve?.text ?? ""}
											glow={tagGlowMsg}
											resolve={msgResolve?.mix ?? 0}
										/>
									</>
								),
							},
							{title: "Model", value: "claude-sonnet-4-6"},
							{title: "Skills", value: "support-playbook", opacity: skillsReveal},
						]}
						tools={tools}
						toolsReveal={toolsReveal}
						toolsWrapReveal={toolsWrapReveal}
						toolsRowAfter={1}
						highlighted={mid?.highlighted}
						state={mid?.state}
					/>
				</div>
			) : null}

			{/* Terminal: Slack posts the result to #support on every run */}
			<div
				style={{position: "absolute", left: blockX(2), top: CHAIN_Y, opacity: visOpacity(response)}}
			>
				<SimBlock
					name="Slack"
					color={BLOCK_COLORS.slack}
					glyph={<SlackGlyphW size={20} />}
					rows={[
						{title: "Channel", value: "#support"},
						{title: "Message", value: messageValue},
					]}
					hideSourceHandle
					highlighted={response?.highlighted}
					state={response?.state}
				/>
			</div>
		</>
	);
};

// ---------------------------------------------------------------------------
// Shared run choreography: input resolves in Start's row → pulse crosses
// edge 1 → the middle block works → pulse crosses edge 2 → the category
// resolves in Response's row, holds, then both revert. Scenes drive it with
// a single start time.
// ---------------------------------------------------------------------------
export type RunBeats = {
	inputMix: number;
	pulse1: number;
	midLive: boolean;
	/** ResolvedTag mix for the block's Messages tag. */
	msgMix: number;
	pulse2: number;
	respMix: number;
	startBlip: boolean;
	respBlip: boolean;
	/** When this run is fully reverted (next run may start here). */
	end: number;
};

export const runBeats = (
	t: number,
	a: number,
	opts: {midDur?: number; hold?: number} = {},
): RunBeats => {
	const m = opts.midDur ?? 0.7;
	const hold = opts.hold ?? 0.7;
	const c = (lo: number, hi: number, l2 = 0, h2 = 1) =>
		interpolate(t, [lo, hi], [l2, h2], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

	const respStart = a + 1.1 + m + 0.65; // after pulse 2 lands
	const revertAt = respStart + 0.35 + hold;

	return {
		inputMix: Math.min(c(a, a + 0.35), c(revertAt, revertAt + 0.35, 1, 0)),
		startBlip: t >= a + 0.25 && t < a + 0.75,
		pulse1: c(a + 0.5, a + 1.15),
		midLive: t >= a + 1.1 && t < a + 1.1 + m,
		// The Messages tag resolves the moment the pulse arrives at the block.
		msgMix: Math.min(c(a + 1.05, a + 1.45), c(revertAt, revertAt + 0.35, 1, 0)),
		pulse2: c(a + 1.1 + m, a + 1.75 + m),
		respMix: Math.min(c(respStart, respStart + 0.35), c(revertAt, revertAt + 0.35, 1, 0)),
		respBlip: t >= respStart - 0.05 && t < respStart + 0.55,
		end: revertAt + 0.35,
	};
};
