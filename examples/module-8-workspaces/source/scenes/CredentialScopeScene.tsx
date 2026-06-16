import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, TYPE} from "../../../theme";
import {ObjectNode} from "../../../components";
import {BoundaryFrame, CredentialKey, MemberDot} from "./_local";
import {STAGE_H, STAGE_W} from "../layout";

// Scene 8 — personal-vs-workspace-credentials.
// Left: a personal credential bound to a single member. Right: a workspace
// credential living in the boundary itself, available to the system. "Whose key?"
const PERSONAL_CX = STAGE_W * 0.28;
const WS_BOX_W = 720;
const WS_BOX_H = 460;
const WS_BOX_X = STAGE_W * 0.5 + 40;
const WS_BOX_Y = (STAGE_H - WS_BOX_H) / 2 + 10;

export const CredentialScopeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const personalT = interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const wsT = interpolate(frame, [1.0 * fps, 1.7 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Bind arrows draw after both sides exist.
	const arrowT = interpolate(frame, [2.2 * fps, 3.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const personalMemberY = STAGE_H / 2 - 130;
	const personalKeyY = STAGE_H / 2 + 30;

	// workspace key sits at the top of the box; two workflows below it.
	const wsKeyX = WS_BOX_X + (WS_BOX_W - 250) / 2;
	const wsKeyY = WS_BOX_Y + 70;
	const wfY = WS_BOX_Y + 250;
	const wfW = 260;
	const wfH = 150;
	const wfLeftX = WS_BOX_X + 70;
	const wfRightX = WS_BOX_X + WS_BOX_W - 70 - wfW;

	const wsKeyCenter = {x: wsKeyX + 125, y: wsKeyY + 46};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Section captions */}
			<div style={{position: "absolute", left: PERSONAL_CX - 150, top: WS_BOX_Y - 70, opacity: personalT, width: 300, textAlign: "center"}}>
				<Caption text="personal" color={COLORS.brand} />
			</div>
			<div style={{position: "absolute", left: WS_BOX_X, top: WS_BOX_Y - 70, opacity: wsT, width: WS_BOX_W, textAlign: "center"}}>
				<Caption text="workspace" color={COLORS.accent} />
			</div>

			{/* ── Personal column: member + their own key ── */}
			<div style={{position: "absolute", left: PERSONAL_CX - 30, top: personalMemberY, opacity: personalT}}>
				<MemberDot color={COLORS.brand} size={88} ring />
			</div>
			<div style={{position: "absolute", left: PERSONAL_CX - 125, top: personalKeyY, opacity: personalT}}>
				<CredentialKey label="my key" scope="personal" width={250} accent={COLORS.brand} />
			</div>
			{/* Bind line: member ↔ personal key */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				<line
					x1={PERSONAL_CX + 14}
					y1={personalMemberY + 88}
					x2={PERSONAL_CX + 14}
					y2={personalKeyY}
					stroke={COLORS.brand}
					strokeWidth={2.5}
					strokeOpacity={personalT * 0.7}
				/>

				{/* ── Workspace: key feeds both workflows ── */}
				{[wfLeftX, wfRightX].map((wx, i) => {
					const tx = wx + wfW / 2;
					const ty = wfY;
					const curY = wsKeyCenter.y + (ty - wsKeyCenter.y) * arrowT;
					const curX = wsKeyCenter.x + (tx - wsKeyCenter.x) * arrowT;
					return (
						<line
							key={i}
							x1={wsKeyCenter.x}
							y1={wsKeyCenter.y + 30}
							x2={curX}
							y2={curY}
							stroke={COLORS.accent}
							strokeWidth={2.5}
							strokeOpacity={0.8}
						/>
					);
				})}
			</svg>

			{/* ── Workspace box ── */}
			<div style={{position: "absolute", left: WS_BOX_X, top: WS_BOX_Y, opacity: wsT}}>
				<BoundaryFrame label="team workspace" width={WS_BOX_W} height={WS_BOX_H} accent={COLORS.accent} />
			</div>
			<div style={{position: "absolute", left: wsKeyX, top: wsKeyY, opacity: wsT}}>
				<CredentialKey label="shared key" scope="workspace" width={250} accent={COLORS.accent} />
			</div>
			<div style={{position: "absolute", left: wfLeftX, top: wfY, opacity: wsT}}>
				<ObjectNode kind="workflow" width={wfW} height={wfH} />
			</div>
			<div style={{position: "absolute", left: wfRightX, top: wfY, opacity: wsT}}>
				<ObjectNode kind="workflow" width={wfW} height={wfH} />
			</div>
		</AbsoluteFill>
	);
};

const Caption: React.FC<{text: string; color: string}> = ({text, color}) => (
	<div style={{...TYPE.heading, fontSize: 40, color}}>{text}</div>
);
