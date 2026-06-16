import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, TYPE} from "../../../theme";
import {STAGE_W} from "../layout";
import {Chip} from "./_local";

// failure-types: common failure flavors fade in as chips. Each is the same
// mismatch wearing a different hat.
const TYPES = [
	"missing input",
	"wrong field reference",
	"string vs object",
	"nested field missing",
	"empty agent message",
	"tool / API failure",
	"structured-output mismatch",
];

// two columns, snap-grid
const COLS = 2;
const CHIP_W = 540;
const GAP_X = 48;
const GAP_Y = 28;
const GRID_W = COLS * CHIP_W + (COLS - 1) * GAP_X;
const GRID_X = (STAGE_W - GRID_W) / 2;
const GRID_Y = 290;

export const FailureTypesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const heading = interpolate(frame, [0, 0.5 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	const chipIn = (i: number) =>
		interpolate(frame, [(0.4 + i * 0.28) * fps, (0.8 + i * 0.28) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div
				style={{
					position: "absolute",
					left: GRID_X,
					top: 170,
					width: GRID_W,
					textAlign: "center",
					opacity: heading,
					...TYPE.heading,
					color: COLORS.text,
				}}
			>
				All one mismatch
			</div>

			{TYPES.map((t, i) => {
				const col = i % COLS;
				const row = Math.floor(i / COLS);
				const x = GRID_X + col * (CHIP_W + GAP_X);
				const y = GRID_Y + row * (62 + GAP_Y);
				const op = chipIn(i);
				return (
					<div
						key={t}
						style={{
							position: "absolute",
							left: x,
							top: y,
							opacity: op,
							transform: `translateY(${(1 - op) * 16}px)`,
						}}
					>
						<Chip text={t} accent={COLORS.error + "66"} width={CHIP_W} mono />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
