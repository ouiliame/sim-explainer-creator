import React, {useEffect, useState} from "react";
import {Audio, continueRender, delayRender, Sequence, staticFile, useVideoConfig} from "remotion";

// Scratch voiceover track. `scripts/scratch-vo.ts` writes per-scene TTS audio
// to public/vo/<compId>/ plus a manifest; this component plays it when
// present and renders NOTHING when absent — so compositions can mount it
// unconditionally. The scratch track exists to time scenes against real
// speech rhythm; William's recorded VO replaces the files 1:1.

type Entry = {at: number; file: string};

export const ScratchVO: React.FC<{compId: string; volume?: number}> = ({
	compId,
	volume = 1,
}) => {
	const {fps} = useVideoConfig();
	const [entries, setEntries] = useState<Entry[] | null>(null);
	const [handle] = useState(() => delayRender(`scratch-vo manifest: ${compId}`));

	useEffect(() => {
		let cancelled = false;
		fetch(staticFile(`vo/${compId}/manifest.json`))
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null)
			.then((data) => {
				if (!cancelled) setEntries(Array.isArray(data?.scenes) ? data.scenes : []);
				continueRender(handle);
			});
		return () => {
			cancelled = true;
		};
	}, [compId, handle]);

	if (!entries || entries.length === 0) return null;
	return (
		<>
			{entries.map((e) => (
				<Sequence key={e.file} from={Math.round(e.at * fps)} layout="none">
					<Audio src={staticFile(`vo/${compId}/${e.file}`)} volume={volume} />
				</Sequence>
			))}
		</>
	);
};
