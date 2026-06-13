import "./index.css";
import React from "react";
import {Composition} from "remotion";
import {z} from "zod";
import {FPS, seconds, ThemeProvider} from "./theme";

// ─────────────────────────────────────────────────────────────────────────────
// Video registry. EMPTY by design — this is the generator harness, not a video
// library. Each generated video adds a folder under src/videos/<slug>/ and one
// entry to VIDEOS below (id, Component, totalSeconds, scenes). See CLAUDE.md.
// ─────────────────────────────────────────────────────────────────────────────

type SceneDef = {name: string; durationSec: number; Component: React.FC};
type VideoDef = {id: string; Component: React.FC; totalSeconds: number; scenes: SceneDef[]};

const VIDEOS: VideoDef[] = [
	// e.g. {id: "wf-intro-v1", Component: WfIntroVideo, totalSeconds: WFI_TOTAL, scenes: WFI_SCENES},
];

const themeSchema = z.object({theme: z.enum(["dark", "light"]), dots: z.boolean()});
type ThemeProps = z.infer<typeof themeSchema>;

const withTheme = (Component: React.FC): React.FC<ThemeProps> => {
	const Themed: React.FC<ThemeProps> = ({theme, dots}) => (
		<ThemeProvider theme={theme} dots={dots}>
			<Component />
		</ThemeProvider>
	);
	return Themed;
};

const THEMED = VIDEOS.map((v) => ({
	...v,
	Component: withTheme(v.Component),
	scenes: v.scenes.map((s) => ({...s, Component: withTheme(s.Component)})),
}));

export const RemotionRoot: React.FC = () => (
	<>
		{THEMED.map((video) => (
			<React.Fragment key={video.id}>
				<Composition
					id={video.id}
					component={video.Component}
					durationInFrames={seconds(video.totalSeconds)}
					fps={FPS}
					width={1920}
					height={1080}
					schema={themeSchema}
					defaultProps={{theme: "dark" as const, dots: false}}
				/>
				{video.scenes.map((scene, i) => (
					<Composition
						key={scene.name}
						id={`${video.id}--${String(i + 1).padStart(2, "0")}-${scene.name}`}
						component={scene.Component}
						durationInFrames={seconds(scene.durationSec)}
						fps={FPS}
						width={1920}
						height={1080}
						schema={themeSchema}
						defaultProps={{theme: "dark" as const, dots: false}}
					/>
				))}
			</React.Fragment>
		))}
	</>
);
