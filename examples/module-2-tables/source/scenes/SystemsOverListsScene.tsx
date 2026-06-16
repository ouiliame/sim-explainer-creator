import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {RecordStack} from "./_local";
import {STAGE_H, STAGE_W} from "../layout";

const LABELS = ["Lead · Acme Co", "Ticket · #4821", "Candidate · J. Rivera", "Company · Bluefin", "Document · Q4 plan"];

// Cold open: look-alike records stack in one by one. Frames the use case
// ("a list of records") before the table noun is introduced.
export const SystemsOverListsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const stackW = 560;
	const rowH = 72;
	const gap = 16;
	const stackH = LABELS.length * rowH + (LABELS.length - 1) * gap;

	const opacityFor = (i: number) => {
		const start = (0.3 + i * 0.35) * fps;
		return interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
	};
	const slideFor = (i: number) => {
		const start = (0.3 + i * 0.35) * fps;
		const p = interpolate(frame, [start, start + 0.5 * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
		return -40 * (1 - p);
	};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div
				style={{
					position: "absolute",
					left: (STAGE_W - stackW) / 2,
					top: (STAGE_H - stackH) / 2,
				}}
			>
				<div style={{display: "flex", flexDirection: "column", gap}}>
					{LABELS.map((label, i) => (
						<div key={i} style={{transform: `translateX(${slideFor(i)}px)`, opacity: opacityFor(i)}}>
							<RecordStack count={1} width={stackW} rowH={rowH} gap={0} labels={[label]} />
						</div>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};
