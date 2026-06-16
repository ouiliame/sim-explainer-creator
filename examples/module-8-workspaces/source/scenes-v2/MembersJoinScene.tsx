import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {PANEL_HOME_X} from "../layout-v2";
import {pulse01, ramp, WorkspacePanel} from "./_shared";

// Scene 2 — members-join.
// Person dots dock onto the boundary ring itself (the docs' visual note). As
// each new member docks, a soft scale-pulse sweeps the tiles: joining the box
// IS gaining access to everything inside. No arrows, no per-object grants.
export const MembersJoinScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Dock times for the three members (the first is "you" — quiet entrance).
	const docks = [0.6, 3.0, 6.0];
	const members = docks.map((d) => ({
		drop: ramp(t, d, d + 1.0, EASING.out),
		ring: pulse01(t, d + 1.0, d + 2.0),
	}));

	// Access sweep after members 2 and 3 dock — every tile, in order.
	const sweep = (start: number, i: number) => pulse01(t, start + i * 0.14, start + 0.8 + i * 0.14);
	const tilePulse = [0, 1, 2, 3].map((i) => Math.max(sweep(4.2, i), sweep(7.2, i)));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<WorkspacePanel x={PANEL_HOME_X} members={members} tilePulse={tilePulse} />
		</AbsoluteFill>
	);
};
