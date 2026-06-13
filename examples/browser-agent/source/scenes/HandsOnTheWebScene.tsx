import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {popIn} from "../../../components";
import {CARD_W, CARD_H, slotRect} from "../layout";
import {cv, Rig, SessionViewport, type ViewportState} from "./_rig";

// Scene 5 — hands on the web [zoom-aside + zoom-through-reverse exit].
// THE set piece. The Browser Use chip rings and HOLDS; the world dims
// around the live agent; the live session viewport rises (the product's
// own surface — the block outputs a liveUrl). The cursor navigates to the
// pricing page and clicks through the three plans, capturing each (blue
// glow → green settle, residue kept). Then the whole session FOLDS into
// rail slot 4 — it becomes its own evidence card. The live ring never
// releases.
export const HandsOnTheWebScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	// The long-held call: ring up early, release only after the fold lands.
	const browserRing = Math.min(cv(t, 0.5, 0.9), cv(t, 14.4, 15.0, 1, 0));

	// Everything that isn't the working agent steps back; undims as the
	// session lands as evidence.
	const dim = Math.min(cv(t, 0.9, 1.6), cv(t, 13.6, 14.3, 1, 0));

	// Viewport rise → page A → click nav → page B (pricing).
	const reveal = popIn(frame, fps, 1.4, 0.8);
	const page = cv(t, 4.6, 5.4);

	// Cursor waypoints (viewport page coords). Eases between targets.
	const seg = (lo: number, hi: number, a: number, b: number) =>
		interpolate(t, [lo, hi], [a, b], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
	// entry (380,300) → nav Pricing (700,40) → plan1 (165,95) → plan2
	// (387,95) → plan3 (609,95); fades in 3.2, out by 12.1.
	const cx =
		t < 5.6
			? seg(3.4, 4.3, 380, 700)
			: t < 7.6
				? seg(5.6, 6.6, 700, 165)
				: t < 9.2
					? seg(7.6, 8.4, 165, 387)
					: seg(9.2, 9.9, 387, 609);
	const cy =
		t < 5.6 ? seg(3.4, 4.3, 300, 40) : t < 7.6 ? seg(5.6, 6.6, 40, 95) : 95;
	const cursorOp = Math.min(cv(t, 3.2, 3.6), cv(t, 11.6, 12.1, 1, 0));

	// Clicks (ripples) + captures. Greens settle to the 0.25 provenance
	// residue — the landed card keeps showing WHAT was captured.
	const ripples = [
		{x: 700, y: 40, p: cv(t, 4.3, 4.75)},
		{x: 165, y: 95, p: cv(t, 6.7, 7.15)},
		{x: 387, y: 95, p: cv(t, 8.5, 8.95)},
		{x: 609, y: 95, p: cv(t, 10.0, 10.45)},
	];
	const captures = [
		{
			glow: Math.min(cv(t, 6.8, 7.2), cv(t, 7.8, 8.2, 1, 0)),
			green: Math.min(cv(t, 7.8, 8.4), cv(t, 9.4, 10.0, 1, 0.25)),
		},
		{
			glow: Math.min(cv(t, 8.6, 9.0), cv(t, 9.5, 9.9, 1, 0)),
			green: Math.min(cv(t, 9.5, 10.1), cv(t, 10.9, 11.5, 1, 0.25)),
		},
		{
			glow: Math.min(cv(t, 10.1, 10.5), cv(t, 11.0, 11.4, 1, 0)),
			green: Math.min(cv(t, 11.0, 11.6), cv(t, 12.2, 12.8, 1, 0.25)),
		},
	];

	// The fold: the session becomes evidence card 4.
	const fold = cv(t, 12.6, 14.0) === 0 ? 0 : interpolate(t, [12.6, 14.0], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Green capture pulse once it lands in the slot.
	const landPulse = Math.min(cv(t, 14.0, 14.3), cv(t, 15.0, 15.5, 1, 0));

	const viewport: ViewportState = {
		reveal,
		page,
		cursor: cursorOp > 0 ? {x: cx, y: cy, opacity: cursorOp} : null,
		ripples,
		captures,
		fold,
	};

	const slot4 = slotRect(3);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<Rig
				start={{dim}}
				agent={{highlighted: true}}
				response={{dim}}
				edge1={{dim}}
				edge2={{dim}}
				toolsReveal={1}
				chips={{browser: {ring: browserRing}}}
				cards={[{reveal: 1, dim}, {reveal: 1, dim}, {reveal: 1, dim}, {hidden: true}]}
			/>
			<SessionViewport state={viewport} />
			{landPulse > 0 ? (
				<div
					style={{
						position: "absolute",
						left: slot4.x,
						top: slot4.y,
						width: CARD_W,
						height: CARD_H,
						borderRadius: 8,
						boxShadow: `inset 0 0 0 2.5px rgba(34, 197, 94, ${0.9 * landPulse})`,
						pointerEvents: "none",
					}}
				/>
			) : null}
		</AbsoluteFill>
	);
};
