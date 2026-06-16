import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {TheWorkflowYouKnowScene} from "./scenes/TheWorkflowYouKnowScene";
import {ItBecomesABlockScene} from "./scenes/ItBecomesABlockScene";
import {TheCallBeginsScene} from "./scenes/TheCallBeginsScene";
import {InsideTheCallV1Scene} from "./scenes/InsideTheCallV1Scene";
import {BackWithTheResultV1Scene} from "./scenes/BackWithTheResultV1Scene";
import {WorkflowsAllTheWayUpScene} from "./scenes/WorkflowsAllTheWayUpScene";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// subworkflows-v1 — the ORIGINAL take (zoom-through centerpiece),
// kept renderable per takes culture; the accepted cut is subworkflows-v2
// (VideoV2.tsx). One idea: a whole workflow can be one block inside
// another — the parent run parks at the block, the child runs end-to-end
// with the parent's value as its start.input, and the child's final
// response comes back as <workflow.result>. One geometry for every world
// (layout.ts); THE move is the fold/unfold through the center slot; one
// mechanistic run held across two freeze-cut boundaries (script-v1.md).
// Authored durations are the visual minimums; when a VO sync has run,
// narration length re-times each scene (extend-only — see vo-timing.ts).
const BASE_SCENES: SceneDef[] = [
	{name: "the-workflow-you-know", durationSec: 8, Component: TheWorkflowYouKnowScene},
	{name: "it-becomes-a-block", durationSec: 10, Component: ItBecomesABlockScene},
	{name: "the-call-begins", durationSec: 7, Component: TheCallBeginsScene},
	{name: "inside-the-call", durationSec: 14, Component: InsideTheCallV1Scene},
	{name: "back-with-the-result", durationSec: 10, Component: BackWithTheResultV1Scene},
	{name: "workflows-all-the-way-up", durationSec: 8, Component: WorkflowsAllTheWayUpScene},
];

export const SCENES: SceneDef[] = BASE_SCENES;

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const SubworkflowsVideo: React.FC = () => {
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
