import React from "react";
import {ObjectNode, WirePulse, type ObjectKind} from "../../../components";
import {
	HUB_CENTER,
	SPOKES,
	spokeAngle,
	spokeCenter,
	spokeSpan,
	STAGE_H,
	STAGE_W,
	TILE,
} from "../layout-v2";

// Intro v2 set-piece helpers. The set piece is the workspace tile field;
// scenes position tiles via layout-v2 helpers and express state through the
// props here. Nothing in this file owns geometry.

/** One tile of the field. Renders null at opacity 0 (never an invisible
 *  element). `ring` is the product's blue selection ring, 0..1. */
export const FieldTile: React.FC<{
	kind: ObjectKind;
	x: number;
	y: number;
	opacity?: number;
	ring?: number;
}> = ({kind, x, y, opacity = 1, ring = 0}) => {
	if (opacity <= 0) return null;
	return (
		<div style={{position: "absolute", left: x, top: y, opacity}}>
			<ObjectNode kind={kind} />
			{ring > 0 ? (
				<div
					style={{
						position: "absolute",
						inset: -6,
						borderRadius: 13,
						border: "2px solid #33b4ff",
						opacity: ring,
					}}
				/>
			) : null}
		</div>
	);
};

/** The hub's spoke lines, drawn center-to-center behind the tiles (the
 *  module-1 treatment). `draw(i)` is per-spoke progress 0..1 — at 0 the
 *  spoke is not in the tree. */
export const SpokeLines: React.FC<{draw: (i: number) => number; opacity?: number}> = ({
	draw,
	opacity = 1,
}) => (
	<svg
		width={STAGE_W}
		height={STAGE_H}
		viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
		style={{position: "absolute", inset: 0, opacity, pointerEvents: "none"}}
	>
		{SPOKES.map((spoke, i) => {
			const d = draw(i);
			if (d <= 0) return null;
			const c = spokeCenter(spoke.angle);
			return (
				<line
					key={spoke.kind}
					x1={HUB_CENTER.x}
					y1={HUB_CENTER.y}
					x2={HUB_CENTER.x + (c.x - HUB_CENTER.x) * d}
					y2={HUB_CENTER.y + (c.y - HUB_CENTER.y) * d}
					stroke="#454545"
					strokeWidth={2.25}
				/>
			);
		})}
	</svg>
);

/**
 * Wire light on a spoke — the WirePulse streak rotated onto the spoke
 * direction. Outward = hub → satellite; inward = satellite → hub. The pulse
 * lives strictly on the visible span (tile border to tile border); tiles are
 * the same size at both ends, so the span is symmetric whichever endpoint
 * anchors it.
 */
export const SpokePulse: React.FC<{kind: ObjectKind; p: number; inward?: boolean}> = ({
	kind,
	p,
	inward = false,
}) => {
	if (p <= 0 || p >= 1) return null;
	const angle = spokeAngle(kind);
	const span = spokeSpan(angle);
	const origin = inward ? spokeCenter(angle) : HUB_CENTER;
	const theta = inward ? angle + 180 : angle;
	return (
		<div
			style={{
				position: "absolute",
				left: origin.x,
				top: origin.y,
				width: 0,
				height: 0,
				transform: `rotate(${theta}deg)`,
				transformOrigin: "0 0",
			}}
		>
			<WirePulse x1={span.from} x2={span.to} y={0} p={p} len={70} />
		</div>
	);
};

/** Soft cluster boundary (scene 2) — the sanctioned grouping visual. */
export const ClusterPanel: React.FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	opacity?: number;
}> = ({x, y, w, h, opacity = 1}) => {
	if (opacity <= 0) return null;
	return (
		<div
			style={{
				position: "absolute",
				left: x,
				top: y,
				width: w,
				height: h,
				borderRadius: 20,
				backgroundColor: "#1f1f1f",
				border: "1px solid #333333",
				opacity,
			}}
		/>
	);
};

export {TILE};
