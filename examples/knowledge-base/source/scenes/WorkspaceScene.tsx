import React from "react";
import {AbsoluteFill} from "remotion";
import {COLORS, SPACING} from "../../../theme";
import {FadeIn, SlideIn} from "../../../motion";
import {ResourcePanel, WorkflowChain, WorkspaceFrame} from "../../../components";

// Workspace shell renders at full opacity from frame 0 (no fade-from-black).
// Inner contents (workflow chain, KB resource panel) animate in.
export const WorkspaceScene: React.FC = () => {
	return (
		<AbsoluteFill
			style={{
				backgroundColor: COLORS.bg,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<WorkspaceFrame title="my workspace">
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: SPACING.xl,
					}}
				>
					<SlideIn delay={0.3} duration={0.5} from="up" distance={16}>
						<WorkflowChain />
					</SlideIn>
					<FadeIn delay={1.0} duration={0.6}>
						<SlideIn delay={1.0} duration={0.6} from="up" distance={20}>
							<ResourcePanel
								label="Knowledge Base"
								subtitle="resource · document store"
								width={360}
							/>
						</SlideIn>
					</FadeIn>
				</div>
			</WorkspaceFrame>
		</AbsoluteFill>
	);
};
