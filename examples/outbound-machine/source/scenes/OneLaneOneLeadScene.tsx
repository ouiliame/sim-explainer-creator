import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_LANE, type LaneId} from "../layout";
import {Stage, camMix, pulseWindow, ramp, type LaneState} from "./_rig";

// Scene 5 — one-lane-one-lead [freeze-cut + camera lean-in, same run].
// Opens inside the held moment (fan=1, container live, currentItem resolved,
// every enrichment live). Camera pushes onto the followed lane; the lane
// works ONE lead mechanistically: the provider chip rings (the cascade
// calling out) and Data Enrichment settles ok; pulse → Personalize goes
// live, its <enrich.contact> tag glows and resolves to [Priya Nair],
// settles ok; pulse → Instantly goes live, settles ok. The table stays
// untouched — nothing writes until the writer runs. Camera eases back.
// Exit (freeze-cut): fan=1, followed lane ok, ghosts live, CAM_ALL.

const NONE = () => 0;
const GHOSTS: LaneId[] = [0, 1, 3, 4];

export const OneLaneOneLeadScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Camera leans onto the lane, holds, eases back near the end.
	const inM = ramp(t, 0.2, 1.8, EASING.inOut);
	const outM = ramp(t, 9.8, 11.4, EASING.inOut);
	const cam = camMix(camMix(CAM_ALL, CAM_LANE, inM), CAM_ALL, outM);

	// currentItem carried in resolved (scene 4); its glow finishes decaying.
	const itemGlow = 0.4 * (1 - ramp(t, 0.6, 1.4));

	// Data Enrichment works the lead: the provider chip rings (the cascade
	// calling out), then the block settles ok and its in-edge cools.
	const providerRing = pulseWindow(t, 2.0, 2.4, 3.4, 3.9);
	const enrOk = t >= 4.1;
	const midEdgeInHi = 1 - ramp(t, 4.1, 4.8);

	// Pulse → Personalize goes live; <enrich.contact> glows and resolves to
	// the enriched value; the block settles ok.
	const pulseA = ramp(t, 4.5, 5.3, EASING.inOut);
	const edgeAHi = pulseWindow(t, 4.5, 4.8, 5.3, 5.8);
	const persLive = t >= 5.2 && t < 7.6;
	const persOk = t >= 7.6;
	const contactGlow = Math.min(ramp(t, 5.5, 5.9), 1 - ramp(t, 7.4, 8.2));
	const contactResolve = ramp(t, 6.0, 6.9, EASING.inOut);

	// Pulse → Instantly goes live, settles ok.
	const pulseB = ramp(t, 7.9, 8.7, EASING.inOut);
	const edgeBHi = pulseWindow(t, 7.9, 8.2, 8.7, 9.2);
	const sendLive = t >= 8.6 && t < 10.3;
	const sendOk = t >= 10.3;

	const ghost = (): LaneState => ({
		enr: {highlighted: true},
		pers: {},
		send: {},
		edgeIn: {hi: 1},
	});
	const lanes: Partial<Record<LaneId, LaneState>> = {};
	GHOSTS.forEach((id) => (lanes[id] = ghost()));
	lanes[2] = {
		providerRing,
		enr: {highlighted: t < 4.1, state: enrOk ? "ok" : "none"},
		pers: {highlighted: persLive, state: persOk ? "ok" : "none"},
		send: {highlighted: sendLive, state: sendOk ? "ok" : "none"},
		edgeIn: {hi: midEdgeInHi},
		edgeA: {hi: edgeAHi},
		edgeB: {hi: edgeBHi},
		pulseA,
		pulseB,
	};

	return (
		<Stage
			cam={cam}
			rowLand={NONE}
			apollo={{state: "ok"}}
			edge1={{hi: 1}}
			cont={{highlighted: true}}
			fan={1}
			lanes={lanes}
			itemTag={{resolve: 1, glow: itemGlow}}
			contactTag={{glow: contactGlow, resolve: contactResolve}}
		/>
	);
};
