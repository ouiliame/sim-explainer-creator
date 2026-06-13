import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {CAM_ALL} from "../layout";
import {FleetConfigCard, Stage, pulseWindow, ramp} from "./_rig";

// Scene 3 — wired-by-reference [zoom-aside]. The container takes the blue
// editing ring; everything that isn't the container dims to 0.35. The
// editor card slides in: Parallel Type | Parallel Each, Parallel Items |
// <getissues.rows> — the reference tag glows. Card leaves, ring releases,
// world undims. Enter/exit: chain assembled idle, CAM_ALL.
export const WiredByReferenceScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// World dim around the focal container (zoom-aside: overlay over dimmed
	// content; the container and its lane stay lit).
	const dimW = pulseWindow(t, 0.4, 0.9, 10.2, 10.7);
	const editing = t >= 0.5 && t < 10.4;

	const cardIn = pulseWindow(t, 0.8, 1.4, 9.6, 10.2);
	const cardSlide = 1 - ramp(t, 0.8, 1.4);
	const itemsGlow = pulseWindow(t, 2.6, 3.2, 7.8, 8.4);

	return (
		<AbsoluteFill>
			<Stage
				cam={CAM_ALL}
				tableIn={1 - 0.65 * dimW}
				sched={{dim: dimW}}
				query={{dim: dimW}}
				cont={{highlighted: editing}}
				edge1={{opacity: 1 - 0.65 * dimW}}
				edge2={{opacity: 1 - 0.65 * dimW}}
				lanes={{2: {}}}
			/>
			<FleetConfigCard opacity={cardIn} slide={cardSlide} itemsGlow={itemsGlow} />
		</AbsoluteFill>
	);
};
