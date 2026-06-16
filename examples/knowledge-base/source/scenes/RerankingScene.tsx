import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, SPACING, TYPE} from "../../../theme";
import {ChunkCard, KBContainer, QueryBox} from "../../../components";
import {
	DOCS,
	KB_CHUNK_H,
	KB_CHUNK_W,
	KB_CHUNKS,
	KB_QUERY_H,
	KB_QUERY_W,
	KB_QUERY_X,
	KB_QUERY_Y,
	QUERY_CENTER_Y,
	QUERY_W,
	QUERY_X,
	QUERY_Y,
	RELEVANT_CHUNK_INDICES,
	RERANK_FINAL_SLOTS,
	RERANK_X,
	kbChunkX,
	kbChunkY,
	rerankY,
} from "../layout";

const RELEVANT = new Set(RELEVANT_CHUNK_INDICES);

export const RerankingScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Phase 1: fly relevant chunks from KB grid positions to the staging stack
	// (in their *initial* slot order — slot 0, 1, 2).
	const flyOut = interpolate(frame, [0.3 * fps, 1.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// The "relevance glow" from RelevantChunks scene fades out as the chunks
	// leave the KB grid — they are no longer in retrieval state.
	const glowAlpha = interpolate(frame, [0, 0.9 * fps], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const ringHex = Math.round(glowAlpha * 255)
		.toString(16)
		.padStart(2, "0");
	const haloHex = Math.round(glowAlpha * 0.33 * 255)
		.toString(16)
		.padStart(2, "0");

	// Background KB chunks: carry over from RelevantChunks scene's dimmed state (0.35),
	// then fade further to 0.18 (matching the ContextInjection background level).
	const kbDimOp = interpolate(frame, [0, 0.5 * fps], [0.35, 0.18], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Phase 2: reorder. Each chunk animates from its initial slot Y to its final slot Y.
	const reorderT = interpolate(frame, [1.7 * fps, 2.7 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// "rerank by relevance" label appears once chunks reach the staging stack
	const labelOp = interpolate(frame, [1.2 * fps, 1.6 * fps, 2.9 * fps, 3.3 * fps], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// QueryBox + connector line: carry over from RelevantChunks, fade out late
	const queryOp = interpolate(frame, [2.4 * fps, 3.1 * fps], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* KB on right */}
			<div style={{position: "absolute", left: KB_QUERY_X, top: KB_QUERY_Y}}>
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

			{/* Non-relevant chunks dim further */}
			{KB_CHUNKS.map((c, i) => {
				if (RELEVANT.has(i)) return null;
				return (
					<div
						key={i}
						style={{
							position: "absolute",
							left: kbChunkX(i),
							top: kbChunkY(i),
							opacity: kbDimOp,
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

			{/* Query carry-over (fades late) */}
			<div style={{position: "absolute", left: QUERY_X, top: QUERY_Y, opacity: queryOp}}>
				<QueryBox text="Why are sales down in Q4?" width={QUERY_W} />
			</div>
			<div
				style={{
					position: "absolute",
					left: QUERY_X + QUERY_W,
					top: QUERY_CENTER_Y,
					width: KB_QUERY_X - (QUERY_X + QUERY_W),
					height: 2,
					backgroundColor: COLORS.secondary,
					opacity: queryOp,
				}}
			/>

			{/* "rerank by relevance" label above the staging stack */}
			<div
				style={{
					position: "absolute",
					left: RERANK_X,
					top: rerankY(0) - 48,
					width: KB_CHUNK_W,
					opacity: labelOp,
					...TYPE.micro,
					color: COLORS.brand,
					textTransform: "uppercase",
					letterSpacing: 1.4,
					textAlign: "center",
				}}
			>
				rerank by relevance
			</div>

			{/* The 3 relevant chunks fly from KB → initial slot → final slot */}
			{RELEVANT_CHUNK_INDICES.map((kbIdx, initialSlot) => {
				const finalSlot = RERANK_FINAL_SLOTS[initialSlot];
				const c = KB_CHUNKS[kbIdx];

				const kbStartX = kbChunkX(kbIdx);
				const kbStartY = kbChunkY(kbIdx);
				const initialY = rerankY(initialSlot);
				const finalY = rerankY(finalSlot);

				// Phase 1: KB → initial staging slot
				const x = kbStartX + (RERANK_X - kbStartX) * flyOut;
				const yAfterFly = kbStartY + (initialY - kbStartY) * flyOut;
				// Phase 2: initial slot → final slot (only contributes after flyOut completes)
				const y = yAfterFly + (finalY - initialY) * reorderT;

				return (
					<div
						key={kbIdx}
						style={{
							position: "absolute",
							left: x,
							top: y,
							width: KB_CHUNK_W,
							height: KB_CHUNK_H,
							borderRadius: RADIUS.sm,
							boxShadow: `0 0 0 1px ${COLORS.accent}${ringHex}, 0 0 40px ${COLORS.accent}${haloHex}`,
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
		</AbsoluteFill>
	);
};
