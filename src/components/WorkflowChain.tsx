import React from "react";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	ResponseGlyphW,
	SimBlock,
	StartGlyphW,
} from "./SimBlock";
import {COLORS} from "../theme";

type Block = {label: string; tone?: "default" | "accent" | "brand"};

type Props = {
	blocks?: Block[];
	/** compact = header-only blocks (chain). Default 0.78 scale of SimBlock width. */
	blockWidth?: number;
};

const defaultBlocks: Block[] = [
	{label: "Start", tone: "default"},
	{label: "Agent", tone: "brand"},
	{label: "Response", tone: "accent"},
];

// Map the legacy tone API onto real Sim block colors + glyphs.
// default → Start (blue), brand → Agent (purple), accent → Response (deep blue).
const toneSpec = (label: string, tone?: Block["tone"]) => {
	const l = label.toLowerCase();
	if (tone === "brand" || l.includes("agent") || l.includes("process"))
		return {color: BLOCK_COLORS.agent, glyph: <AgentGlyphW size={16} />};
	if (l.includes("response") || l.includes("output") || l.includes("reply") || tone === "accent")
		return {color: BLOCK_COLORS.response, glyph: <ResponseGlyphW size={15} />};
	return {color: BLOCK_COLORS.start, glyph: <StartGlyphW size={16} />};
};

// A linear chain of Sim preview blocks joined by real #454545 edge stubs at
// handle height — matches Sim's landing/docs workflow previews.
export const WorkflowChain: React.FC<Props> = ({blocks = defaultBlocks, blockWidth = 270}) => {
	const EDGE_W = 44;
	const HANDLE_Y = 30; // SIM_HANDLE_Y for header-only blocks (20*1.5)

	return (
		<div style={{display: "flex", alignItems: "flex-start"}}>
			{blocks.map((block, i) => {
				const spec = toneSpec(block.label, block.tone);
				return (
					<React.Fragment key={`${block.label}-${i}`}>
						{i > 0 ? (
							<div style={{width: EDGE_W, height: HANDLE_Y * 2, position: "relative"}}>
								<div
									style={{
										position: "absolute",
										left: -10,
										right: -10,
										top: HANDLE_Y - 1.25,
										height: 2.5,
										backgroundColor: COLORS.wire,
									}}
								/>
							</div>
						) : null}
						<SimBlock
							name={block.label}
							color={spec.color}
							glyph={spec.glyph}
							width={blockWidth}
							hideTargetHandle={i === 0}
							hideSourceHandle={i === blocks.length - 1}
						/>
					</React.Fragment>
				);
			})}
		</div>
	);
};
