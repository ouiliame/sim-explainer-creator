import React from "react";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	DatabaseGlyphW,
	GmailGlyphFull,
	ResponseGlyphW,
	SearchGlyphW,
	SimBlock,
	SimEdgePath,
	StartGlyphW,
	Tag,
	type SimBlockTool,
} from "../../../components";
import {COLORS, usePalette} from "../../../theme";
import {edgeColor} from "../../module-1-workflows/scenes/_local";
import {
	blockX,
	CHAIN_EDGE_Y,
	CHAIN_Y,
	edgeX1,
	edgeX2,
	STAGE_H,
	STAGE_W,
} from "../layout";

export {CanvasDots, DataPill, Tag, WireDot} from "../../../components";

// ---------------------------------------------------------------------------
// Edge at arbitrary lane height (scene 4 reuses the chain x-geometry at LANE_Y).
// ---------------------------------------------------------------------------
type EdgeVis = {progress?: number; hi?: number; opacity?: number};

export const LaneEdge: React.FC<{i: 0 | 1; y?: number} & EdgeVis> = ({
	i,
	y = CHAIN_EDGE_Y,
	progress = 1,
	hi = 0,
	opacity = 1,
}) => (
	<svg
		width={STAGE_W}
		height={STAGE_H}
		viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
		style={{position: "absolute", inset: 0, opacity, pointerEvents: "none"}}
	>
		<SimEdgePath
			x1={edgeX1(i)}
			y1={y}
			x2={edgeX2(i)}
			y2={y}
			progress={progress}
			color={edgeColor(hi, usePalette())}
			thickness={2.25 + 1.25 * hi}
		/>
	</svg>
);

// ---------------------------------------------------------------------------
// Tool chips (real integration colors from the registry / docs examples).
// ---------------------------------------------------------------------------
export const CHIP_SEARCH: SimBlockTool = {
	name: "Search",
	color: "#1F40ED",
	glyph: <SearchGlyphW size={15} />,
};
export const CHIP_EMAIL: SimBlockTool = {
	name: "Send Email",
	color: "#E0E0E0",
	glyph: <GmailGlyphFull size={15} />,
};
export const CHIP_KNOWLEDGE: SimBlockTool = {
	name: "Knowledge",
	color: "#00B0B0",
	glyph: <DatabaseGlyphW size={14} />,
};

// ---------------------------------------------------------------------------
// The set piece: Start {Input: Lead} → Score lead (Agent) → Response
// {"score": <agent.score>} — the docs' BUILD_AGENT example. The agent block
// accumulates its real rows (Tools / Skills / Memory / Response Format) as
// the video grants them.
// ---------------------------------------------------------------------------
export type BlockVis = {
	opacity?: number;
	dim?: number;
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
	hidden?: boolean;
};

const visOpacity = (v?: BlockVis) =>
	v?.hidden ? 0 : (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));

export type Gifts = {
	tools?: SimBlockTool[];
	toolsReveal?: number; // 0..1 — Tools row growing in (scene 3)
	toolsWrapReveal?: number; // 0..1 — second chip line opening (scene 6)
	skillsReveal?: number; // 0..1 — Skills row (scene 5)
	memoryReveal?: number; // 0..1 — Memory row (scene 7)
	rfReveal?: number; // 0..1 — Response Format row (scene 8)
};

type AgentChainProps = {
	start?: BlockVis;
	agent?: BlockVis;
	response?: BlockVis;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	tagGlowMsg?: number; // <start.input> in Messages
	tagGlowResp?: number; // <agent.score> in Response Data
	gifts?: Gifts;
	/** Positions override for scene 9 (defaults to canonical chain slots). */
	xs?: {start: number; agent: number; response: number};
};

export const AgentChain: React.FC<AgentChainProps> = ({
	start,
	agent,
	response,
	edge1,
	edge2,
	tagGlowMsg = 0,
	tagGlowResp = 0,
	gifts = {},
	xs,
}) => {
	const X = xs ?? {start: blockX(0), agent: blockX(1), response: blockX(2)};
	const {
		tools = [],
		toolsReveal = tools.length > 0 ? 1 : 0,
		toolsWrapReveal = 1,
		skillsReveal = 0,
		memoryReveal = 0,
		rfReveal = 0,
	} = gifts;

	return (
		<>
			{/* Canonical-position edges. Scene 9 fades these out (via opacity)
			    BEFORE the blocks glide, so they never detach from handles. */}
			<LaneEdge i={0} {...edge1} />
			<LaneEdge i={1} {...edge2} />
			<div style={{position: "absolute", left: X.start, top: CHAIN_Y, opacity: visOpacity(start)}}>
				<SimBlock
					name="Start"
					color={BLOCK_COLORS.start}
					glyph={<StartGlyphW size={22} />}
					rows={[{title: "Input", value: "Lead"}]}
					hideTargetHandle
					highlighted={start?.highlighted}
					state={start?.state}
				/>
			</div>
			<div style={{position: "absolute", left: X.agent, top: CHAIN_Y, opacity: visOpacity(agent)}}>
				<SimBlock
					name="Score lead"
					color={BLOCK_COLORS.agent}
					glyph={<AgentGlyphW size={22} />}
					rows={[
						{
							title: "Messages",
							value: (
								<>
									Score <Tag text="<start.input>" glow={tagGlowMsg} />
								</>
							),
						},
						{title: "Model", value: "claude-sonnet-4-6"},
						{title: "Skills", value: "lead-scoring-rubric", opacity: skillsReveal},
						{title: "Memory", value: "Conversation", opacity: memoryReveal},
						{title: "Response Format", value: "{ score, tier, reason }", opacity: rfReveal},
					]}
					tools={tools}
					toolsReveal={toolsReveal}
					toolsWrapReveal={toolsWrapReveal}
					toolsRowAfter={1}
					highlighted={agent?.highlighted}
					state={agent?.state}
				/>
			</div>
			<div
				style={{position: "absolute", left: X.response, top: CHAIN_Y, opacity: visOpacity(response)}}
			>
				<SimBlock
					name="Response"
					color={BLOCK_COLORS.response}
					glyph={<ResponseGlyphW size={21} />}
					rows={[
						{
							title: "Data",
							value: (
								<>
									{'{ "score": '}
									<Tag text="<agent.score>" glow={tagGlowResp} />
									{" }"}
								</>
							),
						},
						{title: "Status", value: "200"},
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
// Skill card (scene 5): name + description always visible; the body expands
// only when the agent loads it. Neutral panel, fake text bars for the body.
// ---------------------------------------------------------------------------
export const SkillCard: React.FC<{
	x: number;
	y: number;
	w?: number;
	opacity?: number;
	bodyReveal?: number; // 0..1 — the loaded rubric body
}> = ({x, y, w = 360, opacity = 1, bodyReveal = 0}) => (
	<div
		style={{
			position: "absolute",
			left: x,
			top: y,
			width: w,
			opacity,
			backgroundColor: COLORS.surface2,
			border: `1px solid ${COLORS.border1}`,
			borderRadius: 12,
			padding: 18,
			boxSizing: "border-box",
		}}
	>
		<div
			style={{
				fontFamily:
					'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
				fontSize: 19,
				color: COLORS.text,
			}}
		>
			lead-scoring-rubric
		</div>
		<div
			style={{
				marginTop: 6,
				fontFamily:
					'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
				fontSize: 15,
				color: COLORS.textMuted,
			}}
		>
			Bands and disqualifiers for inbound leads
		</div>
		{bodyReveal > 0 ? (
			<div
				style={{
					overflow: "hidden",
					height: 96 * Math.min(1, bodyReveal),
					opacity: Math.min(1, bodyReveal * 1.4),
				}}
			>
				<div style={{height: 1, backgroundColor: COLORS.divider, margin: "14px 0"}} />
				{[0.92, 0.7, 0.82].map((wf, i) => (
					<div
						key={i}
						style={{
							height: 10,
							width: `${wf * 100}%`,
							borderRadius: 5,
							backgroundColor: COLORS.border1,
							marginBottom: 12,
						}}
					/>
				))}
			</div>
		) : null}
	</div>
);

// ---------------------------------------------------------------------------
// Memory store tile (scene 7) — neutral card, memory-pink chip (#F64F9E).
// ---------------------------------------------------------------------------
export const StoreTile: React.FC<{
	x: number;
	y: number;
	w?: number;
	h?: number;
	opacity?: number;
	pulse?: number; // 0..1 — scale blip when a value lands
}> = ({x, y, w = 340, h = 96, opacity = 1, pulse = 0}) => (
	<div
		style={{
			position: "absolute",
			left: x,
			top: y,
			width: w,
			height: h,
			opacity,
			transform: `scale(${1 + 0.03 * Math.sin(Math.min(1, Math.max(0, pulse)) * Math.PI)})`,
			backgroundColor: COLORS.surface2,
			border: `1px solid ${COLORS.border1}`,
			borderRadius: 12,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			gap: 16,
			boxSizing: "border-box",
		}}
	>
		<div
			style={{
				width: 54,
				height: 54,
				borderRadius: 9,
				backgroundColor: "#F64F9E",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<DatabaseGlyphW size={30} />
		</div>
		<span
			style={{
				fontFamily:
					'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
				fontWeight: 500,
				fontSize: 24,
				color: COLORS.text,
			}}
		>
			Memory
		</span>
	</div>
);

// ---------------------------------------------------------------------------
// Typed mini-bundle (scene 8): the structured output riding to Response —
// three keyed rows with the docs' dark type badges.
// ---------------------------------------------------------------------------
const BADGE: Record<string, {bg: string; text: string}> = {
	number: {bg: "rgba(59,130,246,0.2)", text: "#93c5fd"},
	string: {bg: "rgba(34,197,94,0.2)", text: "#86efac"},
};

export const MiniBundle: React.FC<{
	x: number;
	y: number;
	opacity?: number;
	scale?: number;
}> = ({x, y, opacity = 1, scale = 1}) => (
	<div
		style={{
			position: "absolute",
			left: x,
			top: y,
			transform: `translate(-50%, -50%) scale(${scale})`,
			opacity,
			backgroundColor: COLORS.surface1,
			border: `1px solid ${COLORS.border}`,
			borderRadius: 10,
			padding: "10px 14px",
			display: "flex",
			flexDirection: "column",
			gap: 6,
			boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
		}}
	>
		{(
			[
				["score", "number"],
				["tier", "string"],
				["reason", "string"],
			] as const
		).map(([key, type]) => (
			<div key={key} style={{display: "flex", alignItems: "center", gap: 10}}>
				<span
					style={{
						fontFamily:
							'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
						fontSize: 17,
						color: COLORS.text,
					}}
				>
					{key}
				</span>
				<span
					style={{
						borderRadius: 5,
						padding: "1px 7px",
						fontSize: 13,
						fontFamily:
							'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif',
						background: BADGE[type].bg,
						color: BADGE[type].text,
					}}
				>
					{type}
				</span>
			</div>
		))}
	</div>
);
