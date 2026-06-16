import React from "react";
import {interpolate, interpolateColors} from "remotion";
import {usePalette, type Palette} from "../../../theme";
import {
	AgentGlyphW,
	BLOCK_COLORS,
	DatabaseGlyphW,
	DipSwap,
	ResolvedTag,
	SearchGlyphW,
	SimBlock,
	SimEdgePath,
	StartGlyphW,
	WirePulse,
	type OutputLogRow,
	type OutputNode,
	type SimBlockTool,
} from "../../../components";
import {ToolGlyph} from "../../../components/ObjectIcons";
import {
	blockLX,
	CHAIN_EDGE_LY,
	CHAIN_LEFT,
	CHAIN_SCALE,
	CHAIN_W,
	chainY,
	edgeLX1,
	edgeLX2,
} from "../layout-v2";

// ---------------------------------------------------------------------------
// Module-7 v2 set piece: the REAL beaming-polaris run, as actually run —
// Start → Triage → BuildRow → LogTicket. Every value on screen traces to
// module-5's demo-corpus/triage-run.md. Nothing from the v1 take is touched.
// ---------------------------------------------------------------------------

// The real run's values (verbatim / noted condensations — see script-v2.md).
export const RUN_INPUT_FULL =
	"I was charged twice for the Pro plan this month — please fix this. My account email is alex.johnson@zengraph3282.ai";
export const RUN_INPUT_SHORT = "I was charged twice for the Pro plan…";
export const TRIAGE_CONTENT_SHORT = "billing — Alex Johnson charged twice…";

// White glyphs for the two block kinds this chain adds (function, table) —
// same lucide sources as the product's block icons.
export const CodeGlyphW: React.FC<{size?: number}> = ({size = 22}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ffffff"
		strokeWidth="2.25"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="m16 18 6-6-6-6" />
		<path d="m8 6-6 6 6 6" />
	</svg>
);

export const TableGlyphW: React.FC<{size?: number}> = ({size = 20}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="#ffffff"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M12 3v18" />
		<rect width="18" height="18" x="3" y="3" rx="2" />
		<path d="M3 9h18" />
		<path d="M3 15h18" />
	</svg>
);

// The agent's real toolset — module-5 v3's established chips.
export const CHIP_DOCS: SimBlockTool = {
	name: "Docs",
	color: "#00B0B0",
	glyph: <DatabaseGlyphW size={14} />,
};
export const CHIP_CRM: SimBlockTool = {
	name: "CRM",
	color: "#6366F1",
	glyph: <ToolGlyph size={14} color="#ffffff" />,
};
export const CHIP_SEARCH: SimBlockTool = {
	name: "Search",
	color: "#1F40ED",
	glyph: <SearchGlyphW size={14} />,
};

// ---------------------------------------------------------------------------
// Glowing inline value — Tag's selection-blue treatment on arbitrary text.
// Used for the traced value ("billing") holding its provenance glow.
// ---------------------------------------------------------------------------
export const GlowText: React.FC<{text: string; glow?: number; base?: string}> = ({
	text,
	glow = 0,
	base = "#cccccc",
}) => (
	<span
		style={{
			color: interpolateColors(glow, [0, 1], [base, "#33b4ff"]),
			borderRadius: 4,
			padding: "0 3px",
			margin: "0 -3px",
			backgroundColor: `rgba(51, 180, 255, ${0.14 * glow})`,
		}}
	>
		{text}
	</span>
);

// ---------------------------------------------------------------------------
// The chain.
// ---------------------------------------------------------------------------
export type BlockVis = {
	opacity?: number;
	dim?: number; // 0..1 → opacity multiplier 1 → 0.35
	highlighted?: boolean;
	state?: "none" | "error" | "ok";
};

const visOpacity = (v?: BlockVis) => (v?.opacity ?? 1) * (1 - 0.65 * (v?.dim ?? 0));

export type EdgeVis = {progress?: number; opacity?: number};

const edgeColor = (hi: number, pal: Palette) =>
	interpolateColors(hi, [0, 1], [pal.wire, pal.secondary]);

const ChainEdge: React.FC<{i: 0 | 1 | 2; hi?: number} & EdgeVis> = ({
	i,
	progress = 1,
	opacity = 1,
	hi = 0,
}) => (
	<svg
		width={CHAIN_W}
		height={120}
		viewBox={`0 0 ${CHAIN_W} 120`}
		style={{position: "absolute", left: 0, top: 0, opacity, pointerEvents: "none"}}
	>
		<SimEdgePath
			x1={edgeLX1(i)}
			y1={CHAIN_EDGE_LY}
			x2={edgeLX2(i)}
			y2={CHAIN_EDGE_LY}
			progress={progress}
			color={edgeColor(hi, usePalette())}
			thickness={2.25 + 1.25 * hi}
		/>
	</svg>
);

type TicketChainProps = {
	start?: BlockVis;
	triage?: BlockVis;
	build?: BlockVis;
	ticket?: BlockVis;
	edges?: [EdgeVis, EdgeVis, EdgeVis];
	/** WirePulse travel per edge, 0..1 (0/1 = hidden). */
	pulses?: [number, number, number];
	/** The real customer message resolving into Start's Input row. */
	inputResolve?: number;
	/** Triage's <start.message> tag resolving (ResolvedTag mix). */
	msgResolve?: number;
	msgGlow?: number;
	/** LogTicket's <buildRow.result> tag resolving to the category. */
	dataResolve?: number;
	dataGlow?: number;
	/** Selection ring per tool chip (CRM, Docs, Search order = chips order). */
	chipRings?: {docs?: number; crm?: number; search?: number};
};

/** The whole persistent set piece. Scenes pass state props only; geometry
 *  comes from layout-v2 and the wrapper is scaled as a unit. */
export const TicketChain: React.FC<TicketChainProps & {glide?: number}> = ({
	start,
	triage,
	build,
	ticket,
	edges = [{}, {}, {}],
	pulses = [0, 0, 0],
	inputResolve = 0,
	msgResolve = 0,
	msgGlow = 0,
	dataResolve = 0,
	dataGlow = 0,
	chipRings = {},
	glide = 1,
}) => (
	<div
		style={{
			position: "absolute",
			left: CHAIN_LEFT,
			top: chainY(glide),
			width: CHAIN_W,
			transform: `scale(${CHAIN_SCALE})`,
			transformOrigin: "top left",
		}}
	>
		<ChainEdge i={0} {...edges[0]} />
		<ChainEdge i={1} {...edges[1]} />
		<ChainEdge i={2} {...edges[2]} />

		<div style={{position: "absolute", left: blockLX(0), top: 0, opacity: visOpacity(start)}}>
			<SimBlock
				name="Start"
				color={BLOCK_COLORS.start}
				glyph={<StartGlyphW size={22} />}
				rows={[
					{
						title: "Input",
						value: <DipSwap a="message" b={RUN_INPUT_SHORT} mix={inputResolve} />,
					},
				]}
				hideTargetHandle
				highlighted={start?.highlighted}
				state={start?.state}
			/>
		</div>

		<div style={{position: "absolute", left: blockLX(1), top: 0, opacity: visOpacity(triage)}}>
			<SimBlock
				name="Triage"
				color={BLOCK_COLORS.agent}
				glyph={<AgentGlyphW size={22} />}
				rows={[
					{
						title: "Messages",
						value: (
							<>
								{"Classify: "}
								<ResolvedTag
									tag="<start.message>"
									value={RUN_INPUT_SHORT}
									glow={msgGlow}
									resolve={msgResolve}
								/>
							</>
						),
					},
					{title: "Model", value: "claude-sonnet-4-6"},
				]}
				tools={[
					{...CHIP_DOCS, ring: chipRings.docs ?? 0},
					{...CHIP_CRM, ring: chipRings.crm ?? 0},
					{...CHIP_SEARCH, ring: chipRings.search ?? 0},
				]}
				highlighted={triage?.highlighted}
				state={triage?.state}
			/>
		</div>

		<div style={{position: "absolute", left: blockLX(2), top: 0, opacity: visOpacity(build)}}>
			<SimBlock
				name="BuildRow"
				color={BLOCK_COLORS.function}
				glyph={<CodeGlyphW size={22} />}
				rows={[
					{title: "Language", value: "JavaScript"},
					{title: "Code", value: "return { message, category, … }"},
				]}
				highlighted={build?.highlighted}
				state={build?.state}
			/>
		</div>

		<div style={{position: "absolute", left: blockLX(3), top: 0, opacity: visOpacity(ticket)}}>
			<SimBlock
				name="LogTicket"
				color={BLOCK_COLORS.table}
				glyph={<TableGlyphW size={20} />}
				rows={[
					{title: "Table", value: "support_tickets"},
					{
						title: "Data",
						value: (
							<ResolvedTag
								tag="<buildRow.result>"
								value={
									<>
										{"{ category: "}
										<GlowText text={'"billing"'} glow={dataGlow} base="#e6e6e6" />
										{", … }"}
									</>
								}
								glow={0}
								resolve={dataResolve}
							/>
						),
					},
				]}
				hideSourceHandle
				highlighted={ticket?.highlighted}
				state={ticket?.state}
			/>
		</div>

		{pulses.map((p, i) =>
			p > 0 && p < 1 ? (
				<WirePulse
					key={i}
					x1={edgeLX1(i as 0 | 1 | 2)}
					x2={edgeLX2(i as 0 | 1 | 2)}
					y={CHAIN_EDGE_LY}
					p={p}
				/>
			) : null,
		)}
	</div>
);

// ---------------------------------------------------------------------------
// Run choreography over 4 blocks (scene 1's single traversal): the real
// message resolves into Start, the pulse walks the three edges, Triage holds
// its live ring (the block where the real 12.2s went), BuildRow blips,
// LogTicket's Data tag resolves to the category and the block settles ok —
// then everything reverts to template.
// ---------------------------------------------------------------------------
export type RunBeats4 = {
	inputMix: number;
	startLive: boolean;
	pulse1: number;
	triLive: boolean;
	msgMix: number;
	pulse2: number;
	buildLive: boolean;
	pulse3: number;
	dataMix: number;
	ticketOk: boolean;
	end: number;
};

export const runBeats4 = (t: number, a: number, opts: {triDur?: number} = {}): RunBeats4 => {
	const triDur = opts.triDur ?? 1.6;
	const c = (lo: number, hi: number, l2 = 0, h2 = 1) =>
		interpolate(t, [lo, hi], [l2, h2], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

	const t1 = a + 0.5; // pulse 1 departs
	const tTri = a + 1.05; // Triage live
	const t2 = tTri + triDur; // pulse 2 departs
	const tBuild = t2 + 0.6; // BuildRow live (blip)
	const t3 = tBuild + 0.45; // pulse 3 departs
	const tData = t3 + 0.62; // Data tag resolves
	const revertAt = tData + 1.5;

	return {
		inputMix: Math.min(c(a, a + 0.35), c(revertAt, revertAt + 0.35, 1, 0)),
		startLive: t >= a + 0.2 && t < a + 0.65,
		pulse1: c(t1, t1 + 0.6),
		triLive: t >= tTri && t < tTri + triDur,
		msgMix: Math.min(c(tTri - 0.05, tTri + 0.35), c(revertAt, revertAt + 0.35, 1, 0)),
		pulse2: c(t2, t2 + 0.6),
		buildLive: t >= tBuild - 0.05 && t < tBuild + 0.4,
		pulse3: c(t3, t3 + 0.6),
		dataMix: Math.min(c(tData, tData + 0.35), c(revertAt, revertAt + 0.35, 1, 0)),
		ticketOk: t >= tData - 0.05 && t < revertAt,
		end: revertAt + 0.35,
	};
};

// ---------------------------------------------------------------------------
// The record panel's content — the run log (REAL durations) and the per-block
// trees the trace walks. Builders take 0..1 mixes so scenes stay declarative.
// ---------------------------------------------------------------------------

/** The four log rows in run order. selected = per-row 0..1 mixes. */
export const buildLogRows = (opts: {
	reveals?: [number, number, number, number];
	selected?: [number, number, number, number];
	triageDurationGlow?: number;
}): OutputLogRow[] => {
	const {reveals = [1, 1, 1, 1], selected = [0, 1, 0, 0], triageDurationGlow = 0} = opts;
	return [
		{
			name: "Start",
			color: BLOCK_COLORS.start,
			glyph: <StartGlyphW size={11} />,
			duration: "32ms",
			reveal: reveals[0],
			selected: selected[0],
		},
		{
			name: "Triage",
			color: BLOCK_COLORS.agent,
			glyph: <AgentGlyphW size={11} />,
			duration: (
				<span
					style={{
						color: interpolateColors(triageDurationGlow, [0, 1], ["#787878", "#33b4ff"]),
					}}
				>
					12.2s
				</span>
			),
			reveal: reveals[1],
			selected: selected[1],
		},
		{
			name: "BuildRow",
			color: BLOCK_COLORS.function,
			glyph: <CodeGlyphW size={12} />,
			duration: "115ms",
			reveal: reveals[2],
			selected: selected[2],
		},
		{
			name: "LogTicket",
			color: BLOCK_COLORS.table,
			glyph: <TableGlyphW size={11} />,
			duration: "111ms",
			reveal: reveals[3],
			selected: selected[3],
		},
	];
};

/** Triage's full output tree — the real bundle (content · tokens ·
 *  toolCalls), module-5's record shape. All values from triage-run.md.
 *  (cost deliberately left out — curriculum: keep light on costs.) */
export const triageTree = (opts: {
	reveals?: [number, number, number]; // content, tokens, toolCalls
	toolCallsHi?: number;
	callHi?: [number, number, number];
	tokensHi?: number;
	opacity?: number;
}): OutputNode[] => {
	const {
		reveals = [1, 1, 1],
		toolCallsHi = 0,
		callHi = [0, 0, 0],
		tokensHi = 0,
		opacity = 1,
	} = opts;
	return [
		{
			key: "content",
			type: "string",
			value: TRIAGE_CONTENT_SHORT,
			reveal: reveals[0] * opacity,
		},
		{
			key: "tokens",
			type: "object",
			highlight: tokensHi,
			children: [
				{key: "input", type: "number", value: "5074"},
				{key: "output", type: "number", value: "431"},
			],
			reveal: reveals[1] * opacity,
		},
		{
			key: "toolCalls",
			type: "array",
			highlight: toolCallsHi,
			children: [
				{
					key: "[0] customerLookup",
					type: "object",
					value: "375ms · 1 account",
					highlight: callHi[0],
				},
				{
					key: "[1] knowledge_search",
					type: "object",
					value: "457ms · 0 results",
					highlight: callHi[1],
				},
				{
					key: "[2] knowledge_search",
					type: "object",
					value: "540ms · 0 results",
					highlight: callHi[2],
				},
			],
			reveal: reveals[2] * opacity,
		},
	];
};

// ── The trace's per-block trees (scene 4) ───────────────────────────────────

/** LogTicket · Input — what it wrote came from <buildRow.result>. */
export const logTicketInputTree = (opts: {
	opacity?: number;
	tagGlow?: number;
	resolve?: number;
	billingGlow?: number;
}): OutputNode[] => {
	const {opacity = 1, tagGlow = 0, resolve = 0, billingGlow = 0} = opts;
	return [
		{key: "table", type: "string", value: "support_tickets", reveal: opacity},
		{
			key: "data",
			type: "object",
			value: (
				<ResolvedTag
					tag="<buildRow.result>"
					value={
						<>
							{"{ category: "}
							<GlowText text={'"billing"'} glow={billingGlow} />
							{", … }"}
						</>
					}
					glow={tagGlow}
					resolve={resolve}
				/>
			),
			reveal: opacity,
		},
	];
};

/** BuildRow · Input — it read <triage.content>. */
export const buildRowInputTree = (opts: {
	opacity?: number;
	tagGlow?: number;
	resolve?: number;
	billingGlow?: number;
}): OutputNode[] => {
	const {opacity = 1, tagGlow = 0, resolve = 0, billingGlow = 0} = opts;
	return [
		{
			key: "content",
			type: "string",
			value: (
				<ResolvedTag
					tag="<triage.content>"
					value={
						<>
							<GlowText text="billing" glow={billingGlow} />
							{" — Alex Johnson charged twice…"}
						</>
					}
					glow={tagGlow}
					resolve={resolve}
				/>
			),
			reveal: opacity,
		},
	];
};

/** Triage · Input — its prompt read <start.message>. */
export const triageInputTree = (opts: {
	opacity?: number;
	tagGlow?: number;
	resolve?: number;
}): OutputNode[] => {
	const {opacity = 1, tagGlow = 0, resolve = 0} = opts;
	return [
		{
			key: "messages",
			type: "string",
			value: (
				<>
					{"Classify: "}
					<ResolvedTag
						tag="<start.message>"
						value={RUN_INPUT_SHORT}
						glow={tagGlow}
						resolve={resolve}
					/>
				</>
			),
			reveal: opacity,
		},
	];
};

/** Start · Output — the run's origin: the message itself. */
export const startOutputTree = (opts: {opacity?: number}): OutputNode[] => [
	{key: "message", type: "string", value: RUN_INPUT_FULL, reveal: opts.opacity ?? 1},
];
