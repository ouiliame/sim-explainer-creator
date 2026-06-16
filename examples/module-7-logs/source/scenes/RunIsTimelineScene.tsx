import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {FAILED_INDEX, RUN_BLOCK_W, RUN_COUNT, RUN_GAP, RUN_X, RUN_Y, STAGE_W} from "../layout";
import {RunTimeline, type RunStatus} from "./_local";

// run-is-a-timeline: the run expands into a left→right sequence of blocks.
// Each flips to `ok` (green) in order; the last flips to `failed` (red).
export const RunIsTimelineScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Whole row expands in from a collapsed center.
	const expand = interpolate(frame, [0, 0.7 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Connector draws across after the blocks land.
	const connector = interpolate(frame, [0.6 * fps, 1.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Each block flips status in sequence. ok blocks resolve 1.4s..; the failed
	// block resolves last.
	const flipAt = (i: number) => (1.4 + i * 0.55) * fps;

	const statuses: RunStatus[] = [];
	const glows: number[] = [];
	const glowColors: (string | undefined)[] = [];
	for (let i = 0; i < RUN_COUNT; i++) {
		const done = frame >= flipAt(i);
		const isFailed = i === FAILED_INDEX;
		statuses.push(done ? (isFailed ? "failed" : "ok") : "pending");
		// brief glow pulse at the moment of flip; failed block keeps a steady glow
		const since = (frame - flipAt(i)) / fps;
		const pop = done && since < 0.4 ? 1 - since / 0.4 : 0;
		glows.push(isFailed && done ? Math.max(0.7, pop) : pop * 0.6);
		glowColors.push(isFailed ? COLORS.error : COLORS.accent);
	}

	// Row scales out from center while expanding.
	const rowW = RUN_COUNT * RUN_BLOCK_W + (RUN_COUNT - 1) * RUN_GAP;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div
				style={{
					position: "absolute",
					left: RUN_X,
					top: RUN_Y,
					width: rowW,
					transform: `scaleX(${0.7 + 0.3 * expand})`,
					transformOrigin: `${STAGE_W / 2 - RUN_X}px center`,
				}}
			>
				<RunTimeline statuses={statuses} glows={glows} glowColors={glowColors} connectorProgress={connector} />
			</div>
		</AbsoluteFill>
	);
};
