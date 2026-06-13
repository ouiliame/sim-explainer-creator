import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL} from "../layout";
import {EnrichConfigCard, Stage, ramp} from "./_rig";

// Scene 3 — wired-by-reference [zoom-aside]. The Enrich container takes the
// brand-blue editing ring; the world dims to 0.35. The editor card slides
// in: Parallel Type | Parallel Each, Parallel Items | <apollo.organizations>
// — the reference tag glows. Card leaves, ring releases, world undims.
// Exit: machine idle, card gone, ring released, CAM_ALL.

const NONE = () => 0;

export const WiredByReferenceScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Dim + ring on, hold, then release before scene end.
	const dim = Math.min(ramp(t, 0.3, 1.0, EASING.inOut), 1 - ramp(t, 6.6, 7.4, EASING.inOut));
	const ringOn = t >= 0.3 && t <= 7.4;

	// Card slides in, holds, slides out; the wiring reference glows mid-hold.
	const cardOp = Math.min(ramp(t, 0.8, 1.5, EASING.out), 1 - ramp(t, 6.7, 7.3, EASING.in));
	const cardSlide = 1 - Math.min(ramp(t, 0.8, 1.5, EASING.out), 1) + ramp(t, 6.7, 7.3, EASING.in);
	const itemsGlow = Math.min(ramp(t, 2.2, 2.9, EASING.out), 1 - ramp(t, 5.6, 6.3, EASING.in));

	return (
		<AbsoluteFill>
			<Stage
				cam={CAM_ALL}
				dim={dim}
				rowLand={NONE}
				apollo={{}}
				cont={{highlighted: ringOn}}
				wb={{}}
				fan={0}
				lanes={{2: {}}}
			/>
			<EnrichConfigCard opacity={cardOp} slide={cardSlide} itemsGlow={itemsGlow} />
		</AbsoluteFill>
	);
};
