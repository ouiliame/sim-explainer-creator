import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, TYPE} from "../../../theme";
import {BoundaryFrame, MemberDot, ROLE_ACCENT, ROLE_LABEL} from "./_local";
import {STAGE_H, STAGE_W} from "../layout";

// Scene 13 — internal-vs-external.
// The workspace's members sort into three labeled groups — team, partner,
// customer — each carrying a different role badge. Same box, different people.
const BOX_W = 1280;
const BOX_H = 600;
const BOX_X = (STAGE_W - BOX_W) / 2;
const BOX_Y = (STAGE_H - BOX_H) / 2 + 10;

type Group = {label: string; role: string; count: number; color: string};
const GROUPS: Group[] = [
	{label: "Team", role: "admin", count: 3, color: COLORS.brand},
	{label: "Partner", role: "write", count: 2, color: COLORS.secondary},
	{label: "Customer", role: "read", count: 2, color: COLORS.accent},
];

export const InternalVsExternalScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const boxT = interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const colW = (BOX_W - 120) / 3;
	const colX = (i: number) => BOX_X + 60 + i * colW;

	const groupT = (i: number) =>
		interpolate(frame, [(1.0 + i * 0.5) * fps, (1.6 + i * 0.5) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Box */}
			<div style={{position: "absolute", left: BOX_X, top: BOX_Y, opacity: boxT}}>
				<BoundaryFrame label="team workspace" width={BOX_W} height={BOX_H} accent={COLORS.accent} />
			</div>

			{/* Column dividers */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
				{[1, 2].map((i) => (
					<line
						key={i}
						x1={BOX_X + 60 + i * colW}
						y1={BOX_Y + 50}
						x2={BOX_X + 60 + i * colW}
						y2={BOX_Y + BOX_H - 50}
						stroke={COLORS.divider}
						strokeWidth={2}
						strokeOpacity={boxT * 0.8}
					/>
				))}
			</svg>

			{/* Groups */}
			{GROUPS.map((g, i) => {
				const t = groupT(i);
				const cx = colX(i) + colW / 2;
				const memberGap = 92;
				const startX = cx - ((g.count - 1) * memberGap) / 2;
				return (
					<div key={g.label} style={{opacity: t, transform: `translateY(${(1 - t) * 16}px)`}}>
						{/* Member dots */}
						{Array.from({length: g.count}).map((_, j) => (
							<div
								key={j}
								style={{
									position: "absolute",
									left: startX + j * memberGap - 27,
									top: BOX_Y + 150,
								}}
							>
								<MemberDot color={g.color} size={64} ring />
							</div>
						))}
						{/* Group label */}
						<div
							style={{
								position: "absolute",
								left: colX(i),
								top: BOX_Y + 280,
								width: colW,
								textAlign: "center",
								...TYPE.heading,
								fontSize: 38,
								color: COLORS.text,
							}}
						>
							{g.label}
						</div>
						{/* Role badge */}
						<div
							style={{
								position: "absolute",
								left: cx - 85,
								top: BOX_Y + 350,
								width: 170,
							}}
						>
							<div
								style={{
									padding: "10px 0",
									textAlign: "center",
									borderRadius: RADIUS.sm,
									backgroundColor: ROLE_ACCENT[g.role] + "1c",
									border: `1px solid ${ROLE_ACCENT[g.role]}`,
									...TYPE.label,
									fontSize: 24,
									color: ROLE_ACCENT[g.role],
								}}
							>
								{ROLE_LABEL[g.role]}
							</div>
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
