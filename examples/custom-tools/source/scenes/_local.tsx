import type {EditorLine, SimBlockTool} from "../../../components";
import {ToolGlyph} from "../../../components/ObjectIcons";

// Tokenized content for the editor panel — the docs' authored get_weather
// example, VERBATIM (demo-corpus/get-weather-tool.md; source:
// apps/docs/content/docs/en/tools/custom-tools.mdx). Token kinds map to the
// product's Prism theme (code.css); schema params and {{ENV}} render blue
// exactly as the product's highlightVariables does.
//
// hl groups drive the selection washes:
//   schema: "name" | "desc" | "city" | "units"
//   code:   "p-city" | "p-units" | "env" | "ret"

export const SCHEMA_LINES: EditorLine[] = [
	{num: 1, spans: [{t: "{", k: "pun"}]},
	{
		num: 2,
		spans: [
			{t: "  "},
			{t: '"type"', k: "prop"},
			{t: ": ", k: "pun"},
			{t: '"function"', k: "str"},
			{t: ",", k: "pun"},
		],
	},
	{num: 3, spans: [{t: "  "}, {t: '"function"', k: "prop"}, {t: ": {", k: "pun"}]},
	{
		num: 4,
		hl: "name",
		spans: [
			{t: "    "},
			{t: '"name"', k: "prop"},
			{t: ": ", k: "pun"},
			{t: '"get_weather"', k: "str"},
			{t: ",", k: "pun"},
		],
	},
	{
		num: 5,
		hl: "desc",
		spans: [
			{t: "    "},
			{t: '"description"', k: "prop"},
			{t: ": ", k: "pun"},
			{t: '"Get the current weather for a city"', k: "str"},
			{t: ",", k: "pun"},
		],
	},
	{num: 6, spans: [{t: "    "}, {t: '"parameters"', k: "prop"}, {t: ": {", k: "pun"}]},
	{
		num: 7,
		spans: [
			{t: "      "},
			{t: '"type"', k: "prop"},
			{t: ": ", k: "pun"},
			{t: '"object"', k: "str"},
			{t: ",", k: "pun"},
		],
	},
	{num: 8, spans: [{t: "      "}, {t: '"properties"', k: "prop"}, {t: ": {", k: "pun"}]},
	{num: 9, hl: "city", spans: [{t: "        "}, {t: '"city"', k: "prop"}, {t: ": {", k: "pun"}]},
	{
		num: 10,
		hl: "city",
		spans: [
			{t: "          "},
			{t: '"type"', k: "prop"},
			{t: ": ", k: "pun"},
			{t: '"string"', k: "str"},
			{t: ",", k: "pun"},
		],
	},
	{
		num: 11,
		hl: "city",
		spans: [
			{t: "          "},
			{t: '"description"', k: "prop"},
			{t: ": ", k: "pun"},
			{t: '"The city name"', k: "str"},
		],
	},
	{num: 12, hl: "city", spans: [{t: "        },", k: "pun"}]},
	{num: 13, hl: "units", spans: [{t: "        "}, {t: '"units"', k: "prop"}, {t: ": {", k: "pun"}]},
	{
		num: 14,
		hl: "units",
		spans: [
			{t: "          "},
			{t: '"type"', k: "prop"},
			{t: ": ", k: "pun"},
			{t: '"string"', k: "str"},
			{t: ",", k: "pun"},
		],
	},
	{
		num: 15,
		hl: "units",
		spans: [
			{t: "          "},
			{t: '"enum"', k: "prop"},
			{t: ": [", k: "pun"},
			{t: '"celsius"', k: "str"},
			{t: ", ", k: "pun"},
			{t: '"fahrenheit"', k: "str"},
			{t: "],", k: "pun"},
		],
	},
	{
		num: 16,
		hl: "units",
		spans: [
			{t: "          "},
			{t: '"description"', k: "prop"},
			{t: ": ", k: "pun"},
			{t: '"Temperature units"', k: "str"},
		],
	},
	{num: 17, hl: "units", spans: [{t: "        }", k: "pun"}]},
	{num: 18, spans: [{t: "      },", k: "pun"}]},
	{
		num: 19,
		spans: [
			{t: "      "},
			{t: '"required"', k: "prop"},
			{t: ": [", k: "pun"},
			{t: '"city"', k: "str"},
			{t: "]", k: "pun"},
		],
	},
	{num: 20, spans: [{t: "    }", k: "pun"}]},
	{num: 21, spans: [{t: "  }", k: "pun"}]},
	{num: 22, spans: [{t: "}", k: "pun"}]},
];

// The long fetch-URL line (logical line 2) soft-wraps across two visual rows
// (display adaptation argued in demo-corpus/get-weather-tool.md); content is
// byte-identical to the docs.
export const CODE_LINES: EditorLine[] = [
	{
		num: 1,
		spans: [
			{t: "const", k: "kw"},
			{t: " response "},
			{t: "=", k: "pun"},
			{t: " "},
			{t: "await", k: "kw"},
			{t: " "},
			{t: "fetch", k: "fn"},
			{t: "(", k: "pun"},
		],
	},
	{
		num: 2,
		spans: [
			{t: "  "},
			{t: "`https://api.openweathermap.org/data/2.5/weather?q=", k: "str"},
			{t: "${", k: "pun"},
			{t: "city", k: "blue", hl: "p-city"},
			{t: "}", k: "pun"},
			{t: "&units=", k: "str"},
		],
	},
	{
		spans: [
			{t: "    "},
			{t: "${", k: "pun"},
			{t: "units", k: "blue", hl: "p-units"},
			{t: " === ", k: "pun"},
			{t: "'celsius'", k: "str"},
			{t: " ? ", k: "pun"},
			{t: "'metric'", k: "str"},
			{t: " : ", k: "pun"},
			{t: "'imperial'", k: "str"},
			{t: "}", k: "pun"},
			{t: "&appid=", k: "str"},
			{t: "{{OPENWEATHER_API_KEY}}", k: "blue", hl: "env"},
			{t: "`", k: "str"},
		],
	},
	{num: 3, spans: [{t: ");", k: "pun"}]},
	{num: 4, spans: [{t: ""}]},
	{
		num: 5,
		spans: [
			{t: "const", k: "kw"},
			{t: " data "},
			{t: "=", k: "pun"},
			{t: " "},
			{t: "await", k: "kw"},
			{t: " response"},
			{t: ".", k: "pun"},
			{t: "json", k: "fn"},
			{t: "();", k: "pun"},
		],
	},
	{num: 6, spans: [{t: ""}]},
	{num: 7, hl: "ret", spans: [{t: "return", k: "kw"}, {t: " {", k: "pun"}]},
	{
		num: 8,
		hl: "ret",
		spans: [
			{t: "  "},
			{t: "temperature", k: "prop"},
			{t: ": ", k: "pun"},
			{t: "data"},
			{t: ".", k: "pun"},
			{t: "main"},
			{t: ".", k: "pun"},
			{t: "temp"},
			{t: ",", k: "pun"},
		],
	},
	{
		num: 9,
		hl: "ret",
		spans: [
			{t: "  "},
			{t: "description", k: "prop"},
			{t: ": ", k: "pun"},
			{t: "data"},
			{t: ".", k: "pun"},
			{t: "weather"},
			{t: "[", k: "pun"},
			{t: "0", k: "num"},
			{t: "]", k: "pun"},
			{t: ".", k: "pun"},
			{t: "description"},
			{t: ",", k: "pun"},
		],
	},
	{
		num: 10,
		hl: "ret",
		spans: [
			{t: "  "},
			{t: "humidity", k: "prop"},
			{t: ": ", k: "pun"},
			{t: "data"},
			{t: ".", k: "pun"},
			{t: "main"},
			{t: ".", k: "pun"},
			{t: "humidity"},
		],
	},
	{num: 11, hl: "ret", spans: [{t: "};", k: "pun"}]},
];

export const TOOL_PARAMS = ["city", "units"];

// The saved tool's chip — name condensed from get_weather (module-5
// condensation rule); color/glyph follow the repo's custom-tool chip
// grammar (CHIP_CRM precedent: #6366F1 + ToolGlyph).
export const CHIP_WEATHER: SimBlockTool = {
	name: "Weather",
	color: "#6366F1",
	glyph: <ToolGlyph size={14} color="#ffffff" />,
};
