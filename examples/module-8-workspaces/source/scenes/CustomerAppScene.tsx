import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {BoundaryFrame, PersonFigure} from "./_local";
import {STAGE_H, STAGE_W, TWO_BOX_H, TWO_BOX_RIGHT_X, TWO_BOX_W, TWO_BOX_Y} from "../layout";

// Scene 5 — workspace-as-customer-app.
// The team box re-labels "customer app" and slides from a "you" figure on the
// left to a "customer" figure on the right. For a partner, the workspace IS the app.
const YOU_X = 220;
const CUST_X = STAGE_W - 220 - 120;
const FIG_Y = STAGE_H / 2 - 60;

export const CustomerAppScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Box starts at the team's right slot, then slides to center as it hands off.
	const centerX = (STAGE_W - TWO_BOX_W) / 2;
	const slide = interpolate(frame, [1.0 * fps, 2.4 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const boxX = interpolate(slide, [0, 1], [TWO_BOX_RIGHT_X, centerX]);

	// Figures fade in.
	const youOp = interpolate(frame, [0.3 * fps, 0.9 * fps], [1, 0.25], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const custOp = interpolate(frame, [0.3 * fps, 1.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Handoff arrow draws from "you" to "customer".
	const arrowT = interpolate(frame, [1.2 * fps, 2.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const arrowY = STAGE_H / 2 + 220;
	const arrowStart = YOU_X + 60;
	const arrowEnd = CUST_X + 60;
	const arrowLen = (arrowEnd - arrowStart) * arrowT;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Handoff arrow */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				<line
					x1={arrowStart}
					y1={arrowY}
					x2={arrowStart + arrowLen}
					y2={arrowY}
					stroke={COLORS.accent}
					strokeWidth={3}
					strokeOpacity={0.8}
				/>
				{arrowT > 0.96 ? (
					<polygon
						points={`${arrowEnd},${arrowY} ${arrowEnd - 18},${arrowY - 11} ${arrowEnd - 18},${arrowY + 11}`}
						fill={COLORS.accent}
					/>
				) : null}
			</svg>

			{/* You — dims as ownership leaves */}
			<div style={{position: "absolute", left: YOU_X, top: FIG_Y, opacity: youOp}}>
				<PersonFigure label="you" accent={COLORS.secondary} />
			</div>

			{/* Customer — lights up as it receives the app */}
			<div style={{position: "absolute", left: CUST_X, top: FIG_Y, opacity: custOp}}>
				<PersonFigure label="customer" accent={COLORS.accent} />
			</div>

			{/* The workspace box, re-labeled customer app, sliding to center */}
			<div style={{position: "absolute", left: boxX, top: TWO_BOX_Y}}>
				<BoundaryFrame label="customer app" width={TWO_BOX_W} height={TWO_BOX_H} accent={COLORS.accent} />
			</div>
		</AbsoluteFill>
	);
};
