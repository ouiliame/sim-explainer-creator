/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// enableTailwind, plus a defensive guard against a bun+webpack persistent-cache
// crash (`wasm-hash … undefined is not an object`) seen on some machines during
// render bundling. Forcing sha256 hashing + an in-memory cache sidesteps the
// wasm hasher; the only cost is no cross-run bundle cache (slightly slower cold
// rebuilds). Safe to remove if you never hit the crash.
Config.overrideWebpackConfig((config) => {
	const withTailwind = enableTailwind(config);
	return {
		...withTailwind,
		output: { ...(withTailwind.output ?? {}), hashFunction: "sha256" },
		cache: { type: "memory" },
	};
});
