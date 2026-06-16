import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {AgentGlyphW, OutputBundle} from "../../../components";
import {CAM_ID, RECORD_SCALE, RECORD_X, RECORD_Y} from "../layoutV2";
import {pulseWindow, ramp, Stage, TableGlyphW} from "./_v2";

// v2 scene 6 — the-record (record-panel). The world dims; the run inspector
// rises with the docs' authored Query Rows record (using-in-workflows.mdx):
// block `table1` at 84ms, output tree rows → 0 → id/company/status,
// rowCount 5. Agent and table-write durations are the real beaming-polaris
// run's (triage-run.md) standing in for the same block types. The `rows`
// node gets the highlight — the rows the workflow read.
// Enter == scene 5 exit; the panel is fully gone and the world undimmed by
// the end, so exit == scene 7 enter (idle chain, filled table).

export const TheRecordScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const dim = pulseWindow(t, 0.4, 1.1, 7.5, 8.3);
	const panelOp = pulseWindow(t, 0.9, 1.7, 7.4, 8.1);
	const panelY = RECORD_Y + (1 - ramp(t, 0.9, 1.7, EASING.out)) * 30;

	const reveal = (t0: number) => ramp(t, t0, t0 + 0.4, EASING.out);
	const rowsHi = pulseWindow(t, 2.9, 3.5, 6.6, 7.2);

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<Stage
				cam={CAM_ID}
				dim={dim}
				writeMix={() => 1}
				query={{}}
				classify={{}}
				update={{}}
				edge1={{}}
				edge2={{}}
			/>

			{panelOp > 0 ? (
				<div style={{position: "absolute", left: RECORD_X, top: panelY}}>
					<OutputBundle
						scale={RECORD_SCALE}
						opacity={panelOp}
						logs={[
							{
								name: "Table",
								color: "#10B981",
								glyph: <TableGlyphW size={11} />,
								duration: "84ms",
								selected: true,
								reveal: reveal(1.7),
							},
							{
								name: "Classify",
								color: "#33C482",
								glyph: <AgentGlyphW size={11} />,
								duration: "12.2s",
								reveal: reveal(1.9),
							},
							{
								name: "Table",
								color: "#10B981",
								glyph: <TableGlyphW size={11} />,
								duration: "111ms",
								reveal: reveal(2.1),
							},
						]}
						values={[
							{
								key: "rows",
								type: "array",
								highlight: rowsHi,
								children: [
									{
										key: "0",
										type: "object",
										children: [
											{key: "id", type: "string", value: '"row_…"'},
											{key: "company", type: "string", value: '"Acme Co"'},
											{key: "status", type: "string", value: '"unprocessed"'},
										],
									},
								],
								reveal: reveal(2.4),
							},
							{key: "rowCount", type: "number", value: "5", reveal: reveal(2.8)},
						]}
					/>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
