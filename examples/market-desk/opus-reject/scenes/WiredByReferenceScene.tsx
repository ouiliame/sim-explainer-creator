import React from "react";
import {AbsoluteFill, useCurrentFrame} from "remotion";
import {EASING, seconds} from "../../../theme";
import {Stage, DeskConfigCard, ramp, pulseWindow} from "./_rig";
import {CAM_ALL} from "../layout";

// Scene 3 — wired-by-reference [zoom-aside]
// The Desk container takes the blue editing ring; the world dims to 0.35. The
// editor card slides in: Parallel Type | Parallel Each, Parallel Items |
// <pull.markets> (the reference glows). Card leaves, ring releases, undim.
// Exit state: card gone, ring released, world undimmed, CAM_ALL (== scene 2).
export const WiredByReferenceScene: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / seconds(1);

	const ring = pulseWindow(t, 0.3, 0.7, 6.6, 7.2);
	const dim = 0.35 * pulseWindow(t, 0.3, 0.8, 6.6, 7.2);
	const cardOp = pulseWindow(t, 0.6, 1.2, 6.4, 7.0);
	const slide = 1 - ramp(t, 0.6, 1.2, EASING.out) + ramp(t, 6.4, 7.0, EASING.in);
	const itemsGlow = pulseWindow(t, 1.6, 2.1, 6.2, 6.6);

	return (
		<AbsoluteFill>
			<Stage
				cam={CAM_ALL}
				dim={dim}
				tableIn={1}
				rowReveal={() => 1}
				rowStates={() => ({})}
				sched={{}}
				pull={{}}
				cont={{highlighted: ring > 0.5}}
				pill={{reveal: 1, swap: 0, dimmed: dim / 0.35}}
				fan={0}
				lanes={{2: {analyst: {}}}}
			/>
			<DeskConfigCard opacity={cardOp} slide={slide} itemsGlow={itemsGlow} />
		</AbsoluteFill>
	);
};
