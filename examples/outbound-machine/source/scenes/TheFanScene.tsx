import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, type LaneId} from "../layout";
import {Stage, pulseWindow, ramp, type LaneState} from "./_rig";

// Scene 4 — the-fan [run, freeze]. The run starts: Apollo's ring lights and
// settles ok; a pulse crosses edge 1; the container's live ring comes on.
// The fan: the lane fans out (the compact ghost lanes deal out), the inner
// Start pill blips ONCE, the pulses leave together, every Data Enrichment
// block goes live AT THE SAME TIME, and in the followed lane
// <parallel.currentItem> resolves to [Northwind]. HOLDS.
// Exit (freeze-cut): container live, fan=1, all lanes live, item resolved.

const NONE = () => 0;
const ALL_LANES: LaneId[] = [0, 1, 2, 3, 4];

export const TheFanScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Apollo fires; pulse 1 crosses to the container; edge 1 stays hot (the
	// active path — it cools when the parallel settles, scene 6).
	const apolloRing = t >= 0.4 && t < 2.6;
	const pulse1 = ramp(t, 1.2, 2.4, EASING.inOut);
	const edge1Hi = ramp(t, 1.4, 2.0);

	// Container live ring lands when the pulse arrives, HOLDS.
	const contLive = t >= 2.4;

	// The fan splits.
	const fan = ramp(t, 3.0, 4.6, EASING.inOut);

	// Pill blips once; the pulses leave together to every lane; the in-edges
	// heat and HOLD (live lanes).
	const pillBlip = pulseWindow(t, 4.8, 5.0, 5.3, 5.6);
	const pulseIn = ramp(t, 5.0, 5.9, EASING.inOut);
	const edgeInHi = ramp(t, 5.0, 5.6);

	// Every Data Enrichment block goes live together, HOLDS.
	const enrLive = t >= 5.8;

	// The followed lane's currentItem resolves; glow decays to the 0.4 carry.
	const itemResolve = ramp(t, 6.2, 7.2, EASING.inOut);
	const itemGlow = Math.min(ramp(t, 5.9, 6.3), 1 - 0.6 * ramp(t, 7.6, 8.4));

	const lane = (): LaneState => ({
		enr: {highlighted: enrLive},
		pers: {},
		send: {},
		edgeIn: {hi: edgeInHi},
		pulseIn,
	});

	const lanes: Partial<Record<LaneId, LaneState>> = {};
	ALL_LANES.forEach((id) => (lanes[id] = lane()));

	return (
		<Stage
			cam={CAM_ALL}
			rowLand={NONE}
			apollo={{highlighted: apolloRing, state: t >= 2.6 ? "ok" : "none"}}
			pulse1={pulse1}
			edge1={{hi: edge1Hi}}
			cont={{highlighted: contLive}}
			fan={fan}
			pillBlip={pillBlip}
			lanes={lanes}
			itemTag={{glow: itemGlow, resolve: itemResolve}}
		/>
	);
};
