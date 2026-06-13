import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING} from "../../../theme";
import {CAM_HOME, CAM_WORK} from "../layout";
import {Stage} from "./_rig";
import {camMix, mkClock, sceneClock} from "./_anim";

// Scene 2 — the-run-fires [run + runtime fan]. Enters on S1 (the chain at
// rest, CAM_WORK). The run fires: Start blips, a pulse crosses edge 1,
// Campaign live-rings, a pulse crosses edge 2 into the container; the
// container live-rings, the inner pill blips, a pulse reaches Call — and
// the lane FANS: two ghost instance pairs separate above and below the
// real lane, wires fanning with them, <parallel.currentItem> glowing as
// the items distribute. The camera eases back to the home framing,
// revealing the (still empty) aside band. Exits at S2 (run live, fan out,
// glow absorbed).
export const TheRunFiresScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {t, c} = mkClock(frame);
	const {gf, q} = sceneClock("the-run-fires", frame);

	// The run enters the chain: blip → pulse → ring, left to right.
	const startBlip = t >= 0.3 && t < 0.8;
	const pulse1 = c(0.5, 1.2, 0, 1, EASING.inOut);
	const edge1Hi = c(0.9, 1.3);
	const campaignLive = t >= 1.15;
	const pulse2 = c(1.6, 2.3, 0, 1, EASING.inOut);
	const edge2Hi = c(2.0, 2.4);
	const containerLive = t >= 2.25;

	// Inside the container: pill blips once, the pulse reaches Call.
	const pillBlip = Math.min(c(2.5, 2.7), c(3.0, 3.3, 1, 0));
	const pulsePill = c(2.8, 3.5, 0, 1, EASING.inOut);
	const pillHi = c(3.2, 3.6);
	const callLive = t >= 3.45;

	// The runtime fan: ghost instance pairs separate; the reference tag
	// glows while the items distribute, and releases before the cut.
	const fan = c(3.6, 5.0, 0, 1, EASING.inOut);
	const tagGlow = Math.min(c(3.9, 4.3), c(5.4, 6.0, 1, 0));

	// Camera eases back to home, revealing the empty aside band.
	const camP = c(4.2, 6.2, 0, 1, EASING.inOut);

	return (
		<Stage
			frame={gf}
			state={{
				cam: camMix(CAM_WORK, CAM_HOME, camP),
				start: {highlighted: startBlip},
				campaign: {highlighted: campaignLive},
				container: {highlighted: containerLive},
				call: {highlighted: callLive},
				edge1: {hi: edge1Hi},
				edge2: {hi: edge2Hi},
				pillE: {hi: pillHi},
				pulse1,
				pulse2,
				pulsePill,
				pillBlip,
				fan,
				tagGlow,
				quiet: q,
			}}
		/>
	);
};
