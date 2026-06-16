import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {COLORS, EASING, RADIUS} from "../../../theme";
import {SourceCard, SourceIconByKind} from "../../../components";
import {
	CENTER_X,
	CENTER_Y,
	PROMPT_H,
	PROMPT_W,
	PROMPT_X,
	PROMPT_Y,
	SOURCES,
} from "../preludeLayout";

// Sources drift toward a centered prompt; brand icons pile inside it; the
// prompt visibly overloads; a giant red X stamps it; cards recoil.
// No workflow box, no connector lines, no text labels — voiceover carries it.
export const ContextOverloadScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Prompt fades in
	const setupOp = interpolate(frame, [0, 0.6 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.out,
	});

	// Sources drift toward the prompt (1.4-3.2s) then recoil (5.4-7.0s)
	const pullIn = interpolate(frame, [1.4 * fps, 3.2 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const recoil = interpolate(frame, [5.4 * fps, 7.0 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const pull = pullIn * (1 - recoil);

	// Mini brand icons inside the prompt, staggered as cards "arrive"
	const iconAppear = (i: number) =>
		interpolate(frame, [(1.8 + i * 0.15) * fps, (2.3 + i * 0.15) * fps], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
			easing: EASING.out,
		});

	// Red rejection X stamps the prompt at ~4.2s
	const stampScale = interpolate(
		frame,
		[4.0 * fps, 4.4 * fps, 4.8 * fps, 6.0 * fps],
		[2.4, 1.0, 1.0, 1.0],
		{extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASING.in},
	);
	const stampOp = interpolate(frame, [4.0 * fps, 4.4 * fps, 5.6 * fps, 6.6 * fps], [0, 1, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});

	// Prompt red overload glow
	const overloadAlpha = interpolate(frame, [3.4 * fps, 4.4 * fps, 6.2 * fps], [0, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: EASING.inOut,
	});
	const ringHex = Math.round(overloadAlpha * 255)
		.toString(16)
		.padStart(2, "0");
	const haloHex = Math.round(overloadAlpha * 0.4 * 255)
		.toString(16)
		.padStart(2, "0");

	// Small shake on the prompt during overload
	const shakeT = interpolate(frame, [3.6 * fps, 4.4 * fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const shake = shakeT < 1 ? Math.sin(frame * 1.2) * 3 * shakeT * (1 - shakeT) * 4 : 0;

	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* Source cards stay at scattered positions; shrink + drift toward the prompt */}
			{SOURCES.map((src) => {
				const dx = (CENTER_X - 110 - src.x) * 0.3 * pull;
				const dy = (CENTER_Y - 38 - src.y) * 0.3 * pull;
				const scale = 1 - 0.22 * pull;
				return (
					<div
						key={src.label}
						style={{
							position: "absolute",
							left: src.x,
							top: src.y,
							transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
							transformOrigin: "center center",
							opacity: 0.95,
						}}
					>
						<SourceCard kind={src.kind} label={src.label} subtitle={src.subtitle} size={src.size} />
					</div>
				);
			})}

			{/* Centered prompt box — fills with mini brand icons, overloads, gets stamped */}
			<div
				style={{
					position: "absolute",
					left: PROMPT_X,
					top: PROMPT_Y,
					width: PROMPT_W,
					height: PROMPT_H,
					backgroundColor: COLORS.surface2,
					border: `1px solid ${COLORS.border1}`,
					borderRadius: RADIUS.md,
					opacity: setupOp,
					padding: 32,
					boxSizing: "border-box",
					boxShadow: `0 0 0 2px ${COLORS.warning}${ringHex}, 0 0 80px ${COLORS.warning}${haloHex}`,
					transform: `translate(${shake}px, 0)`,
				}}
			>
				<div style={{display: "flex", flexWrap: "wrap", gap: 16, alignContent: "center", justifyContent: "center", height: "100%"}}>
					{SOURCES.map((src, i) => {
						const Icon = SourceIconByKind[src.kind];
						return (
							<div
								key={src.label}
								style={{
									width: 72,
									height: 72,
									backgroundColor: COLORS.surface4,
									border: `1px solid ${COLORS.border}`,
									borderRadius: RADIUS.sm,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									opacity: iconAppear(i),
								}}
							>
								<Icon size={42} />
							</div>
						);
					})}
				</div>
			</div>

			{/* Big red X stamped across the prompt */}
			<div
				style={{
					position: "absolute",
					left: PROMPT_X,
					top: PROMPT_Y,
					width: PROMPT_W,
					height: PROMPT_H,
					transform: `scale(${stampScale})`,
					transformOrigin: "center center",
					opacity: stampOp,
					pointerEvents: "none",
				}}
			>
				<RejectedX width={PROMPT_W} height={PROMPT_H} />
			</div>
		</AbsoluteFill>
	);
};

const RejectedX: React.FC<{width: number; height: number}> = ({width, height}) => (
	<svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
		<line
			x1={width * 0.12}
			y1={height * 0.18}
			x2={width * 0.88}
			y2={height * 0.82}
			stroke="#e53935"
			strokeWidth="16"
			strokeLinecap="round"
		/>
		<line
			x1={width * 0.88}
			y1={height * 0.18}
			x2={width * 0.12}
			y2={height * 0.82}
			stroke="#e53935"
			strokeWidth="16"
			strokeLinecap="round"
		/>
	</svg>
);
