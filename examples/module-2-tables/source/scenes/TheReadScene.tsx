import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ID} from "../layoutV2";
import {ramp, Stage} from "./_v2";

// v2 scene 4 — the-read (run, freeze-cut). THE roundtrip run begins. The
// Query block's live ring comes on and IN SYNC the five rows light as one
// selection range, sweeping top to bottom — the query selecting its rows
// (synchrony only; no connector lines). The pulse crosses edge 1; Classify's
// <table.rows> glows with the range, then resolves to the rows it points at.
// Classify's live ring comes on — and the moment HOLDS through the cut.
// Enter == scene 3 exit. Exit (HELD live state, the 4→5 contract):
// range lit, tag resolved, Classify ring on, pulses spent.

export const TheReadScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Query goes live; rows light as one range, top to bottom.
	const queryLive = t >= 0.8 && t < 3.6;
	const rangeMix = (r: number) => ramp(t, 1.1 + 0.14 * r, 1.45 + 0.14 * r);

	// The reference glows in sync with the lit range, then resolves when the
	// pulse delivers the rows.
	const tagGlow = ramp(t, 2.2, 2.7, EASING.out);
	const pulse1 = ramp(t, 3.5, 4.15, EASING.inOut);
	const tagResolve = ramp(t, 4.1, 4.5);

	const classifyLive = t >= 4.05; // holds through the boundary

	return (
		<Stage
			cam={CAM_ID}
			cellHi={(c, r) => rangeMix(r)}
			query={{highlighted: queryLive}}
			classify={{highlighted: classifyLive}}
			update={{}}
			edge1={{}}
			edge2={{}}
			pulse1={pulse1}
			tagGlow={tagGlow}
			tagResolve={tagResolve}
		/>
	);
};
