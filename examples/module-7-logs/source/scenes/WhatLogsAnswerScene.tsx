import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {STAGE_W} from "../layout";
import {ChecklistCard, ChecklistRow} from "./_local";

// what-logs-answer: the five plain questions logs answer, checked one per beat.
const QUESTIONS = [
	"What ran?",
	"In what order?",
	"What did each block receive?",
	"What did each block return?",
	"Where did it fail?",
];

const CARD_W = 1100;
const CARD_X = (STAGE_W - CARD_W) / 2;
const CARD_Y = 250;

export const WhatLogsAnswerScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const checkAt = (i: number) =>
		interpolate(frame, [(0.5 + i * 0.7) * fps, (1.0 + i * 0.7) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	const cardIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div
				style={{
					position: "absolute",
					left: CARD_X,
					top: CARD_Y,
					width: CARD_W,
					opacity: cardIn,
					transform: `translateY(${(1 - cardIn) * 24}px)`,
				}}
			>
				<ChecklistCard title="Logs answer five questions" width={CARD_W}>
					{QUESTIONS.map((q, i) => (
						<ChecklistRow key={q} text={q} checked={checkAt(i)} />
					))}
				</ChecklistCard>
			</div>
		</AbsoluteFill>
	);
};
