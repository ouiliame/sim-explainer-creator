import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {AForkInTheFlowScene} from "./scenes/AForkInTheFlowScene";
import {TheRuleDecidesScene} from "./scenes/TheRuleDecidesScene";
import {TheOtherPathScene} from "./scenes/TheOtherPathScene";
import {SwapTheDeciderScene} from "./scenes/SwapTheDeciderScene";
import {TheModelDecidesScene} from "./scenes/TheModelDecidesScene";
import {TheRunRecordScene} from "./scenes/TheRunRecordScene";
import {StillOneWorkflowScene} from "./scenes/StillOneWorkflowScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// Branching v1 (script-v1.md) — the fork is the capability, the two
// deciders are its anatomies. One set piece (the docs' own condition-route
// and router-triage examples as two states of one fork); 3 runs; the only
// cross-boundary carry is the 2→3 camera lean.
// Authored durations are the visual minimums; when a VO sync has run,
// narration length re-times each scene (extend-only — see vo-timing.ts).
const BASE_SCENES: SceneDef[] = [
	{name: "a-fork-in-the-flow", durationSec: 8, Component: AForkInTheFlowScene},
	{name: "the-rule-decides", durationSec: 12, Component: TheRuleDecidesScene},
	{name: "the-other-path", durationSec: 8, Component: TheOtherPathScene},
	{name: "swap-the-decider", durationSec: 10, Component: SwapTheDeciderScene},
	{name: "the-model-decides", durationSec: 12, Component: TheModelDecidesScene},
	{name: "the-run-record", durationSec: 8, Component: TheRunRecordScene},
	{name: "still-one-workflow", durationSec: 6, Component: StillOneWorkflowScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const BranchingVideo: React.FC = () => {
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
