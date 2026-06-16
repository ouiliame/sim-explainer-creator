import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {Expand} from "../../../motion";
import {ChunkCard, DocumentCard} from "../../../components";
import {
	CHUNK_GAP,
	CHUNK_W,
	CHUNKS_START_X,
	CHUNKS_TOP,
	DOC_LARGE_W,
	DOC_LARGE_X,
	DOC_LARGE_Y,
	FOCAL_CHUNKS,
	FOCAL_DOC,
} from "../layout";

export const ChunkingScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const lineEndY = CHUNKS_TOP - 12;
	const lineStartY = DOC_LARGE_Y + 96;
	const lineH = interpolate(frame, [0.6 * fps, 1.2 * fps], [0, lineEndY - lineStartY], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Doc stays in place (continuity from ZoomIntoDocScene end) */}
			<div style={{position: "absolute", left: DOC_LARGE_X, top: DOC_LARGE_Y}}>
				<DocumentCard
					kind={FOCAL_DOC.kind}
					name={FOCAL_DOC.name}
					size="lg"
					width={DOC_LARGE_W}
				/>
			</div>

			{/* Connector line from doc → chunks */}
			<div
				style={{
					position: "absolute",
					left: 1920 / 2 - 1,
					top: lineStartY,
					width: 2,
					height: lineH,
					backgroundColor: COLORS.border1,
				}}
			/>

			{FOCAL_CHUNKS.map((c, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						left: CHUNKS_START_X + i * (CHUNK_W + CHUNK_GAP),
						top: CHUNKS_TOP,
					}}
				>
					<Expand delay={1.3 + i * 0.12} duration={0.7} axis="y">
						<ChunkCard
							width={CHUNK_W}
							seed={c.seed}
							lines={c.lines}
							source={c.source}
						/>
					</Expand>
				</div>
			))}
		</AbsoluteFill>
	);
};
