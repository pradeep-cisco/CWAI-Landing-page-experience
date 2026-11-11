import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';
import { d as check } from './index2.js';
import { c as clamp$1 } from './function-helper.js';
import { g as getBootstrapConfig, d as defineCustomElement$6 } from './icon.js';
import { d as defineCustomElement$8 } from './button.js';
import { d as defineCustomElement$7 } from './dropdown.js';
import { d as defineCustomElement$5 } from './input.js';
import { d as defineCustomElement$4 } from './popup.js';
import { d as defineCustomElement$3 } from './spinner.js';
import { d as defineCustomElement$2 } from './visually-hidden.js';

var colorString$1 = {exports: {}};

var colorName = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};

var simpleSwizzle = {exports: {}};

var isArrayish$1 = function isArrayish(obj) {
	if (!obj || typeof obj === 'string') {
		return false;
	}

	return obj instanceof Array || Array.isArray(obj) ||
		(obj.length >= 0 && (obj.splice instanceof Function ||
			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
};

var isArrayish = isArrayish$1;

var concat = Array.prototype.concat;
var slice = Array.prototype.slice;

var swizzle$1 = simpleSwizzle.exports = function swizzle(args) {
	var results = [];

	for (var i = 0, len = args.length; i < len; i++) {
		var arg = args[i];

		if (isArrayish(arg)) {
			// http://jsperf.com/javascript-array-concat-vs-push/98
			results = concat.call(results, slice.call(arg));
		} else {
			results.push(arg);
		}
	}

	return results;
};

swizzle$1.wrap = function (fn) {
	return function () {
		return fn(swizzle$1(arguments));
	};
};

/* MIT license */

var colorNames = colorName;
var swizzle = simpleSwizzle.exports;
var hasOwnProperty = Object.hasOwnProperty;

var reverseNames = Object.create(null);

// create a list of reverse color names
for (var name in colorNames) {
	if (hasOwnProperty.call(colorNames, name)) {
		reverseNames[colorNames[name]] = name;
	}
}

var cs = colorString$1.exports = {
	to: {},
	get: {}
};

cs.get = function (string) {
	var prefix = string.substring(0, 3).toLowerCase();
	var val;
	var model;
	switch (prefix) {
		case 'hsl':
			val = cs.get.hsl(string);
			model = 'hsl';
			break;
		case 'hwb':
			val = cs.get.hwb(string);
			model = 'hwb';
			break;
		default:
			val = cs.get.rgb(string);
			model = 'rgb';
			break;
	}

	if (!val) {
		return null;
	}

	return {model: model, value: val};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	var abbr = /^#([a-f0-9]{3,4})$/i;
	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
	var rgba = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/;
	var keyword = /^(\w+)$/;

	var rgb = [0, 0, 0, 1];
	var match;
	var i;
	var hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			var i2 = i * 2;
			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha, 16) / 255;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = parseInt(match[i + 1], 0);
		}

		if (match[4]) {
			if (match[5]) {
				rgb[3] = parseFloat(match[4]) * 0.01;
			} else {
				rgb[3] = parseFloat(match[4]);
			}
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			if (match[5]) {
				rgb[3] = parseFloat(match[4]) * 0.01;
			} else {
				rgb[3] = parseFloat(match[4]);
			}
		}
	} else if (match = string.match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		if (!hasOwnProperty.call(colorNames, match[1])) {
			return null;
		}

		rgb = colorNames[match[1]];
		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}
	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
	var match = string.match(hsl);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var s = clamp(parseFloat(match[2]), 0, 100);
		var l = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/;
	var match = string.match(hwb);

	if (match) {
		var alpha = parseFloat(match[4]);
		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
		var w = clamp(parseFloat(match[2]), 0, 100);
		var b = clamp(parseFloat(match[3]), 0, 100);
		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function () {
	var rgba = swizzle(arguments);

	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function () {
	var rgba = swizzle(arguments);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function () {
	var rgba = swizzle(arguments);

	var r = Math.round(rgba[0] / 255 * 100);
	var g = Math.round(rgba[1] / 255 * 100);
	var b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function () {
	var hsla = swizzle(arguments);
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function () {
	var hwba = swizzle(arguments);

	var a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// helpers
function clamp(num, min, max) {
	return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
	var str = Math.round(num).toString(16).toUpperCase();
	return (str.length < 2) ? '0' + str : str;
}

/* MIT license */

/* eslint-disable no-mixed-operators */
const cssKeywords = colorName;

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

const reverseKeywords = {};
for (const key of Object.keys(cssKeywords)) {
	reverseKeywords[cssKeywords[key]] = key;
}

const convert$2 = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
};

var conversions$2 = convert$2;

// Hide .channels and .labels properties
for (const model of Object.keys(convert$2)) {
	if (!('channels' in convert$2[model])) {
		throw new Error('missing channels property: ' + model);
	}

	if (!('labels' in convert$2[model])) {
		throw new Error('missing channel labels property: ' + model);
	}

	if (convert$2[model].labels.length !== convert$2[model].channels) {
		throw new Error('channel and label counts mismatch: ' + model);
	}

	const {channels, labels} = convert$2[model];
	delete convert$2[model].channels;
	delete convert$2[model].labels;
	Object.defineProperty(convert$2[model], 'channels', {value: channels});
	Object.defineProperty(convert$2[model], 'labels', {value: labels});
}

convert$2.rgb.hsl = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;
	let h;
	let s;

	if (max === min) {
		h = 0;
	} else if (r === max) {
		h = (g - b) / delta;
	} else if (g === max) {
		h = 2 + (b - r) / delta;
	} else if (b === max) {
		h = 4 + (r - g) / delta;
	}

	h = Math.min(h * 60, 360);

	if (h < 0) {
		h += 360;
	}

	const l = (min + max) / 2;

	if (max === min) {
		s = 0;
	} else if (l <= 0.5) {
		s = delta / (max + min);
	} else {
		s = delta / (2 - max - min);
	}

	return [h, s * 100, l * 100];
};

convert$2.rgb.hsv = function (rgb) {
	let rdif;
	let gdif;
	let bdif;
	let h;
	let s;

	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const v = Math.max(r, g, b);
	const diff = v - Math.min(r, g, b);
	const diffc = function (c) {
		return (v - c) / 6 / diff + 1 / 2;
	};

	if (diff === 0) {
		h = 0;
		s = 0;
	} else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) {
			h = bdif - gdif;
		} else if (g === v) {
			h = (1 / 3) + rdif - bdif;
		} else if (b === v) {
			h = (2 / 3) + gdif - rdif;
		}

		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}

	return [
		h * 360,
		s * 100,
		v * 100
	];
};

convert$2.rgb.hwb = function (rgb) {
	const r = rgb[0];
	const g = rgb[1];
	let b = rgb[2];
	const h = convert$2.rgb.hsl(rgb)[0];
	const w = 1 / 255 * Math.min(r, Math.min(g, b));

	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

	return [h, w * 100, b * 100];
};

convert$2.rgb.cmyk = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;

	const k = Math.min(1 - r, 1 - g, 1 - b);
	const c = (1 - r - k) / (1 - k) || 0;
	const m = (1 - g - k) / (1 - k) || 0;
	const y = (1 - b - k) / (1 - k) || 0;

	return [c * 100, m * 100, y * 100, k * 100];
};

function comparativeDistance(x, y) {
	/*
		See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
	*/
	return (
		((x[0] - y[0]) ** 2) +
		((x[1] - y[1]) ** 2) +
		((x[2] - y[2]) ** 2)
	);
}

convert$2.rgb.keyword = function (rgb) {
	const reversed = reverseKeywords[rgb];
	if (reversed) {
		return reversed;
	}

	let currentClosestDistance = Infinity;
	let currentClosestKeyword;

	for (const keyword of Object.keys(cssKeywords)) {
		const value = cssKeywords[keyword];

		// Compute comparative distance
		const distance = comparativeDistance(rgb, value);

		// Check if its less, if so set as closest
		if (distance < currentClosestDistance) {
			currentClosestDistance = distance;
			currentClosestKeyword = keyword;
		}
	}

	return currentClosestKeyword;
};

convert$2.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert$2.rgb.xyz = function (rgb) {
	let r = rgb[0] / 255;
	let g = rgb[1] / 255;
	let b = rgb[2] / 255;

	// Assume sRGB
	r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
	g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
	b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

	const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

	return [x * 100, y * 100, z * 100];
};

convert$2.rgb.lab = function (rgb) {
	const xyz = convert$2.rgb.xyz(rgb);
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert$2.hsl.rgb = function (hsl) {
	const h = hsl[0] / 360;
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;
	let t2;
	let t3;
	let val;

	if (s === 0) {
		val = l * 255;
		return [val, val, val];
	}

	if (l < 0.5) {
		t2 = l * (1 + s);
	} else {
		t2 = l + s - l * s;
	}

	const t1 = 2 * l - t2;

	const rgb = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * -(i - 1);
		if (t3 < 0) {
			t3++;
		}

		if (t3 > 1) {
			t3--;
		}

		if (6 * t3 < 1) {
			val = t1 + (t2 - t1) * 6 * t3;
		} else if (2 * t3 < 1) {
			val = t2;
		} else if (3 * t3 < 2) {
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		} else {
			val = t1;
		}

		rgb[i] = val * 255;
	}

	return rgb;
};

convert$2.hsl.hsv = function (hsl) {
	const h = hsl[0];
	let s = hsl[1] / 100;
	let l = hsl[2] / 100;
	let smin = s;
	const lmin = Math.max(l, 0.01);

	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;
	const v = (l + s) / 2;
	const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

	return [h, sv * 100, v * 100];
};

convert$2.hsv.rgb = function (hsv) {
	const h = hsv[0] / 60;
	const s = hsv[1] / 100;
	let v = hsv[2] / 100;
	const hi = Math.floor(h) % 6;

	const f = h - Math.floor(h);
	const p = 255 * v * (1 - s);
	const q = 255 * v * (1 - (s * f));
	const t = 255 * v * (1 - (s * (1 - f)));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert$2.hsv.hsl = function (hsv) {
	const h = hsv[0];
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;
	const vmin = Math.max(v, 0.01);
	let sl;
	let l;

	l = (2 - s) * v;
	const lmin = (2 - s) * vmin;
	sl = s * vmin;
	sl /= (lmin <= 1) ? lmin : 2 - lmin;
	sl = sl || 0;
	l /= 2;

	return [h, sl * 100, l * 100];
};

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
convert$2.hwb.rgb = function (hwb) {
	const h = hwb[0] / 360;
	let wh = hwb[1] / 100;
	let bl = hwb[2] / 100;
	const ratio = wh + bl;
	let f;

	// Wh + bl cant be > 1
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	const i = Math.floor(6 * h);
	const v = 1 - bl;
	f = 6 * h - i;

	if ((i & 0x01) !== 0) {
		f = 1 - f;
	}

	const n = wh + f * (v - wh); // Linear interpolation

	let r;
	let g;
	let b;
	/* eslint-disable max-statements-per-line,no-multi-spaces */
	switch (i) {
		default:
		case 6:
		case 0: r = v;  g = n;  b = wh; break;
		case 1: r = n;  g = v;  b = wh; break;
		case 2: r = wh; g = v;  b = n; break;
		case 3: r = wh; g = n;  b = v; break;
		case 4: r = n;  g = wh; b = v; break;
		case 5: r = v;  g = wh; b = n; break;
	}
	/* eslint-enable max-statements-per-line,no-multi-spaces */

	return [r * 255, g * 255, b * 255];
};

convert$2.cmyk.rgb = function (cmyk) {
	const c = cmyk[0] / 100;
	const m = cmyk[1] / 100;
	const y = cmyk[2] / 100;
	const k = cmyk[3] / 100;

	const r = 1 - Math.min(1, c * (1 - k) + k);
	const g = 1 - Math.min(1, m * (1 - k) + k);
	const b = 1 - Math.min(1, y * (1 - k) + k);

	return [r * 255, g * 255, b * 255];
};

convert$2.xyz.rgb = function (xyz) {
	const x = xyz[0] / 100;
	const y = xyz[1] / 100;
	const z = xyz[2] / 100;
	let r;
	let g;
	let b;

	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

	// Assume sRGB
	r = r > 0.0031308
		? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
		: r * 12.92;

	g = g > 0.0031308
		? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
		: g * 12.92;

	b = b > 0.0031308
		? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
		: b * 12.92;

	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);

	return [r * 255, g * 255, b * 255];
};

convert$2.xyz.lab = function (xyz) {
	let x = xyz[0];
	let y = xyz[1];
	let z = xyz[2];

	x /= 95.047;
	y /= 100;
	z /= 108.883;

	x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

	const l = (116 * y) - 16;
	const a = 500 * (x - y);
	const b = 200 * (y - z);

	return [l, a, b];
};

convert$2.lab.xyz = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let x;
	let y;
	let z;

	y = (l + 16) / 116;
	x = a / 500 + y;
	z = y - b / 200;

	const y2 = y ** 3;
	const x2 = x ** 3;
	const z2 = z ** 3;
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	x *= 95.047;
	y *= 100;
	z *= 108.883;

	return [x, y, z];
};

convert$2.lab.lch = function (lab) {
	const l = lab[0];
	const a = lab[1];
	const b = lab[2];
	let h;

	const hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;

	if (h < 0) {
		h += 360;
	}

	const c = Math.sqrt(a * a + b * b);

	return [l, c, h];
};

convert$2.lch.lab = function (lch) {
	const l = lch[0];
	const c = lch[1];
	const h = lch[2];

	const hr = h / 360 * 2 * Math.PI;
	const a = c * Math.cos(hr);
	const b = c * Math.sin(hr);

	return [l, a, b];
};

convert$2.rgb.ansi16 = function (args, saturation = null) {
	const [r, g, b] = args;
	let value = saturation === null ? convert$2.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

	value = Math.round(value / 50);

	if (value === 0) {
		return 30;
	}

	let ansi = 30
		+ ((Math.round(b / 255) << 2)
		| (Math.round(g / 255) << 1)
		| Math.round(r / 255));

	if (value === 2) {
		ansi += 60;
	}

	return ansi;
};

convert$2.hsv.ansi16 = function (args) {
	// Optimization here; we already know the value and don't need to get
	// it converted for us.
	return convert$2.rgb.ansi16(convert$2.hsv.rgb(args), args[2]);
};

convert$2.rgb.ansi256 = function (args) {
	const r = args[0];
	const g = args[1];
	const b = args[2];

	// We use the extended greyscale palette here, with the exception of
	// black and white. normal palette only has 4 greyscale shades.
	if (r === g && g === b) {
		if (r < 8) {
			return 16;
		}

		if (r > 248) {
			return 231;
		}

		return Math.round(((r - 8) / 247) * 24) + 232;
	}

	const ansi = 16
		+ (36 * Math.round(r / 255 * 5))
		+ (6 * Math.round(g / 255 * 5))
		+ Math.round(b / 255 * 5);

	return ansi;
};

convert$2.ansi16.rgb = function (args) {
	let color = args % 10;

	// Handle greyscale
	if (color === 0 || color === 7) {
		if (args > 50) {
			color += 3.5;
		}

		color = color / 10.5 * 255;

		return [color, color, color];
	}

	const mult = (~~(args > 50) + 1) * 0.5;
	const r = ((color & 1) * mult) * 255;
	const g = (((color >> 1) & 1) * mult) * 255;
	const b = (((color >> 2) & 1) * mult) * 255;

	return [r, g, b];
};

convert$2.ansi256.rgb = function (args) {
	// Handle greyscale
	if (args >= 232) {
		const c = (args - 232) * 10 + 8;
		return [c, c, c];
	}

	args -= 16;

	let rem;
	const r = Math.floor(args / 36) / 5 * 255;
	const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
	const b = (rem % 6) / 5 * 255;

	return [r, g, b];
};

convert$2.rgb.hex = function (args) {
	const integer = ((Math.round(args[0]) & 0xFF) << 16)
		+ ((Math.round(args[1]) & 0xFF) << 8)
		+ (Math.round(args[2]) & 0xFF);

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert$2.hex.rgb = function (args) {
	const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) {
		return [0, 0, 0];
	}

	let colorString = match[0];

	if (match[0].length === 3) {
		colorString = colorString.split('').map(char => {
			return char + char;
		}).join('');
	}

	const integer = parseInt(colorString, 16);
	const r = (integer >> 16) & 0xFF;
	const g = (integer >> 8) & 0xFF;
	const b = integer & 0xFF;

	return [r, g, b];
};

convert$2.rgb.hcg = function (rgb) {
	const r = rgb[0] / 255;
	const g = rgb[1] / 255;
	const b = rgb[2] / 255;
	const max = Math.max(Math.max(r, g), b);
	const min = Math.min(Math.min(r, g), b);
	const chroma = (max - min);
	let grayscale;
	let hue;

	if (chroma < 1) {
		grayscale = min / (1 - chroma);
	} else {
		grayscale = 0;
	}

	if (chroma <= 0) {
		hue = 0;
	} else
	if (max === r) {
		hue = ((g - b) / chroma) % 6;
	} else
	if (max === g) {
		hue = 2 + (b - r) / chroma;
	} else {
		hue = 4 + (r - g) / chroma;
	}

	hue /= 6;
	hue %= 1;

	return [hue * 360, chroma * 100, grayscale * 100];
};

convert$2.hsl.hcg = function (hsl) {
	const s = hsl[1] / 100;
	const l = hsl[2] / 100;

	const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

	let f = 0;
	if (c < 1.0) {
		f = (l - 0.5 * c) / (1.0 - c);
	}

	return [hsl[0], c * 100, f * 100];
};

convert$2.hsv.hcg = function (hsv) {
	const s = hsv[1] / 100;
	const v = hsv[2] / 100;

	const c = s * v;
	let f = 0;

	if (c < 1.0) {
		f = (v - c) / (1 - c);
	}

	return [hsv[0], c * 100, f * 100];
};

convert$2.hcg.rgb = function (hcg) {
	const h = hcg[0] / 360;
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	if (c === 0.0) {
		return [g * 255, g * 255, g * 255];
	}

	const pure = [0, 0, 0];
	const hi = (h % 1) * 6;
	const v = hi % 1;
	const w = 1 - v;
	let mg = 0;

	/* eslint-disable max-statements-per-line */
	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}
	/* eslint-enable max-statements-per-line */

	mg = (1.0 - c) * g;

	return [
		(c * pure[0] + mg) * 255,
		(c * pure[1] + mg) * 255,
		(c * pure[2] + mg) * 255
	];
};

convert$2.hcg.hsv = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const v = c + g * (1.0 - c);
	let f = 0;

	if (v > 0.0) {
		f = c / v;
	}

	return [hcg[0], f * 100, v * 100];
};

convert$2.hcg.hsl = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;

	const l = g * (1.0 - c) + 0.5 * c;
	let s = 0;

	if (l > 0.0 && l < 0.5) {
		s = c / (2 * l);
	} else
	if (l >= 0.5 && l < 1.0) {
		s = c / (2 * (1 - l));
	}

	return [hcg[0], s * 100, l * 100];
};

convert$2.hcg.hwb = function (hcg) {
	const c = hcg[1] / 100;
	const g = hcg[2] / 100;
	const v = c + g * (1.0 - c);
	return [hcg[0], (v - c) * 100, (1 - v) * 100];
};

convert$2.hwb.hcg = function (hwb) {
	const w = hwb[1] / 100;
	const b = hwb[2] / 100;
	const v = 1 - b;
	const c = v - w;
	let g = 0;

	if (c < 1) {
		g = (v - c) / (1 - c);
	}

	return [hwb[0], c * 100, g * 100];
};

convert$2.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert$2.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert$2.gray.rgb = function (args) {
	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
};

convert$2.gray.hsl = function (args) {
	return [0, 0, args[0]];
};

convert$2.gray.hsv = convert$2.gray.hsl;

convert$2.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert$2.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert$2.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert$2.gray.hex = function (gray) {
	const val = Math.round(gray[0] / 100 * 255) & 0xFF;
	const integer = (val << 16) + (val << 8) + val;

	const string = integer.toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert$2.rgb.gray = function (rgb) {
	const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
	return [val / 255 * 100];
};

const conversions$1 = conversions$2;

/*
	This function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
	const graph = {};
	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
	const models = Object.keys(conversions$1);

	for (let len = models.length, i = 0; i < len; i++) {
		graph[models[i]] = {
			// http://jsperf.com/1-vs-infinity
			// micro-opt, but this is simple.
			distance: -1,
			parent: null
		};
	}

	return graph;
}

// https://en.wikipedia.org/wiki/Breadth-first_search
function deriveBFS(fromModel) {
	const graph = buildGraph();
	const queue = [fromModel]; // Unshift -> queue -> pop

	graph[fromModel].distance = 0;

	while (queue.length) {
		const current = queue.pop();
		const adjacents = Object.keys(conversions$1[current]);

		for (let len = adjacents.length, i = 0; i < len; i++) {
			const adjacent = adjacents[i];
			const node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	const path = [graph[toModel].parent, toModel];
	let fn = conversions$1[graph[toModel].parent][toModel];

	let cur = graph[toModel].parent;
	while (graph[cur].parent) {
		path.unshift(graph[cur].parent);
		fn = link(conversions$1[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

var route$1 = function (fromModel) {
	const graph = deriveBFS(fromModel);
	const conversion = {};

	const models = Object.keys(graph);
	for (let len = models.length, i = 0; i < len; i++) {
		const toModel = models[i];
		const node = graph[toModel];

		if (node.parent === null) {
			// No possible conversion, or this node is the source model.
			continue;
		}

		conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};

const conversions = conversions$2;
const route = route$1;

const convert$1 = {};

const models = Object.keys(conversions);

function wrapRaw(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];
		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		return fn(args);
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

function wrapRounded(fn) {
	const wrappedFn = function (...args) {
		const arg0 = args[0];

		if (arg0 === undefined || arg0 === null) {
			return arg0;
		}

		if (arg0.length > 1) {
			args = arg0;
		}

		const result = fn(args);

		// We're assuming the result is an array here.
		// see notice in conversions.js; don't use box types
		// in conversion functions.
		if (typeof result === 'object') {
			for (let len = result.length, i = 0; i < len; i++) {
				result[i] = Math.round(result[i]);
			}
		}

		return result;
	};

	// Preserve .conversion property if there is one
	if ('conversion' in fn) {
		wrappedFn.conversion = fn.conversion;
	}

	return wrappedFn;
}

models.forEach(fromModel => {
	convert$1[fromModel] = {};

	Object.defineProperty(convert$1[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert$1[fromModel], 'labels', {value: conversions[fromModel].labels});

	const routes = route(fromModel);
	const routeModels = Object.keys(routes);

	routeModels.forEach(toModel => {
		const fn = routes[toModel];

		convert$1[fromModel][toModel] = wrapRounded(fn);
		convert$1[fromModel][toModel].raw = wrapRaw(fn);
	});
});

var colorConvert = convert$1;

const colorString = colorString$1.exports;
const convert = colorConvert;

const skippedModels = [
	// To be honest, I don't really feel like keyword belongs in color convert, but eh.
	'keyword',

	// Gray conflicts with some method names, and has its own method defined.
	'gray',

	// Shouldn't really be in color-convert either...
	'hex',
];

const hashedModelKeys = {};
for (const model of Object.keys(convert)) {
	hashedModelKeys[[...convert[model].labels].sort().join('')] = model;
}

const limiters = {};

function Color(object, model) {
	if (!(this instanceof Color)) {
		return new Color(object, model);
	}

	if (model && model in skippedModels) {
		model = null;
	}

	if (model && !(model in convert)) {
		throw new Error('Unknown model: ' + model);
	}

	let i;
	let channels;

	if (object == null) { // eslint-disable-line no-eq-null,eqeqeq
		this.model = 'rgb';
		this.color = [0, 0, 0];
		this.valpha = 1;
	} else if (object instanceof Color) {
		this.model = object.model;
		this.color = [...object.color];
		this.valpha = object.valpha;
	} else if (typeof object === 'string') {
		const result = colorString.get(object);
		if (result === null) {
			throw new Error('Unable to parse color from string: ' + object);
		}

		this.model = result.model;
		channels = convert[this.model].channels;
		this.color = result.value.slice(0, channels);
		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
	} else if (object.length > 0) {
		this.model = model || 'rgb';
		channels = convert[this.model].channels;
		const newArray = Array.prototype.slice.call(object, 0, channels);
		this.color = zeroArray(newArray, channels);
		this.valpha = typeof object[channels] === 'number' ? object[channels] : 1;
	} else if (typeof object === 'number') {
		// This is always RGB - can be converted later on.
		this.model = 'rgb';
		this.color = [
			(object >> 16) & 0xFF,
			(object >> 8) & 0xFF,
			object & 0xFF,
		];
		this.valpha = 1;
	} else {
		this.valpha = 1;

		const keys = Object.keys(object);
		if ('alpha' in object) {
			keys.splice(keys.indexOf('alpha'), 1);
			this.valpha = typeof object.alpha === 'number' ? object.alpha : 0;
		}

		const hashedKeys = keys.sort().join('');
		if (!(hashedKeys in hashedModelKeys)) {
			throw new Error('Unable to parse color from object: ' + JSON.stringify(object));
		}

		this.model = hashedModelKeys[hashedKeys];

		const {labels} = convert[this.model];
		const color = [];
		for (i = 0; i < labels.length; i++) {
			color.push(object[labels[i]]);
		}

		this.color = zeroArray(color);
	}

	// Perform limitations (clamping, etc.)
	if (limiters[this.model]) {
		channels = convert[this.model].channels;
		for (i = 0; i < channels; i++) {
			const limit = limiters[this.model][i];
			if (limit) {
				this.color[i] = limit(this.color[i]);
			}
		}
	}

	this.valpha = Math.max(0, Math.min(1, this.valpha));

	if (Object.freeze) {
		Object.freeze(this);
	}
}

Color.prototype = {
	toString() {
		return this.string();
	},

	toJSON() {
		return this[this.model]();
	},

	string(places) {
		let self = this.model in colorString.to ? this : this.rgb();
		self = self.round(typeof places === 'number' ? places : 1);
		const args = self.valpha === 1 ? self.color : [...self.color, this.valpha];
		return colorString.to[self.model](args);
	},

	percentString(places) {
		const self = this.rgb().round(typeof places === 'number' ? places : 1);
		const args = self.valpha === 1 ? self.color : [...self.color, this.valpha];
		return colorString.to.rgb.percent(args);
	},

	array() {
		return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
	},

	object() {
		const result = {};
		const {channels} = convert[this.model];
		const {labels} = convert[this.model];

		for (let i = 0; i < channels; i++) {
			result[labels[i]] = this.color[i];
		}

		if (this.valpha !== 1) {
			result.alpha = this.valpha;
		}

		return result;
	},

	unitArray() {
		const rgb = this.rgb().color;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;

		if (this.valpha !== 1) {
			rgb.push(this.valpha);
		}

		return rgb;
	},

	unitObject() {
		const rgb = this.rgb().object();
		rgb.r /= 255;
		rgb.g /= 255;
		rgb.b /= 255;

		if (this.valpha !== 1) {
			rgb.alpha = this.valpha;
		}

		return rgb;
	},

	round(places) {
		places = Math.max(places || 0, 0);
		return new Color([...this.color.map(roundToPlace(places)), this.valpha], this.model);
	},

	alpha(value) {
		if (value !== undefined) {
			return new Color([...this.color, Math.max(0, Math.min(1, value))], this.model);
		}

		return this.valpha;
	},

	// Rgb
	red: getset('rgb', 0, maxfn(255)),
	green: getset('rgb', 1, maxfn(255)),
	blue: getset('rgb', 2, maxfn(255)),

	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, value => ((value % 360) + 360) % 360),

	saturationl: getset('hsl', 1, maxfn(100)),
	lightness: getset('hsl', 2, maxfn(100)),

	saturationv: getset('hsv', 1, maxfn(100)),
	value: getset('hsv', 2, maxfn(100)),

	chroma: getset('hcg', 1, maxfn(100)),
	gray: getset('hcg', 2, maxfn(100)),

	white: getset('hwb', 1, maxfn(100)),
	wblack: getset('hwb', 2, maxfn(100)),

	cyan: getset('cmyk', 0, maxfn(100)),
	magenta: getset('cmyk', 1, maxfn(100)),
	yellow: getset('cmyk', 2, maxfn(100)),
	black: getset('cmyk', 3, maxfn(100)),

	x: getset('xyz', 0, maxfn(95.047)),
	y: getset('xyz', 1, maxfn(100)),
	z: getset('xyz', 2, maxfn(108.833)),

	l: getset('lab', 0, maxfn(100)),
	a: getset('lab', 1),
	b: getset('lab', 2),

	keyword(value) {
		if (value !== undefined) {
			return new Color(value);
		}

		return convert[this.model].keyword(this.color);
	},

	hex(value) {
		if (value !== undefined) {
			return new Color(value);
		}

		return colorString.to.hex(this.rgb().round().color);
	},

	hexa(value) {
		if (value !== undefined) {
			return new Color(value);
		}

		const rgbArray = this.rgb().round().color;

		let alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();
		if (alphaHex.length === 1) {
			alphaHex = '0' + alphaHex;
		}

		return colorString.to.hex(rgbArray) + alphaHex;
	},

	rgbNumber() {
		const rgb = this.rgb().color;
		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
	},

	luminosity() {
		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
		const rgb = this.rgb().color;

		const lum = [];
		for (const [i, element] of rgb.entries()) {
			const chan = element / 255;
			lum[i] = (chan <= 0.04045) ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;
		}

		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
	},

	contrast(color2) {
		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
		const lum1 = this.luminosity();
		const lum2 = color2.luminosity();

		if (lum1 > lum2) {
			return (lum1 + 0.05) / (lum2 + 0.05);
		}

		return (lum2 + 0.05) / (lum1 + 0.05);
	},

	level(color2) {
		// https://www.w3.org/TR/WCAG/#contrast-enhanced
		const contrastRatio = this.contrast(color2);
		if (contrastRatio >= 7) {
			return 'AAA';
		}

		return (contrastRatio >= 4.5) ? 'AA' : '';
	},

	isDark() {
		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
		const rgb = this.rgb().color;
		const yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 10000;
		return yiq < 128;
	},

	isLight() {
		return !this.isDark();
	},

	negate() {
		const rgb = this.rgb();
		for (let i = 0; i < 3; i++) {
			rgb.color[i] = 255 - rgb.color[i];
		}

		return rgb;
	},

	lighten(ratio) {
		const hsl = this.hsl();
		hsl.color[2] += hsl.color[2] * ratio;
		return hsl;
	},

	darken(ratio) {
		const hsl = this.hsl();
		hsl.color[2] -= hsl.color[2] * ratio;
		return hsl;
	},

	saturate(ratio) {
		const hsl = this.hsl();
		hsl.color[1] += hsl.color[1] * ratio;
		return hsl;
	},

	desaturate(ratio) {
		const hsl = this.hsl();
		hsl.color[1] -= hsl.color[1] * ratio;
		return hsl;
	},

	whiten(ratio) {
		const hwb = this.hwb();
		hwb.color[1] += hwb.color[1] * ratio;
		return hwb;
	},

	blacken(ratio) {
		const hwb = this.hwb();
		hwb.color[2] += hwb.color[2] * ratio;
		return hwb;
	},

	grayscale() {
		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
		const rgb = this.rgb().color;
		const value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
		return Color.rgb(value, value, value);
	},

	fade(ratio) {
		return this.alpha(this.valpha - (this.valpha * ratio));
	},

	opaquer(ratio) {
		return this.alpha(this.valpha + (this.valpha * ratio));
	},

	rotate(degrees) {
		const hsl = this.hsl();
		let hue = hsl.color[0];
		hue = (hue + degrees) % 360;
		hue = hue < 0 ? 360 + hue : hue;
		hsl.color[0] = hue;
		return hsl;
	},

	mix(mixinColor, weight) {
		// Ported from sass implementation in C
		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
		if (!mixinColor || !mixinColor.rgb) {
			throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
		}

		const color1 = mixinColor.rgb();
		const color2 = this.rgb();
		const p = weight === undefined ? 0.5 : weight;

		const w = 2 * p - 1;
		const a = color1.alpha() - color2.alpha();

		const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
		const w2 = 1 - w1;

		return Color.rgb(
			w1 * color1.red() + w2 * color2.red(),
			w1 * color1.green() + w2 * color2.green(),
			w1 * color1.blue() + w2 * color2.blue(),
			color1.alpha() * p + color2.alpha() * (1 - p));
	},
};

// Model conversion methods and static constructors
for (const model of Object.keys(convert)) {
	if (skippedModels.includes(model)) {
		continue;
	}

	const {channels} = convert[model];

	// Conversion methods
	Color.prototype[model] = function (...args) {
		if (this.model === model) {
			return new Color(this);
		}

		if (args.length > 0) {
			return new Color(args, model);
		}

		return new Color([...assertArray(convert[this.model][model].raw(this.color)), this.valpha], model);
	};

	// 'static' construction methods
	Color[model] = function (...args) {
		let color = args[0];
		if (typeof color === 'number') {
			color = zeroArray(args, channels);
		}

		return new Color(color, model);
	};
}

function roundTo(number, places) {
	return Number(number.toFixed(places));
}

function roundToPlace(places) {
	return function (number) {
		return roundTo(number, places);
	};
}

function getset(model, channel, modifier) {
	model = Array.isArray(model) ? model : [model];

	for (const m of model) {
		(limiters[m] || (limiters[m] = []))[channel] = modifier;
	}

	model = model[0];

	return function (value) {
		let result;

		if (value !== undefined) {
			if (modifier) {
				value = modifier(value);
			}

			result = this[model]();
			result.color[channel] = value;
			return result;
		}

		result = this[model]().color[channel];
		if (modifier) {
			result = modifier(result);
		}

		return result;
	};
}

function maxfn(max) {
	return function (v) {
		return Math.max(0, Math.min(max, v));
	};
}

function assertArray(value) {
	return Array.isArray(value) ? value : [value];
}

function zeroArray(array, length) {
	for (let i = 0; i < length; i++) {
		if (typeof array[i] !== 'number') {
			array[i] = 0;
		}
	}

	return array;
}

var color = Color;

const color$1 = color;

const colorPickerCss = ":host{position:relative;box-sizing:border-box}:host *,:host *:before,:host *:after{box-sizing:inherit}:host{--grid-width:260px;--grid-height:200px;--grid-handle-size:16px;--slider-height:12px;--slider-handle-size:14px;display:inline-block}.color-picker{width:var(--grid-width);font-family:var(--hbr-font-body);font-size:var(--hbr-font-size-md);font-weight:var(--hbr-font-weight-normal);color:var(--base-text-default);background-color:var(--control-bg-weak-default);border-radius:var(--hbr-border-radius-md);user-select:none}.color-picker--inline{border:solid 1px var(--hbr-panel-border-color);box-shadow:var(--hbr-shadow-sm)}.color-picker__grid{position:relative;height:var(--grid-height);background-image:linear-gradient(to bottom, hsl(0, 0%, 100%) 0%, hsla(0, 0%, 100%, 0) 50%, hsla(0, 0%, 0%, 0) 50%, hsl(0, 0%, 0%) 100%), linear-gradient(to right, hsl(0, 0%, 50%) 0%, hsla(0, 0%, 50%, 0) 100%);border-top-left-radius:var(--hbr-border-radius-md);border-top-right-radius:var(--hbr-border-radius-md);cursor:crosshair}.color-picker__grid-handle{position:absolute;width:var(--grid-handle-size);height:var(--grid-handle-size);border-radius:50%;box-shadow:0 0 0 1px rgba(0, 0, 0, 0.25);border:solid 2px white;margin-top:calc(var(--grid-handle-size) / -2);margin-left:calc(var(--grid-handle-size) / -2)}.color-picker__grid-handle:focus{outline:none;box-shadow:0 0 0 1px rgba(62, 132, 229, 0.2), 0 0 0 var(--hbr-focus-ring-width) var(--hbr-focus-ring-color-primary)}.color-picker__controls{padding:var(--hbr-spacing-sm);display:flex;align-items:center}.color-picker__sliders{flex:1 1 auto}.color-picker__slider{position:relative;height:var(--slider-height);border-radius:var(--hbr-border-radius-pill);box-shadow:inset 0 0 0 1px rgba(0, 0, 0, 0.2)}.color-picker__slider:not(:last-of-type){margin-bottom:var(--hbr-spacing-sm)}.color-picker__slider-handle{position:absolute;top:calc(50% - var(--slider-handle-size) / 2);width:var(--slider-handle-size);height:var(--slider-handle-size);background-color:white;border-radius:50%;box-shadow:0 0 0 1px rgba(0, 0, 0, 0.25);margin-left:calc(var(--slider-handle-size) / -2)}.color-picker__slider-handle:focus{outline:none;box-shadow:0 0 0 1px rgba(62, 132, 229, 0.2), 0 0 0 var(--hbr-focus-ring-width) var(--hbr-focus-ring-color-primary)}.color-picker__hue{background-image:linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 67%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)}.color-picker__alpha .color-picker__alpha-gradient{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:inherit}.color-picker__preview{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;position:relative;width:3.125rem;height:var(--hbr-control-height-sm);border:none;border-radius:var(--hbr-control-border-radius-sm);background:none;margin-left:var(--hbr-spacing-sm);cursor:copy}.color-picker__preview::before{content:\"\";position:absolute;top:0;left:0;width:100%;height:100%;border-radius:inherit;box-shadow:inset 0 0 0 1px rgba(0, 0, 0, 0.2);background-color:var(--preview-color)}.color-picker__preview:focus{box-shadow:0 0 0 var(--hbr-focus-ring-width) var(--hbr-focus-ring-color-primary);outline:none}.color-picker__preview-color{position:absolute;top:0;left:0;width:100%;height:100%;border:solid 1px rgba(0, 0, 0, 0.125)}.color-picker__copy-feedback{width:calc(var(--hbr-control-height-sm) / 2);height:calc(var(--hbr-control-height-sm) / 2);color:white;background-color:rgba(0, 0, 0, 0.33);border-radius:var(--hbr-border-radius-circle);opacity:0}.color-picker__copy-feedback.color-picker__copy-feedback--visible{animation:copied 1s}@keyframes copied{0%{transform:scale(0.5);opacity:0}25%{transform:scale(1.2);opacity:1}50%{transform:scale(1);opacity:1}100%{transform:scale(1.6);opacity:0}}.color-picker__user-input{display:flex;padding:0 var(--hbr-spacing-sm) var(--hbr-spacing-sm) var(--hbr-spacing-sm)}.color-picker__user-input hbr-input{min-width:0;flex:1 1 auto}.color-picker__user-input hbr-button{min-width:3.125rem;max-width:3.125rem;font-size:1rem;margin-left:var(--hbr-spacing-sm)}.color-picker__swatches{display:grid;grid-template-columns:repeat(8, 1fr);grid-gap:6px;justify-items:center;border-top:solid 1px transparent;padding:var(--hbr-spacing-sm)}.color-picker__swatch{flex:0 0 auto;position:relative;width:20px;height:20px;border-radius:2px}.color-picker__swatch .color-picker__swatch-color{position:absolute;top:0;left:0;width:100%;height:100%;border:solid 1px rgba(0, 0, 0, 0.125);border-radius:inherit;cursor:pointer}.color-picker__swatch:focus{outline:none;box-shadow:0 0 0 var(--hbr-focus-ring-width) var(--hbr-focus-ring-color-primary)}.color-picker__transparent-bg{background-image:linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(45deg, #eee 25%, transparent 25%);background-size:10px 10px;background-position:0 0, 0 0, -5px -5px, 5px 5px}.color-picker--disabled{opacity:0.5;cursor:not-allowed}.color-picker--disabled .color-picker__grid,.color-picker--disabled .color-picker__grid-handle,.color-picker--disabled .color-picker__slider,.color-picker--disabled .color-picker__slider-handle,.color-picker--disabled .color-picker__preview,.color-picker--disabled .color-picker__swatch,.color-picker--disabled .color-picker__swatch-color{pointer-events:none}.color-dropdown::part(panel){max-height:none;overflow:visible}.color-dropdown__trigger{display:inline-block;position:relative;background-color:transparent;border:none;cursor:pointer;transition:var(--hbr-transition-fast) box-shadow}.color-dropdown__trigger.color-dropdown__trigger--sm{width:var(--hbr-control-height-sm);height:var(--hbr-control-height-sm);border-radius:var(--hbr-border-radius-circle)}.color-dropdown__trigger.color-dropdown__trigger--md{width:var(--hbr-control-height-md);height:var(--hbr-control-height-md);border-radius:var(--hbr-border-radius-circle)}.color-dropdown__trigger.color-dropdown__trigger--lg{width:var(--hbr-control-height-lg);height:var(--hbr-control-height-lg);border-radius:var(--hbr-border-radius-circle)}.color-dropdown__trigger::before{content:\"\";position:absolute;top:0;left:0;width:100%;height:100%;border-radius:inherit;background-color:currentColor;box-shadow:inset 0 0 0 1px rgba(0, 0, 0, 0.25);transition:inherit}.color-dropdown__trigger:focus{outline:none}.color-dropdown__trigger:focus:not(.color-dropdown__trigger--disabled){box-shadow:0 0 0 var(--hbr-focus-ring-width) var(--hbr-focus-ring-color-primary);outline:none}.color-dropdown__trigger:focus:not(.color-dropdown__trigger--disabled)::before{box-shadow:inset 0 0 0 1px rgba(62, 132, 229, 0.2)}.color-dropdown__trigger.color-dropdown__trigger--disabled{opacity:0.5;cursor:not-allowed}";
const HbrColorPickerStyle0 = colorPickerCss;

const ColorPicker = /*@__PURE__*/ proxyCustomElement(class ColorPicker extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        this.hbrChange = createEvent(this, "hbr-change", 7);
        this.hbrShow = createEvent(this, "hbr-show", 7);
        this.hbrAfterShow = createEvent(this, "hbr-after-show", 7);
        this.hbrHide = createEvent(this, "hbr-hide", 7);
        this.hbrAfterHide = createEvent(this, "hbr-after-hide", 7);
        this.bypassValueParse = false;
        this.inputValue = "";
        this.hue = 0;
        this.saturation = 100;
        this.lightness = 100;
        this.alpha = 100;
        this.showCopyFeedback = false;
        this.value = "#ffffff";
        this.format = "hex";
        this.inline = false;
        this.size = "medium";
        this.noFormatToggle = false;
        this.name = "";
        this.disabled = false;
        this.invalid = false;
        this.hoist = false;
        this.opacity = false;
        this.uppercase = false;
        this.swatches = [
            "#d0021b",
            "#f5a623",
            "#f8e71c",
            "#8b572a",
            "#7ed321",
            "#417505",
            "#bd10e0",
            "#9013fe",
            "#4a90e2",
            "#50e3c2",
            "#b8e986",
            "#000",
            "#444",
            "#888",
            "#ccc",
            "#fff",
        ];
    }
    handleFormatChange() {
        this.syncValues();
    }
    handleOpacityChange() {
        this.alpha = 100;
    }
    handleValueChange(newValue, oldValue) {
        if (!this.bypassValueParse) {
            const newColor = this.parseColor(newValue);
            if (newColor) {
                this.inputValue = this.value;
                this.hue = newColor.hsla.h;
                this.saturation = newColor.hsla.s;
                this.lightness = newColor.hsla.l;
                this.alpha = newColor.hsla.a * 100;
            }
            else {
                this.inputValue = oldValue;
            }
        }
        if (this.value !== this.lastValueEmitted) {
            this.hbrChange.emit();
            this.lastValueEmitted = this.value;
        }
    }
    connectedCallback() {
        this.handleAlphaDrag = this.handleAlphaDrag.bind(this);
        this.handleAlphaInput = this.handleAlphaInput.bind(this);
        this.handleAlphaKeyDown = this.handleAlphaKeyDown.bind(this);
        this.handleCopy = this.handleCopy.bind(this);
        this.handleFormatToggle = this.handleFormatToggle.bind(this);
        this.handleDocumentMouseDown = this.handleDocumentMouseDown.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleDropdownAfterHide = this.handleDropdownAfterHide.bind(this);
        this.handleDropdownAfterShow = this.handleDropdownAfterShow.bind(this);
        this.handleDropdownHide = this.handleDropdownHide.bind(this);
        this.handleDropdownShow = this.handleDropdownShow.bind(this);
        this.handleGridDrag = this.handleGridDrag.bind(this);
        this.handleGridKeyDown = this.handleGridKeyDown.bind(this);
        this.handleHueDrag = this.handleHueDrag.bind(this);
        this.handleHueInput = this.handleHueInput.bind(this);
        this.handleHueKeyDown = this.handleHueKeyDown.bind(this);
        this.handleLightnessInput = this.handleLightnessInput.bind(this);
        this.handleSaturationInput = this.handleSaturationInput.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    }
    componentWillLoad() {
        if (!this.setColor(this.value)) {
            this.setColor("#ffff");
        }
        this.inputValue = this.value;
        this.lastValueEmitted = this.value;
        this.syncValues();
    }
    /** Returns the current value as a string in the specified format. */
    async getFormattedValue(format = "hex") {
        const currentColor = this.parseColor(`hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha / 100})`);
        if (!currentColor) {
            return "";
        }
        switch (format) {
            case "hex":
                return currentColor.hex;
            case "hexa":
                return currentColor.hexa;
            case "rgb":
                return currentColor.rgb.string;
            case "rgba":
                return currentColor.rgba.string;
            case "hsl":
                return currentColor.hsl.string;
            case "hsla":
                return currentColor.hsla.string;
            default:
                return "";
        }
    }
    /** Checks for validity and shows the browser's validation message if the control is invalid. */
    async reportValidity() {
        // If the input is invalid, show the dropdown so the browser can focus on it
        if (!this.inline && this.input.invalid) {
            return new Promise((resolve) => {
                this.dropdown.addEventListener("hbr-after-show", () => {
                    this.input.reportValidity();
                    resolve();
                }, { once: true });
                this.dropdown.show();
            });
        }
        return this.input.reportValidity();
    }
    /** Sets a custom validation message. If `message` is not empty, the field will be considered invalid. */
    async setCustomValidity(message) {
        await this.input.setCustomValidity(message);
        this.invalid = this.input.invalid;
    }
    handleCopy() {
        this.input.select().then(() => {
            document.execCommand("copy");
            this.previewButton.focus();
            this.showCopyFeedback = true;
            this.previewButton.addEventListener("animationend", () => {
                this.showCopyFeedback = false;
            }, { once: true });
        });
    }
    handleFormatToggle() {
        const formats = ["hex", "rgb", "hsl"];
        const nextIndex = (formats.indexOf(this.format) + 1) % formats.length;
        this.format = formats[nextIndex];
    }
    handleHueInput(event) {
        const target = event.target;
        this.hue = clamp$1(Number(target.value), 0, 360);
    }
    handleSaturationInput(event) {
        const target = event.target;
        this.saturation = clamp$1(Number(target.value), 0, 100);
    }
    handleLightnessInput(event) {
        const target = event.target;
        this.lightness = clamp$1(Number(target.value), 0, 100);
    }
    handleAlphaInput(event) {
        const target = event.target;
        this.alpha = clamp$1(Number(target.value), 0, 100);
    }
    handleAlphaDrag(event) {
        const container = this.host.shadowRoot.querySelector(".color-picker__slider.color-picker__alpha");
        const handle = container.querySelector(".color-picker__slider-handle");
        const { width } = container.getBoundingClientRect();
        handle.focus();
        event.preventDefault();
        this.handleDrag(event, container, (x) => {
            this.alpha = clamp$1((x / width) * 100, 0, 100);
            this.syncValues();
        });
    }
    handleHueDrag(event) {
        const container = this.host.shadowRoot.querySelector(".color-picker__slider.color-picker__hue");
        const handle = container.querySelector(".color-picker__slider-handle");
        const { width } = container.getBoundingClientRect();
        handle.focus();
        event.preventDefault();
        this.handleDrag(event, container, (x) => {
            this.hue = clamp$1((x / width) * 360, 0, 360);
            this.syncValues();
        });
    }
    handleGridDrag(event) {
        const grid = this.host.shadowRoot.querySelector(".color-picker__grid");
        const handle = grid.querySelector(".color-picker__grid-handle");
        const { width, height } = grid.getBoundingClientRect();
        handle.focus();
        event.preventDefault();
        this.handleDrag(event, grid, (x, y) => {
            this.saturation = clamp$1((x / width) * 100, 0, 100);
            this.lightness = clamp$1(100 - (y / height) * 100, 0, 100);
            this.syncValues();
        });
    }
    handleDrag(event, container, onMove) {
        if (this.disabled) {
            return false;
        }
        const move = (event) => {
            const dims = container.getBoundingClientRect();
            const offsetX = dims.left + container.ownerDocument.defaultView.pageXOffset;
            const offsetY = dims.top + container.ownerDocument.defaultView.pageYOffset;
            const pageX = "changedTouches" in event ? event.changedTouches[0].pageX : event.pageX;
            const pageY = "changedTouches" in event ? event.changedTouches[0].pageY : event.pageY;
            const x = pageX - offsetX;
            const y = pageY - offsetY;
            onMove(x, y);
        };
        // Move on init
        move(event);
        const stop = () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("touchmove", move);
            document.removeEventListener("mouseup", stop);
            document.removeEventListener("touchend", stop);
        };
        document.addEventListener("mousemove", move);
        document.addEventListener("touchmove", move);
        document.addEventListener("mouseup", stop);
        document.addEventListener("touchend", stop);
    }
    handleAlphaKeyDown(event) {
        const increment = event.shiftKey ? 10 : 1;
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            this.alpha = clamp$1(this.alpha - increment, 0, 100);
            this.syncValues();
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            this.alpha = clamp$1(this.alpha + increment, 0, 100);
            this.syncValues();
        }
        if (event.key === "Home") {
            event.preventDefault();
            this.alpha = 0;
            this.syncValues();
        }
        if (event.key === "End") {
            event.preventDefault();
            this.alpha = 100;
            this.syncValues();
        }
    }
    handleHueKeyDown(event) {
        const increment = event.shiftKey ? 10 : 1;
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            this.hue = clamp$1(this.hue - increment, 0, 360);
            this.syncValues();
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            this.hue = clamp$1(this.hue + increment, 0, 360);
            this.syncValues();
        }
        if (event.key === "Home") {
            event.preventDefault();
            this.hue = 0;
            this.syncValues();
        }
        if (event.key === "End") {
            event.preventDefault();
            this.hue = 360;
            this.syncValues();
        }
    }
    handleGridKeyDown(event) {
        const increment = event.shiftKey ? 10 : 1;
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            this.saturation = clamp$1(this.saturation - increment, 0, 100);
            this.syncValues();
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            this.saturation = clamp$1(this.saturation + increment, 0, 100);
            this.syncValues();
        }
        if (event.key === "ArrowUp") {
            event.preventDefault();
            this.lightness = clamp$1(this.lightness + increment, 0, 100);
            this.syncValues();
        }
        if (event.key === "ArrowDown") {
            event.preventDefault();
            this.lightness = clamp$1(this.lightness - increment, 0, 100);
            this.syncValues();
        }
    }
    handleInputChange(event) {
        const target = event.target;
        this.setColor(target.value);
        target.value = this.value;
        event.stopPropagation();
    }
    handleInputKeyDown(event) {
        if (event.key === "Enter") {
            this.setColor(this.input.value);
            this.input.value = this.value;
            setTimeout(() => this.input.select());
        }
    }
    handleDocumentMouseDown(event) {
        const target = event.target;
        // Close when clicking outside of the dropdown
        if (target.closest("hbr-color-picker") !== this.host) {
            this.dropdown.hide();
        }
    }
    handleDropdownShow(event) {
        event.stopPropagation();
        this.hbrShow.emit();
    }
    handleDropdownAfterShow(event) {
        event.stopPropagation();
        this.hbrAfterShow.emit();
    }
    handleDropdownHide(event) {
        event.stopPropagation();
        this.hbrHide.emit();
    }
    handleDropdownAfterHide(event) {
        event.stopPropagation();
        this.hbrAfterHide.emit();
        this.showCopyFeedback = false;
    }
    normalizeColorString(colorString) {
        //
        // The color module we're using doesn't parse % values for the alpha channel in RGBA and HSLA. It also doesn't parse
        // hex colors when the # is missing. This pre-parser tries to normalize these edge cases to provide a better
        // experience for users who type in color values.
        //
        if (/rgba?/i.test(colorString)) {
            const rgba = colorString
                .replace(/[^\d.%]/g, " ")
                .split(" ")
                .map((val) => val.trim())
                .filter((val) => val.length);
            if (rgba.length < 4) {
                rgba[3] = "1";
            }
            if (rgba[3].indexOf("%") > -1) {
                rgba[3] = (Number(rgba[3].replace(/%/g, "")) / 100).toString();
            }
            return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
        }
        if (/hsla?/i.test(colorString)) {
            const hsla = colorString
                .replace(/[^\d.%]/g, " ")
                .split(" ")
                .map((val) => val.trim())
                .filter((val) => val.length);
            if (hsla.length < 4) {
                hsla[3] = "1";
            }
            if (hsla[3].indexOf("%") > -1) {
                hsla[3] = (Number(hsla[3].replace(/%/g, "")) / 100).toString();
            }
            return `hsla(${hsla[0]}, ${hsla[1]}, ${hsla[2]}, ${hsla[3]})`;
        }
        if (/^[0-9a-f]+$/i.test(colorString)) {
            return `#${colorString}`;
        }
        return colorString;
    }
    parseColor(colorString) {
        function toHex(value) {
            const hex = Math.round(value).toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        }
        let parsed;
        // The color module has a weak parser, so we normalize certain things to make the user experience better
        const normalizedColorString = this.normalizeColorString(colorString);
        try {
            parsed = color$1(normalizedColorString);
        }
        catch (_a) {
            return false;
        }
        const hsl = {
            h: parsed.hsl().color[0],
            s: parsed.hsl().color[1],
            l: parsed.hsl().color[2],
            a: parsed.hsl().valpha,
        };
        const rgb = {
            r: parsed.rgb().color[0],
            g: parsed.rgb().color[1],
            b: parsed.rgb().color[2],
            a: parsed.rgb().valpha,
        };
        const hex = {
            r: toHex(parsed.rgb().color[0]),
            g: toHex(parsed.rgb().color[1]),
            b: toHex(parsed.rgb().color[2]),
            a: toHex(parsed.rgb().valpha * 255),
        };
        return {
            hsl: {
                h: hsl.h,
                s: hsl.s,
                l: hsl.l,
                string: this.setLetterCase(`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`),
            },
            hsla: {
                h: hsl.h,
                s: hsl.s,
                l: hsl.l,
                a: hsl.a,
                string: this.setLetterCase(`hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${Number(hsl.a.toFixed(2).toString())})`),
            },
            rgb: {
                r: rgb.r,
                g: rgb.g,
                b: rgb.b,
                string: this.setLetterCase(`rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`),
            },
            rgba: {
                r: rgb.r,
                g: rgb.g,
                b: rgb.b,
                a: rgb.a,
                string: this.setLetterCase(`rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${Number(rgb.a.toFixed(2).toString())})`),
            },
            hex: this.setLetterCase(`#${hex.r}${hex.g}${hex.b}`),
            hexa: this.setLetterCase(`#${hex.r}${hex.g}${hex.b}${hex.a}`),
        };
    }
    setColor(colorString) {
        const newColor = this.parseColor(colorString);
        if (!newColor) {
            return false;
        }
        this.hue = newColor.hsla.h;
        this.saturation = newColor.hsla.s;
        this.lightness = newColor.hsla.l;
        this.alpha = this.opacity ? newColor.hsla.a * 100 : 100;
        this.syncValues();
        return true;
    }
    setLetterCase(string) {
        if (typeof string !== "string")
            return "";
        return this.uppercase ? string.toUpperCase() : string.toLowerCase();
    }
    syncValues() {
        const currentColor = this.parseColor(`hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha / 100})`);
        if (!currentColor) {
            return false;
        }
        // Update the value
        if (this.format === "hsl") {
            this.inputValue = this.opacity
                ? currentColor.hsla.string
                : currentColor.hsl.string;
        }
        else if (this.format === "rgb") {
            this.inputValue = this.opacity
                ? currentColor.rgba.string
                : currentColor.rgb.string;
        }
        else {
            this.inputValue = this.opacity ? currentColor.hexa : currentColor.hex;
        }
        // Setting this.value will trigger the watcher which parses the new color. We want to bypass that behavior because
        // a) we've already done it in this function and b) conversion/rounding can lead to values changing slightly.
        this.bypassValueParse = true;
        this.value = this.inputValue;
        this.bypassValueParse = false;
    }
    render() {
        var _a;
        const x = this.saturation;
        const y = 100 - this.lightness;
        const customSystemIcons = (_a = getBootstrapConfig()) === null || _a === void 0 ? void 0 : _a.systemIcons;
        const ColorPicker = () => {
            return (h("div", { part: "base", class: {
                    "color-picker": true,
                    "color-picker--inline": this.inline,
                    "color-picker--disabled": this.disabled,
                }, "aria-disabled": this.disabled ? "true" : "false" }, h("div", { part: "grid", class: "color-picker__grid", style: {
                    backgroundColor: `hsl(${this.hue}deg, 100%, 50%)`,
                }, onMouseDown: this.handleGridDrag, onTouchStart: this.handleGridDrag }, h("span", { part: "grid-handle", class: "color-picker__grid-handle", style: {
                    top: `${y}%`,
                    left: `${x}%`,
                    backgroundColor: `hsla(${this.hue}deg, ${this.saturation}%, ${this.lightness}%)`,
                }, role: "slider", "aria-label": "HSL", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(this.saturation), "aria-valuetext": `hsl(${Math.round(this.hue)}, ${Math.round(this.saturation)}%, ${Math.round(this.lightness)}%)`, tabIndex: this.disabled ? null : 0, onKeyDown: this.handleGridKeyDown })), h("div", { class: "color-picker__controls" }, h("div", { class: "color-picker__sliders" }, h("div", { part: "slider hue-slider", class: "color-picker__hue color-picker__slider", onMouseDown: this.handleHueDrag, onTouchStart: this.handleHueDrag }, h("span", { part: "slider-handle", class: "color-picker__slider-handle", style: {
                    left: `${this.hue === 0 ? 0 : 100 / (360 / this.hue)}%`,
                }, role: "slider", "aria-label": "hue", "aria-orientation": "horizontal", "aria-valuemin": "0", "aria-valuemax": "360", "aria-valuenow": Math.round(this.hue), tabIndex: this.disabled ? null : 0, onKeyDown: this.handleHueKeyDown })), this.opacity && (h("div", { part: "slider opacity-slider", class: "color-picker__alpha color-picker__slider color-picker__transparent-bg", onMouseDown: this.handleAlphaDrag, onTouchStart: this.handleAlphaDrag }, h("div", { class: "color-picker__alpha-gradient", style: {
                    backgroundImage: `linear-gradient(
                      to right,
                      hsl(${this.hue}deg, ${this.saturation}%, ${this.lightness}%, 0%) 0%,
                      hsl(${this.hue}deg, ${this.saturation}%, ${this.lightness}%) 100%
                      )`,
                } }), h("span", { part: "slider-handle", class: "color-picker__slider-handle", style: {
                    left: `${this.alpha}%`,
                }, role: "slider", "aria-label": "alpha", "aria-orientation": "horizontal", "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": Math.round(this.alpha), tabIndex: this.disabled ? null : 0, onKeyDown: this.handleAlphaKeyDown })))), h("button", { ref: (el) => {
                    this.previewButton = el;
                }, type: "button", part: "preview", class: "color-picker__preview color-picker__transparent-bg", style: {
                    "--preview-color": `hsla(${this.hue}deg, ${this.saturation}%, ${this.lightness}%, ${this.alpha / 100})`,
                }, onClick: this.handleCopy }, h("hbr-icon", { asset: (customSystemIcons === null || customSystemIcons === void 0 ? void 0 : customSystemIcons.check) || check, class: {
                    "color-picker__copy-feedback": true,
                    "color-picker__copy-feedback--visible": this.showCopyFeedback,
                    "color-picker__copy-feedback--dark": this.lightness > 50,
                } }))), h("div", { class: "color-picker__user-input" }, h("hbr-input", { ref: (el) => {
                    this.input = el;
                }, part: "input", size: "small", type: "text", name: this.name, autocomplete: "off", autocorrect: "off", spellcheck: false, value: this.inputValue, disabled: this.disabled, onKeyDown: this.handleInputKeyDown, "onHbr-change": this.handleInputChange }), !this.noFormatToggle && (h("hbr-button", { exportparts: "base:format-button", size: "small", onClick: this.handleFormatToggle }, this.setLetterCase(this.format)))), this.swatches && (h("div", { part: "swatches", class: "color-picker__swatches" }, this.swatches.map((swatch) => (h("div", { part: "swatch", class: "color-picker__swatch color-picker__transparent-bg", tabIndex: this.disabled ? null : 0, role: "button", "aria-label": swatch, onClick: () => !this.disabled && this.setColor(swatch), onKeyDown: (event) => !this.disabled &&
                    event.key === "Enter" &&
                    this.setColor(swatch) }, h("div", { class: "color-picker__swatch-color", style: { backgroundColor: swatch } }))))))));
        };
        // Render inline
        if (this.inline) {
            return h(ColorPicker, null);
        }
        // Render as a dropdown
        return (h("hbr-dropdown", { ref: (el) => {
                this.dropdown = el;
            }, class: "color-dropdown", "aria-disabled": this.disabled ? "true" : "false", containingElement: this.host, "onHbr-show": this.handleDropdownShow, "onHbr-after-show": this.handleDropdownAfterShow, "onHbr-hide": this.handleDropdownHide, "onHbr-after-hide": this.handleDropdownAfterHide }, h("button", { ref: (el) => {
                this.trigger = el;
            }, part: "trigger", slot: "trigger", class: {
                "color-dropdown__trigger": true,
                "color-dropdown__trigger--disabled": this.disabled,
                "color-dropdown__trigger--sm": this.size === "small",
                "color-dropdown__trigger--md": this.size === "medium",
                "color-dropdown__trigger--lg": this.size === "large",
                "color-picker__transparent-bg": true,
            }, style: {
                color: `hsla(${this.hue}deg, ${this.saturation}%, ${this.lightness}%, ${this.alpha / 100})`,
            }, type: "button" }), h(ColorPicker, null)));
    }
    get host() { return this; }
    static get watchers() { return {
        "format": ["handleFormatChange"],
        "opacity": ["handleOpacityChange"],
        "value": ["handleValueChange"]
    }; }
    static get style() { return HbrColorPickerStyle0; }
}, [1, "hbr-color-picker", {
        "value": [1537],
        "format": [1025],
        "inline": [4],
        "size": [1],
        "noFormatToggle": [4, "no-format-toggle"],
        "name": [513],
        "disabled": [4],
        "invalid": [1540],
        "hoist": [4],
        "opacity": [4],
        "uppercase": [4],
        "swatches": [16],
        "inputValue": [32],
        "hue": [32],
        "saturation": [32],
        "lightness": [32],
        "alpha": [32],
        "showCopyFeedback": [32],
        "getFormattedValue": [64],
        "reportValidity": [64],
        "setCustomValidity": [64]
    }, undefined, {
        "format": ["handleFormatChange"],
        "opacity": ["handleOpacityChange"],
        "value": ["handleValueChange"]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-color-picker", "hbr-button", "hbr-dropdown", "hbr-icon", "hbr-input", "hbr-popup", "hbr-spinner", "hbr-visually-hidden"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-color-picker":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, ColorPicker);
            }
            break;
        case "hbr-button":
            if (!customElements.get(tagName)) {
                defineCustomElement$8();
            }
            break;
        case "hbr-dropdown":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-input":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-spinner":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-visually-hidden":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrColorPicker = ColorPicker;
const defineCustomElement = defineCustomElement$1;

export { HbrColorPicker, defineCustomElement };

