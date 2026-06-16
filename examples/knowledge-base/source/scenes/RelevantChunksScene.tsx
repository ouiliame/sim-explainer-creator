import React from "react";
import {AbsoluteFill} from "remotion";
import {COLORS, SPACING, TYPE} from "../../../theme";
import {Highlight} from "../../../motion";
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
	kbChunkX,
	kbChunkY,
} from "../layout";

const RELEVANT = new Set(RELEVANT_CHUNK_INDICES);

export const RelevantChunksScene: React.FC = () => {
	const lineY = QUERY_CENTER_Y;
	const lineW = KB_QUERY_X - (QUERY_X + QUERY_W);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
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

			{KB_CHUNKS.map((c, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						left: kbChunkX(i),
						top: kbChunkY(i),
						width: KB_CHUNK_W,
						height: KB_CHUNK_H,
					}}
				>
					<Highlight active={RELEVANT.has(i)} delay={0.6} duration={0.8}>
						<ChunkCard width={KB_CHUNK_W} seed={c.seed} lines={c.lines} source={c.source} />
					</Highlight>
				</div>
			))}

			<div style={{position: "absolute", left: QUERY_X, top: QUERY_Y}}>
				<QueryBox text="Why are sales down in Q4?" width={QUERY_W} />
			</div>

			<div
				style={{
					position: "absolute",
					left: QUERY_X + QUERY_W,
					top: lineY,
					width: lineW,
					height: 2,
					backgroundColor: COLORS.secondary,
				}}
			/>
		</AbsoluteFill>
	);
};
