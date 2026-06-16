import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {BoundaryFrame} from "../scenes/_local";
import {
	PANEL_HOME_X,
	PANEL_LEFT_X,
	REACH_FROM,
	REACH_STOP_X,
	reachTarget,
	SECOND_H,
	SECOND_MEMBER_X,
	SECOND_TILE_H,
	SECOND_TILE_W,
	SECOND_TILE_X,
	SECOND_TILE_Y,
	SECOND_W,
	SECOND_X,
	SECOND_Y,
} from "../layout-v2";
import {PersonDot, ramp, ReachLine, WorkspacePanel, XStamp} from "./_shared";

// Scene 3 — the-boundary (isolation).
// The panel glides left as a unit; another workspace fades in beside it. Its
// workflow reaches for OUR table — and the reach stops dead at our border:
// red blip, ✗ stamp. Resources never leave the box. The second workspace
// leaves; the panel stays left (scenes 4–5 live there).
export const TheBoundaryScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Glide HOME → LEFT (interpolated, never cut).
	const glide = ramp(t, 0.2, 1.6, EASING.inOut);
	const panelX = interpolate(glide, [0, 1], [PANEL_HOME_X, PANEL_LEFT_X]);

	const members = [{drop: 1}, {drop: 1}, {drop: 1}];

	// The other workspace.
	const secondOp = ramp(t, 1.2, 2.4, EASING.out) * (1 - ramp(t, 6.8, 8.2, EASING.in));

	// The blocked reach.
	const reachP = ramp(t, 2.8, 4.0, EASING.out);
	const blocked = ramp(t, 4.0, 4.5);
	const stampP = ramp(t, 4.0, 4.6, EASING.out);
	const reachFade = 1 - ramp(t, 5.4, 6.4, EASING.in);

	const target = reachTarget();
	const tStop = (REACH_FROM.x - REACH_STOP_X) / (REACH_FROM.x - target.x);
	const stampY = REACH_FROM.y + (target.y - REACH_FROM.y) * tStop;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* The other workspace (fades in/out as a unit) */}
			{secondOp > 0 ? (
				<div style={{opacity: secondOp}}>
					<div style={{position: "absolute", left: SECOND_X, top: SECOND_Y}}>
						<BoundaryFrame label="another workspace" width={SECOND_W} height={SECOND_H} />
					</div>
					<div style={{position: "absolute", left: SECOND_TILE_X, top: SECOND_TILE_Y}}>
						<ObjectNode kind="workflow" width={SECOND_TILE_W} height={SECOND_TILE_H} />
					</div>
					{SECOND_MEMBER_X.map((mx) => (
						<div key={mx} style={{position: "absolute", left: mx - 24, top: SECOND_Y - 24}}>
							<PersonDot size={48} />
						</div>
					))}
				</div>
			) : null}

			{/* The blocked reach (under the panels' borders, above the bg) */}
			<ReachLine
				from={REACH_FROM}
				toward={target}
				stopX={REACH_STOP_X}
				progress={reachP}
				blocked={blocked}
				opacity={reachFade * secondOp}
			/>

			{/* Our workspace */}
			<WorkspacePanel x={panelX} members={members} />

			{/* ✗ at the crossing point on our border */}
			<XStamp x={REACH_STOP_X} y={stampY} presence={stampP * reachFade * secondOp} />
		</AbsoluteFill>
	);
};
