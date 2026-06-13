import React from "react";
import {interpolateColors, spring} from "remotion";
import {COLORS, useCanvasDotsEnabled, usePalette} from "../theme";

/**
 * Spring-driven entrance value with a guaranteed exact landing: 0 before
 * `delaySec`, springs (slight organic overshoot) over `durSec`, and is
 * clamped to EXACTLY 1 afterwards — so boundary frames stay pixel-exact.
 * Use for transforms (translate/scale) on transient elements, never for
 * layout heights (those keep the exact-natural-height machinery).
 */
export const popIn = (
	frame: number,
	fps: number,
	delaySec: number,
	durSec = 0.6,
): number => {
	const f = frame - delaySec * fps;
	if (f <= 0) return 0;
	const dur = durSec * fps;
	if (f >= dur) return 1;
	return spring({frame: f, fps, durationInFrames: dur, config: {damping: 14, stiffness: 160}});
};

// Shared canvas-scene vocabulary, promoted from module-1-workflows once the
// agents module needed the same pieces. The builder-canvas dot grid, the
// <block.field> reference tag, and the packet-on-wire data pill.

/** Builder canvas: the docs preview's ReactFlow dots background, scaled up. */
export const CanvasDots: React.FC<{opacity?: number}> = ({opacity = 1}) => {
	// Default OFF (founders, 2026-06-11) — enable per render with
	// --props='{"theme":"dark","dots":true}'.
	const enabled = useCanvasDotsEnabled();
	if (!enabled) return null;
	return (
	<div
		style={{
			position: "absolute",
			inset: 0,
			opacity,
			backgroundImage: `radial-gradient(circle, ${COLORS.border} 1.5px, transparent 1.5px)`,
			backgroundSize: "30px 30px",
			backgroundPosition: "15px 15px",
		}}
	/>
	);
};

/**
 * <block.field> reference tag. glow 0 = plain row text; glow 1 = the editor's
 * selection-blue treatment.
 */
export const Tag: React.FC<{text: string; glow?: number}> = ({text, glow = 0}) => {
	const pal = usePalette();
	const color = interpolateColors(glow, [0, 1], [pal.text, pal.secondary]);
	return (
		<span
			style={{
				color,
				borderRadius: 4,
				padding: "0 3px",
				margin: "0 -3px",
				backgroundColor: `rgba(51, 180, 255, ${0.14 * glow})`,
			}}
		>
			{text}
		</span>
	);
};

/**
 * Data pill riding a wire (packet-on-wire language). Absorb it (fade+shrink)
 * before it overlaps the destination; if the wire is shorter than the pill,
 * use a glowing dot instead.
 */
export const DataPill: React.FC<{
	text: string;
	x: number;
	y: number;
	opacity?: number;
	scale?: number;
}> = ({text, x, y, opacity = 1, scale = 1}) => (
	<div
		style={{
			position: "absolute",
			left: x,
			top: y,
			transform: `translate(-50%, -50%) scale(${scale})`,
			opacity,
			backgroundColor: COLORS.surface2,
			border: `1px solid ${COLORS.border1}`,
			borderRadius: 999,
			padding: "7px 18px",
			fontFamily:
				'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
			fontSize: 21,
			color: COLORS.textSecondary,
			whiteSpace: "nowrap",
			boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
		}}
	>
		{text}
	</div>
);

/** Glowing dot pulse for wires too short for a pill. */
export const WireDot: React.FC<{x: number; y: number; opacity?: number}> = ({
	x,
	y,
	opacity = 1,
}) => (
	<div
		style={{
			position: "absolute",
			left: x - 6,
			top: y - 6,
			width: 12,
			height: 12,
			borderRadius: 99,
			backgroundColor: "#33b4ff",
			boxShadow: "0 0 12px rgba(51,180,255,0.8)",
			opacity,
		}}
	/>
);

/**
 * The current data-travel language: a light pulse sliding along a (straight,
 * horizontal) wire — a gradient streak with a fading tail, no cargo attached.
 * Values never ride wires; they resolve inside block rows (see DipSwap).
 * p is travel progress 0..1 from x1 to x2; the streak fades in/out at the ends.
 */
export const WirePulse: React.FC<{
	x1: number;
	x2: number;
	y: number;
	p: number;
	len?: number;
	/** Ghost copies trailing the streak (parametric motion trail). 0 = off. */
	trail?: number;
}> = ({x1, x2, y, p, len = 80, trail = 3}) => {
	if (p <= 0 || p >= 1) return null;
	// One streak at progress q; the streak lives strictly on the wire: it
	// emerges from the source handle (tail clamped at x1) and is absorbed at
	// the target. Trail copies render at slightly earlier progress with
	// falling opacity — a true motion trail, computed from the same param
	// (deterministic, no time-shifting needed).
	const streak = (q: number, opMul: number, key: number) => {
		if (q <= 0 || q >= 1) return null;
		const head = x1 + (x2 - x1) * q;
		const tail = Math.max(x1, head - len);
		const w = head - tail;
		if (w <= 0) return null;
		const op = (q > 0.82 ? (1 - q) / 0.18 : 1) * opMul;
		return (
			<div
				key={key}
				style={{
					position: "absolute",
					left: tail,
					top: y - 2,
					width: w,
					height: 4,
					borderRadius: 4,
					background: "linear-gradient(90deg, rgba(51,180,255,0), rgba(51,180,255,0.95))",
					boxShadow: opMul === 1 ? "0 0 10px rgba(51,180,255,0.45)" : undefined,
					opacity: op,
				}}
			/>
		);
	};
	return (
		<>
			{Array.from({length: trail}, (_, k) =>
				streak(p - (k + 1) * 0.045, 0.4 * (1 - k / trail), k + 1),
			)}
			{streak(p, 1, 0)}
		</>
	);
};

/**
 * Dip-swap between two row values: fades through the midpoint and comes back
 * as the other value — no layout pop, no floating text. mix 0 = a, 1 = b.
 */
export const DipSwap: React.FC<{a: React.ReactNode; b: React.ReactNode; mix: number}> = ({
	a,
	b,
	mix,
}) => (
	<span style={{opacity: Math.min(1, Math.abs(mix - 0.5) * 4)}}>{mix < 0.5 ? a : b}</span>
);

/**
 * THE reference-resolution pattern: a `<block.field>` tag that glows (it's a
 * reference), then resolves in place to its actual runtime value. The value
 * arrives tag-blue and settles toward row text while keeping a faint blue
 * residue — provenance stays visible: this text CAME FROM that reference.
 *
 * This is the core teaching move for Sim's tag system ("what does
 * <start.input> actually do?"): glow → dip → the real value, right where the
 * tag was. Use it in block rows, chat bubbles, anywhere a reference lives.
 *
 * - glow: 0..1 — selection-blue highlight on the unresolved tag
 * - resolve: 0 = tag, 1 = value (dip-swaps through the midpoint; reverting
 *   back to 0 plays the same move in reverse)
 */
export const ResolvedTag: React.FC<{
	tag: string;
	/** ReactNode so a resolved value can carry an inner glow (module-7 v2). */
	value: React.ReactNode;
	glow?: number;
	resolve?: number;
}> = ({tag, value, glow = 0, resolve = 0}) => {
	const pal = usePalette();
	const dip = Math.min(1, Math.abs(resolve - 0.5) * 4);
	if (resolve < 0.5) {
		return (
			<span style={{opacity: dip}}>
				<Tag text={tag} glow={glow} />
			</span>
		);
	}
	// Residual blueness marks provenance while resolved (floor 0.3).
	const blue = Math.max(0.3, 1 - (resolve - 0.5) * 2);
	return (
		<span
			style={{
				opacity: dip,
				color: interpolateColors(blue, [0, 1], [pal.text, pal.secondary]),
				borderRadius: 4,
				padding: "0 3px",
				margin: "0 -3px",
				backgroundColor: `rgba(51, 180, 255, ${0.14 * blue})`,
			}}
		>
			{value}
		</span>
	);
};
