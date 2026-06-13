import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {TheTaskScene} from "./scenes/TheTaskScene";
import {TheToolbeltScene} from "./scenes/TheToolbeltScene";
import {TheRunBeginsScene} from "./scenes/TheRunBeginsScene";
import {ReadingThePagesScene} from "./scenes/ReadingThePagesScene";
import {HandsOnTheWebScene} from "./scenes/HandsOnTheWebScene";
import {TheBriefComesBackScene} from "./scenes/TheBriefComesBackScene";
import {TheEvidenceTrailScene} from "./scenes/TheEvidenceTrailScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// browser-agent v1 (script-v1.md) — "The Agent With Hands". One set piece
// (the docs-shaped chain + the evidence rail), ONE run spanning scenes 3–6
// via held freeze-cuts (the agent's live ring never releases between tool
// calls); four tool calls, four captured results — the filmstrip filling
// up IS the video. Authored durations are the visual minimums; a VO sync
// re-times each scene extend-only (see vo-timing.ts).
const BASE_SCENES: SceneDef[] = [
	{name: "the-task", durationSec: 8, Component: TheTaskScene},
	{name: "the-toolbelt", durationSec: 9, Component: TheToolbeltScene},
	{name: "the-run-begins", durationSec: 11, Component: TheRunBeginsScene},
	{name: "reading-the-pages", durationSec: 9, Component: ReadingThePagesScene},
	{name: "hands-on-the-web", durationSec: 17, Component: HandsOnTheWebScene},
	{name: "the-brief-comes-back", durationSec: 9, Component: TheBriefComesBackScene},
	{name: "the-evidence-trail", durationSec: 7, Component: TheEvidenceTrailScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const BrowserAgentVideo: React.FC = () => {
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
