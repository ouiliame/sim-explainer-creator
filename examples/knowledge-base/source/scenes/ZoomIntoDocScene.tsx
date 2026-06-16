import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, SPACING, TYPE} from "../../../theme";
import {DocumentCard, KBContainer} from "../../../components";
import {
	DOC_IN_KB_W,
	DOC_IN_KB_X,
	DOC_LARGE_W,
	DOC_LARGE_X,
	DOC_LARGE_Y,
	DOCS,
	FOCAL_DOC_INDEX,
	KB_LARGE_H,
	KB_LARGE_W,
	KB_LARGE_X,
	KB_LARGE_Y,
	docInKbY,
} from "../layout";

export const ZoomIntoDocScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Surrounding context fades out: KB shell + non-focal docs
	const contextOp = interpolate(frame, [0.2 * fps, 1.0 * fps], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Focal doc animates from its in-KB position to the centered zoomed position
	const focalX = interpolate(frame, [0.3 * fps, 1.8 * fps], [DOC_IN_KB_X, DOC_LARGE_X], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const focalY = interpolate(
		frame,
		[0.3 * fps, 1.8 * fps],
		[docInKbY(FOCAL_DOC_INDEX), DOC_LARGE_Y],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.inOut,
		},
	);
	const focalW = interpolate(frame, [0.3 * fps, 1.8 * fps], [DOC_IN_KB_W, DOC_LARGE_W], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const focalDoc = DOCS[FOCAL_DOC_INDEX];

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* KB shell (fades out) */}
			<div style={{position: "absolute", left: KB_LARGE_X, top: KB_LARGE_Y, opacity: contextOp}}>
				<KBContainer
					name="Sales"
					docCount={DOCS.length}
					width={KB_LARGE_W}
					height={KB_LARGE_H}
				>
					<div
						style={{
							...TYPE.micro,
							color: COLORS.textMuted,
							textTransform: "uppercase",
							letterSpacing: 1.2,
							marginTop: 4,
							marginBottom: SPACING.xs,
						}}
					>
						documents
					</div>
				</KBContainer>
			</div>

			{/* Non-focal docs fade out at their resting positions */}
			{DOCS.map((d, i) =>
				i === FOCAL_DOC_INDEX ? null : (
					<div
						key={d.name}
						style={{
							position: "absolute",
							left: DOC_IN_KB_X,
							top: docInKbY(i),
							opacity: contextOp,
						}}
					>
						<DocumentCard
							kind={d.kind}
							name={d.name}
							size="lg"
							connector={d.connector}
							width={DOC_IN_KB_W}
						/>
					</div>
				),
			)}

			{/* Focal doc animates out */}
			<div style={{position: "absolute", left: focalX, top: focalY}}>
				<DocumentCard kind={focalDoc.kind} name={focalDoc.name} size="lg" width={focalW} />
			</div>
		</AbsoluteFill>
	);
};
