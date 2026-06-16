import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {TheWorkflowYouKnowScene} from "./scenes/TheWorkflowYouKnowScene";
import {ItBecomesABlockScene} from "./scenes/ItBecomesABlockScene";
import {TheCallBeginsScene} from "./scenes/TheCallBeginsScene";
import {InsideTheCallScene} from "./scenes/InsideTheCallScene";
import {BackWithTheResultScene} from "./scenes/BackWithTheResultScene";
import {WorkflowsAllTheWayUpScene} from "./scenes/WorkflowsAllTheWayUpScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// subworkflows-v2 — the ACCEPTED cut (director: "that's how subworkflows
// should be shown"): the inside is shown BENEATH the halted call
// (expand-beneath archetype) instead of v1's zoom-through. Scenes 4-5
// differ from v1; everything else is shared.
const BASE_SCENES: SceneDef[] = [
	{name: "the-workflow-you-know", durationSec: 8, Component: TheWorkflowYouKnowScene},
	{name: "it-becomes-a-block", durationSec: 10, Component: ItBecomesABlockScene},
	{name: "the-call-begins", durationSec: 7, Component: TheCallBeginsScene},
	{name: "inside-the-call", durationSec: 14, Component: InsideTheCallScene},
	{name: "back-with-the-result", durationSec: 10, Component: BackWithTheResultScene},
	{name: "workflows-all-the-way-up", durationSec: 8, Component: WorkflowsAllTheWayUpScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const SubworkflowsV2Video: React.FC = () => {
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
