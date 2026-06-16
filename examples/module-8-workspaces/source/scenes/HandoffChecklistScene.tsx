import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {BoundaryFrame, ChecklistCard, PersonFigure} from "./_local";
import {CHECKLIST_ITEMS, STAGE_H, STAGE_W} from "../layout";

// Scene 15 — handoff-checklist.
// The closing recap: a checklist builds line by line as a workspace box slides
// from "you" toward "customer". Handoff is a checklist, not just a build.
const CARD_W = 760;
const CARD_X = STAGE_W * 0.52;
const CARD_Y = 150;

const BOX_W = 380;
const BOX_H = 240;

const YOU_X = 130;
const CUST_X = 130;

export const HandoffChecklistScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const baseT = interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Reveal checklist items one at a time.
	const revealed = Math.max(
		0,
		Math.min(CHECKLIST_ITEMS.length, Math.floor((frame / fps - 0.8) / 0.85) + 1),
	);

	// The workspace box slides from the "you" figure toward the "customer" figure.
	// Both figures stand on the left column (stacked); the box travels down between.
	const slide = interpolate(frame, [1.0 * fps, 7.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const youY = 150;
	const custY = STAGE_H - 150 - 120;
	const boxX = 280;
	const boxStartY = youY + 20;
	const boxEndY = custY - BOX_H + 100;
	const boxY = interpolate(slide, [0, 1], [boxStartY, boxEndY]);

	const youOp = interpolate(slide, [0, 1], [1, 0.3]);
	const custOp = interpolate(slide, [0, 1], [0.3, 1]);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* You (top-left) */}
			<div style={{position: "absolute", left: YOU_X, top: youY, opacity: baseT * youOp}}>
				<PersonFigure label="you" accent={COLORS.secondary} />
			</div>

			{/* Customer (bottom-left) */}
			<div style={{position: "absolute", left: CUST_X, top: custY, opacity: baseT * custOp}}>
				<PersonFigure label="customer" accent={COLORS.accent} />
			</div>

			{/* The workspace box traveling down the handoff path */}
			<div style={{position: "absolute", left: boxX, top: boxY, opacity: baseT}}>
				<BoundaryFrame
					label="workspace"
					width={BOX_W}
					height={BOX_H}
					accent={slide > 0.5 ? COLORS.accent : COLORS.brand}
				/>
			</div>

			{/* Checklist building line by line */}
			<div style={{position: "absolute", left: CARD_X, top: CARD_Y, opacity: baseT}}>
				<ChecklistCard items={CHECKLIST_ITEMS} revealed={revealed} width={CARD_W} />
			</div>
		</AbsoluteFill>
	);
};
