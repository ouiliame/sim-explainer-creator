import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_CONT} from "../layout";
import {Stage, camMix, pulseWindow, ramp, type LaneState} from "./_rig";

// Scene 6 — the-fan [freeze-cut continuation]. Opens inside the held
// moment (container live). The camera eases onto the container; the lane
// fans five wide (four compact lanes separate out above and below the
// followed lane); the inner Start pill blips ONCE; five pulses leave
// together; all five Engineers go live AT THE SAME TIME, and in the
// followed lane <parallel.currentItem> resolves to its item.
// Exit (freeze-cut): fan 1, five Engineers live, tag resolved, container
// live, pill swap 1, CAM_CONT.
export const TheFanScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const cam = camMix(CAM_ALL, CAM_CONT, ramp(t, 0.4, 1.8, EASING.inOut));
	const fan = ramp(t, 2.4, 4.0, EASING.inOut);

	const pillBlip = pulseWindow(t, 4.9, 5.15, 5.45, 5.75);
	const pulses = ramp(t, 5.1, 5.9, EASING.inOut);

	// One clock for all five — the synchrony IS the scene.
	const engLive = t >= 5.8;
	const tagGlow = pulseWindow(t, 6.6, 6.9, 7.6, 7.9);
	const tagResolve = ramp(t, 7.1, 7.5);

	const lane = (): LaneState => ({
		eng: {highlighted: engLive},
		pulseIn: pulses,
	});

	return (
		<Stage
			cam={cam}
			fan={fan}
			pillBlip={pillBlip}
			cont={{highlighted: true}}
			pill={{reveal: 1, swap: 1}}
			laneTag={{glow: tagGlow, resolve: tagResolve}}
			lanes={{0: lane(), 1: lane(), 2: lane(), 3: lane(), 4: lane()}}
		/>
	);
};
