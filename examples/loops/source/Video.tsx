import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {ABlockThatHoldsBlocksScene} from "./scenes/ABlockThatHoldsBlocksScene";
import {WhatTheLoopKnowsScene} from "./scenes/WhatTheLoopKnowsScene";
import {OneAtATimeScene} from "./scenes/OneAtATimeScene";
import {TheResultsComeOutScene} from "./scenes/TheResultsComeOutScene";
import {SwapTheContainerScene} from "./scenes/SwapTheContainerScene";
import {AllAtOnceScene} from "./scenes/AllAtOnceScene";
import {TwoSchedulesOneShapeScene} from "./scenes/TwoSchedulesOneShapeScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// Loops v1 (script-v1.md) — iteration: the Loop and Parallel containers.
// One set piece (the docs' own loop/parallel example shape with the
// product screenshots' inner mechanism); 2 runs (sequential vs concurrent
// — the schedule contrast IS the lesson); the only cross-boundary carry
// is the 3→4 freeze-cut's container live ring.
// Authored durations are the visual minimums; when a VO sync has run,
// narration length re-times each scene (extend-only — see vo-timing.ts).
const BASE_SCENES: SceneDef[] = [
	{name: "a-block-that-holds-blocks", durationSec: 9, Component: ABlockThatHoldsBlocksScene},
	{name: "what-the-loop-knows", durationSec: 8, Component: WhatTheLoopKnowsScene},
	{name: "one-at-a-time", durationSec: 14, Component: OneAtATimeScene},
	{name: "the-results-come-out", durationSec: 8, Component: TheResultsComeOutScene},
	{name: "swap-the-container", durationSec: 8, Component: SwapTheContainerScene},
	{name: "all-at-once", durationSec: 12, Component: AllAtOnceScene},
	{name: "two-schedules-one-shape", durationSec: 7, Component: TwoSchedulesOneShapeScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const LoopsVideo: React.FC = () => {
	let cursor = 0;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg, color: COLORS.text}}>
			{SCENES.map((scene) => {
				const from = cursor;
				const durationInFrames = seconds(scene.durationSec);
				cursor += durationInFrames;
				const Scene = scene.Component;
				return (
					<Sequence
						key={scene.name}
						from={from}
						durationInFrames={durationInFrames}
						layout="none"
						name={scene.name}
					>
						<Scene />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
