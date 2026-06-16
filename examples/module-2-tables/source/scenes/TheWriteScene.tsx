import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ID} from "../layoutV2";
import {pulseWindow, ramp, Stage, writeRangeHi} from "./_v2";

// v2 scene 5 — the-write (the SAME run completes). We open inside the held
// moment (Classify live, range lit, tag resolved). The ring sits a beat —
// working — then the pulse crosses edge 2; the Update block goes live and IN
// SYNC the written range (category + status × 5 rows) lights while values
// dip in top to bottom. Update settles ok; rings, selection and the resolved
// tag all release — but the table KEEPS its new values.
// Enter == scene 4's held exit. Exit == scene 6 enter: idle chain, template
// tag, no selections, table FILLED.

export const TheWriteScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Held state releases as the run moves on.
	const classifyLive = t < 1.7;
	const readFade = 1 - ramp(t, 1.5, 2.1); // read range lets go
	const pulse2 = ramp(t, 1.6, 2.25, EASING.inOut);

	// The write: update live, written range lights, values dip in.
	const updateLive = t >= 2.15 && t < 5.4;
	const updateOk = t >= 5.4 && t < 6.6;
	const writeHi = (r: number) =>
		pulseWindow(t, 2.3 + 0.14 * r, 2.65 + 0.14 * r, 5.7, 6.4);
	const writeMix = (r: number) => ramp(t, 2.5 + 0.22 * r, 3.0 + 0.22 * r);

	// The reference reverts to its template once the run is done.
	const tagResolve = 1 - ramp(t, 6.2, 6.6);
	const tagGlow = 1 - ramp(t, 6.2, 6.6);

	const writtenHi = writeRangeHi(writeHi);

	return (
		<Stage
			cam={CAM_ID}
			cellHi={(c, r) => Math.max(readFade, writtenHi(c, r))}
			writeMix={writeMix}
			query={{}}
			classify={{highlighted: classifyLive}}
			update={{highlighted: updateLive, state: updateOk ? "ok" : "none"}}
			edge1={{}}
			edge2={{}}
			pulse2={pulse2}
			tagGlow={tagGlow}
			tagResolve={tagResolve}
		/>
	);
};
