import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, TYPE} from "../../../theme";
import {ObjectNode, type ObjectKind} from "../../../components";
import {STAGE_H, STAGE_W} from "../layout";

// The old way: row-wise work as a chain of disconnected, hand-glued parts.
// Coordination overhead shown visually — broken connectors + warning glints in
// the gaps, not a paragraph of text.
type Part = {kind: ObjectKind; label: string};
const PARTS: Part[] = [
	{kind: "table", label: "table"},
	{kind: "deployment", label: "webhook"},
	{kind: "tool", label: "enrichment"},
	{kind: "tool", label: "script"},
	{kind: "table", label: "write-back"},
];

const TILE_W = 220;
const TILE_H = 150;
const GAP = 86;

export const OldPipelineScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const totalW = PARTS.length * TILE_W + (PARTS.length - 1) * GAP;
	const startX = (STAGE_W - totalW) / 2;
	const rowY = STAGE_H / 2 - TILE_H / 2;

	const tileT = (i: number) => {
		const s = (0.3 + i * 0.35) * fps;
		return interpolate(frame, [s, s + 0.4 * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
	};

	// Warning glints appear in the gaps to signal the glue/coordination cost.
	const gapT = (i: number) => {
		const s = (2.2 + i * 0.3) * fps;
		return interpolate(frame, [s, s + 0.5 * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
	};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{PARTS.map((p, i) => {
				const x = startX + i * (TILE_W + GAP);
				return (
					<React.Fragment key={i}>
						{/* broken connector + warning glint between tiles */}
						{i > 0 ? (
							<div
								style={{
									position: "absolute",
									left: x - GAP,
									top: rowY + TILE_H / 2 - 1,
									width: GAP,
									height: 2,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									opacity: tileT(i),
								}}
							>
								<div style={{width: GAP * 0.32, height: 2, backgroundColor: COLORS.border1}} />
								{/* gap marker: a small warning diamond */}
								<div
									style={{
										width: 18,
										height: 18,
										margin: "0 6px",
										transform: "rotate(45deg)",
										backgroundColor: COLORS.warning + "22",
										border: `1.5px solid ${COLORS.warning}`,
										borderRadius: RADIUS.xs,
										opacity: gapT(i - 1),
									}}
								/>
								<div style={{width: GAP * 0.32, height: 2, backgroundColor: COLORS.border1}} />
							</div>
						) : null}

						<div
							style={{
								position: "absolute",
								left: x,
								top: rowY,
								opacity: tileT(i),
								transform: `translateY(${(1 - tileT(i)) * 16}px)`,
							}}
						>
							<ObjectNode kind={p.kind} label={p.label} width={TILE_W} height={TILE_H} />
						</div>
					</React.Fragment>
				);
			})}

			{/* "coordination overhead" conveyed as a warning band under the gaps */}
			<div
				style={{
					position: "absolute",
					left: startX + TILE_W,
					top: rowY + TILE_H + 64,
					width: totalW - 2 * TILE_W,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 12,
					opacity: interpolate(frame, [3.4 * fps, 4.0 * fps], [0, 1], {
						extrapolateLeft: "clamp",
						extrapolateRight: "clamp",
						easing: EASING.out,
					}),
				}}
			>
				<div style={{flex: 1, height: 2, backgroundColor: COLORS.warning + "55"}} />
				<span style={{...TYPE.label, fontSize: 22, color: COLORS.warning, whiteSpace: "nowrap"}}>glue &amp; coordinate</span>
				<div style={{flex: 1, height: 2, backgroundColor: COLORS.warning + "55"}} />
			</div>
		</AbsoluteFill>
	);
};
