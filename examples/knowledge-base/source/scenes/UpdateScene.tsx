import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, TYPE} from "../../../theme";
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

export const UpdateScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Pulse the doc — flashes accent color to indicate it just changed
	const pulseT = interpolate(
		frame,
		[0.3 * fps, 0.8 * fps, 1.4 * fps],
		[0, 1, 0],
		{extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING.inOut},
	);
	const ringAlpha = Math.round(pulseT * 255)
		.toString(16)
		.padStart(2, "0");
	const haloAlpha = Math.round(pulseT * 0.4 * 255)
		.toString(16)
		.padStart(2, "0");

	// Old chunks fade out as the update propagates
	const oldOp = interpolate(frame, [1.0 * fps, 1.6 * fps], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// New chunks fade in (re-indexed)
	const newOp = interpolate(frame, [1.5 * fps, 2.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// "updating…" badge appears with the pulse
	const badgeOp = interpolate(frame, [0.2 * fps, 0.6 * fps, 1.6 * fps, 2.0 * fps], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Doc with pulse glow */}
			<div
				style={{
					position: "absolute",
					left: DOC_LARGE_X,
					top: DOC_LARGE_Y,
					boxShadow: `0 0 0 1px ${COLORS.accent}${ringAlpha}, 0 0 60px ${COLORS.accent}${haloAlpha}`,
					borderRadius: RADIUS.sm,
				}}
			>
				<DocumentCard
					kind={FOCAL_DOC.kind}
					name={FOCAL_DOC.name}
					size="lg"
					width={DOC_LARGE_W}
				/>
			</div>

			{/* updating badge */}
			<div
				style={{
					position: "absolute",
					left: DOC_LARGE_X + DOC_LARGE_W + 16,
					top: DOC_LARGE_Y + 28,
					opacity: badgeOp,
					...TYPE.micro,
					color: COLORS.accent,
					backgroundColor: COLORS.accentSoft,
					border: `1px solid ${COLORS.accent}`,
					borderRadius: RADIUS.xs,
					padding: "4px 8px",
					textTransform: "uppercase",
					letterSpacing: 1,
				}}
			>
				reindexing
			</div>

			{/* Old chunks — fade out */}
			{FOCAL_CHUNKS.map((c, i) => (
				<div
					key={`old-${i}`}
					style={{
						position: "absolute",
						left: CHUNKS_START_X + i * (CHUNK_W + CHUNK_GAP),
						top: CHUNKS_TOP,
						opacity: oldOp,
					}}
				>
					<ChunkCard width={CHUNK_W} seed={c.seed} lines={c.lines} source={c.source} />
				</div>
			))}

			{/* New chunks (re-indexed) — fade in with bumped seeds */}
			{FOCAL_CHUNKS.map((c, i) => (
				<div
					key={`new-${i}`}
					style={{
						position: "absolute",
						left: CHUNKS_START_X + i * (CHUNK_W + CHUNK_GAP),
						top: CHUNKS_TOP,
						opacity: newOp,
					}}
				>
					<ChunkCard width={CHUNK_W} seed={c.seed + 10} lines={c.lines} source={c.source} />
				</div>
			))}
		</AbsoluteFill>
	);
};
