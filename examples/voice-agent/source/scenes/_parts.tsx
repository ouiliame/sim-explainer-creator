import React from "react";
import {interpolate} from "remotion";
import {COLORS, EASING} from "../../../theme";

// ───────────────────────────────────────────────────────────────────────────
// Aside-band parts for "The Voice Agent" take 2. The call panel + waveform
// are ported from take 1 (hype/voice-agent:_parts.tsx) — the director graded
// the panels GOOD; only their PLACEMENT was wrong. They are chat-bubble
// aside grammar: surface2/border1 cards, skeleton-line language, the
// blue→green state ramp. Every value is frame-derived; nothing here invents
// a run value — agent turns are authored config (the registry greeting),
// human turns are skeleton bars, outcomes are state stamps with config
// labels. See ../script-v1.md (truth contract).
//
// Take 1's invented OutcomeTable is GONE — take 2 records outcomes in the
// real SimTable (components/SimTable, the verbatim product port).
// ───────────────────────────────────────────────────────────────────────────

const FONT =
	'ui-sans-serif, -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif';
const MONO =
	'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace';

const GREEN = "#22c55e";
// AgentPhone's real chip is a dark green->black gradient; the accent green
// is derived from it (linear-gradient(135deg,#1a1a1a,#0a2a14)).
const PHONE_ACCENT = "#2fd16a";

/** AgentPhone block glyph (white), ported from apps/sim/components/icons.tsx
 *  AgentPhoneIcon, simplified to the white speech-bubble silhouette. */
export const AgentPhoneGlyphW: React.FC<{size?: number}> = ({size = 24}) => (
	<svg width={size} height={size} viewBox="0 0 236 240" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M113.144 79.3516C126.849 79.3516 138.665 80.2967 143.628 85.2591C149.299 90.9306 151.662 103.455 151.662 120.705C151.662 129.921 150.481 136.538 146.936 141.737C140.32 151.19 119.761 154.734 95.6569 155.443C76.8148 155.443 70.5663 153.611 66.7692 149.046L66.5903 148.827C61.8642 143.628 59.501 129.922 58.7921 114.089C58.7921 108.181 59.0286 100.147 61.3917 95.1842C64.5966 88.3165 68.9105 86.1058 77.5557 83.611L78.4062 83.3683C89.5331 80.0303 104.452 79.3516 113.144 79.3516ZM92.3822 114.379C91.7601 109.217 89.9576 101.341 83.841 101.568C78.406 102.041 75.3339 107.948 76.0428 116.455C76.5154 122.599 79.115 129.216 84.3137 129.216C91.6341 129.704 92.9389 121.325 92.5283 115.743C92.5003 115.363 92.4465 114.913 92.3822 114.379ZM119.287 112.166C118.753 106.772 120.089 97.9051 126.849 97.3172C133.466 97.5536 135.829 106.769 136.065 112.204C136.302 116.222 135.593 120.948 133.23 123.311C131.575 125.201 127.322 125.674 124.959 124.02C121.501 122.176 119.842 116.731 119.325 112.517L119.287 112.166ZM106.078 135.137C104.869 135.173 103.537 135.175 102.037 135.128C101.584 135.128 101.069 135.084 100.534 135.039C98.2803 134.848 95.657 134.627 95.6569 137.491C95.6569 141.508 100.855 144.58 107.235 145.053C115.506 145.289 120.941 139.382 120.705 136.31C120.705 134.656 119.76 133.001 117.633 133.474C117.046 133.591 116.481 133.709 115.927 133.824C112.836 134.466 109.926 135.019 106.078 135.137Z"
			fill="white"
		/>
		<path
			d="M17.9127 164.383C18.008 173.453 21.1026 182.054 26.8907 189C37.0521 200.815 55.9566 210.504 79.5873 211.922C83.1319 212.158 87.1496 211.685 90.2217 210.976C98.4924 208.85 103.455 202.705 103.455 195.143C103.455 188.999 98.9651 179.311 85.9683 177.657C70.773 176.441 55.4867 174.057 45.3225 161.351C51.7029 165.369 62.5734 169.858 81.2419 170.567C90.4497 170.567 95.3749 172.384 103.441 175.613L103.641 175.389C111.111 167.007 116.993 160.406 128.031 160.406C134.033 160.256 138.129 162.487 141.046 164.076C142.723 164.99 144.011 165.691 145.046 165.605C148.355 165.367 164.66 145.045 168.677 132.994C169.297 130.926 169.375 129.22 169.384 128.509C169.393 126.948 167.209 125.547 165.778 124.629C165.526 124.468 165.311 124.33 165.131 124.207C164.405 123.712 163.73 123.251 163.242 122.832C158.752 119.524 154.971 114.089 154.971 108.417C154.971 99.4375 160.879 86.9131 167.968 75.334C164.991 67.5485 159.13 58.2099 147.374 53.7683L146.809 53.5606C133.948 49.0707 118.229 48.4536 104.637 49.8128L106.527 36.8154C109.599 35.8702 113.616 33.0344 113.616 27.8357C113.849 23.1833 109.96 18.073 103.978 17.9145L103.691 17.9105C98.0199 17.9105 94.0026 22.4008 93.53 26.8907C93.2939 31.3804 96.1297 34.9247 99.438 36.5788L97.3111 49.8128C87.8587 50.5217 78.8788 51.4668 68.9538 53.3573C61.8583 54.8852 54.5424 56.4829 47.9859 59.7016C39.4376 63.9402 32.7425 69.8213 29.2533 79.8238C25.7086 88.0947 24.7636 105.582 24.5273 123.069L25.2361 141.265C20.979 148.205 17.9106 155.63 17.9105 163.95L17.9127 164.383Z"
			fill="white"
		/>
	</svg>
);

/** Table block glyph (white) — lucide table, the product TableIcon port
 *  (same path as module-2-tables / use-cases). */
export const TableGlyphW: React.FC<{size?: number}> = ({size = 22}) => (
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
		<rect width="18" height="18" x="3" y="3" rx="2" />
		<path d="M3 9h18" />
		<path d="M3 15h18" />
		<path d="M9 3v18" />
	</svg>
);

// ── Skeleton bar: the house "captured run-value" language (gray rounded bar).
const SKELETON = "#6b6b6b";
const Bar: React.FC<{w: number | string; h?: number; op?: number; round?: number}> = ({
	w,
	h = 12,
	op = 1,
	round = 6,
}) => (
	<div
		style={{
			width: w,
			height: h,
			borderRadius: round,
			backgroundColor: SKELETON,
			opacity: op,
		}}
	/>
);

// ── A transcript turn. Agent = authored config text (right, green tint).
// Human = skeleton bars (left). reveal 0..1 rises the bubble in.
export type Turn =
	| {kind: "agent"; text: string; reveal?: number}
	| {kind: "human"; lines: (number | string)[]; reveal?: number};

const bubbleFade = (r: number): React.CSSProperties => ({
	opacity: r,
	transform: `translateY(${(1 - Math.min(1, r)) * 12}px)`,
});

// vocab-ok: chat-bubble aside grammar (ChatPanel lineage), ported verbatim
// from take 1 (hype/voice-agent) — the panels the director graded GOOD.
const TurnRow: React.FC<{turn: Turn}> = ({turn}) => {
	const r = turn.reveal ?? 1;
	if (r <= 0) return null;
	if (turn.kind === "agent") {
		return (
			<div style={{display: "flex", justifyContent: "flex-end", ...bubbleFade(r)}}>
				<div
					style={{
						maxWidth: "82%",
						backgroundColor: "rgba(47,209,106,0.14)",
						border: "1px solid rgba(47,209,106,0.32)",
						borderRadius: 18,
						borderBottomRightRadius: 6,
						padding: "12px 16px",
						fontFamily: FONT,
						fontSize: 21,
						lineHeight: 1.32,
						color: "#dff5e6",
					}}
				>
					{turn.text}
				</div>
			</div>
		);
	}
	return (
		<div style={{display: "flex", justifyContent: "flex-start", ...bubbleFade(r)}}>
			<div
				style={{
					width: "62%",
					backgroundColor: COLORS.chipBg,
					border: `1px solid ${COLORS.border1}`,
					borderRadius: 18,
					borderBottomLeftRadius: 6,
					padding: "16px 18px",
					display: "flex",
					flexDirection: "column",
					gap: 11,
				}}
			>
				{turn.lines.map((w, i) => (
					<Bar key={i} w={w} h={13} op={0.92} />
				))}
			</div>
		</div>
	);
};

// ── Live waveform: bar heights animate from a frame-derived sine while
// `active` (the agent is speaking); flatlines to a thin baseline when
// listening. `seed` de-phases panels. Generated MOTION, not data — declared
// in script-v1.md.
const Waveform: React.FC<{
	frame: number;
	active: number; // 0 listening (flat), 1 speaking (full amplitude)
	seed: number;
	width: number;
	color?: string;
}> = ({frame, active, seed, width, color = PHONE_ACCENT}) => {
	const N = 28;
	const gap = 4;
	const bw = (width - (N - 1) * gap) / N;
	const maxH = 56;
	const amp = Math.max(0, Math.min(1, active));
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap,
				height: maxH,
			}}
		>
			{Array.from({length: N}, (_, i) => {
				// Deterministic per-bar pseudo-amplitude — three out-of-phase sines.
				const t = frame / 9;
				const a =
					0.5 +
					0.32 * Math.sin(t + i * 0.7 + seed * 2.1) +
					0.18 * Math.sin(t * 1.7 - i * 0.42 + seed) +
					0.12 * Math.sin(t * 0.6 + i * 1.3 + seed * 3.3);
				const env = Math.max(0.06, Math.min(1, a));
				const h = maxH * (0.06 + (env - 0.06) * amp);
				return (
					<div
						key={i}
						style={{
							width: bw,
							height: h,
							borderRadius: bw,
							backgroundColor: color,
							opacity: 0.45 + 0.55 * amp,
						}}
					/>
				);
			})}
		</div>
	);
};

// ── The call panel (the loved aside). A SEPARATE box in the aside band —
// never inside the container, never over a block. Driven entirely by props.
export type CallPanelProps = {
	x: number;
	y: number;
	w: number;
	h: number;
	opacity?: number;
	/** Masked destination, e.g. "+1 415 ··· 4288" (authored stand-in). */
	dest: string;
	/** 0..1 brightness of the pulsing live dot; 0 when the call ended. */
	livePulse: number;
	ended?: boolean; // dot goes solid green
	turns: Turn[];
	frame: number;
	speaking: number; // waveform amplitude 0..1
	seed: number;
	/** Outcome stamp: label is config-template language; reveal 0..1. */
	outcome?: {label: string; reveal: number};
	dim?: number; // 0..1 opacity multiplier for de-focus
};

// vocab-ok: the take-1 call panel (hype/voice-agent:_parts.tsx) — aside
// grammar the director graded GOOD; only its placement was corrected.
export const CallPanel: React.FC<CallPanelProps> = ({
	x,
	y,
	w,
	h,
	opacity = 1,
	dest,
	livePulse,
	ended = false,
	turns,
	frame,
	speaking,
	seed,
	outcome,
	dim = 1,
}) => {
	const pad = Math.round(w * 0.05);
	const headerH = 78;
	const waveH = 96;
	const dotColor = ended ? GREEN : "#ff5a5a";
	const dotGlow = ended ? 0.55 : 0.25 + 0.6 * livePulse;
	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: w,
				height: h,
				opacity: opacity * dim,
				backgroundColor: COLORS.surface2,
				border: `1px solid ${COLORS.border1}`,
				borderRadius: 16,
				boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Header: live dot + masked destination + ⟨pending⟩ duration pill */}
			<div
				style={{
					height: headerH,
					flexShrink: 0,
					padding: `0 ${pad}px`,
					display: "flex",
					alignItems: "center",
					gap: 14,
					borderBottom: `1px solid ${COLORS.border1}`,
				}}
			>
				<div
					style={{
						width: 14,
						height: 14,
						borderRadius: 99,
						backgroundColor: dotColor,
						boxShadow: `0 0 ${10 + 14 * dotGlow}px ${dotColor}`,
						flexShrink: 0,
					}}
				/>
				<span
					style={{
						fontFamily: MONO,
						fontSize: 23,
						color: COLORS.textSecondary,
						letterSpacing: 0.5,
					}}
				>
					{dest}
				</span>
				<div style={{marginLeft: "auto"}}>
					<Bar w={56} h={18} round={9} op={0.7} />
				</div>
			</div>

			{/* Transcript stream — newest at the bottom, pinned. */}
			<div
				style={{
					flex: 1,
					minHeight: 0,
					padding: `${Math.round(pad * 0.8)}px ${pad}px`,
					display: "flex",
					flexDirection: "column",
					justifyContent: "flex-end",
					gap: 14,
				}}
			>
				{turns.map((t, i) => (
					<TurnRow key={i} turn={t} />
				))}
			</div>

			{/* Waveform footer (the agent's voice) + outcome stamp overlay */}
			<div
				style={{
					height: waveH,
					flexShrink: 0,
					padding: `0 ${pad}px`,
					borderTop: `1px solid ${COLORS.border1}`,
					display: "flex",
					alignItems: "center",
					position: "relative",
				}}
			>
				<Waveform frame={frame} active={speaking} seed={seed} width={w - 2 * pad} />
				{outcome && outcome.reveal > 0 ? (
					<OutcomeStamp label={outcome.label} reveal={outcome.reveal} />
				) : null}
			</div>
		</div>
	);
};

// ── Outcome stamp: green ✓ + a short config-template label. Lands over the
// waveform footer when the call resolves. Two surfaces, one event with the
// table row (ResolvedTag discipline).
const OutcomeStamp: React.FC<{label: string; reveal: number}> = ({label, reveal}) => {
	const r = interpolate(reveal, [0, 1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				opacity: r,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 12,
					backgroundColor: "rgba(34,197,94,0.16)",
					border: "1px solid rgba(34,197,94,0.5)",
					borderRadius: 999,
					padding: "10px 22px",
					transform: `scale(${0.86 + 0.14 * r})`,
				}}
			>
				<CheckGlyph size={24} />
				<span style={{fontFamily: FONT, fontSize: 24, fontWeight: 600, color: "#bdf0cd"}}>
					{label}
				</span>
			</div>
		</div>
	);
};

export const CheckGlyph: React.FC<{size?: number; color?: string}> = ({
	size = 22,
	color = GREEN,
}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none">
		<path
			d="M5 12.5l4.2 4.2L19 7"
			stroke={color}
			strokeWidth={2.6}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
