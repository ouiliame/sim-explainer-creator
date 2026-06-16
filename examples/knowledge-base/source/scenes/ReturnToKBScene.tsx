import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, SPACING, TYPE} from "../../../theme";
import {DocumentCard, KBContainer} from "../../../components";
import {
	CHUNK_GAP,
	CHUNK_W,
	CHUNKS_START_X,
	CHUNKS_TOP,
	DOC_IN_KB_W,
	DOC_IN_KB_X,
	DOC_LARGE_W,
	DOC_LARGE_X,
	DOC_LARGE_Y,
	DOCS,
	FOCAL_CHUNKS,
	FOCAL_DOC_INDEX,
	KB_LARGE_H,
	KB_LARGE_W,
	KB_LARGE_X,
	KB_LARGE_Y,
	docInKbY,
} from "../layout";
import {ChunkCard} from "../../../components";

// Reverse of ZoomIntoDocScene + Chunking: chunks fade out, focal doc shrinks
// back to its in-KB position, KB shell + non-focal docs fade back in.
export const ReturnToKBScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const chunksOp = interpolate(frame, [0, 0.6 * fps], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const focalX = interpolate(frame, [0.4 * fps, 1.9 * fps], [DOC_LARGE_X, DOC_IN_KB_X], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const focalY = interpolate(
		frame,
		[0.4 * fps, 1.9 * fps],
		[DOC_LARGE_Y, docInKbY(FOCAL_DOC_INDEX)],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		},
	);
	const focalW = interpolate(frame, [0.4 * fps, 1.9 * fps], [DOC_LARGE_W, DOC_IN_KB_W], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const contextOp = interpolate(frame, [1.1 * fps, 2.1 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const focalDoc = DOCS[FOCAL_DOC_INDEX];

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Chunks fade out (carry-over from update scene end state) */}
			{FOCAL_CHUNKS.map((c, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						left: CHUNKS_START_X + i * (CHUNK_W + CHUNK_GAP),
						top: CHUNKS_TOP,
						opacity: chunksOp,
					}}
				>
					<ChunkCard
						width={CHUNK_W}
						seed={c.seed + 10}
						lines={c.lines}
						source={c.source}
					/>
				</div>
			))}

			{/* KB shell fades back in */}
			<div
				style={{
					position: "absolute",
					left: KB_LARGE_X,
					top: KB_LARGE_Y,
					opacity: contextOp,
				}}
			>
				<KBContainer
					name="Sales"
					docCount={DOCS.length}
					width={KB_LARGE_W}
					height={KB_LARGE_H}
				>
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
						documents
					</div>
				</KBContainer>
			</div>

			{/* Non-focal docs fade back in at their KB rest positions */}
			{DOCS.map((d, i) =>
				i === FOCAL_DOC_INDEX ? null : (
					<div
						key={d.name}
						style={{
							position: "absolute",
							left: DOC_IN_KB_X,
							top: docInKbY(i),
							opacity: contextOp,
						}}
					>
						<DocumentCard
							kind={d.kind}
							name={d.name}
							size="lg"
							connector={d.connector}
							width={DOC_IN_KB_W}
						/>
					</div>
				),
			)}

			{/* Focal doc animates back into its KB slot */}
			<div style={{position: "absolute", left: focalX, top: focalY}}>
				<DocumentCard
					kind={focalDoc.kind}
					name={focalDoc.name}
					size="lg"
					connector={focalDoc.connector}
					width={focalW}
				/>
			</div>
		</AbsoluteFill>
	);
};
