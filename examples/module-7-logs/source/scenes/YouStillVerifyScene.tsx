import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, SHADOW, TYPE} from "../../../theme";
import {STAGE_H, STAGE_W} from "../layout";

// you-still-verify: the loop closes. Mothership suggests → Workflow edits →
// Rerun → You verify. A check-gate sits on "You", echoing the intro loop.
type Step = {label: string; accent: string; gate?: boolean};
const STEPS: Step[] = [
	{label: "Mothership", accent: COLORS.brand},
	{label: "Edit", accent: COLORS.secondary},
	{label: "Rerun", accent: COLORS.accent},
	{label: "You verify", accent: COLORS.accent, gate: true},
];

const CX = STAGE_W / 2;
const CY = STAGE_H / 2 + 20;
const R = 300;
const NODE_W = 230;
const NODE_H = 96;

const nodePos = (i: number) => {
	const angle = -Math.PI / 2 + (i / STEPS.length) * Math.PI * 2;
	return {x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle)};
};

export const YouStillVerifyScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const nodeT = (i: number) =>
		interpolate(frame, [(0.2 + i * 0.25) * fps, (0.7 + i * 0.25) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// the loop circle draws after nodes land
	const arcT = interpolate(frame, [1.4 * fps, 3.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// traveling dot circles continuously
	const dotProgress = interpolate(frame, [3.0 * fps, 6.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const dotAngle = -Math.PI / 2 + dotProgress * Math.PI * 2;
	const dotPos = {x: CX + R * Math.cos(dotAngle), y: CY + R * Math.sin(dotAngle)};

	// verification gate expands onto the "You" node
	const gate = interpolate(frame, [2.4 * fps, 3.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const circumference = 2 * Math.PI * R;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				<circle
					cx={CX}
					cy={CY}
					r={R}
					fill="none"
					stroke={COLORS.border1}
					strokeWidth={2}
					strokeDasharray={`${circumference * arcT} ${circumference}`}
					transform={`rotate(-90 ${CX} ${CY})`}
				/>
				{dotProgress > 0 ? <circle cx={dotPos.x} cy={dotPos.y} r={10} fill={COLORS.brand} opacity={0.95} /> : null}
			</svg>

			{STEPS.map((step, i) => {
				const t = nodeT(i);
				const p = nodePos(i);
				const isGate = step.gate;
				return (
					<div
						key={step.label}
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
							border: `1.5px solid ${step.accent}`,
							borderRadius: RADIUS.md,
							boxShadow: isGate ? `0 0 0 ${8 * gate}px ${COLORS.accent}22, ${SHADOW.subtle}` : SHADOW.subtle,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 14,
						}}
					>
						{isGate ? (
							<div
								style={{
									width: 38,
									height: 38,
									borderRadius: 999,
									backgroundColor: COLORS.accent + "22",
									border: `1.5px solid ${COLORS.accent}`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									opacity: gate,
									transform: `scale(${0.6 + 0.4 * gate})`,
								}}
							>
								<svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
									<polyline points="5 13 10 18 19 6" />
								</svg>
							</div>
						) : null}
						<div style={{...TYPE.label, fontSize: 26, color: COLORS.text}}>{step.label}</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
