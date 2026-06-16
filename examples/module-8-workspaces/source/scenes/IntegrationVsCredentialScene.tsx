import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {CredentialKey, Gate, ServiceNode} from "./_local";
import {STAGE_H, STAGE_W} from "../layout";

// Scene 7 — integration-vs-credential, no words.
// One centered pipeline: Workflow → connection (the integration) → Slack.
// A locked auth port sits mid-pipe. The credential key rises from below,
// docks at the port, the lock opens green, and flow continues to Slack.
// The mechanic IS the definition: integration = the door, credential = the key.

const CY = STAGE_H / 2 - 60; // pipe centerline

const WF_W = 280;
const WF_H = 170;
const WF_X = 240;

const SERVICE_W = 300;
const SERVICE_H = 96;
const SERVICE_X = STAGE_W - 240 - SERVICE_W;

const PORT_X = STAGE_W / 2; // port center
const PIPE_X1 = WF_X + WF_W;
const PIPE_X2 = SERVICE_X;

const KEY_W = 250;
const KEY_H = 92;
const KEY_X = PORT_X - KEY_W / 2;
const KEY_START_Y = STAGE_H - 200;
const KEY_END_Y = CY + 86; // docks just under the port

export const IntegrationVsCredentialScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Build: workflow + service + pipe + locked port settle in.
	const buildT = interpolate(frame, [0.2 * fps, 1.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Key rises from below and docks at the port.
	const riseT = interpolate(frame, [1.6 * fps, 3.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const keyY = interpolate(riseT, [0, 1], [KEY_START_Y, KEY_END_Y]);

	// Port unlocks once the key docks.
	const openT = interpolate(frame, [3.1 * fps, 3.8 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Active flow draws from the port to Slack after unlock; Slack pulses.
	const flowT = interpolate(frame, [3.9 * fps, 4.9 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const slackPulse = interpolate(frame, [4.9 * fps, 5.2 * fps, 5.8 * fps], [0, 1, 0.5], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* The pipe (integration). Neutral until unlocked; green flow after. */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
				<line
					x1={PIPE_X1}
					y1={CY}
					x2={PIPE_X2}
					y2={CY}
					style={{stroke: COLORS.wire}}
					strokeWidth={4}
					strokeOpacity={buildT}
					strokeLinecap="round"
				/>
				{/* Green active segment: port → Slack */}
				<line
					x1={PORT_X + 52}
					y1={CY}
					x2={PORT_X + 52 + (PIPE_X2 - PORT_X - 52) * flowT}
					y2={CY}
					stroke="#10B981"
					strokeWidth={4}
					strokeOpacity={flowT > 0 ? 0.95 : 0}
					strokeLinecap="round"
				/>
			</svg>

			{/* Workflow (left) */}
			<div style={{position: "absolute", left: WF_X, top: CY - WF_H / 2, opacity: buildT}}>
				<ObjectNode kind="workflow" width={WF_W} height={WF_H} />
			</div>

			{/* Slack (right) */}
			<div
				style={{
					position: "absolute",
					left: SERVICE_X,
					top: CY - SERVICE_H / 2,
					opacity: buildT,
					borderRadius: 12,
					boxShadow: slackPulse > 0 ? `0 0 ${36 * slackPulse}px rgba(16,185,129,${0.5 * slackPulse})` : "none",
				}}
			>
				<ServiceNode kind="slack" width={SERVICE_W} height={SERVICE_H} />
			</div>

			{/* Auth port mid-pipe (locked amber → open green) */}
			<div style={{position: "absolute", left: PORT_X - 46, top: CY - 46, opacity: buildT}}>
				<Gate open={openT} height={92} color={COLORS.warning} />
			</div>

			{/* Credential key rises and docks under the port */}
			<div style={{position: "absolute", left: KEY_X, top: keyY, opacity: Math.min(1, riseT * 3 + 0.0001)}}>
				<CredentialKey label="API key" width={KEY_W} height={KEY_H} />
			</div>

			{/* Dock stem: key → port, appears as it docks */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
				<line
					x1={PORT_X}
					y1={CY + 46}
					x2={PORT_X}
					y2={KEY_END_Y}
					style={{stroke: COLORS.wire}}
					strokeWidth={3}
					strokeOpacity={riseT > 0.96 ? 1 : 0}
				/>
			</svg>
		</AbsoluteFill>
	);
};
