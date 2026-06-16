import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS, SHADOW, SPACING, TYPE} from "../../../theme";
import {KBIcon, SourceCard, SourceIconByKind} from "../../../components";
import {
	KB_LANDING,
	PRELUDE_KB_H,
	PRELUDE_KB_W,
	PRELUDE_KB_X,
	PRELUDE_KB_Y,
	SOURCES,
} from "../preludeLayout";

// KB appears in the center → ALL 8 sources stream into it at distributed
// landing slots → KB shows search as part of itself (search row in header).
// No text-heavy subtitles — voiceover handles the explanation.
export const KBAppearsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// KB scales into the center
	const kbT = interpolate(frame, [0, 1.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const kbScale = 0.55 + 0.45 * kbT;

	// Search bar inside the KB header — fades in once KB has materialized
	const searchOp = interpolate(frame, [4.6 * fps, 5.4 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Per-source stream timing — each source departs scattered position and
	// lands at its assigned KB slot, fading fully to 0 by the time it arrives.
	const sourceStream = (i: number) => {
		const startSec = 1.2 + i * 0.18;
		return interpolate(frame, [startSec * fps, (startSec + 1.4) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		});
	};

	// As each source lands, a small persistent icon-chip appears at the slot
	// inside the KB (showing "this source is now part of the KB").
	const slotChip = (i: number) => {
		const arriveSec = 1.2 + i * 0.18 + 1.0; // chip pops in just before the source fully fades
		return interpolate(frame, [arriveSec * fps, (arriveSec + 0.4) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});
	};

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* KB container — large, centered, hero element */}
			<div
				style={{
					position: "absolute",
					left: PRELUDE_KB_X,
					top: PRELUDE_KB_Y,
					width: PRELUDE_KB_W,
					height: PRELUDE_KB_H,
					backgroundColor: COLORS.surface3,
					border: `1px solid ${COLORS.knowledge}`,
					borderRadius: RADIUS.md,
					padding: SPACING.md,
					boxSizing: "border-box",
					transform: `scale(${kbScale})`,
					transformOrigin: "center center",
					opacity: kbT,
					boxShadow: `0 0 60px ${COLORS.knowledge}44, ${SHADOW.overlay}`,
					display: "flex",
					flexDirection: "column",
					gap: 18,
				}}
			>
				{/* Header row */}
				<div style={{display: "flex", alignItems: "center", gap: 14}}>
					<KBIcon size={36} color={COLORS.knowledge} />
					<div style={{...TYPE.label, fontSize: 30, color: COLORS.text}}>Knowledge Base</div>
				</div>

				{/* Spacer — chips render absolutely on top */}
				<div style={{flex: 1}} />

				{/* Search row built into the KB — at the bottom, appears once sources arrive */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: 12,
						padding: "12px 18px",
						borderRadius: RADIUS.lg,
						backgroundColor: COLORS.surface2,
						border: `1px solid ${COLORS.border1}`,
						opacity: searchOp,
					}}
				>
					<SearchGlyph size={22} color={COLORS.textMuted} />
					<div style={{flex: 1, height: 6, borderRadius: 3, backgroundColor: COLORS.border}} />
				</div>
			</div>

			{/* Slot chips inside the KB — one per source, pop in as the corresponding source arrives */}
			{SOURCES.map((src, i) => {
				const Icon = SourceIconByKind[src.kind];
				const chipOp = slotChip(i);
				return (
					<div
						key={`chip-${src.label}`}
						style={{
							position: "absolute",
							left: KB_LANDING[i].x,
							top: KB_LANDING[i].y,
							width: 56,
							height: 56,
							backgroundColor: COLORS.surface4,
							border: `1px solid ${COLORS.border}`,
							borderRadius: RADIUS.sm,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							opacity: chipOp * kbT,
							transform: `scale(${0.7 + 0.3 * chipOp})`,
							transformOrigin: "center center",
						}}
					>
						<Icon size={30} />
					</div>
				);
			})}

			{/* Traveling source cards: scattered position → KB landing slot, fade to 0 on arrival */}
			{SOURCES.map((src, i) => {
				const t = sourceStream(i);
				const targetX = KB_LANDING[i].x - 28; // chip is 56 wide → center on chip
				const targetY = KB_LANDING[i].y - 38; // card is 76 tall → align center
				const x = src.x + (targetX - src.x) * t;
				const y = src.y + (targetY - src.y) * t;
				const scale = 1 - 0.6 * t;
				// Hold at 1 for first 70% of travel, then fade out
				const opacity = interpolate(t, [0, 0.65, 1], [1, 1, 0], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				return (
					<div
						key={src.label}
						style={{
							position: "absolute",
							left: x,
							top: y,
							transform: `scale(${scale})`,
							transformOrigin: "center center",
							opacity,
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

		</AbsoluteFill>
	);
};

const SearchGlyph: React.FC<{size: number; color: string}> = ({size, color}) => (
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="10" cy="10" r="6" stroke={color} strokeWidth="2" />
		<line x1="14.5" y1="14.5" x2="19" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round" />
	</svg>
);
