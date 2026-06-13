import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {cv, Rig, wave} from "./_rig";

// Scene 2 — the toolbelt [preview-glance + smooth growth]. A selection
// ring on Research (editing); the Tools row grows in at exact natural
// height; three chips land in sequence — Exa (finds), Firecrawl (reads),
// Browser Use (acts) — each with a brief chip-ring pulse. "Browser Use"
// owns the wrap line, so it fades in at full width while the line opens
// (width-growth would jump lines mid-reveal).
export const TheToolbeltScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const grow = (t0: number, dur = 0.6) =>
		interpolate(t, [t0, t0 + dur], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Exa's chip mounts BEFORE toolsReveal completes so the row opens
			    straight to the 40px chip-line height — no 31.5→40 pop when the
			    first chip would otherwise mount into a bare-label row. */}
			<Rig
				agent={{highlighted: t >= 0.6 && t < 7.0}}
				toolsReveal={grow(1.0, 0.7)}
				toolsWrapReveal={cv(t, 4.8, 5.4)}
				chips={{
					exa: {reveal: grow(1.2), ring: wave(t, 2.2, 3.2, 0.3)},
					firecrawl: {reveal: grow(3.0), ring: wave(t, 3.8, 4.8, 0.3)},
					browser: {reveal: cv(t, 5.0, 5.7), ring: wave(t, 5.9, 6.9, 0.3)},
				}}
			/>
		</AbsoluteFill>
	);
};
