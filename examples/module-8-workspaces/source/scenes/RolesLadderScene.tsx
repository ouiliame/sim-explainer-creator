import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {Highlight} from "../../../motion";
import {RoleRung, ROLE_ACCENT} from "./_local";
import {ROLE_RUNG_H, ROLE_RUNG_W, ROLE_X, ROLES, roleRungY} from "../layout";

// Scene 12 — roles-ladder.
// A vertical ladder of role rungs — Read / Write / Admin / Owner — each rung
// lighting up bottom-to-top. Roles stack: each does everything below, plus more.
export const RolesLadderScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Rungs reveal bottom-up (read first), staggered.
	const rungT = (i: number) =>
		interpolate(frame, [(0.3 + i * 0.5) * fps, (0.8 + i * 0.5) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// The currently-highlighted rung index walks up the ladder.
	const activeIdx = Math.min(ROLES.length - 1, Math.floor((frame / fps - 0.5) / 0.5));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Ladder rails connecting the rungs */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}}>
				{ROLES.slice(0, -1).map((_, i) => {
					const y1 = roleRungY(i) + ROLE_RUNG_H / 2;
					const y2 = roleRungY(i + 1) + ROLE_RUNG_H / 2;
					const op = Math.min(rungT(i), rungT(i + 1));
					return (
						<line
							key={i}
							x1={ROLE_X - 40}
							y1={y1}
							x2={ROLE_X - 40}
							y2={y2}
							stroke={COLORS.border1}
							strokeWidth={3}
							strokeOpacity={op}
						/>
					);
				})}
			</svg>

			{ROLES.map((role, i) => {
				const t = rungT(i);
				const accent = ROLE_ACCENT[role];
				return (
					<div
						key={role}
						style={{
							position: "absolute",
							left: ROLE_X,
							top: roleRungY(i),
							opacity: t,
							transform: `translateX(${(1 - t) * -40}px)`,
						}}
					>
						<Highlight active={i === activeIdx} delay={0} duration={0.4} color={accent} dimmed={0.55}>
							<RoleRung role={role} width={ROLE_RUNG_W} height={ROLE_RUNG_H} accent={accent} />
						</Highlight>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
