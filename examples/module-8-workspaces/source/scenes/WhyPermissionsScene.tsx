import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {BoundaryFrame, MemberDot} from "./_local";
import {STAGE_H, STAGE_W} from "../layout";

// Scene 11 — why-permissions.
// The team boundary returns; members reach for resources and some reaches are
// blocked (red). Not everyone should edit — or even see — everything.
const BOX_W = 1100;
const BOX_H = 560;
const BOX_X = (STAGE_W - BOX_W) / 2;
const BOX_Y = (STAGE_H - BOX_H) / 2 + 10;

// Three resources in a row inside the box.
const RES_W = 240;
const RES_H = 180;
const RES_Y = BOX_Y + BOX_H - RES_H - 70;
const resKinds = ["workflow", "table", "deployment"] as const;
const resX = (i: number) => BOX_X + 90 + i * ((BOX_W - 180 - RES_W) / 2);

// Two members above the box.
const memberX = (i: number) => BOX_X + BOX_W / 2 + (i === 0 ? -160 : 160);
const MEMBER_Y = BOX_Y - 70;

// Member 0 may reach resource 0 (allowed). Member 1 reach to resource 2 is blocked.
const REACHES = [
	{m: 0, r: 0, allowed: true},
	{m: 1, r: 1, allowed: true},
	{m: 1, r: 2, allowed: false},
];

export const WhyPermissionsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const baseT = interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const reachT = interpolate(frame, [1.2 * fps, 2.4 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				{REACHES.map((re, i) => {
					const sx = memberX(re.m) + 22;
					const sy = MEMBER_Y + 44;
					const tx = resX(re.r) + RES_W / 2;
					const ty = RES_Y;
					const curX = sx + (tx - sx) * reachT;
					const curY = sy + (ty - sy) * reachT;
					const color = re.allowed ? COLORS.accent : COLORS.error;
					return (
						<g key={i}>
							<line
								x1={sx}
								y1={sy}
								x2={curX}
								y2={curY}
								stroke={color}
								strokeWidth={2.5}
								strokeOpacity={0.8}
								strokeDasharray={re.allowed ? undefined : "8 8"}
							/>
							{!re.allowed && reachT > 0.92 ? (
								<g stroke={COLORS.error} strokeWidth={3.5} strokeLinecap="round">
									<line x1={tx - 14} y1={ty - 30} x2={tx + 14} y2={ty - 2} />
									<line x1={tx + 14} y1={ty - 30} x2={tx - 14} y2={ty - 2} />
								</g>
							) : null}
						</g>
					);
				})}
			</svg>

			{/* Team boundary */}
			<div style={{position: "absolute", left: BOX_X, top: BOX_Y, opacity: baseT}}>
				<BoundaryFrame label="team workspace" width={BOX_W} height={BOX_H} accent={COLORS.accent} />
			</div>

			{/* Resources */}
			{resKinds.map((kind, i) => (
				<div key={kind} style={{position: "absolute", left: resX(i), top: RES_Y, opacity: baseT}}>
					<ObjectNode kind={kind} width={RES_W} height={RES_H} />
				</div>
			))}

			{/* Members */}
			{[0, 1].map((i) => (
				<div key={i} style={{position: "absolute", left: memberX(i), top: MEMBER_Y, opacity: baseT}}>
					<MemberDot color={i === 0 ? COLORS.brand : COLORS.secondary} size={88} ring />
				</div>
			))}
		</AbsoluteFill>
	);
};
