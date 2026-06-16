import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {
	CascadeScene,
	InputOutputColumnsScene,
	OldPipelineScene,
	OneOffVsManyScene,
	PipelineComesToDataScene,
	ProcessRowScene,
	ReadRowsScene,
	SystemsOverListsScene,
	TableAnatomyScene,
	TableAsDashboardScene,
	TableIsTheAgentScene,
	TheTableScene,
	WhatBelongsScene,
	WorkVsInspectableScene,
	WorkflowColumnScene,
	WriteBackScene,
} from "./scenes";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

export const SCENES: SceneDef[] = [
	// V1 — Tables Intro
	{name: "systems-over-lists", durationSec: 6, Component: SystemsOverListsScene},
	{name: "one-off-vs-many", durationSec: 7, Component: OneOffVsManyScene},
	{name: "table-anatomy", durationSec: 9, Component: TableAnatomyScene},
	{name: "what-belongs", durationSec: 7, Component: WhatBelongsScene},
	{name: "work-vs-inspectable", durationSec: 6, Component: WorkVsInspectableScene},
	{name: "pipeline-comes-to-data", durationSec: 5, Component: PipelineComesToDataScene},
	// V2 — Using Tables in Workflows
	{name: "the-table", durationSec: 5, Component: TheTableScene},
	{name: "read-rows", durationSec: 6, Component: ReadRowsScene},
	{name: "process-row", durationSec: 6, Component: ProcessRowScene},
	{name: "write-back", durationSec: 6, Component: WriteBackScene},
	{name: "table-as-dashboard", durationSec: 5, Component: TableAsDashboardScene},
	// V3 — Workflow Columns / Active Tables
	{name: "old-pipeline", durationSec: 7, Component: OldPipelineScene},
	{name: "workflow-column", durationSec: 8, Component: WorkflowColumnScene},
	{name: "input-output-columns", durationSec: 8, Component: InputOutputColumnsScene},
	{name: "cascade", durationSec: 8, Component: CascadeScene},
	{name: "table-is-the-agent", durationSec: 6, Component: TableIsTheAgentScene},
];

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const Module2TablesVideo: React.FC = () => {
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
