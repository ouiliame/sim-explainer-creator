// Scene timing for voice-agent-v2, shared by Video.tsx AND the scenes
// themselves. The scenes need it because the aside band carries
// continuously-oscillating surfaces (waveforms, live dots) across cuts:
// each scene derives a video-GLOBAL oscillator clock from its own start
// offset, so the shimmer is continuous through every boundary whether a
// scene renders inside the master comp or standalone (verify-boundaries
// renders scene comps). Durations are extend-only re-timed by vo-sync
// (vo-timing.ts), and offsets follow automatically.

import {seconds} from "../../theme";
import {VO_TIMING} from "./vo-timing";

export const SCENE_LIST = [
	{name: "the-workflow", min: 9},
	{name: "the-run-fires", min: 7},
	{name: "calls-connect", min: 8},
	{name: "one-conversation", min: 12},
	{name: "three-at-once", min: 14},
	{name: "outcomes-land", min: 12},
	{name: "the-campaign-ran", min: 8},
] as const;

export type SceneName = (typeof SCENE_LIST)[number]["name"];

/** Effective scene length in seconds: authored visual minimum, extend-only
 *  re-timed by narration (vo-sync). */
export const sceneSeconds = (name: SceneName): number => {
	const base = SCENE_LIST.find((s) => s.name === name)!;
	return Math.max(base.min, VO_TIMING[name] ?? 0);
};

export const sceneFrames = (name: SceneName): number => seconds(sceneSeconds(name));

/** Video-global start frame of a scene (sum of effective prior durations). */
export const sceneStartFrames = (name: SceneName): number => {
	let acc = 0;
	for (const s of SCENE_LIST) {
		if (s.name === name) return acc;
		acc += sceneFrames(s.name);
	}
	return acc;
};
