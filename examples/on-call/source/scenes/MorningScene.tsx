import React from "react";
import {useCurrentFrame, useVideoConfig} from "remotion";
import {EASING} from "../../../theme";
import {CAM_ALL, CAM_OUT, camLerp} from "../layout";
import {TINT_RESIDUE, ramp} from "./_beats";
import {Stage} from "./_rig";

// Scene 7 — morning. [settle / bookend — THE FINAL FRAME] The settled
// frame holds: chain green in causal order, record full, every status cell
// `assigned` with its faint residue. Camera eases back ~4% and holds for VO.
// Beat intent: by morning the pages went to the right people, every
// incident has an owner and a ticket — and the whole night is written
// down, run by run.
export const MorningScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const cam = camLerp(CAM_ALL, CAM_OUT, ramp(t, 2.0, 4.4, 0, 1, EASING.inOut));

	return (
		<Stage
			cam={cam}
			webhook={{state: "ok"}}
			agent={{state: "ok"}}
			terms={[{state: "ok"}, {state: "ok"}, {state: "ok"}]}
			statusAt={() => "assigned"}
			statusTint={() => TINT_RESIDUE}
			recordIn={1}
			logReveals={[1, 1, 1, 1, 1]}
			logSelected={1}
		/>
	);
};
