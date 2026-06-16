import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, TYPE} from "../../../theme";
import {AgentNode} from "../../../components";
import {Connector} from "./_local";
import {STAGE_H, STAGE_W} from "../layout";

// The agent processes the row and emits a small structured-output card:
// category / urgency / confidence. Kept deliberately tiny.
const FIELDS: {k: string; v: string; tone: string}[] = [
	{k: "category", v: "billing", tone: COLORS.secondary},
	{k: "urgency", v: "high", tone: COLORS.warning},
	{k: "confidence", v: "0.94", tone: COLORS.accent},
];

export const ProcessRowScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const agentX = 380;
	const agentY = STAGE_H / 2 - 110;
	const agentW = 320;
	const agentH = 220;

	const cardX = 1080;
	const cardY = STAGE_H / 2 - 150;
	const cardW = 460;

	const agentT = interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const lineT = interpolate(frame, [1.0 * fps, 1.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const cardT = interpolate(frame, [1.5 * fps, 2.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const fieldT = (i: number) => {
		const s = (2.4 + i * 0.5) * fps;
		return interpolate(frame, [s, s + 0.4 * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
	};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				<Connector x1={agentX + agentW} y1={agentY + agentH / 2} x2={cardX} y2={cardY + 100} t={lineT} color={COLORS.brand} />
			</svg>

			{/* Agent */}
			<div style={{position: "absolute", left: agentX, top: agentY, opacity: agentT, transform: `scale(${0.9 + 0.1 * agentT})`, transformOrigin: "center"}}>
				<AgentNode label="agent" width={agentW} height={agentH} />
			</div>

			{/* Structured-output card */}
			<div
				style={{
					position: "absolute",
					left: cardX,
					top: cardY,
					width: cardW,
					backgroundColor: COLORS.surface3,
					border: `1px solid ${COLORS.brand}`,
					borderRadius: RADIUS.md,
					padding: 22,
					boxSizing: "border-box",
					opacity: cardT,
					transform: `translateX(${(1 - cardT) * 30}px)`,
				}}
			>
				<div style={{...TYPE.micro, color: COLORS.brandInset, textTransform: "uppercase", letterSpacing: 1.4, marginBottom: 16}}>
					structured output
				</div>
				<div style={{display: "flex", flexDirection: "column", gap: 12}}>
					{FIELDS.map((f, i) => (
						<div
							key={f.k}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								opacity: fieldT(i),
								transform: `translateY(${(1 - fieldT(i)) * 10}px)`,
							}}
						>
							<span style={{...TYPE.body, fontSize: 26, color: COLORS.textMuted}}>{f.k}</span>
							<span
								style={{
									...TYPE.label,
									fontSize: 24,
									color: f.tone,
									backgroundColor: f.tone + "1f",
									border: `1px solid ${f.tone}55`,
									borderRadius: RADIUS.sm,
									padding: "4px 14px",
								}}
							>
								{f.v}
							</span>
						</div>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};
