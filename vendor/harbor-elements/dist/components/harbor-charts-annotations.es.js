import { aF as _arrayFilter, aG as isArray_1, ax as _baseGetTag, ay as isObjectLike_1, r as react, aH as si, a0 as oi, aI as li, V as ni, j as jsxRuntime, E as Et, Z as Zr, b as useSpring, a as animated, $ as $r } from './client.js';
import { a as _baseEach, _ as _baseIteratee } from './sortBy.js';
import { o as omit_1 } from './omit.js';

var baseEach = _baseEach;

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter$1(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

var _baseFilter = baseFilter$1;

var arrayFilter = _arrayFilter,
    baseFilter = _baseFilter,
    baseIteratee = _baseIteratee,
    isArray = isArray_1;

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 *
 * // Combining several predicates using `_.overEvery` or `_.overSome`.
 * _.filter(users, _.overSome([{ 'age': 36 }, ['age', 40]]));
 * // => objects for ['fred', 'barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate));
}

var filter_1 = filter;

var baseGetTag = _baseGetTag,
    isObjectLike = isObjectLike_1;

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && baseGetTag(value) == numberTag);
}

var isNumber_1 = isNumber;

function g(){return g=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var i=arguments[n];for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(t[o]=i[o]);}return t},g.apply(this,arguments)}var k={dotSize:4,noteWidth:120,noteTextOffset:8,animate:!0},W=function(n){var i=typeof n;return react.exports.isValidElement(n)||"string"===i||"function"===i||"object"===i},b=function(t){var n=typeof t;return "string"===n||"function"===n},v=function(t){return "circle"===t.type},w=function(t){return "dot"===t.type},z=function(t){return "rect"===t.type},P=function(t){var n=t.data,i=t.annotations,e=t.getPosition,r=t.getDimensions;return i.reduce((function(t,i){var s=i.offset||0;return [].concat(t,filter_1(n,i.match).map((function(t){var n=e(t),o=r(t);return (v(i)||z(i))&&(o.size=o.size+2*s,o.width=o.width+2*s,o.height=o.height+2*s),g({},omit_1(i,["match","offset"]),n,o,{size:i.size||o.size,datum:t})})))}),[])},C=function(t,n,i,o){var e=Math.atan2(o-n,i-t);return si(oi(e))},O=function(t){var n,i,o=t.x,a=t.y,r=t.noteX,s=t.noteY,h=t.noteWidth,d=void 0===h?k.noteWidth:h,c=t.noteTextOffset,f=void 0===c?k.noteTextOffset:c;if(isNumber_1(r))n=o+r;else {if(void 0===r.abs)throw new Error("noteX should be either a number or an object containing an 'abs' property");n=r.abs;}if(isNumber_1(s))i=a+s;else {if(void 0===s.abs)throw new Error("noteY should be either a number or an object containing an 'abs' property");i=s.abs;}var y=o,x=a,m=C(o,a,n,i);if(v(t)){var p=li(ni(m),t.size/2);y+=p.x,x+=p.y;}if(z(t)){var g=Math.round((m+90)/45)%8;0===g&&(x-=t.height/2),1===g&&(y+=t.width/2,x-=t.height/2),2===g&&(y+=t.width/2),3===g&&(y+=t.width/2,x+=t.height/2),4===g&&(x+=t.height/2),5===g&&(y-=t.width/2,x+=t.height/2),6===g&&(y-=t.width/2),7===g&&(y-=t.width/2,x-=t.height/2);}var W=n,b=n;return (m+90)%360>180?(W-=d,b-=d):b+=d,{points:[[y,x],[n,i],[b,i]],text:[W,i-f],angle:m+90}},S=function(t){var i=t.data,o=t.annotations,e=t.getPosition,a=t.getDimensions;return react.exports.useMemo((function(){return P({data:i,annotations:o,getPosition:e,getDimensions:a})}),[i,o,e,a])},j=function(t){var i=t.annotations;return react.exports.useMemo((function(){return i.map((function(t){return g({},t,{computed:O(g({},t))})}))}),[i])},M=function(t){return react.exports.useMemo((function(){return O(t)}),[t])},T=function(t){var n=t.datum,o=t.x,e=t.y,r=t.note,s=Et(),l=Zr(),u=l.animate,c=l.config,k=useSpring({x:o,y:e,config:c,immediate:!u});return "function"==typeof r?react.exports.createElement(r,{x:o,y:e,datum:n}):jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment,{children:[s.annotations.text.outlineWidth>0&&jsxRuntime.exports.jsx(animated.text,{x:k.x,y:k.y,style:g({},s.annotations.text,{strokeLinejoin:"round",strokeWidth:2*s.annotations.text.outlineWidth,stroke:s.annotations.text.outlineColor}),children:r}),jsxRuntime.exports.jsx(animated.text,{x:k.x,y:k.y,style:omit_1(s.annotations.text,["outlineWidth","outlineColor"]),children:r})]})},E=function(t){var i=t.points,o=t.isOutline,e=void 0!==o&&o,a=Et(),r=react.exports.useMemo((function(){var t=i[0];return i.slice(1).reduce((function(t,n){return t+" L"+n[0]+","+n[1]}),"M"+t[0]+","+t[1])}),[i]),s=$r(r);if(e&&a.annotations.link.outlineWidth<=0)return null;var l=g({},a.annotations.link);return e&&(l.strokeLinecap="square",l.strokeWidth=a.annotations.link.strokeWidth+2*a.annotations.link.outlineWidth,l.stroke=a.annotations.link.outlineColor,l.opacity=a.annotations.link.outlineOpacity),jsxRuntime.exports.jsx(animated.path,{fill:"none",d:s,style:l})},I=function(t){var n=t.x,i=t.y,o=t.size,e=Et(),a=Zr(),r=a.animate,s=a.config,l=useSpring({x:n,y:i,radius:o/2,config:s,immediate:!r});return jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment,{children:[e.annotations.outline.outlineWidth>0&&jsxRuntime.exports.jsx(animated.circle,{cx:l.x,cy:l.y,r:l.radius,style:g({},e.annotations.outline,{fill:"none",strokeWidth:e.annotations.outline.strokeWidth+2*e.annotations.outline.outlineWidth,stroke:e.annotations.outline.outlineColor,opacity:e.annotations.outline.outlineOpacity})}),jsxRuntime.exports.jsx(animated.circle,{cx:l.x,cy:l.y,r:l.radius,style:e.annotations.outline})]})},D=function(t){var n=t.x,i=t.y,o=t.size,e=void 0===o?k.dotSize:o,a=Et(),r=Zr(),s=r.animate,l=r.config,u=useSpring({x:n,y:i,radius:e/2,config:l,immediate:!s});return jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment,{children:[a.annotations.outline.outlineWidth>0&&jsxRuntime.exports.jsx(animated.circle,{cx:u.x,cy:u.y,r:u.radius,style:g({},a.annotations.outline,{fill:"none",strokeWidth:2*a.annotations.outline.outlineWidth,stroke:a.annotations.outline.outlineColor,opacity:a.annotations.outline.outlineOpacity})}),jsxRuntime.exports.jsx(animated.circle,{cx:u.x,cy:u.y,r:u.radius,style:a.annotations.symbol})]})},L=function(t){var n=t.x,i=t.y,o=t.width,e=t.height,a=t.borderRadius,r=void 0===a?6:a,s=Et(),l=Zr(),u=l.animate,c=l.config,k=useSpring({x:n-o/2,y:i-e/2,width:o,height:e,config:c,immediate:!u});return jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment,{children:[s.annotations.outline.outlineWidth>0&&jsxRuntime.exports.jsx(animated.rect,{x:k.x,y:k.y,rx:r,ry:r,width:k.width,height:k.height,style:g({},s.annotations.outline,{fill:"none",strokeWidth:s.annotations.outline.strokeWidth+2*s.annotations.outline.outlineWidth,stroke:s.annotations.outline.outlineColor,opacity:s.annotations.outline.outlineOpacity})}),jsxRuntime.exports.jsx(animated.rect,{x:k.x,y:k.y,rx:r,ry:r,width:k.width,height:k.height,style:s.annotations.outline})]})},R=function(t){var n=t.datum,i=t.x,o=t.y,e=t.note,a=M(t);if(!W(e))throw new Error("note should be a valid react element");return jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment,{children:[jsxRuntime.exports.jsx(E,{points:a.points,isOutline:!0}),v(t)&&jsxRuntime.exports.jsx(I,{x:i,y:o,size:t.size}),w(t)&&jsxRuntime.exports.jsx(D,{x:i,y:o,size:t.size}),z(t)&&jsxRuntime.exports.jsx(L,{x:i,y:o,width:t.width,height:t.height,borderRadius:t.borderRadius}),jsxRuntime.exports.jsx(E,{points:a.points}),jsxRuntime.exports.jsx(T,{datum:n,x:a.text[0],y:a.text[1],note:e})]})},q=function(t,n){n.forEach((function(n,i){var o=n[0],e=n[1];0===i?t.moveTo(o,e):t.lineTo(o,e);}));},J=function(t,n){var i=n.annotations,o=n.theme;0!==i.length&&(t.save(),i.forEach((function(n){if(!b(n.note))throw new Error("note is invalid for canvas implementation");o.annotations.link.outlineWidth>0&&(t.lineCap="square",t.strokeStyle=o.annotations.link.outlineColor,t.lineWidth=o.annotations.link.strokeWidth+2*o.annotations.link.outlineWidth,t.beginPath(),q(t,n.computed.points),t.stroke(),t.lineCap="butt"),v(n)&&o.annotations.outline.outlineWidth>0&&(t.strokeStyle=o.annotations.outline.outlineColor,t.lineWidth=o.annotations.outline.strokeWidth+2*o.annotations.outline.outlineWidth,t.beginPath(),t.arc(n.x,n.y,n.size/2,0,2*Math.PI),t.stroke()),w(n)&&o.annotations.symbol.outlineWidth>0&&(t.strokeStyle=o.annotations.symbol.outlineColor,t.lineWidth=2*o.annotations.symbol.outlineWidth,t.beginPath(),t.arc(n.x,n.y,n.size/2,0,2*Math.PI),t.stroke()),z(n)&&o.annotations.outline.outlineWidth>0&&(t.strokeStyle=o.annotations.outline.outlineColor,t.lineWidth=o.annotations.outline.strokeWidth+2*o.annotations.outline.outlineWidth,t.beginPath(),t.rect(n.x-n.width/2,n.y-n.height/2,n.width,n.height),t.stroke()),t.strokeStyle=o.annotations.link.stroke,t.lineWidth=o.annotations.link.strokeWidth,t.beginPath(),q(t,n.computed.points),t.stroke(),v(n)&&(t.strokeStyle=o.annotations.outline.stroke,t.lineWidth=o.annotations.outline.strokeWidth,t.beginPath(),t.arc(n.x,n.y,n.size/2,0,2*Math.PI),t.stroke()),w(n)&&(t.fillStyle=o.annotations.symbol.fill,t.beginPath(),t.arc(n.x,n.y,n.size/2,0,2*Math.PI),t.fill()),z(n)&&(t.strokeStyle=o.annotations.outline.stroke,t.lineWidth=o.annotations.outline.strokeWidth,t.beginPath(),t.rect(n.x-n.width/2,n.y-n.height/2,n.width,n.height),t.stroke()),"function"==typeof n.note?n.note(t,{datum:n.datum,x:n.computed.text[0],y:n.computed.text[1],theme:o}):(t.font=o.annotations.text.fontSize+"px "+o.annotations.text.fontFamily,t.textAlign="left",t.textBaseline="alphabetic",t.fillStyle=o.annotations.text.fill,t.strokeStyle=o.annotations.text.outlineColor,t.lineWidth=2*o.annotations.text.outlineWidth,o.annotations.text.outlineWidth>0&&(t.lineJoin="round",t.strokeText(n.note,n.computed.text[0],n.computed.text[1]),t.lineJoin="miter"),t.fillText(n.note,n.computed.text[0],n.computed.text[1]));})),t.restore());};

export { J, R, S, j };

