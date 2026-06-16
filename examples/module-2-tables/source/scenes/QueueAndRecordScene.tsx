import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ID, CAM_OUT} from "../layoutV2";
import {STATUS_COL} from "../dataV2";
import {camMix, pulseWindow, ramp, Stage} from "./_v2";

// v2 scene 7 — queue-and-record (bookend non-run). The Query block runs once
// more: live ring on, the status column header glints (the filter reading
// it) — and NO range lights, because every row already reads `qualified`.
// The contrast with scene 4's lit range is the lesson: the table is both the
// queue the workflow pulls from and the record of what it has already done.
// Query settles green; the camera eases back to hold the final frame.
// Enter == scene 6 exit. No following boundary — the green ring and the
// pulled-back camera hold to the end.

export const QueueAndRecordScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const queryLive = t >= 0.7 && t < 2.9;
	const queryOk = t >= 2.9;
	const headerGlint = pulseWindow(t, 1.2, 1.7, 2.4, 2.9);

	const camM = ramp(t, 3.4, 5.2, EASING.inOut);
	const cam = camMix(CAM_ID, CAM_OUT, camM);

	return (
		<Stage
			cam={cam}
			writeMix={() => 1}
			colHeaderHi={(c) => (c === STATUS_COL ? headerGlint : 0)}
			query={{highlighted: queryLive, state: queryOk ? "ok" : "none"}}
			classify={{}}
			update={{}}
			edge1={{}}
			edge2={{}}
		/>
	);
};
