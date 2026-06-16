import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, SHADOW, TYPE} from "../../../theme";
import {STAGE_H, STAGE_W} from "../layout";

// Closing loop: Ask → Inspect → Run → Logs → Adjust, arranged as a cycle.
// Each node pops in; then a traveling dot circles the loop.
const STEPS = ["Ask", "Inspect", "Run", "Logs", "Adjust"];
const ACCENTS = [COLORS.brand, COLORS.secondary, COLORS.accent, COLORS.textIcon, COLORS.knowledge];

const CX = STAGE_W / 2;
const CY = STAGE_H / 2;
const RADIUS_PX = 320;
const NODE_W = 200;
const NODE_H = 88;

const nodePos = (i: number) => {
	// Start at top, go clockwise
	const angle = -Math.PI / 2 + (i / STEPS.length) * Math.PI * 2;
	return {x: CX + RADIUS_PX * Math.cos(angle), y: CY + RADIUS_PX * Math.sin(angle)};
};

export const ExplorationLoopScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const nodeT = (i: number) =>
		interpolate(frame, [(0.2 + i * 0.18) * fps, (0.7 + i * 0.18) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// Arc segments draw after nodes are in
	const arcT = interpolate(frame, [1.4 * fps, 3.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Traveling dot circles the loop continuously after the arc completes
	const dotProgress = interpolate(frame, [3.0 * fps, 6.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const dotAngle = -Math.PI / 2 + dotProgress * Math.PI * 2;
	const dotPos = {x: CX + RADIUS_PX * Math.cos(dotAngle), y: CY + RADIUS_PX * Math.sin(dotAngle)};

	const circumference = 2 * Math.PI * RADIUS_PX;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				{/* The loop circle */}
				<circle
					cx={CX}
					cy={CY}
					r={RADIUS_PX}
					fill="none"
					stroke={COLORS.border1}
					strokeWidth={2}
					strokeDasharray={`${circumference * arcT} ${circumference}`}
					transform={`rotate(-90 ${CX} ${CY})`}
				/>
				{/* Traveling dot */}
				{dotProgress > 0 ? (
					<circle cx={dotPos.x} cy={dotPos.y} r={10} fill={COLORS.brand} opacity={0.95} />
				) : null}
			</svg>

			{STEPS.map((step, i) => {
				const t = nodeT(i);
				const p = nodePos(i);
				return (
					<div
						key={step}
						style={{
							position: "absolute",
							left: p.x - NODE_W / 2,
							top: p.y - NODE_H / 2,
							width: NODE_W,
							height: NODE_H,
							opacity: t,
							transform: `scale(${0.85 + 0.15 * t})`,
							transformOrigin: "center center",
							backgroundColor: COLORS.surface3,
							border: `1px solid ${ACCENTS[i]}`,
							borderRadius: RADIUS.md,
							boxShadow: SHADOW.subtle,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<div style={{...TYPE.label, fontSize: 26, color: COLORS.text}}>{step}</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
