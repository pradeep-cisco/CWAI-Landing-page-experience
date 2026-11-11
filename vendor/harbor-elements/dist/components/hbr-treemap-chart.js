import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { d as toString_1, r as react, E as Et, j as jsxRuntime, a as animated, t as to, w as w$1, k, Z as Zr, u as useTransition, J as Jt, e as Ht, B as Bt, g as Hi, _ as _i, G as Gi, I as It, p as pr, W as We, c as createRoot } from './client.js';
import { _ as _baseSlice, o as omit_1 } from './omit.js';
import { c as cloneDeep_1 } from './cloneDeep.js';
import { P, r as roundNode, h as hierarchy } from './dice.js';
import { r as reactShadowDomRetargetEvents } from './index3.js';
import { c as cjs } from './cjs.js';
import { m, k as k$1, $, o as omitChartConfigKeys, n as noopChartTooltip, i as isChartPopoverSelfManaged, r as resolveChartPopoverOptions } from './popover-options.js';
import { s as showChartPopover, h as hideChartPopover, d as defineCustomElement$7 } from './board.js';
import { d as defineCustomElement$6 } from './icon.js';
import { d as defineCustomElement$5 } from './illustration.js';
import { d as defineCustomElement$4 } from './popover.js';
import { d as defineCustomElement$3 } from './popup.js';
import { d as defineCustomElement$2 } from './stencil.js';

function required(f) {
  if (typeof f !== "function") throw new Error;
  return f;
}

function constantZero() {
  return 0;
}

function constant(x) {
  return function() {
    return x;
  };
}

function M(parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      node,
      i = -1,
      n = nodes.length,
      k = parent.value && (y1 - y0) / parent.value;

  while (++i < n) {
    node = nodes[i], node.x0 = x0, node.x1 = x1;
    node.y0 = y0, node.y1 = y0 += node.value * k;
  }
}

var phi = (1 + Math.sqrt(5)) / 2;

function squarifyRatio(ratio, parent, x0, y0, x1, y1) {
  var rows = [],
      nodes = parent.children,
      row,
      nodeValue,
      i0 = 0,
      i1 = 0,
      n = nodes.length,
      dx, dy,
      value = parent.value,
      sumValue,
      minValue,
      maxValue,
      newRatio,
      minRatio,
      alpha,
      beta;

  while (i0 < n) {
    dx = x1 - x0, dy = y1 - y0;

    // Find the next non-empty node.
    do sumValue = nodes[i1++].value; while (!sumValue && i1 < n);
    minValue = maxValue = sumValue;
    alpha = Math.max(dy / dx, dx / dy) / (value * ratio);
    beta = sumValue * sumValue * alpha;
    minRatio = Math.max(maxValue / beta, beta / minValue);

    // Keep adding nodes while the aspect ratio maintains or improves.
    for (; i1 < n; ++i1) {
      sumValue += nodeValue = nodes[i1].value;
      if (nodeValue < minValue) minValue = nodeValue;
      if (nodeValue > maxValue) maxValue = nodeValue;
      beta = sumValue * sumValue * alpha;
      newRatio = Math.max(maxValue / beta, beta / minValue);
      if (newRatio > minRatio) { sumValue -= nodeValue; break; }
      minRatio = newRatio;
    }

    // Position and record the row orientation.
    rows.push(row = {value: sumValue, dice: dx < dy, children: nodes.slice(i0, i1)});
    if (row.dice) P(row, x0, y0, x1, value ? y0 += dy * sumValue / value : y1);
    else M(row, x0, y0, value ? x0 += dx * sumValue / value : x1, y1);
    value -= sumValue, i0 = i1;
  }

  return rows;
}

const S = (function custom(ratio) {

  function squarify(parent, x0, y0, x1, y1) {
    squarifyRatio(ratio, parent, x0, y0, x1, y1);
  }

  squarify.ratio = function(x) {
    return custom((x = +x) > 1 ? x : 1);
  };

  return squarify;
})(phi);

function O() {
  var tile = S,
      round = false,
      dx = 1,
      dy = 1,
      paddingStack = [0],
      paddingInner = constantZero,
      paddingTop = constantZero,
      paddingRight = constantZero,
      paddingBottom = constantZero,
      paddingLeft = constantZero;

  function treemap(root) {
    root.x0 =
    root.y0 = 0;
    root.x1 = dx;
    root.y1 = dy;
    root.eachBefore(positionNode);
    paddingStack = [0];
    if (round) root.eachBefore(roundNode);
    return root;
  }

  function positionNode(node) {
    var p = paddingStack[node.depth],
        x0 = node.x0 + p,
        y0 = node.y0 + p,
        x1 = node.x1 - p,
        y1 = node.y1 - p;
    if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
    if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
    node.x0 = x0;
    node.y0 = y0;
    node.x1 = x1;
    node.y1 = y1;
    if (node.children) {
      p = paddingStack[node.depth + 1] = paddingInner(node) / 2;
      x0 += paddingLeft(node) - p;
      y0 += paddingTop(node) - p;
      x1 -= paddingRight(node) - p;
      y1 -= paddingBottom(node) - p;
      if (x1 < x0) x0 = x1 = (x0 + x1) / 2;
      if (y1 < y0) y0 = y1 = (y0 + y1) / 2;
      tile(node, x0, y0, x1, y1);
    }
  }

  treemap.round = function(x) {
    return arguments.length ? (round = !!x, treemap) : round;
  };

  treemap.size = function(x) {
    return arguments.length ? (dx = +x[0], dy = +x[1], treemap) : [dx, dy];
  };

  treemap.tile = function(x) {
    return arguments.length ? (tile = required(x), treemap) : tile;
  };

  treemap.padding = function(x) {
    return arguments.length ? treemap.paddingInner(x).paddingOuter(x) : treemap.paddingInner();
  };

  treemap.paddingInner = function(x) {
    return arguments.length ? (paddingInner = typeof x === "function" ? x : constant(+x), treemap) : paddingInner;
  };

  treemap.paddingOuter = function(x) {
    return arguments.length ? treemap.paddingTop(x).paddingRight(x).paddingBottom(x).paddingLeft(x) : treemap.paddingTop();
  };

  treemap.paddingTop = function(x) {
    return arguments.length ? (paddingTop = typeof x === "function" ? x : constant(+x), treemap) : paddingTop;
  };

  treemap.paddingRight = function(x) {
    return arguments.length ? (paddingRight = typeof x === "function" ? x : constant(+x), treemap) : paddingRight;
  };

  treemap.paddingBottom = function(x) {
    return arguments.length ? (paddingBottom = typeof x === "function" ? x : constant(+x), treemap) : paddingBottom;
  };

  treemap.paddingLeft = function(x) {
    return arguments.length ? (paddingLeft = typeof x === "function" ? x : constant(+x), treemap) : paddingLeft;
  };

  return treemap;
}

function x(parent, x0, y0, x1, y1) {
  var nodes = parent.children,
      i, n = nodes.length,
      sum, sums = new Array(n + 1);

  for (sums[0] = sum = i = 0; i < n; ++i) {
    sums[i + 1] = sum += nodes[i].value;
  }

  partition(0, n, parent.value, x0, y0, x1, y1);

  function partition(i, j, value, x0, y0, x1, y1) {
    if (i >= j - 1) {
      var node = nodes[i];
      node.x0 = x0, node.y0 = y0;
      node.x1 = x1, node.y1 = y1;
      return;
    }

    var valueOffset = sums[i],
        valueTarget = (value / 2) + valueOffset,
        k = i + 1,
        hi = j - 1;

    while (k < hi) {
      var mid = k + hi >>> 1;
      if (sums[mid] < valueTarget) k = mid + 1;
      else hi = mid;
    }

    if ((valueTarget - sums[k - 1]) < (sums[k] - valueTarget) && i + 1 < k) --k;

    var valueLeft = sums[k] - valueOffset,
        valueRight = value - valueLeft;

    if ((x1 - x0) > (y1 - y0)) {
      var xk = (x0 * valueRight + x1 * valueLeft) / value;
      partition(i, k, valueLeft, x0, y0, xk, y1);
      partition(k, j, valueRight, xk, y0, x1, y1);
    } else {
      var yk = (y0 * valueRight + y1 * valueLeft) / value;
      partition(i, k, valueLeft, x0, y0, x1, yk);
      partition(k, j, valueRight, x0, yk, x1, y1);
    }
  }
}

function w(parent, x0, y0, x1, y1) {
  (parent.depth & 1 ? M : P)(parent, x0, y0, x1, y1);
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */

function arrayReduce$1(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

var _arrayReduce = arrayReduce$1;

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */

function basePropertyOf$1(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

var _basePropertyOf = basePropertyOf$1;

var basePropertyOf = _basePropertyOf;

/** Used to map Latin Unicode letters to basic Latin letters. */
var deburredLetters = {
  // Latin-1 Supplement block.
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss',
  // Latin Extended-A block.
  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
  '\u0134': 'J',  '\u0135': 'j',
  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
  '\u0174': 'W',  '\u0175': 'w',
  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
  '\u0132': 'IJ', '\u0133': 'ij',
  '\u0152': 'Oe', '\u0153': 'oe',
  '\u0149': "'n", '\u017f': 's'
};

/**
 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
 * letters to basic Latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
var deburrLetter$1 = basePropertyOf(deburredLetters);

var _deburrLetter = deburrLetter$1;

var deburrLetter = _deburrLetter,
    toString$2 = toString_1;

/** Used to match Latin Unicode letters (excluding mathematical operators). */
var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

/** Used to compose unicode character classes. */
var rsComboMarksRange$3 = '\\u0300-\\u036f',
    reComboHalfMarksRange$3 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$3 = '\\u20d0-\\u20ff',
    rsComboRange$3 = rsComboMarksRange$3 + reComboHalfMarksRange$3 + rsComboSymbolsRange$3;

/** Used to compose unicode capture groups. */
var rsCombo$2 = '[' + rsComboRange$3 + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo$2, 'g');

/**
 * Deburrs `string` by converting
 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
 * letters to basic Latin letters and removing
 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr$1(string) {
  string = toString$2(string);
  return string && string.replace(reLatin, deburrLetter).replace(reComboMark, '');
}

var deburr_1 = deburr$1;

/** Used to match words composed of alphanumeric characters. */

var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

/**
 * Splits an ASCII `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function asciiWords$1(string) {
  return string.match(reAsciiWord) || [];
}

var _asciiWords = asciiWords$1;

/** Used to detect strings that need a more robust regexp to match words. */

var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/**
 * Checks if `string` contains a word composed of Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a word is found, else `false`.
 */
function hasUnicodeWord$1(string) {
  return reHasUnicodeWord.test(string);
}

var _hasUnicodeWord = hasUnicodeWord$1;

/** Used to compose unicode character classes. */

var rsAstralRange$2 = '\\ud800-\\udfff',
    rsComboMarksRange$2 = '\\u0300-\\u036f',
    reComboHalfMarksRange$2 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$2 = '\\u20d0-\\u20ff',
    rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2,
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsPunctuationRange = '\\u2000-\\u206f',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange$2 = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsApos$1 = "['\u2019]",
    rsBreak = '[' + rsBreakRange + ']',
    rsCombo$1 = '[' + rsComboRange$2 + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange$2 + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz$1 = '\\ud83c[\\udffb-\\udfff]',
    rsModifier$1 = '(?:' + rsCombo$1 + '|' + rsFitz$1 + ')',
    rsNonAstral$1 = '[^' + rsAstralRange$2 + ']',
    rsRegional$1 = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair$1 = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ$2 = '\\u200d';

/** Used to compose unicode regexes. */
var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
    rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
    rsOptContrLower = '(?:' + rsApos$1 + '(?:d|ll|m|re|s|t|ve))?',
    rsOptContrUpper = '(?:' + rsApos$1 + '(?:D|LL|M|RE|S|T|VE))?',
    reOptMod$1 = rsModifier$1 + '?',
    rsOptVar$1 = '[' + rsVarRange$2 + ']?',
    rsOptJoin$1 = '(?:' + rsZWJ$2 + '(?:' + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsOptVar$1 + reOptMod$1 + ')*',
    rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
    rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
    rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1,
    rsEmoji = '(?:' + [rsDingbat, rsRegional$1, rsSurrPair$1].join('|') + ')' + rsSeq$1;

/** Used to match complex or compound words. */
var reUnicodeWord = RegExp([
  rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
  rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
  rsUpper + '+' + rsOptContrUpper,
  rsOrdUpper,
  rsOrdLower,
  rsDigits,
  rsEmoji
].join('|'), 'g');

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords$1(string) {
  return string.match(reUnicodeWord) || [];
}

var _unicodeWords = unicodeWords$1;

var asciiWords = _asciiWords,
    hasUnicodeWord = _hasUnicodeWord,
    toString$1 = toString_1,
    unicodeWords = _unicodeWords;

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words$1(string, pattern, guard) {
  string = toString$1(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  }
  return string.match(pattern) || [];
}

var words_1 = words$1;

var arrayReduce = _arrayReduce,
    deburr = deburr_1,
    words = words_1;

/** Used to compose unicode capture groups. */
var rsApos = "['\u2019]";

/** Used to match apostrophes. */
var reApos = RegExp(rsApos, 'g');

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder$1(callback) {
  return function(string) {
    return arrayReduce(words(deburr(string).replace(reApos, '')), callback, '');
  };
}

var _createCompounder = createCompounder$1;

var baseSlice = _baseSlice;

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice$1(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

var _castSlice = castSlice$1;

/** Used to compose unicode character classes. */

var rsAstralRange$1 = '\\ud800-\\udfff',
    rsComboMarksRange$1 = '\\u0300-\\u036f',
    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
    rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ$1 = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ$1 + rsAstralRange$1  + rsComboRange$1 + rsVarRange$1 + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode$2(string) {
  return reHasUnicode.test(string);
}

var _hasUnicode = hasUnicode$2;

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */

function asciiToArray$1(string) {
  return string.split('');
}

var _asciiToArray = asciiToArray$1;

/** Used to compose unicode character classes. */

var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray$1(string) {
  return string.match(reUnicode) || [];
}

var _unicodeToArray = unicodeToArray$1;

var asciiToArray = _asciiToArray,
    hasUnicode$1 = _hasUnicode,
    unicodeToArray = _unicodeToArray;

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray$1(string) {
  return hasUnicode$1(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

var _stringToArray = stringToArray$1;

var castSlice = _castSlice,
    hasUnicode = _hasUnicode,
    stringToArray = _stringToArray,
    toString = toString_1;

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst$1(methodName) {
  return function(string) {
    string = toString(string);

    var strSymbols = hasUnicode(string)
      ? stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

var _createCaseFirst = createCaseFirst$1;

var createCaseFirst = _createCaseFirst;

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst$1 = createCaseFirst('toUpperCase');

var upperFirst_1 = upperFirst$1;

var createCompounder = _createCompounder,
    upperFirst = upperFirst_1;

/**
 * Converts `string` to
 * [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
 *
 * @static
 * @memberOf _
 * @since 3.1.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the start cased string.
 * @example
 *
 * _.startCase('--foo-bar--');
 * // => 'Foo Bar'
 *
 * _.startCase('fooBar');
 * // => 'Foo Bar'
 *
 * _.startCase('__FOO_BAR__');
 * // => 'FOO BAR'
 */
var startCase = createCompounder(function(result, word, index) {
  return result + (index ? ' ' : '') + upperFirst(word);
});

var startCase_1 = startCase;

function j(){return j=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(e[n]=o[n]);}return e},j.apply(this,arguments)}function D(e,t){if(null==e)return {};var o,n,i={},a=Object.keys(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||(i[o]=e[o]);return i}var H=function(e,t){return to([e,t],(function(e,t){return "translate("+e+","+t+")"}))},V=function(e,t){return to([e,t],(function(e,t){return "translate("+e+"px, "+t+"px)"}))},q=function(e,t,o){return to([e,t,o],(function(e,t,o){return "translate("+e+","+t+") rotate("+o+")"}))},A=function(e,t,o){return to([e,t,o],(function(e,t,o){return "translate("+e+"px,"+t+"px) rotate("+o+"deg)"}))},G=function(e,t,o){return to([e,t,o],(function(e,t,o){return "translate("+(e-(0===o?0:5))+"px,"+(t-(0===o?5:0))+"px) rotate("+o+"deg)"}))},J=react.exports.memo((function(e){var t=e.node,o=e.animatedProps,n=e.borderWidth,i=e.enableLabel,a=e.enableParentLabel,r=e.labelSkipSize,d=Et(),b=i&&t.isLeaf&&(0===r||Math.min(t.width,t.height)>r),u=a&&t.isParent;return jsxRuntime.exports.jsxs(animated.g,{transform:H(o.x,o.y),children:[jsxRuntime.exports.jsx(animated.rect,{"data-testid":"node."+t.id,width:to(o.width,(function(e){return Math.max(e,0)})),height:to(o.height,(function(e){return Math.max(e,0)})),fill:t.fill?t.fill:o.color,strokeWidth:n,stroke:t.borderColor,fillOpacity:t.opacity,onMouseEnter:t.onMouseEnter,onMouseMove:t.onMouseMove,onMouseLeave:t.onMouseLeave,onClick:t.onClick}),b&&jsxRuntime.exports.jsx(animated.text,{"data-testid":"label."+t.id,textAnchor:"middle",dominantBaseline:"central",style:j({},d.labels.text,{fill:t.labelTextColor,pointerEvents:"none"}),fillOpacity:o.labelOpacity,transform:q(o.labelX,o.labelY,o.labelRotation),children:t.label}),u&&jsxRuntime.exports.jsx(animated.text,{"data-testid":"parentLabel."+t.id,dominantBaseline:"central",style:j({},d.labels.text,{fill:t.parentLabelTextColor,pointerEvents:"none"}),fillOpacity:o.parentLabelOpacity,transform:q(o.parentLabelX,o.parentLabelY,o.parentLabelRotation),children:t.parentLabel})]})})),K=react.exports.memo((function(e){var t=e.node;return jsxRuntime.exports.jsx(w$1,{id:t.id,value:t.formattedValue,enableChip:!0,color:t.color})})),N=react.exports.memo((function(e){var t=e.node,o=e.animatedProps,n=e.borderWidth,i=e.enableLabel,a=e.enableParentLabel,r=e.labelSkipSize,d=Et(),b=i&&t.isLeaf&&(0===r||Math.min(t.width,t.height)>r),u=a&&t.isParent;return jsxRuntime.exports.jsxs(animated.div,{"data-testid":"node."+t.id,id:t.path.replace(/[^\w]/gi,"-"),style:{boxSizing:"border-box",position:"absolute",top:0,left:0,transform:V(o.x,o.y),width:o.width,height:o.height,borderWidth:n,borderStyle:"solid",borderColor:t.borderColor,overflow:"hidden"},children:[jsxRuntime.exports.jsx(animated.div,{style:{boxSizing:"border-box",position:"absolute",top:0,left:0,opacity:t.opacity,width:o.width,height:o.height,background:o.color},onMouseEnter:t.onMouseEnter,onMouseMove:t.onMouseMove,onMouseLeave:t.onMouseLeave,onClick:t.onClick}),b&&jsxRuntime.exports.jsx(animated.span,{"data-testid":"label."+t.id,style:j({},d.labels.text,{position:"absolute",display:"flex",top:-5,left:-5,width:10,height:10,justifyContent:"center",alignItems:"center",whiteSpace:"nowrap",color:t.labelTextColor,transformOrigin:"center center",transform:A(o.labelX,o.labelY,o.labelRotation),opacity:o.labelOpacity,pointerEvents:"none"}),children:t.label}),u&&jsxRuntime.exports.jsx(animated.span,{"data-testid":"parentLabel."+t.id,style:j({},d.labels.text,{position:"absolute",display:"flex",justifyContent:"flex-start",alignItems:"center",whiteSpace:"nowrap",width:10,height:10,color:t.parentLabelTextColor,transformOrigin:"top left",transform:G(o.parentLabelX,o.parentLabelY,o.parentLabelRotation),opacity:o.parentLabelOpacity,pointerEvents:"none"}),children:t.parentLabel})]})})),Q={layers:["nodes"],identity:"id",value:"value",tile:"squarify",leavesOnly:!1,innerPadding:0,outerPadding:0,colors:{scheme:"nivo"},colorBy:"pathComponents.1",nodeOpacity:.33,enableLabel:!0,label:"formattedValue",labelSkipSize:0,labelTextColor:{from:"color",modifiers:[["darker",1]]},orientLabel:!0,enableParentLabel:!0,parentLabel:"id",parentLabelSize:20,parentLabelPosition:"top",parentLabelPadding:6,parentLabelTextColor:{from:"color",modifiers:[["darker",1]]},borderWidth:1,borderColor:{from:"color",modifiers:[["darker",1]]},isInteractive:!0,tooltip:K,role:"img",animate:!0,motionConfig:"gentle"},U=j({},Q,{nodeComponent:J,defs:[],fill:[]});j({},Q,{nodeComponent:N});j({},Q,{pixelRatio:"undefined"!=typeof window&&window.devicePixelRatio||1});var _={binary:x,dice:P,slice:M,sliceDice:w,squarify:S},ee=function(e){var t=e.root,o=e.getValue;return react.exports.useMemo((function(){return hierarchy(t).sum(o)}),[t,o])},te=function(e){var t=e.data,o=e.width,i=e.height,a=e.identity,r=void 0===a?Q.identity:a,u=e.value,p=void 0===u?Q.value:u,c=e.valueFormat,s=e.leavesOnly,v=void 0===s?Q.leavesOnly:s,h=e.tile,f=void 0===h?Q.tile:h,L=e.innerPadding,g=void 0===L?Q.innerPadding:L,x=e.outerPadding,P=void 0===x?Q.outerPadding:x,M=e.label,w=void 0===M?Q.label:M,S=e.orientLabel,k=void 0===S?Q.orientLabel:S,I=e.enableParentLabel,z=void 0===I?Q.enableParentLabel:I,B=e.parentLabel,R=void 0===B?Q.parentLabel:B,E=e.parentLabelSize,X=void 0===E?Q.parentLabelSize:E,Y=e.parentLabelPosition,F=void 0===Y?Q.parentLabelPosition:Y,D=e.parentLabelPadding,H=void 0===D?Q.parentLabelPadding:D,V=e.colors,q=void 0===V?Q.colors:V,A=e.colorBy,G=void 0===A?Q.colorBy:A,J=e.nodeOpacity,K=void 0===J?Q.nodeOpacity:J,N=e.borderColor,U=void 0===N?Q.borderColor:N,Z=e.labelTextColor,$=void 0===Z?Q.labelTextColor:Z,te=e.parentLabelTextColor,oe=void 0===te?Q.parentLabelTextColor:te,ne=Gi(r),ie=Gi(p),ae=It(c),re=Gi(w),le=Gi(R),de=function(e){var t=e.width,o=e.height,i=e.tile,a=e.innerPadding,r=e.outerPadding,l=e.enableParentLabel,d=e.parentLabelSize,b=e.parentLabelPosition,u=e.leavesOnly;return react.exports.useMemo((function(){var e=O().size([t,o]).tile(_[i]).round(!0).paddingInner(a).paddingOuter(r);if(l&&!u){var n=d+2*r;e["padding"+startCase_1(b)](n);}return e}),[t,o,i,a,r,l,d,b,u])}({width:o,height:i,tile:f,innerPadding:g,outerPadding:P,enableParentLabel:z,parentLabelSize:X,parentLabelPosition:F,leavesOnly:v}),be=ee({root:t,getValue:ie}),ue=react.exports.useMemo((function(){var e=cloneDeep_1(be);return de(e),v?e.leaves():e.descendants()}),[be,de,v]),pe=react.exports.useMemo((function(){return ue.map((function(e){var t=function(e,t){var o=e.ancestors().map((function(e){return t(e.data)})).reverse();return {path:o.join("."),pathComponents:o}}(e,ne),o=t.path,n=t.pathComponents,i={id:ne(e.data),path:o,pathComponents:n,data:omit_1(e.data,"children"),x:e.x0,y:e.y0,width:e.x1-e.x0,height:e.y1-e.y0,value:e.value,formattedValue:ae(e.value),treeDepth:e.depth,treeHeight:e.height,isParent:e.height>0,isLeaf:0===e.height,parentLabelX:0,parentLabelY:0,parentLabelRotation:0};return i.labelRotation=k&&i.height>i.width?-90:0,"top"===F&&(i.parentLabelX=P+H,i.parentLabelY=P+X/2),"right"===F&&(i.parentLabelX=i.width-P-X/2,i.parentLabelY=i.height-P-H,i.parentLabelRotation=-90),"bottom"===F&&(i.parentLabelX=P+H,i.parentLabelY=i.height-P-X/2),"left"===F&&(i.parentLabelX=P+X/2,i.parentLabelY=i.height-P-H,i.parentLabelRotation=-90),i.label=re(i),i.parentLabel=le(i),i}))}),[ue,ne,ae,re,k,le,X,F,H,P]),ce=Et(),se=pr(q,G),ve=We(U,ce),he=We($,ce),fe=We(oe,ce),Le=react.exports.useMemo((function(){return pe.map((function(e){var t=j({},e,{color:se(e),opacity:K});return t.borderColor=ve(t),t.labelTextColor=he(t),t.parentLabelTextColor=fe(t),t}))}),[pe,se,K,ve,he,fe]);return {hierarchy:be,nodes:Le,layout:de}},oe=function(e){var t=e.nodes;return react.exports.useMemo((function(){return {nodes:t}}),[t])},ne=function(e){return {x:e.x,y:e.y,width:e.width,height:e.height,color:e.color,labelX:e.width/2,labelY:e.height/2,labelRotation:e.labelRotation,labelOpacity:1,parentLabelX:e.parentLabelX,parentLabelY:e.parentLabelY,parentLabelRotation:e.parentLabelRotation,parentLabelOpacity:1}},ie=function(e){return {x:e.x+e.width/2,y:e.y+e.height/2,width:0,height:0,color:e.color,labelX:0,labelY:0,labelRotation:e.labelRotation,labelOpacity:0,parentLabelX:0,parentLabelY:0,parentLabelRotation:e.parentLabelRotation,parentLabelOpacity:0}},ae=react.exports.memo((function(e){var i=e.nodes,a=e.nodeComponent,r=e.borderWidth,l=e.enableLabel,d=e.labelSkipSize,b=e.enableParentLabel,p=function(e,i){var a=i.isInteractive,r=i.onMouseEnter,l=i.onMouseMove,d=i.onMouseLeave,b=i.onClick,u=i.tooltip,p=k(),c=p.showTooltipFromEvent,s=p.hideTooltip,v=react.exports.useCallback((function(e,t){c(react.exports.createElement(u,{node:e}),t,"left");}),[c,u]),h=react.exports.useCallback((function(e,t){v(e,t),null==r||r(e,t);}),[r,v]),f=react.exports.useCallback((function(e,t){v(e,t),null==l||l(e,t);}),[l,v]),L=react.exports.useCallback((function(e,t){s(),null==d||d(e,t);}),[d,s]),g=react.exports.useCallback((function(e,t){null==b||b(e,t);}),[b]);return react.exports.useMemo((function(){return e.map((function(e){return a?j({},e,{onMouseEnter:function(t){return h(e,t)},onMouseMove:function(t){return f(e,t)},onMouseLeave:function(t){return L(e,t)},onClick:function(t){return g(e,t)}}):e}))}),[a,e,h,f,L,g])}(i,{isInteractive:e.isInteractive,onMouseEnter:e.onMouseEnter,onMouseMove:e.onMouseMove,onMouseLeave:e.onMouseLeave,onClick:e.onClick,tooltip:e.tooltip}),c=Zr(),s=c.animate,v=c.config,h=useTransition(p,{keys:function(e){return e.path},initial:ne,from:ie,enter:ne,update:ne,leave:ie,config:v,immediate:!s});return jsxRuntime.exports.jsx(jsxRuntime.exports.Fragment,{children:h((function(e,t){return react.exports.createElement(a,{key:t.path,node:t,animatedProps:e,borderWidth:r,enableLabel:l,labelSkipSize:d,enableParentLabel:b})}))})})),re=["isInteractive","animate","motionConfig","theme","renderWrapper"],le=function(e){var t=e.data,n=e.identity,a=void 0===n?U.identity:n,r=e.value,l=void 0===r?U.value:r,d=e.valueFormat,b=e.tile,u=void 0===b?U.tile:b,p=e.nodeComponent,h=void 0===p?U.nodeComponent:p,f=e.innerPadding,L=void 0===f?U.innerPadding:f,g=e.outerPadding,m=void 0===g?U.outerPadding:g,y=e.leavesOnly,C=void 0===y?U.leavesOnly:y,x=e.width,P=e.height,M=e.margin,w=e.layers,S=void 0===w?U.layers:w,O=e.colors,k=void 0===O?U.colors:O,T=e.colorBy,W=void 0===T?U.colorBy:T,I=e.nodeOpacity,z=void 0===I?U.nodeOpacity:I,B=e.borderWidth,R=void 0===B?U.borderWidth:B,E=e.borderColor,X=void 0===E?U.borderColor:E,F=e.defs,j=void 0===F?U.defs:F,D=e.fill,H=void 0===D?U.fill:D,V=e.enableLabel,q=void 0===V?U.enableLabel:V,A=e.label,G=void 0===A?U.label:A,J=e.labelTextColor,K=void 0===J?U.labelTextColor:J,N=e.orientLabel,Q=void 0===N?U.orientLabel:N,Z=e.labelSkipSize,$=void 0===Z?U.labelSkipSize:Z,_=e.enableParentLabel,ee=void 0===_?U.enableParentLabel:_,ne=e.parentLabel,ie=void 0===ne?U.parentLabel:ne,re=e.parentLabelSize,le=void 0===re?U.parentLabelSize:re,de=e.parentLabelPosition,be=void 0===de?U.parentLabelPosition:de,ue=e.parentLabelPadding,pe=void 0===ue?U.parentLabelPadding:ue,ce=e.parentLabelTextColor,se=void 0===ce?U.parentLabelTextColor:ce,ve=e.isInteractive,he=void 0===ve?U.isInteractive:ve,fe=e.onMouseEnter,Le=e.onMouseMove,ge=e.onMouseLeave,me=e.onClick,ye=e.tooltip,Ce=void 0===ye?U.tooltip:ye,xe=e.role,Pe=e.ariaLabel,Me=e.ariaLabelledBy,we=e.ariaDescribedBy,Se=Bt(x,P,M),Oe=Se.margin,ke=Se.innerWidth,Te=Se.innerHeight,We=Se.outerWidth,Ie=Se.outerHeight,ze=te({data:t,identity:a,value:l,valueFormat:d,leavesOnly:C,width:ke,height:Te,tile:u,innerPadding:L,outerPadding:m,colors:k,colorBy:W,nodeOpacity:z,borderColor:X,label:G,labelTextColor:K,orientLabel:Q,enableParentLabel:ee,parentLabel:ie,parentLabelSize:le,parentLabelPosition:be,parentLabelPadding:pe,parentLabelTextColor:se}).nodes,Be={nodes:null};S.includes("nodes")&&(Be.nodes=jsxRuntime.exports.jsx(ae,{nodes:ze,nodeComponent:h,borderWidth:R,enableLabel:q,labelSkipSize:$,enableParentLabel:ee,isInteractive:he,onMouseEnter:fe,onMouseMove:Le,onMouseLeave:ge,onClick:me,tooltip:Ce},"nodes"));var Re=oe({nodes:ze}),Ee=Hi(j,ze,H);return jsxRuntime.exports.jsx(_i,{width:We,height:Ie,margin:Oe,defs:Ee,role:xe,ariaLabel:Pe,ariaLabelledBy:Me,ariaDescribedBy:we,children:S.map((function(e,t){var n;return "function"==typeof e?jsxRuntime.exports.jsx(react.exports.Fragment,{children:react.exports.createElement(e,Re)},t):null!=(n=null==Be?void 0:Be[e])?n:null}))})},de=function(e){var t=e.isInteractive,o=void 0===t?U.isInteractive:t,n=e.animate,i=void 0===n?U.animate:n,a=e.motionConfig,r=void 0===a?U.motionConfig:a,l=e.theme,d=e.renderWrapper,b=D(e,re);return jsxRuntime.exports.jsx(Ht,{animate:i,isInteractive:o,motionConfig:r,renderWrapper:d,theme:l,children:jsxRuntime.exports.jsx(le,j({isInteractive:o},b))})},be=function(e){return jsxRuntime.exports.jsx(Jt,{children:function(t){var o=t.width,n=t.height;return jsxRuntime.exports.jsx(de,j({width:o,height:n},e))}})};

var t={};m(t,{getCategoricalColors:()=>o,getColors:()=>u,getTreemapBaseConfig:()=>i,getTreemapCategoricalConfig:()=>v});var l={top:40,right:60,bottom:90,left:60};function i({itemsEventHandlers:e}){return {margin:l,role:"application",onClick:e==null?void 0:e.onClick,onMouseEnter:e==null?void 0:e.onMouseEnter,onMouseLeave:e==null?void 0:e.onMouseLeave,onMouseMove:e==null?void 0:e.onMouseMove,tooltip:()=>"",labelTextColor:"var(--base-text-default)",parentLabelTextColor:"var(--base-text-default)",theme:{fontSize:"var(--hbr-font-size-2xs)",fontFamily:"var(--hbr-font-body)",textColor:"var(--base-text-default)",legends:{text:{fill:"var(--base-text-default)"}},axis:{text:{fill:"var(--base-text-default)"},legend:{text:{fill:"var(--base-text-default)",fontSize:"var(--hbr-font-size-2xs)"}}}}}}var u=e=>typeof e!="number"?[]:["var(--accent-a-default, #7D8AFF)","var(--accent-b-default, #B02863)","var(--accent-c-default, #F2638C)","var(--accent-d-default, #753BCC)","var(--accent-e-default, #6BA32A)","var(--accent-f-default, #AD3907)","var(--accent-g-default, #04A4B0)","var(--accent-h-default, #006773)","var(--accent-i-default, #E85FC6)","var(--accent-j-default, #545C8A)"].slice(0,e),o=()=>k$1();var f={top:40,right:60,bottom:90,left:60};function v({itemsEventHandlers:e}){return {margin:f,role:"application",onClick:e==null?void 0:e.onClick,onMouseEnter:e==null?void 0:e.onMouseEnter,onMouseLeave:e==null?void 0:e.onMouseLeave,onMouseMove:e==null?void 0:e.onMouseMove,tooltip:()=>"",labelTextColor:"var(--base-text-default)",parentLabelTextColor:"var(--base-text-default)",colors:o(),theme:{fontSize:"var(--hbr-font-size-2xs)",fontFamily:"var(--hbr-font-body)",textColor:"var(--base-text-default)",legends:{text:{fill:"var(--base-text-default)"}},axis:{text:{fill:"var(--base-text-default)"},legend:{text:{fill:"var(--base-text-default)",fontSize:"var(--hbr-font-size-2xs)"}}}}}}var y=$({},t);

const generateTreemapTooltip = (datum, config) => {
    let key = "id";
    let val = "value";
    if (config.identity) {
        key = config.identity;
    }
    if (config.value) {
        val = config.value;
    }
    return typeof (config === null || config === void 0 ? void 0 : config.itemTooltip) === "function"
        ? config.itemTooltip(datum)
        : `<div class="--hbr-treemap-popover-entity">
    <svg class="--hbr-treemap-popover-color" style="background:${datum.color}; opacity: ${datum.opacity}"></svg>
    ${datum.data[key]}: ${datum.formattedValue || datum.data[val]}
  </div>`;
};
const showTreemapTooltip = (data, event, tooltipRef, config) => {
    if (event.target) {
        showChartPopover(tooltipRef, data, event, config === null || config === void 0 ? void 0 : config.itemTooltip, () => generateTreemapTooltip(data, config));
    }
};
const hideTreemapTooltip = (tooltipRef) => {
    hideChartPopover(tooltipRef);
};

const styleCss = ":root,:host{--viz-font-line-height-normal:var(--hbr-font-line-height-normal, 1.5);--viz-font-letter-spacing-loose:var(--hbr-font-letter-spacing-loose, .06em);--viz-font-size-5xl:var(--hbr-font-size-5xl, 4.29rem);--viz-font-size-4xl:var(--hbr-font-size-4xl, 3.43rem);--viz-font-size-3xl:var(--hbr-font-size-3xl, 2.86rem);--viz-font-size-2xl:var(--hbr-font-size-2xl, 2.29rem);--viz-font-size-xl:var(--hbr-font-size-xl, 1.71rem);--viz-font-size-lg:var(--hbr-font-size-lg, 1.29rem);--viz-font-size-md:var(--hbr-font-size-md, 1.14rem);--viz-font-size-sm:var(--hbr-font-size-sm, 1rem);--viz-font-size-xs:var(--hbr-font-size-xs, .86rem);--viz-font-size-2xs:var(--hbr-font-size-2xs, .71rem);--viz-font-size-base:var(--hbr-font-size-base, 62.5%);--viz-font-body:var(--hbr-font-body, \"Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif\");--viz-border-radius-xl:var(--hbr-border-radius-xl, .86rem);--viz-border-radius-lg:var(--hbr-border-radius-lg, .57rem);--viz-border-radius-md:var(--hbr-border-radius-md, .43rem);--viz-border-radius-sm:var(--hbr-border-radius-sm, .29rem);--viz-border-radius:var(--hbr-border-radius, 0);--viz-spacing-4xl:var(--hbr-spacing-4xl, 5.14rem);--viz-spacing-3xl:var(--hbr-spacing-3xl, 4.29rem);--viz-spacing-2xl:var(--hbr-spacing-2xl, 3.43rem);--viz-spacing-xl:var(--hbr-spacing-xl, 2.29rem);--viz-spacing-lg:var(--hbr-spacing-lg, 1.71rem);--viz-spacing-md:var(--hbr-spacing-md, 1.14rem);--viz-spacing-sm:var(--hbr-spacing-sm, .86rem);--viz-spacing-xs:var(--hbr-spacing-xs, .57rem);--viz-spacing-2xs:var(--hbr-spacing-2xs, .29rem);--viz-spacing-3xs:var(--hbr-spacing-3xs, .14rem);--viz-shadow-xl:var(--hbr-shadow-xl, 0px 4px 14px rgba(0, 0, 0, .2));--viz-shadow-lg:var(--hbr-shadow-lg, 0px 4px 12px rgba(0, 0, 0, .18));--viz-shadow-md:var(--hbr-shadow-md, 0px 4px 12px rgba(0, 0, 0, .12));--viz-shadow-sm:var(--hbr-shadow-sm, 0px 3px 8px rgba(0, 0, 0, .08));--viz-shadow-xs:var(--hbr-shadow-xs, 0px 2px 5px rgba(0, 0, 0, .05));--viz-color-neutral-100:var(--Neutral-100, #FFFFFF);--viz-color-neutral-98:var(--Neutral-98, #F7F7F7);--viz-color-neutral-95:var(--Neutral-95, #F0F1F2);--viz-color-neutral-90:var(--Neutral-90, #E1E4E8);--viz-color-neutral-85:var(--Neutral-85, #D0D4D9);--viz-color-neutral-80:var(--Neutral-80, #C1C6CC);--viz-color-neutral-70:var(--Neutral-70, #A7ADB5);--viz-color-neutral-65:var(--Neutral-65, #979FA8);--viz-color-neutral-60:var(--Neutral-60, #889099);--viz-color-neutral-55:var(--Neutral-55, #7E868F);--viz-color-neutral-50:var(--Neutral-50, #6F7680);--viz-color-neutral-45:var(--Neutral-45, #656C75);--viz-color-neutral-40:var(--Neutral-40, #596069);--viz-color-neutral-35:var(--Neutral-35, #464C54);--viz-color-neutral-25:var(--Neutral-25, #373C42);--viz-color-neutral-15:var(--Neutral-15, #23282E);--viz-color-neutral-5:var(--Neutral-5, #0F1214);--viz-color-neutral-0:var(--Neutral-0, #000000)}@media (prefers-color-scheme: light){:root{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}:root .hbr-mode-dark,:root .dark{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}}@media (prefers-color-scheme: dark){:root{--viz-color-neutral-border:var(--viz-color-neutral-50);--viz-color-neutral-border-medium:var(--viz-color-neutral-40);--viz-color-neutral-border-weak:var(--viz-color-neutral-35);--viz-color-neutral-border-hover:var(--viz-color-neutral-50);--viz-color-neutral-border-disabled:var(--viz-color-neutral-40)}:root .hbr-mode-light,:root .light{--viz-color-neutral-border:var(--viz-color-neutral-60);--viz-color-neutral-border-medium:var(--viz-color-neutral-85);--viz-color-neutral-border-weak:var(--viz-color-neutral-90);--viz-color-neutral-border-hover:var(--viz-color-neutral-55);--viz-color-neutral-border-disabled:var(--viz-color-neutral-85)}}:host{--max-width:280px;--bg-color:var(--base-bg-weak-default);--font-size:var(--hbr-font-size-xs, 12px);--font-weight:var(--hbr-font-weight-normal);--line-height:18px;--text-color:var(--base-text-medium-default);--padding:var(--hbr-spacing-sm) var(--hbr-spacing-md);--shadow:var(--hbr-shadow-lg)}:host .--hbr-treemap-popover-entity{display:flex;align-items:center}:host .--hbr-treemap-popover-entity tr{display:flex;align-items:center;justify-items:center}:host .--hbr-treemap-popover-entity tr td{display:flex;align-items:center;justify-items:flex-start;min-width:48px}:host .--hbr-treemap-popover-entity tr{gap:var(--hbr-spacing-sm)}:host .--hbr-treemap-popover-entity .--hbr-treemap-popover-color{width:12px;height:12px;margin-right:var(--hbr-spacing-2xs)}:host .--hbr-treemap-popover-entity .--hbr-treemap-popover-value{font-weight:var(--hbr-font-weight-semibold, 600)}:host .chart-treemap__header{display:flex;align-items:center;justify-content:space-between}:host .chart-treemap__header>:nth-child(2){display:flex}:host .chart-treemap__header>:nth-child(2) hbr-button::part(base){color:var(--control-icon-weak-default)}:host .--treemap-chart{flex-grow:1;overflow:hidden}";
const HbrTreemapChartStyle0 = styleCss;

const { getTreemapBaseConfig } = y;
const HbrTreemapChart$1 = /*@__PURE__*/ proxyCustomElement(class HbrTreemapChart extends HTMLElement {
    constructor() {
        super();
        this.__registerHost();
        this.__attachShadow();
        // saved react object after it is rendered
        // this is for update since react will complain if creating root again during update
        this.contextRoot = null;
        this.warnedAboutNivoTooltip = false;
        this.renderChart = async () => {
            var _a;
            const configWithNivoTooltip = this.config;
            if (!this.warnedAboutNivoTooltip &&
                configWithNivoTooltip.tooltip !== undefined) {
                console.warn("hbr-treemap-chart: config.tooltip is not supported. Use itemTooltip instead.");
                this.warnedAboutNivoTooltip = true;
            }
            const publicConfig = omitChartConfigKeys(configWithNivoTooltip, [
                "tooltip",
            ]);
            const baseConfig = getTreemapBaseConfig({
                itemsEventHandlers: {
                    onMouseEnter: (data, event) => {
                        var _a, _b;
                        showTreemapTooltip(data, event, this.tooltipRef, publicConfig);
                        (_b = (_a = this.config).onMouseEnter) === null || _b === void 0 ? void 0 : _b.call(_a, data, event);
                    },
                    onMouseLeave: (data, event) => {
                        var _a, _b;
                        if (!this.isPopoverSelfManaged()) {
                            hideTreemapTooltip(this.tooltipRef);
                        }
                        (_b = (_a = this.config).onMouseLeave) === null || _b === void 0 ? void 0 : _b.call(_a, data, event);
                    },
                    onClick: (data, event) => {
                        var _a, _b;
                        (_b = (_a = this.config).onClick) === null || _b === void 0 ? void 0 : _b.call(_a, data, event);
                    },
                },
            });
            const existingEventHandlers = {
                onMouseEnter: baseConfig.onMouseEnter,
                onMouseLeave: baseConfig.onMouseLeave,
                onClick: baseConfig.onClick,
            };
            let fullConfig = cjs(baseConfig, publicConfig);
            fullConfig = Object.assign(Object.assign({}, fullConfig), existingEventHandlers);
            fullConfig = omitChartConfigKeys(fullConfig, [
                "tooltip",
            ]);
            if (this.modifyHbrConfig) {
                fullConfig = this.modifyHbrConfig(fullConfig, react.exports.createElement, y);
            }
            fullConfig = Object.assign(Object.assign({}, fullConfig), { tooltip: (_a = fullConfig.tooltip) !== null && _a !== void 0 ? _a : noopChartTooltip });
            if (!this.chartRef.innerHTML.length) {
                const newRoot = createRoot(this.chartRef);
                newRoot.render(react.exports.createElement(be, fullConfig, null));
                this.contextRoot = newRoot;
            }
            else {
                this.contextRoot.render(react.exports.createElement(be, fullConfig, null));
            }
            if (this.boardRef.setChartConfig) {
                this.boardRef.setChartConfig(fullConfig);
            }
        };
        this.config = {
            data: { id: "id" },
        };
        this.width = "100%";
        this.height = "360px";
        this.loading = false;
        this.showHeader = "none";
        this.modifyHbrConfig = undefined;
        this.popoverOptions = undefined;
    }
    /** Public method for download data, use customFunc required to create your own way to download data, such as pdf */
    async download(customFunc) {
        if (customFunc) {
            customFunc(this.config.data);
        }
    }
    /** Public method to get popover reference, client can use this to control magnetic UX popover externally */
    async getPopoverRef() {
        return this.tooltipRef;
    }
    isPopoverSelfManaged() {
        return isChartPopoverSelfManaged(true, this.popoverOptions);
    }
    componentDidLoad() {
        this.renderChart();
        reactShadowDomRetargetEvents(this.el.shadowRoot);
    }
    componentShouldUpdate() {
        return this.renderChart();
    }
    render() {
        const { config } = this;
        this.el.style.width = this.width;
        this.el.style.height = this.height;
        const popoverOptions = resolveChartPopoverOptions({ distance: 10, variant: "chart" }, this.popoverOptions, true);
        return (h(Host, { key: '34b8d05de0b38628e24ab9d5acb1e8eaaa3eef75' }, h("hbr-chart-board", { key: '9268059171f6d3f54652e1f272b8ebdb5c6b4a8f', ref: (el) => {
                this.boardRef = el;
            }, isLoading: this.loading, isEmpty: !Object.keys(config.data || {}).length, style: { width: this.width, height: this.height }, exportparts: "empty-state-illustration, empty-state-image, loading-state-illustration, loading-state-image" }, h("hbr-popover", Object.assign({ key: 'bc8a36ba16d65754fec954cb76f6e490ee11645e' }, popoverOptions, { ref: (el) => {
                this.tooltipRef = el;
            }, part: "popover", exportparts: "base__popup:popover-popup, base__arrow:popover-arrow, body:popover-body", anchor: "" }), h("div", { key: '5112235c5007c03dc823fadd011df5bfc872136c', slot: "content" })), h("div", { key: '3dc26750779b0872ac8bb15d0393f2bc2ecebfb8', slot: "header", part: "header", class: "chart-treemap__header" }, h("slot", { key: 'bb037f5d297921d144515f9ec070b68d6d17eecd', name: "header" }, h("div", { key: 'da3326cebc00fa7fb88ac6f68fe582da16465ed7' }, h("slot", { key: 'a67f32a870e0d9752ae85f9222f46e16d5922dbe', name: "header-title" })), h("div", { key: 'c529ac5e02fa26c63afd473d1662083a36bcdfae' }, h("slot", { key: '3bfe825ea9a6317671feac6e7d0c336936de9eb8', name: "header-action" })))), h("div", { key: 'd282088bf1ac36a81c8608b105396f8afaf6b4c8', ref: (el) => {
                this.chartRef = el;
            }, class: "--hbr-treemap --treemap-chart", part: "chart" }), h("slot", { key: '343e22f599c82c69767bf27087656bf9b8c36740', name: "footer" }), h("slot", { key: 'd2049d12e0a24c36dce8a2f9091fc0c0a3e9f323', slot: "loading-state", name: "loading-state" }), h("slot", { key: '1d3576c5930e2ae1ffc25604f27498e109af728a', slot: "empty-state", name: "empty-state" }))));
    }
    get el() { return this; }
    static get style() { return HbrTreemapChartStyle0; }
}, [1, "hbr-treemap-chart", {
        "config": [1040],
        "width": [1],
        "height": [1],
        "loading": [4],
        "showHeader": [1, "show-header"],
        "modifyHbrConfig": [16],
        "popoverOptions": [16],
        "download": [64],
        "getPopoverRef": [64]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["hbr-treemap-chart", "hbr-chart-board", "hbr-icon", "hbr-illustration", "hbr-popover", "hbr-popup", "hbr-stencil"];
    components.forEach(tagName => { switch (tagName) {
        case "hbr-treemap-chart":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, HbrTreemapChart$1);
            }
            break;
        case "hbr-chart-board":
            if (!customElements.get(tagName)) {
                defineCustomElement$7();
            }
            break;
        case "hbr-icon":
            if (!customElements.get(tagName)) {
                defineCustomElement$6();
            }
            break;
        case "hbr-illustration":
            if (!customElements.get(tagName)) {
                defineCustomElement$5();
            }
            break;
        case "hbr-popover":
            if (!customElements.get(tagName)) {
                defineCustomElement$4();
            }
            break;
        case "hbr-popup":
            if (!customElements.get(tagName)) {
                defineCustomElement$3();
            }
            break;
        case "hbr-stencil":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}

const HbrTreemapChart = HbrTreemapChart$1;
const defineCustomElement = defineCustomElement$1;

export { HbrTreemapChart, defineCustomElement };

