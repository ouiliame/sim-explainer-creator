import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS} from "../../../theme";
import {popIn} from "../../../components";
import {cv, Rig} from "./_rig";

// Scene 4 — reading the pages [run continuation, freeze-cut both ends].
// The live ring holds. Firecrawl rings → card 2 (a page capture: title +
// paragraph skeleton). Then it rings AGAIN at a faster tempo → card 3 —
// one call per page worth reading, the strip growing as the agent reads.
export const ReadingThePagesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// Call 2 — learn the move.
	const ring1 = Math.min(cv(t, 0.8, 1.1), cv(t, 2.8, 3.2, 1, 0));
	const card2 = {
		reveal: popIn(frame, fps, 1.3, 0.7),
		body: cv(t, 1.5, 2.8),
		pulse: Math.min(cv(t, 2.1, 2.4), cv(t, 3.3, 3.8, 1, 0)),
	};

	// Call 3 — the move repeats, ~1.6× tempo.
	const ring2 = Math.min(cv(t, 4.0, 4.25), cv(t, 5.5, 5.85, 1, 0));
	const card3 = {
		reveal: popIn(frame, fps, 4.3, 0.6),
		body: cv(t, 4.45, 5.4),
		pulse: Math.min(cv(t, 4.9, 5.2), cv(t, 6.1, 6.6, 1, 0)),
	};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<Rig
				agent={{highlighted: true}}
				toolsReveal={1}
				chips={{firecrawl: {ring: Math.max(ring1, ring2)}}}
				cards={[{reveal: 1}, card2, card3, {}]}
			/>
		</AbsoluteFill>
	);
};
