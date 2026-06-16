import React from "react";
import {COLORS, RADIUS, usePalette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	ChunkCard,
	DatabaseGlyphW,
	DipSwap,
	DocumentCard,
	KBIcon,
	ResolvedTag,
	SimBlock,
	SimEdgePath,
	StartGlyphW,
	Tag,
} from "../../../components";
import {edgeColor} from "../../module-1-workflows/scenes/_local";
import {
	blockX,
	CHAIN_EDGE_Y,
	CHAIN_Y,
	chunkX,
	chunkY,
	DOC_W,
	docX,
	docY,
	CHUNK_W,
	edgeX1,
	edgeX2,
	KB_PANEL,
	STAGE_H,
	STAGE_W,
} from "../layoutV2";

export {CanvasDots} from "../../../components";

// ---------------------------------------------------------------------------
// Grounded demo values. Every string traces to demo-corpus/ or the docs'
// authored examples — see script-v2.md § Grounding.
// ---------------------------------------------------------------------------
export const KB_NAME = "Product docs";
export const KB_DOC_COUNT = 17; // demo-corpus README: "17 documents total"

export const QUESTION = "What's our refund policy for annual plans?";
// refund-policy.md, first bullet, verbatim.
export const PASSAGE_FULL =
	"Annual plans are eligible for a full refund within 30 days of purchase.";
export const PASSAGE_TRUNC =
	"Annual plans are eligible for a full refund within 30 days…";

// Four of the corpus's 17 documents. Rows 0 and 2 are the Q&A flow's
// authored hits (refund-policy top match, billing-faq supporting).
export const KB_DOCS = [
	"refund-policy.md",
	"pricing-faq.md",
	"billing-faq.md",
	"onboarding-guide.md",
] as const;
// [docRow, chunkCol] of the two retrieved passages.
export const HIT_TOP: [number, number] = [0, 0];
export const HIT_SUPPORT: [number, number] = [2, 1];

// ---------------------------------------------------------------------------
// Block/edge visual state (same vocabulary as module-5).
// ---------------------------------------------------------------------------
export type BlockVis = {
	opacity?: number;
	dim?: number;
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
};
const visOpacity = (v?: BlockVis) => (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));

type EdgeVis = {progress?: number; hi?: number; opacity?: number};

const LaneEdge: React.FC<{i: 0 | 1} & EdgeVis> = ({i, progress = 1, hi = 0, opacity = 1}) => (
	<svg
		width={STAGE_W}
		height={STAGE_H}
		viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
		style={{position: "absolute", inset: 0, opacity, pointerEvents: "none"}}
	>
		<SimEdgePath
			x1={edgeX1(i)}
			y1={CHAIN_EDGE_Y}
			x2={edgeX2(i)}
			y2={CHAIN_EDGE_Y}
			progress={progress}
			color={edgeColor(hi, usePalette())}
			thickness={2.25 + 1.25 * hi}
		/>
	</svg>
);

// ---------------------------------------------------------------------------
// The set piece: the docs' SUPPORT_KB_WORKFLOW, verbatim rows
// (examples.ts), plus the real block's "Knowledge Base" param row
// (apps/sim/blocks/blocks/knowledge.ts subBlock title).
// ---------------------------------------------------------------------------
type KbChainProps = {
	start?: BlockVis;
	knowledge?: BlockVis;
	agent?: BlockVis;
	edge1?: EdgeVis;
	edge2?: EdgeVis;
	/** The actual customer question resolving into Start's Input row. */
	inputResolve?: {text: string; mix: number};
	/** Glow on the Knowledge Base row's value (the block points at the base). */
	kbRowGlow?: number;
	queryGlow?: number;
	/** <start.input> in the Query row resolving to the question. */
	queryResolve?: {text: string; mix: number};
	msgGlow?: number;
	/** <knowledge.results> in the Messages row resolving to the passage. */
	msgResolve?: {text: string; mix: number};
};

export const KbChain: React.FC<KbChainProps> = ({
	start,
	knowledge,
	agent,
	edge1,
	edge2,
	inputResolve,
	kbRowGlow = 0,
	queryGlow = 0,
	queryResolve,
	msgGlow = 0,
	msgResolve,
}) => {
	const inputValue = inputResolve ? (
		<DipSwap a="Customer question" b={inputResolve.text} mix={inputResolve.mix} />
	) : (
		"Customer question"
	);

	return (
		<>
			<LaneEdge i={0} {...edge1} />
			<LaneEdge i={1} {...edge2} />
			<div style={{position: "absolute", left: blockX(0), top: CHAIN_Y, opacity: visOpacity(start)}}>
				<SimBlock
					name="Start"
					color={BLOCK_COLORS.start}
					glyph={<StartGlyphW size={22} />}
					rows={[{title: "Input", value: inputValue}]}
					hideTargetHandle
					highlighted={start?.highlighted}
					state={start?.state}
				/>
			</div>
			<div
				style={{position: "absolute", left: blockX(1), top: CHAIN_Y, opacity: visOpacity(knowledge)}}
			>
				<SimBlock
					name="Knowledge"
					color={BLOCK_COLORS.knowledge}
					glyph={<DatabaseGlyphW size={22} />}
					rows={[
						{title: "Operation", value: "Search"},
						{title: "Knowledge Base", value: <Tag text={KB_NAME} glow={kbRowGlow} />},
						{
							title: "Query",
							value: (
								<ResolvedTag
									tag="<start.input>"
									value={queryResolve?.text ?? ""}
									glow={queryGlow}
									resolve={queryResolve?.mix ?? 0}
								/>
							),
						},
					]}
					highlighted={knowledge?.highlighted}
					state={knowledge?.state}
				/>
			</div>
			<div style={{position: "absolute", left: blockX(2), top: CHAIN_Y, opacity: visOpacity(agent)}}>
				<SimBlock
					name="Agent"
					color={BLOCK_COLORS.agent}
					glyph={<AgentGlyphW size={22} />}
					rows={[
						{
							title: "Messages",
							value: (
								// Docs: "Answer from <knowledge.results>". The prefix doesn't fit
								// at block width without truncating the reference itself, so the
								// row carries the tag and the chat bubble carries the full
								// authored line (module-5 precedent: row compact, bubble verbose).
								<ResolvedTag
									tag="<knowledge.results>"
									value={msgResolve?.text ?? ""}
									glow={msgGlow}
									resolve={msgResolve?.mix ?? 0}
								/>
							),
						},
						{title: "Model", value: "claude-sonnet-4-6"},
					]}
					hideSourceHandle
					highlighted={agent?.highlighted}
					state={agent?.state}
				/>
			</div>
		</>
	);
};

// ---------------------------------------------------------------------------
// The knowledge-base aside (scenes 2–4): overlay panel in the established
// aside chrome (ChatPanel's #1e1e1e/#333 palette), KBIcon header, doc count
// badge. Documents and passage cards are positioned via layoutV2 helpers;
// every animated value enters as a numeric prop.
// ---------------------------------------------------------------------------
const FONT =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif';

export type ChunkVis = {
	reveal: number; // 0..1 — slide-in (null at 0)
	pulse?: number; // 0..1 — comparison blip (scale)
	ring?: number; // 0..1 — selection ring (a retrieved passage)
	dim?: number; // 0..1 — fades toward 0.35 (not among the closest)
};

type KbPanelProps = {
	opacity?: number;
	/** 0..1 entrance — panel rises slightly as it appears. */
	slide?: number;
	/** 0 = doc column centered (scene 2), 1 = left column (scenes 3–4). */
	docSlide?: number;
	/** Per-document reveal. */
	docReveal?: (i: number) => number;
	/** Per-document selection ring (source of a retrieved passage). */
	docRing?: (i: number) => number;
	/** Per-document dim toward 0.5 (not a source). */
	docDim?: (i: number) => number;
	/** Per-passage visual state; chunks[i][j] for doc i, column j. */
	chunks?: (i: number, j: number) => ChunkVis;
};

const ZERO_CHUNK: ChunkVis = {reveal: 0};

export const KbPanel: React.FC<KbPanelProps> = ({
	opacity = 1,
	slide = 1,
	docSlide = 0,
	docReveal = () => 1,
	docRing = () => 0,
	docDim = () => 0,
	chunks = () => ZERO_CHUNK,
}) => {
	const dy = (1 - slide) * 28;
	return (
		<div style={{position: "absolute", inset: 0, opacity, pointerEvents: "none"}}>
			{/* Panel chrome */}
			<div
				style={{
					position: "absolute",
					left: KB_PANEL.x,
					top: KB_PANEL.y + dy,
					width: KB_PANEL.w,
					height: KB_PANEL.h,
					backgroundColor: "#1e1e1e",
					border: "1px solid #333333",
					borderRadius: 14,
					boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
					boxSizing: "border-box",
					padding: 24,
				}}
			>
				<div style={{display: "flex", alignItems: "center", height: 40, gap: 12}}>
					<KBIcon size={28} color={COLORS.knowledge} />
					<span style={{fontFamily: FONT, fontWeight: 500, fontSize: 24, color: COLORS.text}}>
						{KB_NAME}
					</span>
					<div style={{flex: 1}} />
					<div
						style={{
							fontFamily: FONT,
							fontWeight: 500,
							fontSize: 18,
							color: COLORS.textTertiary,
							backgroundColor: COLORS.surface4,
							border: `1px solid ${COLORS.border}`,
							borderRadius: RADIUS.xs,
							padding: "4px 10px",
						}}
					>
						{KB_DOC_COUNT} docs
					</div>
				</div>
			</div>

			{/* Documents */}
			{KB_DOCS.map((name, i) => {
				const r = docReveal(i);
				if (r <= 0) return null;
				const ring = docRing(i);
				const dim = docDim(i);
				return (
					<div
						key={name}
						style={{
							position: "absolute",
							left: docX(docSlide),
							top: docY(i) + dy + (1 - Math.min(1, r)) * 10,
							width: DOC_W,
							opacity: r * (1 - 0.5 * dim),
						}}
					>
						<DocumentCard kind="md" name={name} size="sm" width={DOC_W} />
						{ring > 0 ? (
							<div
								style={{
									position: "absolute",
									inset: 0,
									borderRadius: RADIUS.sm,
									boxShadow: "inset 0 0 0 2px #33b4ff",
									opacity: ring,
								}}
							/>
						) : null}
					</div>
				);
			})}

			{/* Passages — two per document, beside its row */}
			{KB_DOCS.map((name, i) =>
				([0, 1] as const).map((j) => {
					const v = chunks(i, j);
					if (v.reveal <= 0) return null;
					const pulse = Math.sin(Math.min(1, Math.max(0, v.pulse ?? 0)) * Math.PI);
					return (
						<div
							key={`${name}-${j}`}
							style={{
								position: "absolute",
								left: chunkX(j),
								top: chunkY(i) + dy,
								width: CHUNK_W,
								opacity: v.reveal * (1 - 0.65 * (v.dim ?? 0)),
								transform: `translateX(${-24 * (1 - Math.min(1, v.reveal))}px) scale(${1 + 0.04 * pulse})`,
							}}
						>
							<ChunkCard lines={3} width={CHUNK_W} seed={i * 2 + j + 1} />
							{(v.ring ?? 0) > 0 ? (
								<div
									style={{
										position: "absolute",
										inset: 0,
										borderRadius: RADIUS.sm,
										boxShadow: "inset 0 0 0 2px #33b4ff",
										opacity: v.ring,
									}}
								/>
							) : null}
						</div>
					);
				}),
			)}

		</div>
	);
};
