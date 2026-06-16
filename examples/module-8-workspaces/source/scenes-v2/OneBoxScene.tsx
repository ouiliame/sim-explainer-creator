import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {PANEL_HOME_X} from "../layout-v2";
import {ramp, WorkspacePanel} from "./_shared";

// Scene 1 — one-box (assemble).
// The boundary panel draws itself; the four resource tiles the viewer already
// knows fade in staggered inside. Exit state = panel at HOME with all tiles.
export const OneBoxScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const panelOp = ramp(t, 0.2, 1.1, EASING.out);
	const panelScale = interpolate(ramp(t, 0.2, 1.1, EASING.out), [0, 1], [0.97, 1]);

	const tileOp = [0, 1, 2, 3].map((i) => ramp(t, 1.4 + i * 0.5, 2.1 + i * 0.5, EASING.out));

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div style={{position: "absolute", inset: 0, transform: `scale(${panelScale})`, transformOrigin: "50% 50%"}}>
				<WorkspacePanel x={PANEL_HOME_X} opacity={panelOp} tileOp={tileOp} />
			</div>
		</AbsoluteFill>
	);
};
