import React from "react";
import {AbsoluteFill} from "remotion";
import {COLORS, SPACING, TYPE} from "../../../theme";
import {SlideIn} from "../../../motion";
import {DocumentCard, KBContainer} from "../../../components";
import {
	DOC_IN_KB_W,
	DOC_IN_KB_X,
	DOCS,
	KB_LARGE_H,
	KB_LARGE_W,
	KB_LARGE_X,
	KB_LARGE_Y,
	docInKbY,
} from "../layout";

export const DocumentsScene: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.bg}}>
			{/* KB shell (no children — docs are positioned absolutely on top) */}
			<div style={{position: "absolute", left: KB_LARGE_X, top: KB_LARGE_Y}}>
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

			{/* Docs positioned absolutely so individual docs can be animated later */}
			{DOCS.map((d, i) => (
				<div
					key={d.name}
					style={{position: "absolute", left: DOC_IN_KB_X, top: docInKbY(i)}}
				>
					<SlideIn delay={0.4 + i * 0.2} from="up" distance={14} duration={0.5}>
						<DocumentCard
							kind={d.kind}
							name={d.name}
							size="lg"
							connector={d.connector}
							width={DOC_IN_KB_W}
						/>
					</SlideIn>
				</div>
			))}
		</AbsoluteFill>
	);
};
