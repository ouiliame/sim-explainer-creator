import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {ANormalWorkflowScene} from "./scenes/ANormalWorkflowScene";
import {AddTheAgentScene} from "./scenes/AddTheAgentScene";
import {InsideTheAgentScene} from "./scenes/InsideTheAgentScene";
import {TheRunRecordScene} from "./scenes/TheRunRecordScene";
import {WhatsAheadScene} from "./scenes/WhatsAheadScene";
import {StillAWorkflowScene} from "./scenes/StillAWorkflowScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// v3 — the capability-first cut (script-v3.md), SUPPORT TRIAGE example on
// the real beaming-polaris run. Not problem→solution: "drop an Agent block
// into your workflow and now it can think — thinking = spawning a fresh
// chat with the model." One continuous run spans scenes 2→3: it starts at
// the morph, FREEZES at the live ring, the aside opens inside that moment,
// and the same run completes into Slack. Three runs total in the video.
// Authored durations are the visual minimums; when a VO sync has run,
// narration length re-times each scene (extend-only — see vo-timing.ts).
const BASE_SCENES: SceneDef[] = [
	{name: "a-normal-workflow", durationSec: 7, Component: ANormalWorkflowScene},
	{name: "add-the-agent", durationSec: 7, Component: AddTheAgentScene},
	{name: "inside-the-agent", durationSec: 24, Component: InsideTheAgentScene},
	{name: "the-run-record", durationSec: 8, Component: TheRunRecordScene},
	{name: "whats-ahead", durationSec: 8, Component: WhatsAheadScene},
	{name: "still-a-workflow", durationSec: 6, Component: StillAWorkflowScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const Module5AgentsV3Video: React.FC = () => {
	let cursor = 0;
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg, color: COLORS.text}}>
			{/* Scratch/recorded VO track — silent no-op until public/vo/<id>/ exists */}
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
