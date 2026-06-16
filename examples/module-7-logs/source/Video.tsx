import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {
	BlockAnatomyScene,
	DataStoppedMatchingScene,
	DebuggingChecklistScene,
	DontGuessTraceScene,
	FailureTypesScene,
	GoodPromptsScene,
	LogsGroundTruthScene,
	RunIsTimelineScene,
	WhatLogsAnswerScene,
	WhyLogsScene,
	YouStillVerifyScene,
} from "./scenes";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// The animated concept beats for the three-video Logs & Debugging module.
// SCREEN-REC beats (logs-tour-demo, fix-and-rerun-demo, copilot-debug-demo) are
// intentionally omitted — they are live screen recordings, not animated.
export const SCENES: SceneDef[] = [
	// Video 1 — Logs Tour
	{name: "why-logs", durationSec: 6, Component: WhyLogsScene},
	{name: "run-is-a-timeline", durationSec: 7, Component: RunIsTimelineScene},
	{name: "block-anatomy", durationSec: 6, Component: BlockAnatomyScene},
	{name: "what-logs-answer", durationSec: 5, Component: WhatLogsAnswerScene},
	// Video 2 — Debugging Strategies
	{name: "dont-guess-trace", durationSec: 6, Component: DontGuessTraceScene},
	{name: "debugging-checklist", durationSec: 6, Component: DebuggingChecklistScene},
	{name: "data-stopped-matching", durationSec: 8, Component: DataStoppedMatchingScene},
	{name: "failure-types", durationSec: 6, Component: FailureTypesScene},
	// Video 3 — Debugging with Mothership
	{name: "logs-are-ground-truth", durationSec: 6, Component: LogsGroundTruthScene},
	{name: "good-prompts", durationSec: 6, Component: GoodPromptsScene},
	{name: "you-still-verify", durationSec: 6, Component: YouStillVerifyScene},
];

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const Module7LogsVideo: React.FC = () => {
	let cursor = 0;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg, color: COLORS.text}}>
			{SCENES.map((scene) => {
				const from = cursor;
				const durationInFrames = seconds(scene.durationSec);
				cursor += durationInFrames;
				const Scene = scene.Component;
				return (
					<Sequence key={scene.name} from={from} durationInFrames={durationInFrames} layout="none" name={scene.name}>
						<Scene />
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
