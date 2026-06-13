import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {CAM_TABLE} from "../layout";
import {ramp, pulse} from "./_beats";
import {Stage} from "./_rig";

// Scene 1 — the queue. [table hero] Camera on the incidents table
// (CAM_TABLE). The grid assembles: the container fades in, six rows stagger
// in, every status cell `firing`. The status column takes one collective
// product selection-tint pulse and releases — that column is the job.
// Beat intent: six incidents are firing and it's 3 a.m. Somebody is
// supposed to triage all of these.
export const TheQueueScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const tableIn = ramp(t, 0.3, 0.9);
	const rowReveal = (r: number) => ramp(t, 1.0 + r * 0.3, 1.5 + r * 0.3);
	// One collective pulse on the status column ("the same first response"),
	// released before the cut.
	const colHi = pulse(t, 6.0, 9.0);

	return (
		<Stage
			cam={CAM_TABLE}
			webhook={{opacity: 0}}
			agent={{opacity: 0}}
			terms={[{opacity: 0}, {opacity: 0}, {opacity: 0}]}
			edge1={{progress: 0}}
			fans={[{progress: 0}, {progress: 0}, {progress: 0}]}
			tableIn={tableIn}
			rowReveal={rowReveal}
			statusColHi={colHi}
		/>
	);
};
