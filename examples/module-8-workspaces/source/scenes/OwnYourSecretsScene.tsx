import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, TYPE} from "../../../theme";
import {BoundaryFrame, CredentialKey, PersonFigure} from "./_local";
import {STAGE_H, STAGE_W} from "../layout";

// Scene 10 — own-your-secrets.
// A hardcoded secret (struck out, red) vs. a credential held inside the
// boundary, handing off to a customer figure. Two rules, shown not written.
const BOX_W = 620;
const BOX_H = 360;
const BOX_X = STAGE_W * 0.30 - BOX_W / 2;
const BOX_Y = (STAGE_H - BOX_H) / 2 + 10;

export const OwnYourSecretsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const boxT = interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// The hardcoded secret strikes through (the "don't").
	const strikeT = interpolate(frame, [1.4 * fps, 2.1 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// The boundary-held key glows (the "do").
	const keyGlow = interpolate(frame, [2.2 * fps, 2.9 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Handoff arrow to customer.
	const handT = interpolate(frame, [3.2 * fps, 4.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const custOp = interpolate(frame, [3.0 * fps, 3.8 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const custX = STAGE_W - 320;
	const custY = STAGE_H / 2 - 60;
	const arrowY = STAGE_H / 2;
	const arrowStart = BOX_X + BOX_W + 20;
	const arrowEnd = custX - 10;
	const arrowLen = (arrowEnd - arrowStart) * handT;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Handoff arrow */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				<line x1={arrowStart} y1={arrowY} x2={arrowStart + arrowLen} y2={arrowY} stroke={COLORS.accent} strokeWidth={3} strokeOpacity={0.8} />
				{handT > 0.96 ? (
					<polygon points={`${arrowEnd},${arrowY} ${arrowEnd - 18},${arrowY - 11} ${arrowEnd - 18},${arrowY + 11}`} fill={COLORS.accent} />
				) : null}
			</svg>

			{/* The workspace box holding the secret */}
			<div style={{position: "absolute", left: BOX_X, top: BOX_Y, opacity: boxT}}>
				<BoundaryFrame label="my workspace" width={BOX_W} height={BOX_H} accent={COLORS.brand} />
			</div>

			{/* Hardcoded secret — struck through */}
			<div
				style={{
					position: "absolute",
					left: BOX_X + 60,
					top: BOX_Y + 70,
					width: BOX_W - 120,
					opacity: boxT,
				}}
			>
				<div
					style={{
						position: "relative",
						padding: "16px 22px",
						backgroundColor: COLORS.surface3,
						border: `1px solid ${COLORS.error}`,
						borderRadius: RADIUS.sm,
						...TYPE.mono,
						fontSize: 24,
						color: COLORS.textMuted,
					}}
				>
					api_key = "sk-live-9f2c..."
					<div
						style={{
							position: "absolute",
							left: 14,
							right: 14 + (1 - strikeT) * (BOX_W - 148),
							top: "50%",
							height: 3,
							backgroundColor: COLORS.error,
						}}
					/>
				</div>
			</div>

			{/* Credential held inside the boundary — the right way */}
			<div
				style={{
					position: "absolute",
					left: BOX_X + (BOX_W - 250) / 2,
					top: BOX_Y + 200,
					opacity: boxT,
					boxShadow: `0 0 ${36 * keyGlow}px ${COLORS.accent}`,
					borderRadius: RADIUS.md,
				}}
			>
				<CredentialKey label="credential" scope="in workspace" width={250} accent={COLORS.accent} />
			</div>

			{/* Customer receiving ownership */}
			<div style={{position: "absolute", left: custX, top: custY, opacity: custOp}}>
				<PersonFigure label="customer" accent={COLORS.accent} />
			</div>
		</AbsoluteFill>
	);
};
