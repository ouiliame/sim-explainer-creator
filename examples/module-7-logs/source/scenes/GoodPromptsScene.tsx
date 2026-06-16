import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {STAGE_H, STAGE_W} from "../layout";
import {Chip} from "./_local";

// good-prompts: three prompt chips slide in next to the Mothership node.
// Mothership stays where it was in logs-ground-truth (continuity).
const NODE_W = 300;
const NODE_H = 220;
const MS_X = STAGE_W / 2 - 120 - NODE_W;
const MS_Y = STAGE_H / 2 - NODE_H / 2;

const PROMPTS = [
	"Explain why this run failed.",
	"Inspect the logs and find the bad input.",
	"Why is this field undefined?",
];

const CHIP_W = 720;
const CHIP_X = MS_X + NODE_W + 120;
const CHIP_GAP = 32;
const CHIP_H = 84;
const STACK_H = PROMPTS.length * CHIP_H + (PROMPTS.length - 1) * CHIP_GAP;
const CHIP_Y0 = STAGE_H / 2 - STACK_H / 2;

export const GoodPromptsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const msIn = interpolate(frame, [0, 0.4 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const chipIn = (i: number) =>
		interpolate(frame, [(0.5 + i * 0.6) * fps, (1.1 + i * 0.6) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* connectors from mothership to each chip */}
			<svg style={{position: "absolute", inset: 0, width: "100%", height: "100%"}} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
				{PROMPTS.map((p, i) => {
					const cy = CHIP_Y0 + i * (CHIP_H + CHIP_GAP) + CHIP_H / 2;
					const op = chipIn(i);
					return (
						<line
							key={p}
							x1={MS_X + NODE_W}
							y1={STAGE_H / 2}
							x2={CHIP_X}
							y2={cy}
							stroke={COLORS.brand}
							strokeWidth={2}
							strokeOpacity={op * 0.55}
						/>
					);
				})}
			</svg>

			{/* Mothership */}
			<div style={{position: "absolute", left: MS_X, top: MS_Y, opacity: msIn}}>
				<ObjectNode kind="mothership" width={NODE_W} height={NODE_H} />
			</div>

			{/* Prompt chips */}
			{PROMPTS.map((p, i) => {
				const op = chipIn(i);
				return (
					<div
						key={p}
						style={{
							position: "absolute",
							left: CHIP_X,
							top: CHIP_Y0 + i * (CHIP_H + CHIP_GAP),
							opacity: op,
							transform: `translateX(${(1 - op) * 60}px)`,
						}}
					>
						<Chip text={p} accent={COLORS.brand} width={CHIP_W} />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
