import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, TYPE} from "../../../theme";
import {
	FAILED_INDEX,
	ROOT_CAUSE_INDEX,
	RUN_BLOCK_H,
	RUN_BLOCK_W,
	RUN_COUNT,
	RUN_GAP,
	RUN_X,
	RUN_Y,
	STAGE_H,
	STAGE_W,
	runBlockCenterX,
} from "../layout";
import {RunTimeline, type RunStatus} from "./_local";

// dont-guess-trace: the timeline returns with the failed (red) block. A
// "symptom" tag sits on it; a back-arrow traces upstream to the root cause
// block, highlighted amber.
const AMBER = COLORS.warning;

export const DontGuessTraceScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const rowIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// symptom tag drops onto the failed block
	const tag = interpolate(frame, [0.7 * fps, 1.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// trace arrow sweeps backward from failed → root cause
	const trace = interpolate(frame, [1.6 * fps, 2.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// root-cause block lights amber after the arrow arrives
	const amberGlow = interpolate(frame, [2.6 * fps, 3.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const statuses: RunStatus[] = [];
	const glows: number[] = [];
	const glowColors: (string | undefined)[] = [];
	for (let i = 0; i < RUN_COUNT; i++) {
		statuses.push(i === FAILED_INDEX ? "failed" : "ok");
		glows.push(i === FAILED_INDEX ? 0.8 : i === ROOT_CAUSE_INDEX ? amberGlow : 0);
		glowColors.push(i === ROOT_CAUSE_INDEX ? AMBER : undefined);
	}

	const rowW = RUN_COUNT * RUN_BLOCK_W + (RUN_COUNT - 1) * RUN_GAP;

	// arrow geometry: a clean arc above the row, from the failed block back to
	// the root-cause block. Drawn progressively via strokeDasharray.
	const arcLift = 90;
	const xFail = runBlockCenterX(FAILED_INDEX);
	const xRoot = runBlockCenterX(ROOT_CAUSE_INDEX);
	const topY = RUN_Y - arcLift;
	const arcPath = `M ${xFail} ${RUN_Y - 6} C ${xFail} ${topY}, ${xRoot} ${topY}, ${xRoot} ${RUN_Y - 6}`;
	// rough arc length for the dash reveal
	const arcLen = Math.abs(xFail - xRoot) + arcLift * 2;
	const headOnRoot = trace >= 0.985;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* trace arrow */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				{trace > 0 ? (
					<>
						<path
							d={arcPath}
							fill="none"
							stroke={AMBER}
							strokeWidth={3}
							strokeOpacity={0.9}
							strokeLinecap="round"
							strokeDasharray={`${arcLen * trace} ${arcLen}`}
						/>
						{headOnRoot ? (
							<polygon
								points={`${xRoot},${RUN_Y - 2} ${xRoot - 9},${RUN_Y - 22} ${xRoot + 9},${RUN_Y - 22}`}
								fill={AMBER}
							/>
						) : null}
					</>
				) : null}
			</svg>

			<div style={{position: "absolute", left: RUN_X, top: RUN_Y, width: rowW, opacity: rowIn}}>
				<RunTimeline statuses={statuses} glows={glows} glowColors={glowColors} />
			</div>

			{/* symptom tag on the failed block */}
			<div
				style={{
					position: "absolute",
					left: xFail - 70,
					top: RUN_Y + RUN_BLOCK_H + 18,
					opacity: tag,
					transform: `translateY(${(1 - tag) * -12}px)`,
				}}
			>
				<div
					style={{
						...TYPE.micro,
						color: COLORS.error,
						backgroundColor: COLORS.error + "1c",
						border: `1px solid ${COLORS.error}`,
						borderRadius: RADIUS.sm,
						padding: "8px 18px",
						textTransform: "uppercase",
						letterSpacing: 1,
					}}
				>
					symptom
				</div>
			</div>

			{/* root-cause tag */}
			<div
				style={{
					position: "absolute",
					left: xRoot - 80,
					top: RUN_Y + RUN_BLOCK_H + 18,
					opacity: amberGlow,
					transform: `translateY(${(1 - amberGlow) * -12}px)`,
				}}
			>
				<div
					style={{
						...TYPE.micro,
						color: AMBER,
						backgroundColor: AMBER + "1c",
						border: `1px solid ${AMBER}`,
						borderRadius: RADIUS.sm,
						padding: "8px 18px",
						textTransform: "uppercase",
						letterSpacing: 1,
					}}
				>
					root cause
				</div>
			</div>
		</AbsoluteFill>
	);
};
