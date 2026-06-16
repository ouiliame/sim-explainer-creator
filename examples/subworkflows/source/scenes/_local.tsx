import React from "react";
import {usePalette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	DipSwap,
	ResolvedTag,
	ResponseGlyphW,
	SimBlock,
	SimEdgePath,
	StartGlyphW,
} from "../../../components";
import {WorkflowGlyph} from "../../../components/ObjectIcons";
import {
	blockX,
	CHAIN_EDGE_Y,
	CHAIN_Y,
	CHILD_SCALE,
	CHILD_TX,
	CHILD_TY,
	edgeX1,
	edgeX2,
	PANEL_H,
	PANEL_HEADER_H,
	PANEL_W,
	PANEL_X,
	PANEL_Y,
	STAGE_H,
	STAGE_W,
	STEM_TOP,
	STEM_X,
} from "../layout";

// Subworkflows take pieces. Three worlds, ONE geometry (layout.ts):
//
//   child  (scenes 1, 4)  Start → Agent → Response — the series CLASSIFY
//                         workflow, staging examples.ts CLASSIFY_WORKFLOW
//   parent (scenes 2–5)   Start → Workflow → Agent — the docs' own
//                         WORKFLOW_CALL_WORKFLOW skeleton
//   outer  (scene 6)      header-only Start → Workflow → Agent
//
// Every row TITLE is a verbatim staging-registry subBlock title
// (demo-corpus/grounding-v1.md verifies each): Inputs (start_trigger.ts),
// Select Workflow + Input Variable (workflow.ts), Model + Messages
// (agent.ts), Response Data + Status Code (response.ts). Values resolve in
// rows (DipSwap / ResolvedTag); wires carry WirePulse only.

// The one run's values (series canon; grounding-v1.md):
export const RUN_INPUT = "I want a refund";
export const RUN_ANSWER = '"billing"';
export const CHILD_NAME = "classify-message"; // CLASSIFY_WORKFLOW.id

// ── Vis helpers (same conventions as module-1/5/6/webhooks) ─────────────────

export type BlockVis = {
	opacity?: number;
	dim?: number;
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
	hidden?: boolean;
};

const visOpacity = (v?: BlockVis) =>
	v?.hidden ? 0 : (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));

export type EdgeVis = {progress?: number; opacity?: number};

/** A 0..1 resolution: glow on the tag, then resolve-in-place. */
export type Resolve = {glow?: number; mix?: number};

const Wire: React.FC<{x1: number; x2: number} & EdgeVis> = ({x1, x2, progress = 1, opacity = 1}) => {
	const pal = usePalette();
	return progress <= 0 || opacity <= 0 ? null : (
		<svg
			width={STAGE_W}
			height={STAGE_H}
			viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
			style={{position: "absolute", inset: 0, opacity, pointerEvents: "none"}}
		>
			<SimEdgePath
				x1={x1}
				y1={CHAIN_EDGE_Y}
				x2={x2}
				y2={CHAIN_EDGE_Y}
				progress={progress}
				color={pal.wire}
			/>
		</svg>
	);
};

const at = (i: 0 | 1 | 2, op: number, children: React.ReactNode) =>
	op <= 0 ? null : (
		<div style={{position: "absolute", left: blockX(i), top: CHAIN_Y, opacity: op}}>{children}</div>
	);

// ── The child world — the workflow the viewer already knows ─────────────────

type ChildChainProps = {
	start?: BlockVis;
	agent?: BlockVis;
	response?: BlockVis;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	/** The handed-off value dipping into Start's Inputs row (start.input). */
	inputMix?: number;
	/** `Classify <start.input>` resolving in the Messages row. */
	msg?: Resolve;
	/** `<agent.content>` resolving in the Response Data row. */
	resp?: Resolve;
};

export const ChildChain: React.FC<ChildChainProps> = ({
	start,
	agent,
	response,
	edge1,
	edge2,
	inputMix = 0,
	msg,
	resp,
}) => (
	<>
		<Wire x1={edgeX1(0)} x2={edgeX2(0)} {...edge1} />
		<Wire x1={edgeX1(1)} x2={edgeX2(1)} {...edge2} />

		{at(
			0,
			visOpacity(start),
			<SimBlock
				name="Start"
				color={BLOCK_COLORS.start}
				glyph={<StartGlyphW size={22} />}
				rows={[
					{
						title: "Inputs",
						value: <DipSwap a="Customer message" b={RUN_INPUT} mix={inputMix} />,
					},
				]}
				hideTargetHandle
				highlighted={start?.highlighted}
				state={start?.state}
			/>,
		)}

		{at(
			1,
			visOpacity(agent),
			<SimBlock
				name="Agent"
				color={BLOCK_COLORS.agent}
				glyph={<AgentGlyphW size={22} />}
				rows={[
					{title: "Model", value: "claude-sonnet-4-6"},
					{
						title: "Messages",
						value: (
							<>
								{"Classify "}
								<ResolvedTag
									tag="<start.input>"
									value={RUN_INPUT}
									glow={msg?.glow ?? 0}
									resolve={msg?.mix ?? 0}
								/>
							</>
						),
					},
				]}
				highlighted={agent?.highlighted}
				state={agent?.state}
			/>,
		)}

		{at(
			2,
			visOpacity(response),
			<SimBlock
				name="Response"
				color={BLOCK_COLORS.response}
				glyph={<ResponseGlyphW size={21} />}
				rows={[
					{
						title: "Response Data",
						value: (
							<ResolvedTag
								tag="<agent.content>"
								value={RUN_ANSWER}
								glow={resp?.glow ?? 0}
								resolve={resp?.mix ?? 0}
							/>
						),
					},
					{title: "Status Code", value: "200"},
				]}
				hideSourceHandle
				highlighted={response?.highlighted}
				state={response?.state}
			/>,
		)}
	</>
);

// ── The parent world — the docs' WORKFLOW_CALL_WORKFLOW skeleton ────────────

type ParentChainProps = {
	start?: BlockVis;
	wf?: BlockVis;
	agent?: BlockVis;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	/** Workflow-block content reveal (scene 2's configuration moment). */
	wfBodyReveal?: number;
	wfRow1Reveal?: number;
	wfRow2Reveal?: number;
	/** The run input dipping into Start's Inputs row. */
	inputMix?: number;
	/** `<start.input>` resolving in the block's Input Variable row — the handoff. */
	iv?: Resolve;
	/** `<workflow.result>` resolving in the Agent's Messages row — the return. */
	wr?: Resolve;
};

export const ParentChain: React.FC<ParentChainProps> = ({
	start,
	wf,
	agent,
	edge1,
	edge2,
	wfBodyReveal = 1,
	wfRow1Reveal = 1,
	wfRow2Reveal = 1,
	inputMix = 0,
	iv,
	wr,
}) => (
	<>
		<Wire x1={edgeX1(0)} x2={edgeX2(0)} {...edge1} />
		<Wire x1={edgeX1(1)} x2={edgeX2(1)} {...edge2} />

		{at(
			0,
			visOpacity(start),
			<SimBlock
				name="Start"
				color={BLOCK_COLORS.start}
				glyph={<StartGlyphW size={22} />}
				rows={[
					{
						title: "Inputs",
						value: <DipSwap a="Customer message" b={RUN_INPUT} mix={inputMix} />,
					},
				]}
				hideTargetHandle
				highlighted={start?.highlighted}
				state={start?.state}
			/>,
		)}

		{at(
			1,
			visOpacity(wf),
			<SimBlock
				name="Workflow"
				color={BLOCK_COLORS.workflow}
				glyph={<WorkflowGlyph size={22} color="#ffffff" strokeWidth={2} />}
				bodyReveal={wfBodyReveal}
				rows={[
					{title: "Select Workflow", value: CHILD_NAME, opacity: wfRow1Reveal},
					{
						title: "Input Variable",
						value: (
							<ResolvedTag
								tag="<start.input>"
								value={RUN_INPUT}
								glow={iv?.glow ?? 0}
								resolve={iv?.mix ?? 0}
							/>
						),
						opacity: wfRow2Reveal,
					},
				]}
				highlighted={wf?.highlighted}
				state={wf?.state}
			/>,
		)}

		{at(
			2,
			visOpacity(agent),
			<SimBlock
				name="Agent"
				color={BLOCK_COLORS.agent}
				glyph={<AgentGlyphW size={22} />}
				rows={[
					{title: "Model", value: "claude-sonnet-4-6"},
					{
						title: "Messages",
						// Bare tag: the docs example's "Summarize " prefix truncates
						// <workflow.result> at row width (verified on a render) — the
						// KB-v2/webhooks precedent applies (bare tag in the row when
						// the authored prefix doesn't fit).
						value: (
							<ResolvedTag
								tag="<workflow.result>"
								value={RUN_ANSWER}
								glow={wr?.glow ?? 0}
								resolve={wr?.mix ?? 0}
							/>
						),
					},
				]}
				hideSourceHandle
				highlighted={agent?.highlighted}
				state={agent?.state}
			/>,
		)}
	</>
);

// ── The outer world — header-only chain (scene 6's one-level-up) ────────────

type OuterChainProps = {
	start?: BlockVis;
	wf?: BlockVis;
	agent?: BlockVis;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
};

export const OuterChain: React.FC<OuterChainProps> = ({start, wf, agent, edge1, edge2}) => (
	<>
		<Wire x1={edgeX1(0)} x2={edgeX2(0)} {...edge1} />
		<Wire x1={edgeX1(1)} x2={edgeX2(1)} {...edge2} />
		{at(
			0,
			visOpacity(start),
			<SimBlock
				name="Start"
				color={BLOCK_COLORS.start}
				glyph={<StartGlyphW size={22} />}
				hideTargetHandle
				highlighted={start?.highlighted}
				state={start?.state}
			/>,
		)}
		{at(
			1,
			visOpacity(wf),
			<SimBlock
				name="Workflow"
				color={BLOCK_COLORS.workflow}
				glyph={<WorkflowGlyph size={22} color="#ffffff" strokeWidth={2} />}
				highlighted={wf?.highlighted}
				state={wf?.state}
			/>,
		)}
		{at(
			2,
			visOpacity(agent),
			<SimBlock
				name="Agent"
				color={BLOCK_COLORS.agent}
				glyph={<AgentGlyphW size={22} />}
				hideSourceHandle
				highlighted={agent?.highlighted}
				state={agent?.state}
			/>,
		)}
	</>
);

// ── The inside panel — the child shown beneath the halted call ──────────────
// Container grammar from the loops video's SubflowContainer (docs
// preview-container-node.tsx metrics ×1.5): bordered box, --wp-container-fill
// body, header chip + name with border-b. Here the chip is the Workflow
// block's indigo + glyph and the name is the child workflow — the same
// identity the block's "Select Workflow" row carries, so the panel reads as
// THAT block's inside. `expand` 0..1 grows it downward from its top edge
// (clip reveal); render nothing at 0.
const S = 1.5;

export const InsidePanel: React.FC<{
	expand: number;
	children?: React.ReactNode;
}> = ({expand, children}) => {
	const pal = usePalette();
	if (expand <= 0) return null;
	const fill = pal.bg === "#1b1b1b" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";
	return (
		<div
			style={{
				position: "absolute",
				left: PANEL_X,
				top: PANEL_Y,
				width: PANEL_W,
				height: PANEL_H * expand,
				overflow: "hidden",
				borderRadius: 8 * S,
				border: "1px solid var(--border-1)",
				backgroundColor: fill,
				opacity: Math.min(1, expand * 1.6),
			}}
		>
			{/* Child world re-staged inside the panel (stage coords restored, then
			    scaled about origin so the chain centers in the body). */}
			<div
				style={{
					position: "absolute",
					left: -PANEL_X,
					top: -PANEL_Y,
					width: STAGE_W,
					height: STAGE_H,
					transform: `translate(${CHILD_TX}px, ${CHILD_TY}px) scale(${CHILD_SCALE})`,
					transformOrigin: "0 0",
				}}
			>
				{children}
			</div>

			{/* Header (over the body, like the product container) */}
			<div
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					width: "100%",
					height: PANEL_HEADER_H,
					display: "flex",
					alignItems: "center",
					gap: 8 * S,
					paddingLeft: 8 * S,
					borderBottom: "1px solid var(--border-1)",
					backgroundColor: "var(--surface-2)",
					borderRadius: `${8 * S}px ${8 * S}px 0 0`,
				}}
			>
				<div
					style={{
						width: 24 * S,
						height: 24 * S,
						borderRadius: 6 * S,
						background: BLOCK_COLORS.workflow,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<WorkflowGlyph size={16 * S} color="#ffffff" />
				</div>
				<span
					style={{
						fontFamily:
							'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
						fontWeight: 500,
						fontSize: 16 * S,
						color: "var(--text-primary)",
					}}
				>
					{CHILD_NAME}
				</span>
			</div>
		</div>
	);
};

/** The containment stem: block bottom → panel top, drawn with `expand`. */
export const InsideStem: React.FC<{raise: number; expand: number}> = ({raise, expand}) => {
	const pal = usePalette();
	if (expand <= 0) return null;
	const top = STEM_TOP(raise);
	const len = (PANEL_Y - top) * Math.min(1, expand * 1.4);
	return (
		<div
			style={{
				position: "absolute",
				left: STEM_X - 1.1,
				top,
				width: 2.25,
				height: Math.max(0, len),
				backgroundColor: pal.wire,
				opacity: expand,
			}}
		/>
	);
};
