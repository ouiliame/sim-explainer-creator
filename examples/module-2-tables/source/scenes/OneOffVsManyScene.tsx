import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {WorkflowChain} from "../../../components";
import {Highlight} from "../../../motion";
import {RecordStack} from "./_local";
import {STAGE_W} from "../layout";

// Two sketches: top = one input → agent → output (dims). Bottom = many records
// → process each → write back (wins focus). "Tables are where state lives."
export const OneOffVsManyScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const topY = 210;
	const botY = 640;

	const intro = interpolate(frame, [0, 0.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* TOP sketch: single input → agent → output (dims to deemphasize) */}
			<div style={{position: "absolute", left: 0, top: topY, width: STAGE_W, opacity: intro, display: "flex", justifyContent: "center"}}>
				<Highlight active={false} delay={1.4} duration={0.7} dimmed={0.22}>
					<WorkflowChain
						blocks={[
							{label: "input"},
							{label: "agent", tone: "brand"},
							{label: "output"},
						]}
					/>
				</Highlight>
			</div>

			{/* BOTTOM sketch: many records → process each → write back (focal) */}
			<div style={{position: "absolute", left: 0, top: botY, width: STAGE_W, opacity: intro, display: "flex", justifyContent: "center"}}>
				<Highlight active delay={1.4} duration={0.7}>
					<div style={{display: "flex", alignItems: "center", gap: 36}}>
						<RecordStack count={3} width={300} rowH={56} gap={12} accent={COLORS.accent} />
						<Arrow />
						<WorkflowChain blocks={[{label: "process each", tone: "brand"}]} />
						<Arrow />
						<RecordStack count={3} width={300} rowH={56} gap={12} accent={COLORS.accent} />
					</div>
				</Highlight>
			</div>
		</AbsoluteFill>
	);
};

const Arrow: React.FC = () => (
	<div style={{display: "flex", alignItems: "center", gap: 0}}>
		<div style={{width: 40, height: 2, backgroundColor: COLORS.border1}} />
		<div
			style={{
				width: 0,
				height: 0,
				borderTop: "7px solid transparent",
				borderBottom: "7px solid transparent",
				borderLeft: `11px solid ${COLORS.border1}`,
			}}
		/>
	</div>
);
