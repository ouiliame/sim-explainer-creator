import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {TheTableV2Scene} from "./scenes/TheTableV2Scene";
import {RowsAndFieldsScene} from "./scenes/RowsAndFieldsScene";
import {TheWorkflowScene} from "./scenes/TheWorkflowScene";
import {TheReadScene} from "./scenes/TheReadScene";
import {TheWriteScene} from "./scenes/TheWriteScene";
import {TheRecordScene} from "./scenes/TheRecordScene";
import {QueueAndRecordScene} from "./scenes/QueueAndRecordScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// v2 — the orientation cut (script-v2.md): one set piece (the `leads`
// SimTable over the docs' table-roundtrip chain), ONE roundtrip run spanning
// scenes 4→5 as a freeze-cut, and a closing non-run that proves the status
// column is the workflow's memory. Every on-screen value traces to the docs'
// authored examples, this repo's authored demo content, or the real
// beaming-polaris run — see the script's grounding note.
// Authored durations are the visual minimums; when a VO sync has run,
// narration length re-times each scene (extend-only — see vo-timing.ts).
const BASE_SCENES: SceneDef[] = [
	{name: "the-table", durationSec: 9, Component: TheTableV2Scene},
	{name: "rows-and-fields", durationSec: 7, Component: RowsAndFieldsScene},
	{name: "the-workflow", durationSec: 9, Component: TheWorkflowScene},
	{name: "the-read", durationSec: 10, Component: TheReadScene},
	{name: "the-write", durationSec: 11, Component: TheWriteScene},
	{name: "the-record", durationSec: 9, Component: TheRecordScene},
	{name: "queue-and-record", durationSec: 7, Component: QueueAndRecordScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const Module2TablesV2Video: React.FC = () => {
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
