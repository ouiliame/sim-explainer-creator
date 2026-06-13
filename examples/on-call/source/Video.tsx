import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {TheQueueScene} from "./scenes/TheQueueScene";
import {TheResponderScene} from "./scenes/TheResponderScene";
import {AlertInScene} from "./scenes/AlertInScene";
import {ReadingTheSignalsScene} from "./scenes/ReadingTheSignalsScene";
import {CreatingTheRecordsScene} from "./scenes/CreatingTheRecordsScene";
import {TheQueueDrainsScene} from "./scenes/TheQueueDrainsScene";
import {MorningScene} from "./scenes/MorningScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// on-call-v2 (script-v1.md) — the on-call agent: one real webhook-triggered
// workflow reads the signals (Sentry/Datadog/GitHub as tools) and creates
// the records (Slack post, Linear ticket, PagerDuty page). 6 runs: run 1
// followed mechanistically (scenes 3→5, two freeze-cuts), runs 2–6 are the
// cadence beat draining the status column. One set piece; scenes differ
// only in state props and camera.
// Authored durations are the visual minimums; when a VO sync has run,
// narration length re-times each scene (extend-only — see vo-timing.ts).
const BASE_SCENES: SceneDef[] = [
	{name: "the-queue", durationSec: 11, Component: TheQueueScene},
	{name: "the-responder", durationSec: 19, Component: TheResponderScene},
	{name: "alert-in", durationSec: 12, Component: AlertInScene},
	{name: "reading-the-signals", durationSec: 13, Component: ReadingTheSignalsScene},
	{name: "creating-the-records", durationSec: 15, Component: CreatingTheRecordsScene},
	{name: "the-queue-drains", durationSec: 16, Component: TheQueueDrainsScene},
	{name: "morning", durationSec: 8, Component: MorningScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const OnCallV2Video: React.FC = () => {
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
