import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING} from "../../../theme";
import {KBContainer} from "../../../components";
import {DOCS, KB_ROW_XS, KB_ROW_Y, KB_SMALL_H, KB_SMALL_W, STAGE_W} from "../layout";

const CENTER_X = (STAGE_W - KB_SMALL_W) / 2;

const KBS = [
	{name: "Engineering", docCount: 18},
	{name: "Sales", docCount: DOCS.length},
	{name: "Support", docCount: 12},
	{name: "Research", docCount: 8},
];

export const MultiKnowledgeBaseScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const focalOpacity = interpolate(frame, [0, 0.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const focalX = interpolate(frame, [1.3 * fps, 1.9 * fps], [CENTER_X, KB_ROW_XS[1]], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	const kb0X = interpolate(frame, [1.5 * fps, 2.2 * fps], [-KB_SMALL_W - 40, KB_ROW_XS[0]], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const kb0Op = interpolate(frame, [1.5 * fps, 1.9 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const kb2X = interpolate(frame, [1.8 * fps, 2.5 * fps], [STAGE_W + 40, KB_ROW_XS[2]], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const kb2Op = interpolate(frame, [1.8 * fps, 2.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const kb3X = interpolate(frame, [2.1 * fps, 2.8 * fps], [STAGE_W + 40, KB_ROW_XS[3]], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});
	const kb3Op = interpolate(frame, [2.1 * fps, 2.5 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const xs = [kb0X, focalX, kb2X, kb3X];
	const ops = [kb0Op, focalOpacity, kb2Op, kb3Op];

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{KBS.map((kb, i) => (
				<div
					key={kb.name}
					style={{position: "absolute", left: xs[i], top: KB_ROW_Y, opacity: ops[i]}}
				>
					<KBContainer
						name={kb.name}
						docCount={kb.docCount}
						width={KB_SMALL_W}
						height={KB_SMALL_H}
					/>
				</div>
			))}
		</AbsoluteFill>
	);
};
