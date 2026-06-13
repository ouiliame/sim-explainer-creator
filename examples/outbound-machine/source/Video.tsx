import React from "react";
import {Sequence} from "remotion";
import {seconds} from "../../theme";
import {TheEmptyTableScene} from "./scenes/TheEmptyTableScene";
import {TheMachineScene} from "./scenes/TheMachineScene";
import {WiredByReferenceScene} from "./scenes/WiredByReferenceScene";
import {TheFanScene} from "./scenes/TheFanScene";
import {OneLaneOneLeadScene} from "./scenes/OneLaneOneLeadScene";
import {TheScrambleFinishScene} from "./scenes/TheScrambleFinishScene";
import {TheWriteBackScene} from "./scenes/TheWriteBackScene";
import {TheSentCampaignScene} from "./scenes/TheSentCampaignScene";
import {VO_TIMING} from "./vo-timing";

type SceneDef = {name: string; durationSec: number; Component: React.FC};

// outbound-machine-v1 — THE OUTBOUND MACHINE (hype 3). Locked scene list in
// script-v1.md: one workflow fills a table — find the companies once,
// enrich and personalize every one of them at the same time, send, and the
// run's last block batch-inserts every enriched, personalized, sent lead
// into the real `outbound` Sim table. ONE run spans scenes 4→7 through
// freeze-cuts; scene 8 holds the settled record.
// Authored durations are the visual minimums; vo-sync re-times each scene
// to its narration (extend-only).
const BASE_SCENES: SceneDef[] = [
	{name: "the-empty-table", durationSec: 8, Component: TheEmptyTableScene},
	{name: "the-machine", durationSec: 13, Component: TheMachineScene},
	{name: "wired-by-reference", durationSec: 8, Component: WiredByReferenceScene},
	{name: "the-fan", durationSec: 10, Component: TheFanScene},
	{name: "one-lane-one-lead", durationSec: 12, Component: OneLaneOneLeadScene},
	{name: "the-scramble-finish", durationSec: 9, Component: TheScrambleFinishScene},
	{name: "the-write-back", durationSec: 13, Component: TheWriteBackScene},
	{name: "the-sent-campaign", durationSec: 7, Component: TheSentCampaignScene},
];

export const SCENES: SceneDef[] = BASE_SCENES.map((s) => ({
	...s,
	durationSec: Math.max(s.durationSec, VO_TIMING[s.name] ?? 0),
}));

export const TOTAL_SECONDS = SCENES.reduce((sum, s) => sum + s.durationSec, 0);

export const OutboundMachineVideo: React.FC = () => {
	let at = 0;
	return (
		<>
			{SCENES.map((scene) => {
				const from = at;
				at += seconds(scene.durationSec);
				return (
					<Sequence
						key={scene.name}
						from={from}
						durationInFrames={seconds(scene.durationSec)}
						name={scene.name}
					>
						<scene.Component />
					</Sequence>
				);
			})}
		</>
	);
};
