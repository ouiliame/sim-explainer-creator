import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, SPACING, TYPE} from "../../../theme";
import {FadeIn} from "../../../motion";
import {ChunkCard, ContextPanel, KBContainer} from "../../../components";
import {
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
	RELEVANT_CHUNK_INDICES,
	RERANKED_INDICES,
	RERANK_X,
	kbChunkX,
	kbChunkY,
	rerankY,
} from "../layout";

const RELEVANT = new Set(RELEVANT_CHUNK_INDICES);

export const ContextInjectionScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Non-relevant chunks stay dim throughout (carried over from Reranking end at 0.18)
	const dimOp = 0.18;

	// Travel timing: chunks fly from the reranking staging stack into the context panel
	const travel = interpolate(frame, [0.4 * fps, 2.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* KB on right with dimmed chunks */}
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

			{KB_CHUNKS.map((c, i) => {
				if (RELEVANT.has(i)) return null;
				return (
					<div
						key={i}
						style={{
							position: "absolute",
							left: kbChunkX(i),
							top: kbChunkY(i),
							opacity: dimOp,
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

			{/* Context panel on left */}
			<div style={{position: "absolute", left: CTX_X, top: CTX_Y}}>
				<FadeIn delay={0} duration={0.4}>
					<ContextPanel title="model context" width={CTX_W} height={CTX_H} />
				</FadeIn>
			</div>

			{/* Reranked chunks travel from the staging stack to the context panel.
			    Slot j in the staging stack → ctxIdx j in the context panel. */}
			{RERANKED_INDICES.map((kbIdx, ctxIdx) => {
				const c = KB_CHUNKS[kbIdx];
				const startX = RERANK_X;
				const startY = rerankY(ctxIdx);
				const endX = CTX_SLOT_X;
				const endY = CTX_SLOT_Y_START + ctxIdx * CTX_SLOT_PITCH;
				const x = startX + (endX - startX) * travel;
				const y = startY + (endY - startY) * travel;
				return (
					<div
						key={kbIdx}
						style={{
							position: "absolute",
							left: x,
							top: y,
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
		</AbsoluteFill>
	);
};
