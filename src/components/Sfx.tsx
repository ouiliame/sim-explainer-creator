import React from "react";
import {Audio, Sequence, useVideoConfig} from "remotion";
import {ding, mouseClick, uiSwitch, whip, whoosh} from "@remotion/sfx";

// The sound layer — INFRASTRUCTURE ONLY, currently unused.
//
// ⚠ The stock @remotion/sfx assets were tried and REJECTED ("sfx suck
// shit") — they read as cheap UI-demo stock and degrade the picture.
// SILENCE BEATS BAD SOUND. Do not wire these cues into any scene until the
// palette is replaced with real assets William has approved (licensed UI
// sound pack, ElevenLabs SFX generation, or recorded design).
//
// What survives is the cue-mapping concept: sound never carries meaning the
// picture doesn't already carry —
//   tick — a chip/row rings, a log row lands
//   whoosh — a WirePulse fires, a panel enters/leaves
//   ding — a green settle / result arrives
//   switch — a morph-swap begins
// Volumes low (0.12–0.3): seasoning, not score.

const SRC: Record<string, string> = {
	tick: mouseClick,
	whoosh,
	ding,
	switch: uiSwitch,
	whip,
};

export type SfxCue = keyof typeof SRC;

export const Sfx: React.FC<{
	cue: SfxCue;
	/** When the cue fires, in seconds from the scene's start. */
	at: number;
	volume?: number;
	playbackRate?: number;
}> = ({cue, at, volume = 0.25, playbackRate = 1}) => {
	const {fps} = useVideoConfig();
	return (
		<Sequence from={Math.round(at * fps)} layout="none">
			<Audio src={SRC[cue]} volume={volume} playbackRate={playbackRate} />
		</Sequence>
	);
};
