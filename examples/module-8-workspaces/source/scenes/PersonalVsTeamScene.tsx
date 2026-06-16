import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {BoundaryFrame, MemberDot} from "./_local";
import {
	BOUNDARY_H,
	BOUNDARY_W,
	BOUNDARY_X,
	BOUNDARY_Y,
	TWO_BOX_H,
	TWO_BOX_LEFT_X,
	TWO_BOX_RIGHT_X,
	TWO_BOX_W,
	TWO_BOX_Y,
} from "../layout";

// Scene 3 — personal-vs-team.
// The single boundary morphs into the LEFT "personal" box; a second "team" box
// slides in on the right. Same box — but who stands around it changes.
const TEAM_ACCENT = COLORS.accent;

export const PersonalVsTeamScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Left box interpolates from the centered BOUNDARY rect → TWO_BOX_LEFT rect.
	const m = interpolate(frame, [0.2 * fps, 1.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const lx = interpolate(m, [0, 1], [BOUNDARY_X, TWO_BOX_LEFT_X]);
	const ly = interpolate(m, [0, 1], [BOUNDARY_Y, TWO_BOX_Y]);
	const lw = interpolate(m, [0, 1], [BOUNDARY_W, TWO_BOX_W]);
	const lh = interpolate(m, [0, 1], [BOUNDARY_H, TWO_BOX_H]);

	// Team box slides/fades in from the right after the split.
	const teamT = interpolate(frame, [1.0 * fps, 1.8 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const teamX = TWO_BOX_RIGHT_X + (1 - teamT) * 80;

	// Members fade in around their boxes.
	const memberT = (d: number) =>
		interpolate(frame, [(1.9 + d) * fps, (2.3 + d) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	const dotRow = (cx: number, count: number, accent: string, baseDelay: number) => {
		const gap = 64;
		const startX = cx - ((count - 1) * gap) / 2;
		return Array.from({length: count}).map((_, i) => {
			const op = memberT(baseDelay + i * 0.12);
			return (
				<div
					key={i}
					style={{
						position: "absolute",
						left: startX + i * gap - 22,
						top: TWO_BOX_Y - 64,
						opacity: op,
						transform: `translateY(${(1 - op) * 12}px)`,
					}}
				>
					<MemberDot color={accent} ring />
				</div>
			);
		});
	};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Left — personal */}
			<div style={{position: "absolute", left: lx, top: ly}}>
				<BoundaryFrame label="personal" width={lw} height={lh} accent={COLORS.brand} />
			</div>
			{/* Single member over the personal box (appears once split settles) */}
			{dotRow(TWO_BOX_LEFT_X + TWO_BOX_W / 2, 1, COLORS.brand, 0)}

			{/* Right — team / customer */}
			<div style={{position: "absolute", left: teamX, top: TWO_BOX_Y, opacity: teamT}}>
				<BoundaryFrame label="team workspace" width={TWO_BOX_W} height={TWO_BOX_H} accent={TEAM_ACCENT} />
			</div>
			{/* Several members over the team box */}
			{dotRow(TWO_BOX_RIGHT_X + TWO_BOX_W / 2, 4, TEAM_ACCENT, 0.2)}
		</AbsoluteFill>
	);
};
