import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_CONT} from "../layout";
import {Stage, camMix, pulseWindow, ramp, type LaneState} from "./_rig";

// Scene 6 — the-fan [freeze-cut continuation + runtime fan]. Opens
// inside the held moment (container live). The camera eases onto the
// container; the single lane fans five wide AT RUNTIME (four compact
// instances separate out above and below the followed lane); the inner
// Start pill blips ONCE; five pulses leave together; all five Analysts
// go live AT THE SAME MOMENT, and in the followed lane
// <parallel.currentItem> resolves to its market.
// Exit (freeze-cut): fan 1, five Analysts live, tag resolved, container
// live, pill swap 1, CAM_CONT.
export const TheFanScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const cam = camMix(CAM_ALL, CAM_CONT, ramp(t, 0.4, 1.7, EASING.inOut));
	const fan = ramp(t, 2.2, 3.6, EASING.inOut);

	const pillBlip = pulseWindow(t, 4.2, 4.45, 4.75, 5.05);
	const pulses = ramp(t, 4.4, 5.2, EASING.inOut);

	// One clock for all five — the synchrony IS the scene.
	const anaLive = t >= 5.1;
	const tagGlow = pulseWindow(t, 5.8, 6.1, 6.8, 7.1);
	const tagResolve = ramp(t, 6.3, 6.7);

	const lane = (): LaneState => ({
		ana: {highlighted: anaLive},
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
