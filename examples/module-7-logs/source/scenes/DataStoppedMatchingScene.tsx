import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, TYPE} from "../../../theme";
import {RUN_BLOCK_H, STAGE_H, STAGE_W} from "../layout";
import {DataToken, RunBlock} from "./_local";

// data-stopped-matching: two adjacent blocks. Block A emits an object token;
// block B expected a string. The mismatch flashes red at the seam.
const BLK_W = 320;
const BLK_H = RUN_BLOCK_H + 40;
const GAP = 360;
const A_X = STAGE_W / 2 - GAP / 2 - BLK_W;
const B_X = STAGE_W / 2 + GAP / 2;
const ROW_Y = STAGE_H / 2 - BLK_H / 2;
const SEAM_X = STAGE_W / 2;
const TOKEN_Y = ROW_Y + BLK_H / 2 - 28;

export const DataStoppedMatchingScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const blocksIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// The object token leaves A and travels toward B's input.
	const travel = interpolate(frame, [1.0 * fps, 2.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const startX = A_X + BLK_W - 40;
	const endX = B_X - 200;
	const tokenX = startX + (endX - startX) * travel;

	// At arrival, B's expected shape (string) is shown and the mismatch flashes.
	const arrived = travel >= 0.99;
	const flashStart = 2.3 * fps;
	const flashRaw = interpolate(frame, [flashStart, flashStart + 0.4 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const flashPulse = arrived ? 0.6 + 0.4 * Math.sin((frame - flashStart) / fps * Math.PI * 2.2) : 0;
	const mismatch = flashRaw * (frame > flashStart + 0.4 * fps ? flashPulse : 1);

	// expected-shape label fades in on B
	const expectIn = interpolate(frame, [0.6 * fps, 1.1 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const bStatus = mismatch > 0.1 ? "failed" : "ok";

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* connector between the two */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				<line
					x1={A_X + BLK_W}
					y1={ROW_Y + BLK_H / 2}
					x2={B_X}
					y2={ROW_Y + BLK_H / 2}
					stroke={COLORS.border1}
					strokeWidth={2}
					strokeOpacity={blocksIn}
				/>
				{/* seam mismatch burst */}
				{mismatch > 0 ? (
					<circle cx={SEAM_X} cy={ROW_Y + BLK_H / 2} r={14 + 10 * mismatch} fill={COLORS.error} opacity={0.25 * mismatch} />
				) : null}
			</svg>

			{/* Block A — returns an object */}
			<div style={{position: "absolute", left: A_X, top: ROW_Y, opacity: blocksIn}}>
				<RunBlock kind="agent" label="Extract" status="ok" width={BLK_W} height={BLK_H} />
				<div style={{...TYPE.micro, color: COLORS.textMuted, marginTop: 14, textTransform: "uppercase", letterSpacing: 1.2}}>
					returns
				</div>
			</div>

			{/* Block B — expected a string */}
			<div style={{position: "absolute", left: B_X, top: ROW_Y, opacity: blocksIn}}>
				<RunBlock kind="tool" label="Send" status={bStatus} width={BLK_W} height={BLK_H} glow={mismatch} />
				<div
					style={{
						...TYPE.micro,
						color: COLORS.textMuted,
						marginTop: 14,
						textTransform: "uppercase",
						letterSpacing: 1.2,
						opacity: expectIn,
					}}
				>
					expects
				</div>
				<div style={{marginTop: 8, opacity: expectIn}}>
					<DataToken label='"text"' color={COLORS.secondary} />
				</div>
			</div>

			{/* the traveling object token */}
			<div
				style={{
					position: "absolute",
					left: tokenX,
					top: TOKEN_Y,
				}}
			>
				<DataToken label="{ user: … }" color={mismatch > 0.1 ? COLORS.error : COLORS.accent} />
			</div>

			{/* mismatch tag at the seam */}
			{mismatch > 0.05 ? (
				<div
					style={{
						position: "absolute",
						left: SEAM_X - 90,
						top: ROW_Y + BLK_H + 36,
						opacity: Math.min(1, mismatch + 0.3),
					}}
				>
					<div
						style={{
							...TYPE.label,
							fontSize: 26,
							color: COLORS.error,
							backgroundColor: COLORS.error + "1c",
							border: `1px solid ${COLORS.error}`,
							borderRadius: RADIUS.sm,
							padding: "10px 22px",
						}}
					>
						object ≠ string
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
