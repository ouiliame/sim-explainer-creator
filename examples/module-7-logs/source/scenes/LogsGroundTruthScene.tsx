import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, TYPE} from "../../../theme";
import {ObjectNode, OBJECTS} from "../../../components";
import {STAGE_H, STAGE_W} from "../layout";

// logs-are-ground-truth: Logs sits center as the source of truth; Mothership
// connects to it with a "reads the run" line — it reads, doesn't replace.
const NODE_W = 300;
const NODE_H = 220;
const LOGS_X = STAGE_W / 2 + 120;
const LOGS_Y = STAGE_H / 2 - NODE_H / 2;
const MS_X = STAGE_W / 2 - 120 - NODE_W;
const MS_Y = STAGE_H / 2 - NODE_H / 2;

export const LogsGroundTruthScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Logs lands first (it's the ground truth).
	const logsIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Mothership slides in from the left.
	const msIn = interpolate(frame, [0.8 * fps, 1.4 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const msDx = (1 - msIn) * -80;

	// "reads the run" line draws from mothership to logs.
	const line = interpolate(frame, [1.5 * fps, 2.3 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const x1 = MS_X + NODE_W;
	const x2 = LOGS_X;
	const midY = STAGE_H / 2;
	const len = x2 - x1;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				<line
					x1={x1}
					y1={midY}
					x2={x2}
					y2={midY}
					stroke={COLORS.brand}
					strokeWidth={3}
					strokeOpacity={0.85}
					strokeDasharray={`${len * line} 9999`}
				/>
				{line >= 0.99 ? <polygon points={`${x2},${midY} ${x2 - 16},${midY - 9} ${x2 - 16},${midY + 9}`} fill={COLORS.brand} /> : null}
			</svg>

			{/* "reads the run" caption on the line */}
			<div
				style={{
					position: "absolute",
					left: x1,
					top: midY - 44,
					width: len,
					textAlign: "center",
					opacity: line,
					...TYPE.micro,
					color: COLORS.textTertiary,
					textTransform: "uppercase",
					letterSpacing: 1.4,
				}}
			>
				reads the run
			</div>

			{/* Mothership */}
			<div style={{position: "absolute", left: MS_X, top: MS_Y, opacity: msIn, transform: `translateX(${msDx}px)`}}>
				<ObjectNode kind="mothership" width={NODE_W} height={NODE_H} />
			</div>

			{/* Logs — the ground truth, glowing */}
			<div
				style={{
					position: "absolute",
					left: LOGS_X,
					top: LOGS_Y,
					opacity: logsIn,
					transform: `scale(${0.9 + 0.1 * logsIn})`,
					transformOrigin: "center center",
					boxShadow: `0 0 0 ${10 * logsIn}px ${OBJECTS.logs.accent}22`,
					borderRadius: 8,
				}}
			>
				<ObjectNode kind="logs" width={NODE_W} height={NODE_H} subtitle="ground truth" />
			</div>
		</AbsoluteFill>
	);
};
