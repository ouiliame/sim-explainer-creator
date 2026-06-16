import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, SHADOW, SPACING, TYPE} from "../../../theme";
import {FadeIn} from "../../../motion";
import {AgentNode, ChunkCard, ContextPanel, KBContainer} from "../../../components";
import {kbChunkX, kbChunkY} from "../layout";
import {
	AGENT_H,
	AGENT_W,
	AGENT_X,
	AGENT_Y,
	CTX_H,
	CTX_SLOT_PITCH,
	CTX_SLOT_X,
	CTX_SLOT_Y_START,
	CTX_W,
	CTX_X,
	CTX_Y,
	DOCS,
	KB_CHUNK_H,
	KB_CHUNK_W,
	KB_CHUNKS,
	KB_QUERY_H,
	KB_QUERY_W,
	KB_QUERY_X,
	KB_QUERY_Y,
	OUT_H,
	OUT_W,
	OUT_X,
	OUT_Y,
	RELEVANT_CHUNK_INDICES,
	RERANKED_INDICES,
} from "../layout";

const ARROW_Y = AGENT_Y + AGENT_H / 2 - 1;
const ARROW1_X = CTX_X + CTX_W;
const ARROW1_W = AGENT_X - ARROW1_X;
const ARROW2_X = AGENT_X + AGENT_W;
const ARROW2_W = OUT_X - ARROW2_X;

const ANSWER_LINES = [
	"Sales fell 14% QoQ in Q4.",
	"Primary drivers:",
	"• EU demand dropped 18% after Sep pricing change",
	"• 3 enterprise renewals slipped to Q1",
	"• APAC channel partner ramp delayed two weeks",
];

export const OutputScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Cross-fade KB out (carried over from ContextInjection end state) while the
	// agent + output panel come in. Avoids a hard cut at the scene boundary.
	const kbOp = interpolate(frame, [0, 0.6 * fps], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const agentOp = interpolate(frame, [0.4 * fps, 1.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const outOp = interpolate(frame, [0.5 * fps, 1.1 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const arrow1W = interpolate(frame, [1.2 * fps, 1.7 * fps], [0, ARROW1_W], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const pulseT = interpolate(
		frame,
		[1.7 * fps, 2.2 * fps, 2.7 * fps],
		[0, 1, 0],
		{extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING.inOut},
	);
	const ringAlpha = Math.round(pulseT * 255)
		.toString(16)
		.padStart(2, "0");
	const haloAlpha = Math.round(pulseT * 0.4 * 255)
		.toString(16)
		.padStart(2, "0");

	const arrow2W = interpolate(frame, [2.6 * fps, 3.1 * fps], [0, ARROW2_W], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Chunks in the context panel are in the reranked order (the order they were
	// inserted by Reranking → ContextInjection).
	const relevantChunks = RERANKED_INDICES.map((i) => KB_CHUNKS[i]);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Fading KB carry-over from ContextInjection end */}
			<div style={{position: "absolute", left: KB_QUERY_X, top: KB_QUERY_Y, opacity: kbOp}}>
				<KBContainer name="Sales" docCount={DOCS.length} width={KB_QUERY_W} height={KB_QUERY_H}>
					<div
						style={{
							...TYPE.micro,
							color: COLORS.textMuted,
							textTransform: "uppercase",
							letterSpacing: 1.2,
							marginTop: 4,
							marginBottom: SPACING.xs,
						}}
					>
						chunks
					</div>
				</KBContainer>
			</div>
			{/* Dim chunks left in KB (non-relevant) fade out with the KB shell */}
			{KB_CHUNKS.map((c, i) => {
				if (RELEVANT_CHUNK_INDICES.includes(i)) return null;
				return (
					<div
						key={i}
						style={{
							position: "absolute",
							left: kbChunkX(i),
							top: kbChunkY(i),
							opacity: kbOp * 0.18,
							width: KB_CHUNK_W,
							height: KB_CHUNK_H,
						}}
					>
						<ChunkCard
							width={KB_CHUNK_W}
							seed={c.seed}
							lines={c.lines}
							source={c.source}
						/>
					</div>
				);
			})}

			{/* ContextPanel shell — carried over from ContextInjection end (chunks rendered separately below at the same absolute positions ContextInjection landed them at, so the cut is seamless) */}
			<div style={{position: "absolute", left: CTX_X, top: CTX_Y}}>
				<ContextPanel title="model context" width={CTX_W} height={CTX_H} />
			</div>
			{relevantChunks.map((c, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						left: CTX_SLOT_X,
						top: CTX_SLOT_Y_START + i * CTX_SLOT_PITCH,
						width: KB_CHUNK_W,
						height: KB_CHUNK_H,
					}}
				>
					<ChunkCard
						width={KB_CHUNK_W}
						seed={c.seed}
						lines={c.lines}
						source={c.source}
					/>
				</div>
			))}

			{/* Agent node — fades in as KB fades out */}
			<div
				style={{
					position: "absolute",
					left: AGENT_X,
					top: AGENT_Y,
					opacity: agentOp,
					boxShadow: `0 0 0 1px ${COLORS.brand}${ringAlpha}, 0 0 60px ${COLORS.brand}${haloAlpha}`,
					borderRadius: RADIUS.md,
				}}
			>
				<AgentNode label="model" width={AGENT_W} height={AGENT_H} />
			</div>

			{/* Output panel — fades in as KB fades out (occupies similar screen real-estate) */}
			<div
				style={{
					position: "absolute",
					left: OUT_X,
					top: OUT_Y,
					width: OUT_W,
					height: OUT_H,
					opacity: outOp,
					backgroundColor: COLORS.surface3,
					border: `1px solid ${COLORS.border}`,
					borderRadius: RADIUS.md,
					padding: SPACING.md,
					boxSizing: "border-box",
					boxShadow: SHADOW.card,
				}}
			>
				<FadeIn delay={3.0} duration={0.4}>
					<div
						style={{
							...TYPE.micro,
							color: COLORS.textMuted,
							marginBottom: SPACING.md,
							letterSpacing: 1.5,
							textTransform: "uppercase",
						}}
					>
						grounded output
					</div>
				</FadeIn>
				<div style={{display: "flex", flexDirection: "column", gap: 12}}>
					{ANSWER_LINES.map((line, i) => (
						<FadeIn key={i} delay={3.3 + i * 0.22} duration={0.4}>
							<div style={{...TYPE.body, fontSize: 24, color: COLORS.text}}>{line}</div>
						</FadeIn>
					))}
				</div>
			</div>

			{/* Arrows draw after agent/output are visible */}
			<div
				style={{
					position: "absolute",
					left: ARROW1_X,
					top: ARROW_Y,
					width: arrow1W,
					height: 2,
					backgroundColor: COLORS.secondary,
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: ARROW2_X,
					top: ARROW_Y,
					width: arrow2W,
					height: 2,
					backgroundColor: COLORS.secondary,
				}}
			/>
		</AbsoluteFill>
	);
};
