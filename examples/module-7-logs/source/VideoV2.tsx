import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {V2RunHappensScene} from "./scenes/V2RunHappensScene";
import {V2TheRecordScene} from "./scenes/V2TheRecordScene";
import {V2WhatItReallyDidScene} from "./scenes/V2WhatItReallyDidScene";
import {V2ReadItBackwardsScene} from "./scenes/V2ReadItBackwardsScene";
import {V2EveryRunWritesOneScene} from "./scenes/V2EveryRunWritesOneScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// v2 — the single-video take (script-v2.md): every run leaves a complete
// record, and debugging is reading that record backwards from the symptom.
// One set piece (the REAL beaming-polaris triage run + its OutputBundle
// record), ONE traversal, the backward trace as the centerpiece. Registered
// alongside the original module-7-logs take, which stays renderable.
// Authored durations are the visual minimums; when a VO sync has run,
// narration length re-times each scene (extend-only — see vo-timing.ts).
const BASE_SCENES: SceneDef[] = [
	{name: "a-run-happens", durationSec: 11, Component: V2RunHappensScene},
	{name: "the-record", durationSec: 10, Component: V2TheRecordScene},
	{name: "what-it-really-did", durationSec: 12, Component: V2WhatItReallyDidScene},
	{name: "read-it-backwards", durationSec: 20, Component: V2ReadItBackwardsScene},
	{name: "every-run-writes-one", durationSec: 9, Component: V2EveryRunWritesOneScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const Module7LogsV2Video: React.FC = () => {
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
