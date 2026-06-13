import React from "react";
import {Audio, interpolate, staticFile, useVideoConfig} from "remotion";

// Soft background-music bed. Mounted on master comps only (alongside ScratchVO),
// so it scores the full video, not the per-scene previews.
//
// Volume is deliberately low — this sits UNDER narration, never competes with it.
// A short fade-in and a longer tail fade-out keep the in/out clean. The source
// track (Soft Explainer Loop, ~3.9min) is longer than every comp, so no loop is
// needed; `loop` is left on as a safety net for any future longer video.

export const BackgroundMusic: React.FC<{
	/** Bed level under VO. ~0.10–0.15 is a typical music-under-speech level. */
	volume?: number;
	/** Seconds of fade-in at the start. */
	fadeIn?: number;
	/** Seconds of fade-out at the end. */
	fadeOut?: number;
	/** REQUIRED: path under public/ — the track is always specified by the
	 *  caller (see the MUSIC constant in src/Root.tsx), never defaulted. */
	src: string;
}> = ({volume = 0.09, fadeIn = 1.2, fadeOut = 2, src}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const fadeInF = Math.round(fadeIn * fps);
	const fadeOutF = Math.round(fadeOut * fps);

	const envelope = (f: number) => {
		const up = interpolate(f, [0, fadeInF], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
		const down = interpolate(f, [durationInFrames - fadeOutF, durationInFrames], [1, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
		return volume * Math.min(up, down);
	};

	return <Audio src={staticFile(src)} volume={envelope} loop />;
};
