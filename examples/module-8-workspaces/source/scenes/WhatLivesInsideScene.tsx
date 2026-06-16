import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {ObjectNode} from "../../../components";
import {BoundaryFrame, CredentialTile} from "./_local";
import {BOUNDARY_H, BOUNDARY_W, BOUNDARY_X, BOUNDARY_Y, INSIDE_GRID, INSIDE_TILE} from "../layout";

// Scene 2 — what-lives-inside.
// The boundary is already drawn (enters where scene 1 left it). Core objects
// fade in as compact tiles, plus a credential tile. "Everything in one box."
export const WhatLivesInsideScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			<div style={{position: "absolute", left: BOUNDARY_X, top: BOUNDARY_Y}}>
				<BoundaryFrame label="my workspace" width={BOUNDARY_W} height={BOUNDARY_H} />
			</div>

			{INSIDE_GRID.map((o) => {
				const start = o.appearAt * fps;
				const t = interpolate(frame, [start, start + 0.45 * fps], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
					easing: EASING.out,
				});
				const scale = 0.86 + 0.14 * t;
				return (
					<div
						key={o.kind}
						style={{
							position: "absolute",
							left: o.x,
							top: o.y,
							opacity: t,
							transform: `scale(${scale})`,
							transformOrigin: "center center",
						}}
					>
						{o.kind === "credential" ? (
							<CredentialTile width={INSIDE_TILE.w} height={INSIDE_TILE.h} />
						) : (
							<ObjectNode kind={o.kind} width={INSIDE_TILE.w} height={INSIDE_TILE.h} label={shortLabel(o.kind)} />
						)}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

function shortLabel(kind: string): string | undefined {
	if (kind === "knowledge") return "Knowledge";
	return undefined;
}
