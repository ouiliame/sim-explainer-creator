import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, SHADOW, TYPE} from "../../../theme";
import {ObjectNode} from "../../../components";
import {STAGE_H, STAGE_W} from "../layout";

// why-logs: a workflow runs; the output comes back wrong — a red "?" badge.
// Logs (dimmed at first) sit ready as the place to find out what happened.
const WF_W = 300;
const WF_H = 220;
const WF_X = STAGE_W / 2 - 420;
const WF_Y = STAGE_H / 2 - WF_H / 2;

const OUT_W = 300;
const OUT_X = STAGE_W / 2 + 140;
const OUT_Y = STAGE_H / 2 - 90;

export const WhyLogsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Workflow appears, then "runs" (a pulse along the connector).
	const wfIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const flow = interpolate(frame, [0.8 * fps, 1.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Output card lands, then the red "?" badge pops + glows.
	const outIn = interpolate(frame, [1.6 * fps, 2.1 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const badge = interpolate(frame, [2.3 * fps, 2.8 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const glowPulse = 0.5 + 0.5 * Math.sin((frame - 2.8 * fps) / fps * Math.PI * 1.4);
	const glow = badge * (frame > 2.8 * fps ? glowPulse : 1);

	const connX1 = WF_X + WF_W;
	const connX2 = OUT_X;
	const connY = STAGE_H / 2;
	const dotX = connX1 + (connX2 - connX1) * flow;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* connector + traveling run dot */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				<line x1={connX1} y1={connY} x2={connX2} y2={connY} stroke={COLORS.border1} strokeWidth={2} strokeOpacity={wfIn} />
				{flow > 0 && flow < 1 ? <circle cx={dotX} cy={connY} r={8} fill={COLORS.secondary} /> : null}
			</svg>

			{/* the workflow */}
			<div
				style={{
					position: "absolute",
					left: WF_X,
					top: WF_Y,
					opacity: wfIn,
					transform: `scale(${0.9 + 0.1 * wfIn})`,
					transformOrigin: "center center",
				}}
			>
				<ObjectNode kind="workflow" width={WF_W} height={WF_H} subtitle="run" />
			</div>

			{/* the unexpected output */}
			<div
				style={{
					position: "absolute",
					left: OUT_X,
					top: OUT_Y,
					width: OUT_W,
					opacity: outIn,
					transform: `scale(${0.9 + 0.1 * outIn})`,
					transformOrigin: "center center",
				}}
			>
				<div
					style={{
						width: OUT_W,
						height: 180,
						backgroundColor: COLORS.surface3,
						border: `1.5px solid ${interpolateColor(badge)}`,
						borderRadius: RADIUS.md,
						boxShadow: glow > 0 ? `0 0 0 ${6 * glow}px ${COLORS.error}30, ${SHADOW.subtle}` : SHADOW.subtle,
						boxSizing: "border-box",
						padding: 24,
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
					}}
				>
					<div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
						<div style={{...TYPE.micro, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1.2}}>
							output
						</div>
						{/* red question-mark badge */}
						<div
							style={{
								width: 44,
								height: 44,
								borderRadius: 999,
								backgroundColor: COLORS.error + "22",
								border: `1.5px solid ${COLORS.error}`,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								opacity: badge,
								transform: `scale(${0.6 + 0.4 * badge})`,
							}}
						>
							<span style={{...TYPE.label, fontSize: 28, color: COLORS.error, fontWeight: 700}}>?</span>
						</div>
					</div>
					{/* empty / wrong body */}
					<div style={{display: "flex", flexDirection: "column", gap: 10}}>
						<div style={{height: 14, width: "40%", borderRadius: 4, backgroundColor: COLORS.surface5}} />
						<div style={{height: 14, width: "22%", borderRadius: 4, backgroundColor: COLORS.surface5, opacity: 0.5}} />
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// border greys → error red as the badge resolves.
function interpolateColor(t: number) {
	return t > 0.5 ? COLORS.error : COLORS.border1;
}
