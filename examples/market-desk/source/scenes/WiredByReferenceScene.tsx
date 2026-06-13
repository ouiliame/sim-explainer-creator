import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {CAM_ALL} from "../layout";
import {DeskConfigCard, Stage, pulseWindow, ramp} from "./_rig";

// Scene 3 — wired-by-reference [zoom-aside]. The container takes the
// blue editing ring; everything that isn't the container dims to 0.35.
// The editor card slides in: Parallel Type | Parallel Each, Parallel
// Items | <polymarket.markets> — the reference tag glows. Card leaves,
// ring releases, world undims. Enter/exit: chain assembled idle, CAM_ALL.
export const WiredByReferenceScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// World dim around the focal container (zoom-aside: overlay over
	// dimmed content; the container and its lane stay lit).
	const dimW = pulseWindow(t, 0.4, 0.9, 5.8, 6.3);
	const editing = t >= 0.5 && t < 6.0;

	const cardIn = pulseWindow(t, 0.8, 1.4, 5.2, 5.8);
	const cardSlide = 1 - ramp(t, 0.8, 1.4);
	const itemsGlow = pulseWindow(t, 2.2, 2.8, 4.4, 5.0);

	return (
		<AbsoluteFill>
			<Stage
				cam={CAM_ALL}
				tableIn={1 - 0.65 * dimW}
				sched={{dim: dimW}}
				poly={{dim: dimW}}
				cont={{highlighted: editing}}
				edge1={{opacity: 1 - 0.65 * dimW}}
				edge2={{opacity: 1 - 0.65 * dimW}}
				lanes={{2: {}}}
			/>
			<DeskConfigCard opacity={cardIn} slide={cardSlide} itemsGlow={itemsGlow} />
		</AbsoluteFill>
	);
};
