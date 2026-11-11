import { b9 as _baseGet, bi as _castPath, b8 as _toKey, aB as last_1, bj as isPlainObject_1, be as _arrayMap, bk as _copyObject, bl as _flatRest } from './client.js';
import { a as _getAllKeysIn, _ as _baseClone } from './_baseClone.js';

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */

function baseSlice$1(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

var _baseSlice = baseSlice$1;

var baseGet = _baseGet,
    baseSlice = _baseSlice;

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent$1(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

var _parent = parent$1;

var castPath$1 = _castPath,
    last = last_1,
    parent = _parent,
    toKey = _toKey;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset$1(object, path) {
  path = castPath$1(path, object);

  // Prevent prototype pollution, see: https://github.com/lodash/lodash/security/advisories/GHSA-xxjr-mmjv-4gpg
  var index = -1,
      length = path.length;

  if (!length) {
    return true;
  }

  var isRootPrimitive = object == null || (typeof object !== 'object' && typeof object !== 'function');

  while (++index < length) {
    var key = path[index];

    // skip non-string keys (e.g., Symbols, numbers)
    if (typeof key !== 'string') {
      continue;
    }

    // Always block "__proto__" anywhere in the path if it's not expected
    if (key === '__proto__' && !hasOwnProperty.call(object, '__proto__')) {
      return false;
    }

    // Block "constructor.prototype" chains
    if (key === 'constructor' &&
        (index + 1) < length &&
        typeof path[index + 1] === 'string' &&
        path[index + 1] === 'prototype') {

      // Allow ONLY when the path starts at a primitive root, e.g., _.unset(0, 'constructor.prototype.a')
      if (isRootPrimitive && index === 0) {
        continue;
      }

      return false;
    }
  }

  var obj = parent(object, path);
  return obj == null || delete obj[toKey(last(path))];
}

var _baseUnset = baseUnset$1;

var isPlainObject = isPlainObject_1;

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone$1(value) {
  return isPlainObject(value) ? undefined : value;
}

var _customOmitClone = customOmitClone$1;

var arrayMap = _arrayMap,
    baseClone = _baseClone,
    baseUnset = _baseUnset,
    castPath = _castPath,
    copyObject = _copyObject,
    customOmitClone = _customOmitClone,
    flatRest = _flatRest,
    getAllKeysIn = _getAllKeysIn;

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

var omit_1 = omit;

export { _baseSlice as _, omit_1 as o };

