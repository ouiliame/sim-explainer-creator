import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, SHADOW, TYPE} from "../../../theme";
import {
	FAILED_INDEX,
	INSPECT_BLOCK_H,
	INSPECT_BLOCK_W,
	INSPECT_BLOCK_X,
	INSPECT_BLOCK_Y,
	INSPECT_PANEL_H,
	INSPECT_PANEL_W,
	INSPECT_PANEL_X,
	INSPECT_PANEL_Y,
	RUN_BLOCK_H,
	RUN_BLOCK_W,
	RUN_COUNT,
	RUN_GAP,
	RUN_STEPS,
	RUN_X,
	RUN_Y,
	runBlockX,
} from "../layout";
import {InspectRow, RunBlock, type RunStatus} from "./_local";

// block-anatomy: the failed block lifts out of the (dimmed) timeline; a
// BlockInspector panel slides in beside it. Rows reveal one at a time.
const ROWS = [
	{label: "Input", value: "user_id: 8841", error: false},
	{label: "Output", value: "—  (empty)", error: true},
	{label: "Error", value: "Cannot read 'email' of undefined", error: true},
	{label: "Timing", value: "1.24s", error: false},
	{label: "Model · Tool", value: "send_email()", error: false},
];

export const BlockAnatomyScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Timeline dims back (everything except the failed block).
	const dim = interpolate(frame, [0.2 * fps, 0.9 * fps], [1, 0.2], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// The failed block lifts from its timeline slot to the inspect position.
	const lift = interpolate(frame, [0.3 * fps, 1.1 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const fromX = runBlockX(FAILED_INDEX);
	const fromY = RUN_Y;
	const blkX = fromX + (INSPECT_BLOCK_X - fromX) * lift;
	const blkY = fromY + (INSPECT_BLOCK_Y - fromY) * lift;
	const blkW = RUN_BLOCK_W + (INSPECT_BLOCK_W - RUN_BLOCK_W) * lift;
	const blkH = RUN_BLOCK_H + (INSPECT_BLOCK_H - RUN_BLOCK_H) * lift;

	// Inspector panel slides in from the right.
	const panel = interpolate(frame, [0.9 * fps, 1.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const panelX = INSPECT_PANEL_X + (1 - panel) * 120;

	// Rows reveal one at a time.
	const rowOp = (i: number) =>
		interpolate(frame, [(1.7 + i * 0.45) * fps, (2.05 + i * 0.45) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	const rowDx = (i: number) =>
		interpolate(frame, [(1.7 + i * 0.45) * fps, (2.05 + i * 0.45) * fps], [24, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	const rowW = RUN_COUNT * RUN_BLOCK_W + (RUN_COUNT - 1) * RUN_GAP;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Dimmed timeline backdrop — the non-failed blocks stay put. */}
			<div style={{position: "absolute", left: RUN_X, top: RUN_Y, width: rowW, opacity: dim}}>
				<div style={{display: "flex", alignItems: "center"}}>
					{RUN_STEPS.map((step, i) => {
						const status: RunStatus = i === FAILED_INDEX ? "failed" : "ok";
						return (
							<React.Fragment key={step.label}>
								{/* the failed slot becomes empty while its block lifts away */}
								<div style={{opacity: i === FAILED_INDEX ? 1 - lift : 1}}>
									<RunBlock kind={step.kind} label={step.label} status={status} width={RUN_BLOCK_W} height={RUN_BLOCK_H} />
								</div>
								{i < RUN_STEPS.length - 1 ? (
									<div style={{width: RUN_GAP, height: 2, backgroundColor: COLORS.border1, flexShrink: 0}} />
								) : null}
							</React.Fragment>
						);
					})}
				</div>
			</div>

			{/* The lifted failed block. */}
			<div style={{position: "absolute", left: blkX, top: blkY}}>
				<RunBlock
					kind={RUN_STEPS[FAILED_INDEX].kind}
					label={RUN_STEPS[FAILED_INDEX].label}
					status="failed"
					width={blkW}
					height={blkH}
					glow={0.9}
				/>
			</div>

			{/* The inspector panel. */}
			<div
				style={{
					position: "absolute",
					left: panelX,
					top: INSPECT_PANEL_Y,
					width: INSPECT_PANEL_W,
					height: INSPECT_PANEL_H,
					opacity: panel,
					backgroundColor: COLORS.surface2,
					border: `1px solid ${COLORS.border1}`,
					borderRadius: RADIUS.lg,
					boxShadow: SHADOW.medium,
					boxSizing: "border-box",
					padding: 44,
				}}
			>
				<div style={{...TYPE.heading, color: COLORS.text, marginBottom: 32, display: "flex", alignItems: "center", gap: 16}}>
					<span style={{width: 12, height: 12, borderRadius: 999, backgroundColor: COLORS.error}} />
					Send · failed
				</div>
				<div style={{display: "flex", flexDirection: "column", gap: 12}}>
					{ROWS.map((r, i) => (
						<div key={r.label} style={{opacity: rowOp(i), transform: `translateX(${rowDx(i)}px)`}}>
							<InspectRow label={r.label} error={r.error}>
								{r.value}
							</InspectRow>
						</div>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};
