import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, SPACING, TYPE} from "../../../theme";
import {KBContainer} from "../../../components";
import {
	DOCS,
	FOCAL_KB_INDEX,
	KB_LARGE_H,
	KB_LARGE_W,
	KB_LARGE_X,
	KB_LARGE_Y,
	KB_ROW_XS,
	KB_ROW_Y,
	KB_SMALL_H,
	KB_SMALL_W,
} from "../layout";

const KBS = [
	{name: "Engineering", docCount: 18},
	{name: "Sales", docCount: DOCS.length},
	{name: "Support", docCount: 12},
	{name: "Research", docCount: 8},
];

export const ZoomIntoKBScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Other KBs fade out early
	const othersOp = interpolate(frame, [0.2 * fps, 1.2 * fps], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Focal KB transitions position + size from row slot → centered large
	const focalX = interpolate(frame, [0.4 * fps, 2.4 * fps], [KB_ROW_XS[FOCAL_KB_INDEX], KB_LARGE_X], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const focalY = interpolate(frame, [0.4 * fps, 2.4 * fps], [KB_ROW_Y, KB_LARGE_Y], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const focalW = interpolate(frame, [0.4 * fps, 2.4 * fps], [KB_SMALL_W, KB_LARGE_W], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const focalH = interpolate(frame, [0.4 * fps, 2.4 * fps], [KB_SMALL_H, KB_LARGE_H], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// "DOCUMENTS" label fades in during the final stretch of the zoom so that by
	// the cut to DocumentsScene the label is already visible (no pop).
	const docLabelOp = interpolate(frame, [2.4 * fps, 3.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{KBS.map((kb, i) => {
				if (i === FOCAL_KB_INDEX) return null;
				return (
					<div
						key={kb.name}
						style={{position: "absolute", left: KB_ROW_XS[i], top: KB_ROW_Y, opacity: othersOp}}
					>
						<KBContainer
							name={kb.name}
							docCount={kb.docCount}
							width={KB_SMALL_W}
							height={KB_SMALL_H}
						/>
					</div>
				);
			})}
			<div style={{position: "absolute", left: focalX, top: focalY}}>
				<KBContainer
					name={KBS[FOCAL_KB_INDEX].name}
					docCount={KBS[FOCAL_KB_INDEX].docCount}
					width={focalW}
					height={focalH}
				>
					<div
						style={{
							...TYPE.micro,
							color: COLORS.textMuted,
							textTransform: "uppercase",
							letterSpacing: 1.2,
							marginTop: 4,
							marginBottom: SPACING.xs,
							opacity: docLabelOp,
						}}
					>
						documents
					</div>
				</KBContainer>
			</div>
		</AbsoluteFill>
	);
};
