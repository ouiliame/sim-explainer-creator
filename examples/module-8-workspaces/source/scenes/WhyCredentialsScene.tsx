import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {BoundaryFrame, Gate, ServiceNode} from "./_local";
import {
	CRED_BOX_H,
	CRED_BOX_W,
	CRED_BOX_X,
	CRED_BOX_Y,
	GATE_CENTER_Y,
	GATE_X,
	SERVICE_H,
	SERVICE_W,
	SERVICE_X,
	SERVICES,
	STAGE_H,
	STAGE_W,
	serviceY,
} from "../layout";

// Scene 6 — why-credentials.
// A Workflow inside the boundary reaches toward external services outside; the
// reach is blocked by a closed gate at the boundary edge.
const WF_W = 300;
const WF_H = 180;
const WF_X = CRED_BOX_X + (CRED_BOX_W - WF_W) / 2;
const WF_Y = GATE_CENTER_Y - WF_H / 2;

export const WhyCredentialsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const wfCenter = {x: WF_X + WF_W, y: GATE_CENTER_Y};

	// Reach lines extend from the workflow to each service, but stop at the gate.
	const reachT = interpolate(frame, [0.8 * fps, 1.8 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const gateStopX = GATE_X - 10;

	// Gate stays shut; a red "blocked" pulse appears once the reach hits it.
	const blockT = interpolate(frame, [1.8 * fps, 2.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const servicesOp = interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Reach lines from workflow toward services, clipped at the gate */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				{SERVICES.map((kind, i) => {
					const sx = SERVICE_X;
					const sy = serviceY(i) + SERVICE_H / 2;
					// line goes from wf edge toward service, but is cut at the gate.
					const fullEndX = gateStopX;
					const curX = wfCenter.x + (fullEndX - wfCenter.x) * reachT;
					const curY = wfCenter.y + (sy - wfCenter.y) * ((curX - wfCenter.x) / (sx - wfCenter.x));
					// Neutral while extending; turns red once blocked at the port.
					const stroke = blockT > 0 ? COLORS.error : COLORS.wire;
					return (
						<line
							key={kind}
							x1={wfCenter.x}
							y1={wfCenter.y}
							x2={curX}
							y2={curY}
							style={{stroke}}
							strokeWidth={2.5}
							strokeOpacity={0.7 + blockT * 0.3}
						/>
					);
				})}
			</svg>

			{/* Boundary box */}
			<div style={{position: "absolute", left: CRED_BOX_X, top: CRED_BOX_Y}}>
				<BoundaryFrame label="my workspace" width={CRED_BOX_W} height={CRED_BOX_H} />
			</div>

			{/* Workflow inside, reaching out */}
			<div style={{position: "absolute", left: WF_X, top: WF_Y}}>
				<ObjectNode kind="workflow" width={WF_W} height={WF_H} />
			</div>

			{/* External services, outside the boundary */}
			{SERVICES.map((kind, i) => (
				<div key={kind} style={{position: "absolute", left: SERVICE_X, top: serviceY(i), opacity: servicesOp}}>
					<ServiceNode kind={kind} width={SERVICE_W} height={SERVICE_H} />
				</div>
			))}

			{/* Locked auth port on the boundary edge */}
			<div
				style={{
					position: "absolute",
					left: GATE_X - 46,
					top: GATE_CENTER_Y - 120,
					opacity: 0.4 + 0.6 * blockT,
				}}
			>
				<Gate open={0} height={240} color={COLORS.error} />
			</div>
		</AbsoluteFill>
	);
};
