import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, SHADOW} from "../../../theme";
import {SourceCard} from "../../../components";
import {
	HIGHLIGHTED_SOURCES,
	SEARCH_H,
	SEARCH_W,
	SEARCH_X,
	SEARCH_Y,
	SOURCES,
} from "../preludeLayout";

const HIGHLIGHTED = new Set(HIGHLIGHTED_SOURCES);

// Visual-only: search bar slides in over the scattered sources; an animated
// "scan" shimmer travels across the bar; a few sources light up as the search
// settles. No typed query — voiceover handles the explanation.
export const SearchEmergeScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const searchT = interpolate(frame, [0, 0.7 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const searchTy = (1 - searchT) * 20;

	// "Scanning" shimmer that travels across the bar after it lands
	const scanT = interpolate(frame, [1.2 * fps, 2.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const scanLeft = scanT * (SEARCH_W - 100);

	// Dim non-highlighted cards once the scan finishes
	const dimOp = interpolate(frame, [2.6 * fps, 3.4 * fps], [1, 0.35], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Glow on relevant cards
	const glowAlpha = interpolate(frame, [2.8 * fps, 3.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const ringHex = Math.round(glowAlpha * 255)
		.toString(16)
		.padStart(2, "0");
	const haloHex = Math.round(glowAlpha * 0.33 * 255)
		.toString(16)
		.padStart(2, "0");
	const glowShadow = `0 0 0 2px ${COLORS.accent}${ringHex}, 0 0 40px ${COLORS.accent}${haloHex}`;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Scattered sources */}
			{SOURCES.map((src, i) => {
				const isRelevant = HIGHLIGHTED.has(i);
				return (
					<div
						key={src.label}
						style={{
							position: "absolute",
							left: src.x,
							top: src.y,
							opacity: isRelevant ? 1 : dimOp,
							borderRadius: RADIUS.md,
							boxShadow: isRelevant ? glowShadow : "none",
						}}
					>
						<SourceCard
							kind={src.kind}
							label={src.label}
							subtitle={src.subtitle}
							size={src.size}
						/>
					</div>
				);
			})}

			{/* Search bar with shimmer */}
			<div
				style={{
					position: "absolute",
					left: SEARCH_X,
					top: SEARCH_Y,
					width: SEARCH_W,
					height: SEARCH_H,
					backgroundColor: COLORS.surface2,
					border: `1px solid ${COLORS.border1}`,
					borderRadius: SEARCH_H / 2,
					transform: `translateY(${searchTy}px)`,
					opacity: searchT,
					display: "flex",
					alignItems: "center",
					paddingLeft: 28,
					paddingRight: 28,
					gap: 16,
					boxSizing: "border-box",
					boxShadow: SHADOW.overlay,
					overflow: "hidden",
				}}
			>
				<SearchGlyph size={26} color={COLORS.textMuted} />
				<div style={{flex: 1, height: 6, borderRadius: 3, backgroundColor: COLORS.border, position: "relative", overflow: "hidden"}}>
					<div
						style={{
							position: "absolute",
							left: scanLeft,
							top: 0,
							width: 100,
							height: 6,
							borderRadius: 3,
							background: `linear-gradient(90deg, transparent, ${COLORS.secondary}, transparent)`,
							opacity: scanT > 0 && scanT < 1 ? 1 : 0,
						}}
					/>
				</div>
			</div>
		</AbsoluteFill>
	);
};

const SearchGlyph: React.FC<{size: number; color: string}> = ({size, color}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="10" cy="10" r="6" stroke={color} strokeWidth="2" />
		<line x1="14.5" y1="14.5" x2="19" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
	</svg>
);
