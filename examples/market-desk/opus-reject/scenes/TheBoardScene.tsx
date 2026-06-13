import React from "react";
import {useCurrentFrame} from "remotion";
import {EASING, seconds} from "../../../theme";
import {Stage, ramp, pulseWindow} from "./_rig";
import {CAM_BOARD} from "../layout";

// Scene 1 — the-board [assemble]
// Board-centered. The six market rows stagger in (question + live mkt%); est
// and edge stay empty. The mkt odds tick from the first frame (Stage reads
// the frame). Row 1 takes a brief product range-selection and releases.
// Exit state: board assembled, selection released, est/edge empty, CAM_BOARD.
export const TheBoardScene: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame / seconds(1);

	// Rows stagger in over the first ~3.5s.
	const rowReveal = (row: number) => ramp(t, 0.4 + row * 0.45, 1.4 + row * 0.45, EASING.out);

	// Row 1 (index 0) selection blip, after it has appeared.
	const sel = pulseWindow(t, 4.3, 4.7, 5.6, 6.0);
	const cellHi = (_col: number, row: number) => (row === 0 ? sel : 0);

	return (
		<Stage
			cam={CAM_BOARD}
			tableIn={1}
			rowReveal={rowReveal}
			rowStates={() => ({})}
			cellHi={cellHi}
			sched={{hidden: true}}
			pull={{hidden: true}}
			cont={{hidden: true}}
			edge1={{opacity: 0}}
			edge2={{opacity: 0}}
		/>
	);
};
