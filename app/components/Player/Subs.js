import React, {CSSProperties} from 'react';
import {createReadStream, createWriteStream} from "fs";
import * as MatroskaSubtitles from 'matroska-subtitles';
import matchAll from "string.prototype.matchall";
import {load as fLoad} from "webfontloader"

import {dropWhile, groupBy, halve, stealWhile, zipWith} from "../../utils/util";


type BlockProps = {
  anchorV: 'top' | 'middle' | 'bottom',
  anchorH: 'left' | 'centre' | 'right',
  marginL: number,
  marginR: number,
  marginV: number,
  children: any
};

type OverrideProps = {
  type: 'b' | 'i' | 'u' | 's',
  arg: string,
  children: any
};

function padInt(int: number, nums: number): string {
  return int.toString(10).padStart(nums, '0');
}

function millisToTime(millis) {
  let timeLeft = millis;
  const hours = Math.floor(timeLeft / 1000 / 60 / 60);
  timeLeft -= hours * 60 * 60 * 1000;
  const minutes = Math.floor(timeLeft / 1000 / 60);
  timeLeft -= minutes * 1000 * 60;
  const seconds = Math.floor(timeLeft / 1000);
  timeLeft -= seconds * 1000;

  return `${padInt(hours, 2)}:${padInt(minutes, 2)}:${padInt(seconds, 2)}.${padInt(timeLeft, 3)}`
}

function escapeText(text: string): string {
  const lines = text.split(/(\r\n)|\n|\r/);
  if (lines.length > 1) {
    return lines.map(line => `- ${line}`).join('\n');
  } else {
    return lines[0];
  }
}

function parsePseudoIniRealQuickOkFam(iniString: string): {[string]: string} {
  const lines = iniString.split(/\r?\n/g).filter(s => s);
  const ini = {};
  let line: string;
  let currentSection = "";

  // eslint-disable-next-line no-cond-assign
  while ((line = lines.shift()) !== undefined) {
    if (line.length !== 0) {
      if (line.startsWith('[')) {
        currentSection = line.replace(/[[\]]/g, '');
      } else {
        const [key, value] = halve(line, ':').map(s => s.trim());
        if (!ini[currentSection]) {
          ini[currentSection] = {};
        }

        const currentValue = ini[currentSection][key];
        if (currentValue === undefined) {
          ini[currentSection][key] = value;
        } else if (Array.isArray(currentValue)) {
          ini[currentSection][key].push(value);
        } else {
          ini[currentSection][key] = [currentValue, value]
        }
      }
    }
  }

  return ini;
}

const fontMap = {
  thin: 100,
  hairline: 100,
  extralight: 200,
  ultralight: 200,
  light: 300,
  normal: 400,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  ultrabold: 800,
  black: 900,
  heavy: 900
};

function parseFontName(name: string): {name: string, weight: ?{name: string, value: number}} {
  const words = name.split(" ");
  const lastWord = words[words.length - 1];
  const weight = fontMap[lastWord.toLowerCase().replace(/[ -]/ig, "")];
  if (weight !== undefined) {
    return {
      name: words.slice(0, words.length - 1).join(" "),
      weight: {
        name: lastWord.toLowerCase().replace(/[ -]ig/, ""),
        value: weight
      }
    }
  } else {
    return {
      name: words.join(" "),
      weight: null
    }
  }
}

function loadFont(n: string) {
  const {name, weight} = parseFontName(n);
  if (weight !== null) {
    const family = `${name}:${weight.name}`;
    console.log(`Family: ${family}`);
    fLoad({
      google: {
        families: [family]
      }
    })
  } else {
    console.log(`Family: ${name}`);
    fLoad({
      google: {
        families: [name]
      }
    })
  }
}

function parseAssStyle(key: string, value: string, version: 'v4' | 'v4+'): [string, any] {
  const hexPairToDecimal = pair => parseInt(pair, 16);

  function getAlignment(s) {
    const horizontal = ["left", "centre", "right"];
    const vertical = ["bottom", "middle", "top"];
    const v = parseInt(s, 10);
    if (version === "v4") {
      return {
        horizontal: horizontal[(v - 1) % 4],
        vertical: vertical[Math.floor(v / 4)]
      }
    } else {
      return {
        horizontal: horizontal[(v - 1) % 3],
        vertical: vertical[Math.floor((v - 1) / 3)]
      }
    }
  }

  function parseColour(c: string): string {
    const s = c.substring(2);
    const pairs = s.match(/.{1,2}/g).map(hexPairToDecimal);
    let [a, r, g, b] = [1, 255, 255, 255];
    if (version === "v4") {
      b = pairs[0];
      g = pairs[1];
      r = pairs[2];
    } else {
      a = pairs[0];
      b = pairs[1];
      g = pairs[2];
      r = pairs[3];
    }

    return `rgba(${r}, ${g}, ${b}, ${1 - (a / 255)})`;
  }

  switch (key) {
    case "Fontname":
      loadFont(value);
      return ["fontFamily", value];
    case "Fontsize":
      return ["fontSize", parseInt(value, 10)];
    case "Name":
      return ["name", value];
    case "Bold":
      return ["fontWeight", value === "-1"? "bold" : "normal"];
    case "Italic":
      return ["fontStyle", value === "-1"? "italic" : "normal"];
    case "Underline":
      return ["textDecoration", value === "-1"? "underline" : "normal"];
    case "Strikeout":
      return ["textDecoration", value === "-1"? "line-through" : "normal"];
    case "PrimaryColour":
      return ["color", parseColour(value)];
    case "Spacing":
      return ["letterSpacing", parseInt(value, 10)];
    case "OutlineColour":
      return ["WebkitTextStrokeColor", parseColour(value)];
    case "Outline":
      return ["WebkitTextStrokeWidth", parseFloat(value)];
    case "Alignment":
      return ["alignment", getAlignment(value)];
    case "MarginL":
      return ["marginL", parseInt(value, 10)];
    case "MarginR":
      return ["marginR", parseInt(value, 10)];
    case "MarginV":
      return ["marginV", parseInt(value, 10)];
    default:
      return [key, value];
  }
}

// this is actually so annoying to read ill comment it
function assStyleToObject(styleDef) {
  const {Format: formatRaw, Style: styleRaw} = styleDef;

  // split the format so that instead of string "name, marginL, marginR" we get an array ["name", "marginL", "marginR"]
  const format: string[] = formatRaw.split(",").map(s => s.trim());

  // do the same for every style so instead of ["Default, 20, 30", "Rain, 40, 20"] we get [["Default", "20", "30"], ["Rain", "40", "20"]]
  const styles: string[] = styleRaw.map(style => style.split(",").map(s => s.trim()));

  /*
  zip em together, so that we get something like
  [
    [
      ["name", "Default"],
      ["marginL", "20"],
      ["marginR", "30"]
    ],
    [
      ["name", "Rain"],
      ["marginL", "40"],
      ["marginR", "20"]
    ]
  ]

  so it can be parsed into an object easily (might turn it into a single pass later if I have the time)
  */
  const zippedStyles = styles.map(s => zipWith(format, s, (a, b) => [a, b]));

  /*
    Turn it into an object! Now we have
    {
      Default: {
        name: "Default",
        marginL: "20",
        marginR: "30"
      },
      Rain: {
        name: "Rain",
        marginL: "40",
        marginR: "20"
      }
    }
   */
  return zippedStyles
    .map(s => s.reduce((obj, [key, value]) => ({...obj, [key]: value}), {}))
    .reduce((obj, elem) => ({...obj, [elem.Name]: elem}), {});
}

function parseAssHeader(header: string, out) {
  const parsedIni = parsePseudoIniRealQuickOkFam(header);
  const {"Script Info": scriptInfo} = parsedIni;

  const sv = parsedIni["V4 Styles"]? "v4" : "v4+"; // version of styles used in ini
  const styles = parsedIni["V4 Styles"]?? parsedIni["V4+ Styles"]?? parsedIni["V4 Styles+"]?? {};

  // i don't ever wish to look at this code again please spare me
  Object
    .entries(assStyleToObject(styles))
    .map(([key, value]) => [key, Object
      .entries(value)
      .map(([k, v]) => parseAssStyle(k, v, sv))
      .reduce((obj, [k, v]) => ({...obj, [k]: v}), {})
    ])
    .forEach(([key, value]) => {
      // eslint-disable-next-line no-param-reassign
      out.styles[key] = value
    });

  Object.values(out.styles).forEach(style => {
    const {name, weight} = parseFontName(style['fontFamily']);
    if (weight !== null) {
      // eslint-disable-next-line no-param-reassign
      style['fontFamily'] = name;
      // eslint-disable-next-line no-param-reassign
      style['fontWeight'] = weight.value;
    }
    // eslint-disable-next-line no-param-reassign
    style['fontFamily'] = `"${style['fontFamily']}", Arial, sans-serif`;
  });
  // eslint-disable-next-line no-param-reassign
  out.scriptInfo = scriptInfo;
}

function SubtitleBlock(props: BlockProps) {
  // switch expressions hwen
  const justifyContent = ({
    middle: "center",
    top: "flex-start",
    bottom: "flex-end"
  })[props.anchorV];

  const textAlign = ({
    centre: "center",
    left: "left",
    right: "right"
  })[props.anchorH];

  const alignItems = ({
    centre: "center",
    left: "flex-start",
    right: "flex-end"
  })[props.anchorH];

  const containerStyle: CSSProperties = {
    position: "absolute",
    width: '100%',
    height: '100%',
    paddingLeft: props.marginL,
    paddingRight: props.marginR,
    paddingTop: props.marginV,
    paddingBottom: props.marginV,
    display: "flex",
    justifyContent,
    alignItems,
    textAlign,
    pointerEvents: "none",
    boxSizing: "border-box",
    flexDirection: "column"
  };

  return (
    <div style={containerStyle}>
      {props.children}
    </div>
  )
}

function OverrideElement(props: OverrideProps) {
  const style: CSSProperties = {};

  switch (props.type) {
    case "b":
      style.fontWeight = props.arg === '0'? 'normal' : 'bold';
      break;
    case "i":
      style.fontStyle = props.arg === '0'? 'normal' : 'italic';
      break;
    case "s":
      style.textDecoration = props.arg === '0'? 'none' : 'line-through';
      break;
    case "u":
      style.textDecoration = props.arg === '0'? 'none' : 'line-through';
      break;
    default:
      console.log(`Requesting ${props.type} to be ${props.arg}`)
  }

  return <span style={style}>{props.children}</span>
}

export function subTextToJsx(p_subs: Subtitle[], styles: {[string]: any}, scale: number) {
  if (!p_subs || p_subs.length === 0) return;

  const sorted_subs: Subtitle[] = p_subs.sort((a, b) => {
    const styleA = styles[a.style.name];
    const styleB = styles[b.style.name];
    let vAlignSort;
    if (styleA.alignment.vertical === styleB.alignment.vertical) {
      vAlignSort = 0;
    } else if (styleA.alignment.vertical < styleB.alignment.vertical) {
      vAlignSort = -1;
    } else {
      vAlignSort = 1;
    }
    return styleA.marginL - styleB.marginL
      || styleA.marginR - styleB.marginR
      || styleA.marginV - styleB.marginV
      || vAlignSort;
  });

  const subs = groupBy(sorted_subs, (a, b) => {
    const styleA = styles[a.style.name];
    const styleB = styles[b.style.name];
    const marginLEq = styleA.marginL === styleB.marginL;
    const marginREq = styleA.marginR === styleB.marginR;
    const marginVEq = styleA.marginV === styleB.marginV;
    const vAlignEq = styleA.alignment.vertical === styleB.alignment.vertical;
    return marginLEq && marginREq && marginVEq && vAlignEq;
  });

  return subs.map(subGroup => {
    const {marginL, marginR, marginV, alignment: {horizontal, vertical}} = styles[subGroup[0].style.name];
    return (
      <SubtitleBlock
        anchorV={vertical}
        anchorH={horizontal}
        marginL={marginL * scale}
        marginR={marginR * scale}
        marginV={marginV * scale}>
        {
          subGroup.map(sub => {
            const style = styles[sub.style.name];
            const regex = /{\\(b|i|u|s|fn|fs|bord|be|fsc|fsp|fr|fe|a)([a-zA-Z\d %-]+)}|\\n/ig;
            const matches = matchAll(sub.text, regex);
            const cueStyles: CSSProperties = {
              fontWeight: "bold"
            };
            console.log("Style", style);

            return (
              <div
                style={{
                  ...cueStyles,
                  ...style,
                  fontSize: style["fontSize"] * scale * 0.75,
                  WebkitTextStrokeWidth: style["WebkitTextStrokeWidth"] * scale * 0.75,
                  letterSpacing: style["letterSpacing"] - 2
                }}
              >
                {subTextToJsxHelper(sub.text, [...matches], 0)}
              </div>
            )
          })
        }
      </SubtitleBlock>
    )
  });
}

function subTextToJsxHelper(text: string, matches: RegExpMatchArray[], index: number) {
  const match = matches.shift();
  if (!match) {
    return <span>{text.slice(index)}</span>
  } else {
    const leftover = index === match.index ? null : <span>{text.slice(index, match.index)}</span>;
    if (match[0].toLowerCase() === '\\n') {
      return (
        <>
          {leftover}
          <br />
          {subTextToJsxHelper(text, matches, match.index + match[0].length)}
        </>
      )
    }

    return (
      <>
        {leftover}
        <OverrideElement type={match[1]} arg={match[2]}>
          {subTextToJsxHelper(text, matches, match.index + match[0].length)}
        </OverrideElement>
      </>
    )
  }
}

export async function extractSubtitlesInto(input, output) {
  const subs = await extractSubtitles(input);
  const out = createWriteStream(output);

  out.write("WEBVTT - this is an auto-generated vtt sub file to make crime shut up\n\n");

  subs.subs.subs.forEach(sub => {
    out.write(`${millisToTime(sub.start)} --> ${millisToTime(sub.end)}\n`);
    out.write(escapeText(sub.text));
    out.write('\n\n')
  });

  out.close();
}

export type SubtitleData = {
  subs: Subtitles,
  styles: {[string]: any},
  width: number,
  height: number
};

export function extractSubtitles(input): Promise<SubtitleData> {
  return new Promise((resolve, reject) => {
    const header = {
      scriptInfo: {},
      styles: {},
      events: {}
    };
    const subs: Subtitle[] = [];
    const stream = createReadStream(input);
    const parser = new MatroskaSubtitles();
    stream.on("end", () => resolve({
      subs: new Subtitles(subs),
      styles: header.styles,
      width: parseInt(header.scriptInfo["PlayResX"], 10),
      height: parseInt(header.scriptInfo["PlayResY"], 10)
    }));
    parser.on("error", reject);
    parser.on('tracks', tracks => parseAssHeader(tracks[0].header, header));
    parser.on("subtitle", sub => {
      subs.push(new Subtitle(sub.text, sub.time, sub.time + sub.duration, {
        name: sub.style
      }));
    });
    stream.pipe(parser);
  });
}

export class Subtitle {
  constructor(text, start, end, style) {
    this.text = text;
    this.start = start;
    this.end = end;
    this.style = style;
  }
}

export class Subtitles {
  subs: Subtitle[];

  currentSubs: Subtitle[];

  leftoverSubs: Subtitle[];

  time: number;

  constructor(subs: Subtitle[]) {
    this.subs = [...subs].sort((s1, s2) => s1.start - s2.start);
    this.leftoverSubs = [...this.subs];
    this.currentSubs = [];
    this.time = 0;
  }

  moveSubs(time: number): Subtitles[] {
    this.time += time;
    this.currentSubs = this.currentSubs.filter(sub => sub.end >= this.time);
    this.currentSubs.push(...stealWhile(this.leftoverSubs, sub => sub.start <= this.time));

    return [...this.currentSubs];
  }

  positionSubs(time: number): Subtitles[] {
    this.time = time;
    this.currentSubs = [];
    this.leftoverSubs = dropWhile(this.subs, sub => sub.start < this.time);

    return this.moveSubs(0);
  }
}
