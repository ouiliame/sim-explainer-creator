import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {COLORS, seconds} from "../../theme";
import {VO_TIMING} from "./vo-timing";
import {AnswerFromDocsScene} from "./scenes-v2/AnswerFromDocsScene";
import {TheKnowledgeBaseScene} from "./scenes-v2/TheKnowledgeBaseScene";
import {SplitIntoPassagesScene} from "./scenes-v2/SplitIntoPassagesScene";
import {TheClosestPassagesScene} from "./scenes-v2/TheClosestPassagesScene";
import {IntoTheContextScene} from "./scenes-v2/IntoTheContextScene";
import {TheSearchRecordScene} from "./scenes-v2/TheSearchRecordScene";
import {StillYourDocumentsScene} from "./scenes-v2/StillYourDocumentsScene";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// v2 — the orientation cut (script-v2.md): the docs' SUPPORT_KB_WORKFLOW as
// the set piece, current vocabulary (ResolvedTag, WirePulse, chat aside,
// record panel). TWO runs total: one continuous run spans scenes 1→5
// (frozen at the Knowledge ring through 2–4 while the base aside teaches
// docs → passages → selection, frozen again at the Agent ring into 5 where
// the passages land in the model's context), plus the closing green settle.
// Authored durations are the visual minimums; when a VO sync has run,
// narration length re-times each scene (extend-only — see vo-timing.ts).
const BASE_SCENES: SceneDef[] = [
	{name: "answer-from-docs", durationSec: 10, Component: AnswerFromDocsScene},
	{name: "the-knowledge-base", durationSec: 9, Component: TheKnowledgeBaseScene},
	{name: "split-into-passages", durationSec: 11, Component: SplitIntoPassagesScene},
	{name: "the-closest-passages", durationSec: 11, Component: TheClosestPassagesScene},
	{name: "into-the-context", durationSec: 14, Component: IntoTheContextScene},
	{name: "the-search-record", durationSec: 9, Component: TheSearchRecordScene},
	{name: "still-your-documents", durationSec: 7, Component: StillYourDocumentsScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((acc, s) => acc + s.durationSec, 0);

export const KnowledgeBaseV2Video: React.FC = () => {
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
