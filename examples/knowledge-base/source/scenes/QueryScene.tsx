import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, SPACING, TYPE} from "../../../theme";
import {SlideIn} from "../../../motion";
import {ChunkCard, DocumentCard, KBContainer, QueryBox} from "../../../components";
import {
	DOC_IN_KB_W,
	DOC_IN_KB_X,
	DOCS,
	KB_CHUNK_H,
	KB_CHUNK_W,
	KB_CHUNKS,
	KB_LARGE_H,
	KB_LARGE_W,
	KB_LARGE_X,
	KB_LARGE_Y,
	KB_QUERY_H,
	KB_QUERY_W,
	KB_QUERY_X,
	KB_QUERY_Y,
	QUERY_CENTER_Y,
	QUERY_W,
	QUERY_X,
	QUERY_Y,
	docInKbY,
	kbChunkX,
	kbChunkY,
} from "../layout";

export const QueryScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Docs fade out early
	const docsOp = interpolate(frame, [0, 0.5 * fps], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// KB transitions from LARGE → QUERY position and size
	const kbX = interpolate(frame, [0.3 * fps, 1.4 * fps], [KB_LARGE_X, KB_QUERY_X], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const kbY = interpolate(frame, [0.3 * fps, 1.4 * fps], [KB_LARGE_Y, KB_QUERY_Y], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const kbW = interpolate(frame, [0.3 * fps, 1.4 * fps], [KB_LARGE_W, KB_QUERY_W], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const kbH = interpolate(frame, [0.3 * fps, 1.4 * fps], [KB_LARGE_H, KB_QUERY_H], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Chunks fade in at KB_QUERY positions
	const chunksOp = interpolate(frame, [1.1 * fps, 1.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Crossfade the section label: "documents" → "chunks" as the KB shrinks.
	const docsLabelOp = interpolate(frame, [0, 0.5 * fps], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const chunksLabelOp = interpolate(frame, [0.8 * fps, 1.3 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Connector line from query to KB
	const lineY = QUERY_CENTER_Y;
	const lineMaxW = KB_QUERY_X - (QUERY_X + QUERY_W);
	const lineW = interpolate(frame, [2.4 * fps, 3.0 * fps], [0, lineMaxW], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* KB animates from LARGE to QUERY position/size with crossfading section label.
			    Rendered FIRST so the doc cards below can sit on top during their fade-out
			    (otherwise the KB's solid background covers them). */}
			<div style={{position: "absolute", left: kbX, top: kbY}}>
				<KBContainer name="Sales" docCount={DOCS.length} width={kbW} height={kbH}>
					<div style={{position: "relative", marginTop: 4, marginBottom: SPACING.xs, minHeight: 22}}>
						<div
							style={{
								...TYPE.micro,
								color: COLORS.textMuted,
								textTransform: "uppercase",
								letterSpacing: 1.2,
								opacity: docsLabelOp,
								position: "absolute",
								top: 0,
								left: 0,
							}}
						>
							documents
						</div>
						<div
							style={{
								...TYPE.micro,
								color: COLORS.textMuted,
								textTransform: "uppercase",
								letterSpacing: 1.2,
								opacity: chunksLabelOp,
								position: "absolute",
								top: 0,
								left: 0,
							}}
						>
							chunks
						</div>
					</div>
				</KBContainer>
			</div>

			{/* Docs sit ON TOP of the KB shell, fading out as the KB shrinks */}
			{DOCS.map((d, i) => (
				<div
					key={d.name}
					style={{
						position: "absolute",
						left: DOC_IN_KB_X,
						top: docInKbY(i),
						opacity: docsOp,
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
			))}

			{/* Chunks fade in at their KB_QUERY positions */}
			{KB_CHUNKS.map((c, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						left: kbChunkX(i),
						top: kbChunkY(i),
						opacity: chunksOp,
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

			{/* Query slides in from left */}
			<div style={{position: "absolute", left: QUERY_X, top: QUERY_Y}}>
				<SlideIn delay={1.8} from="left" distance={80} duration={0.6}>
					<QueryBox text="Why are sales down in Q4?" width={QUERY_W} />
				</SlideIn>
			</div>

			{/* Connector line */}
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
