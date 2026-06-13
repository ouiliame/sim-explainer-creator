import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING, seconds} from "../../../theme";
import {Stage, camMix, ramp, type LaneState} from "./_rig";
import {CAM_ALL, CAM_CONT, LANE_IDS, type LaneId} from "../layout";

// Scene 5 — the-research-fan [freeze-cut continuation + fan]
// Opens inside the held moment (container live, chain ok). Camera eases
// CAM_ALL → CAM_CONT. The lane fans six wide; the Start pill blips ONCE; six
// pulses leave together; all six Analysts go live AT THE SAME TIME; the
// followed lane's <desk.currentItem> resolves. The followed Analyst's three
// tool chips ring Exa → Perplexity → Serper.
// Exit state (freeze-cut): fan = 1, six Analysts live, tag resolved, the three
// chips ringing, container live, CAM_CONT.
export const TheResearchFanScene: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / seconds(1);

	const cam = camMix(CAM_ALL, CAM_CONT, ramp(t, 0, 1.6, EASING.inOut));

	const fan = ramp(t, 1.6, 2.8, EASING.inOut);
	const pillBlip = ramp(t, 2.9, 3.2) * (1 - ramp(t, 3.4, 3.8));
	const pulse = ramp(t, 3.3, 4.3);
	const live = t >= 4.2;
	const tagResolve = ramp(t, 4.4, 5.0, EASING.out);

	// Followed-lane tool chips ring in succession (the parallel web research).
	// They stay lit to the end — scene 6 opens with them ringing (freeze-cut).
	const chipExa = ramp(t, 5.2, 5.6);
	const chipPerp = ramp(t, 6.0, 6.4);
	const chipSerp = ramp(t, 6.8, 7.2);

	const laneFor = (lane: LaneId): LaneState => {
		const base: LaneState = {
			analyst: {highlighted: live},
			edgeIn: {progress: pulse > 0 ? 1 : fan},
			pulseIn: pulse > 0 && pulse < 1 ? pulse : 0,
		};
		if (lane === 2) {
			return {...base, chipExa, chipPerp, chipSerp};
		}
		return base;
	};

	const lanes: Partial<Record<LaneId, LaneState>> = {};
	LANE_IDS.forEach((l) => (lanes[l] = laneFor(l)));

	return (
		<Stage
			cam={cam}
			tableIn={1}
			rowReveal={() => 1}
			rowStates={() => ({})}
			sched={{state: "ok"}}
			pull={{state: "ok"}}
			cont={{highlighted: true}}
			pill={{reveal: 1, swap: 1}}
			fan={fan}
			pillBlip={pillBlip}
			laneTag={{resolve: tagResolve}}
			lanes={lanes}
		/>
	);
};
