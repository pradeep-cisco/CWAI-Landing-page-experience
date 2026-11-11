import { a7 as initRange, a8 as ordinal, a9 as copy, aa as ticks, ab as format, ac as transformer, ad as linearish, ae as newInterval$1, af as durationSecond$1, ag as durationMinute$1, ah as durationHour$1, ai as bisector, aj as tickStep, ak as durationYear, al as utcYear$1, am as timeYear, an as durationDay, ao as durationWeek$1, ap as durationMonth, aq as utcDay, ar as utcSunday$1, as as timeDay, at as sunday$1, au as continuous, av as timeFormat, aw as utcFormat, ax as _baseGetTag, ay as isObjectLike_1, az as _baseUnary, aA as _nodeUtil, aB as last_1, aC as utcParse, aD as timeParse, a3 as linear, r as react, E as Et, j as jsxRuntime, a as animated, K as K$1, Z as Zr, u as useTransition, b as useSpring, aE as format$1, f as fi, V as ni } from './client.js';
import { _ as _baseUniq, u as uniq_1 } from './uniq.js';
import { _ as _baseIteratee, s as sortBy_1 } from './sortBy.js';

function sequence(start, stop, step) {
  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

  var i = -1,
      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
      range = new Array(n);

  while (++i < n) {
    range[i] = start + i * step;
  }

  return range;
}

function band() {
  var scale = ordinal().unknown(undefined),
      domain = scale.domain,
      ordinalRange = scale.range,
      r0 = 0,
      r1 = 1,
      step,
      bandwidth,
      round = false,
      paddingInner = 0,
      paddingOuter = 0,
      align = 0.5;

  delete scale.unknown;

  function rescale() {
    var n = domain().length,
        reverse = r1 < r0,
        start = reverse ? r1 : r0,
        stop = reverse ? r0 : r1;
    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
    if (round) step = Math.floor(step);
    start += (stop - start - step * (n - paddingInner)) * align;
    bandwidth = step * (1 - paddingInner);
    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
    var values = sequence(n).map(function(i) { return start + step * i; });
    return ordinalRange(reverse ? values.reverse() : values);
  }

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.range = function(_) {
    return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
  };

  scale.rangeRound = function(_) {
    return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
  };

  scale.bandwidth = function() {
    return bandwidth;
  };

  scale.step = function() {
    return step;
  };

  scale.round = function(_) {
    return arguments.length ? (round = !!_, rescale()) : round;
  };

  scale.padding = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
  };

  scale.paddingInner = function(_) {
    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
  };

  scale.paddingOuter = function(_) {
    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
  };

  scale.align = function(_) {
    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
  };

  scale.copy = function() {
    return band(domain(), [r0, r1])
        .round(round)
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)
        .align(align);
  };

  return initRange.apply(rescale(), arguments);
}

function pointish(scale) {
  var copy = scale.copy;

  scale.padding = scale.paddingOuter;
  delete scale.paddingInner;
  delete scale.paddingOuter;

  scale.copy = function() {
    return pointish(copy());
  };

  return scale;
}

function point() {
  return pointish(band.apply(null, arguments).paddingInner(1));
}

function nice(domain, interval) {
  domain = domain.slice();

  var i0 = 0,
      i1 = domain.length - 1,
      x0 = domain[i0],
      x1 = domain[i1],
      t;

  if (x1 < x0) {
    t = i0, i0 = i1, i1 = t;
    t = x0, x0 = x1, x1 = t;
  }

  domain[i0] = interval.floor(x0);
  domain[i1] = interval.ceil(x1);
  return domain;
}

function transformLog(x) {
  return Math.log(x);
}

function transformExp(x) {
  return Math.exp(x);
}

function transformLogn(x) {
  return -Math.log(-x);
}

function transformExpn(x) {
  return -Math.exp(-x);
}

function pow10(x) {
  return isFinite(x) ? +("1e" + x) : x < 0 ? 0 : x;
}

function powp(base) {
  return base === 10 ? pow10
      : base === Math.E ? Math.exp
      : function(x) { return Math.pow(base, x); };
}

function logp(base) {
  return base === Math.E ? Math.log
      : base === 10 && Math.log10
      || base === 2 && Math.log2
      || (base = Math.log(base), function(x) { return Math.log(x) / base; });
}

function reflect(f) {
  return function(x) {
    return -f(-x);
  };
}

function loggish(transform) {
  var scale = transform(transformLog, transformExp),
      domain = scale.domain,
      base = 10,
      logs,
      pows;

  function rescale() {
    logs = logp(base), pows = powp(base);
    if (domain()[0] < 0) {
      logs = reflect(logs), pows = reflect(pows);
      transform(transformLogn, transformExpn);
    } else {
      transform(transformLog, transformExp);
    }
    return scale;
  }

  scale.base = function(_) {
    return arguments.length ? (base = +_, rescale()) : base;
  };

  scale.domain = function(_) {
    return arguments.length ? (domain(_), rescale()) : domain();
  };

  scale.ticks = function(count) {
    var d = domain(),
        u = d[0],
        v = d[d.length - 1],
        r;

    if (r = v < u) i = u, u = v, v = i;

    var i = logs(u),
        j = logs(v),
        p,
        k,
        t,
        n = count == null ? 10 : +count,
        z = [];

    if (!(base % 1) && j - i < n) {
      i = Math.floor(i), j = Math.ceil(j);
      if (u > 0) for (; i <= j; ++i) {
        for (k = 1, p = pows(i); k < base; ++k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      } else for (; i <= j; ++i) {
        for (k = base - 1, p = pows(i); k >= 1; --k) {
          t = p * k;
          if (t < u) continue;
          if (t > v) break;
          z.push(t);
        }
      }
      if (z.length * 2 < n) z = ticks(u, v, n);
    } else {
      z = ticks(i, j, Math.min(j - i, n)).map(pows);
    }

    return r ? z.reverse() : z;
  };

  scale.tickFormat = function(count, specifier) {
    if (specifier == null) specifier = base === 10 ? ".0e" : ",";
    if (typeof specifier !== "function") specifier = format(specifier);
    if (count === Infinity) return specifier;
    if (count == null) count = 10;
    var k = Math.max(1, base * count / scale.ticks().length); // TODO fast estimate?
    return function(d) {
      var i = d / pows(Math.round(logs(d)));
      if (i * base < base - 0.5) i *= base;
      return i <= k ? specifier(d) : "";
    };
  };

  scale.nice = function() {
    return domain(nice(domain(), {
      floor: function(x) { return pows(Math.floor(logs(x))); },
      ceil: function(x) { return pows(Math.ceil(logs(x))); }
    }));
  };

  return scale;
}

function log() {
  var scale = loggish(transformer()).domain([1, 10]);

  scale.copy = function() {
    return copy(scale, log()).base(scale.base());
  };

  initRange.apply(scale, arguments);

  return scale;
}

function transformSymlog(c) {
  return function(x) {
    return Math.sign(x) * Math.log1p(Math.abs(x / c));
  };
}

function transformSymexp(c) {
  return function(x) {
    return Math.sign(x) * Math.expm1(Math.abs(x)) * c;
  };
}

function symlogish(transform) {
  var c = 1, scale = transform(transformSymlog(c), transformSymexp(c));

  scale.constant = function(_) {
    return arguments.length ? transform(transformSymlog(c = +_), transformSymexp(c)) : c;
  };

  return linearish(scale);
}

function symlog() {
  var scale = symlogish(transformer());

  scale.copy = function() {
    return copy(scale, symlog()).constant(scale.constant());
  };

  return initRange.apply(scale, arguments);
}

var millisecond$1 = newInterval$1(function() {
  // noop
}, function(date, step) {
  date.setTime(+date + step);
}, function(start, end) {
  return end - start;
});

// An optimized implementation for this simple case.
millisecond$1.every = function(k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond$1;
  return newInterval$1(function(date) {
    date.setTime(Math.floor(date / k) * k);
  }, function(date, step) {
    date.setTime(+date + step * k);
  }, function(start, end) {
    return (end - start) / k;
  });
};

const millisecond$2 = millisecond$1;

var second$1 = newInterval$1(function(date) {
  date.setTime(date - date.getMilliseconds());
}, function(date, step) {
  date.setTime(+date + step * durationSecond$1);
}, function(start, end) {
  return (end - start) / durationSecond$1;
}, function(date) {
  return date.getUTCSeconds();
});

const utcSecond = second$1;

var minute$1 = newInterval$1(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond$1);
}, function(date, step) {
  date.setTime(+date + step * durationMinute$1);
}, function(start, end) {
  return (end - start) / durationMinute$1;
}, function(date) {
  return date.getMinutes();
});

const timeMinute = minute$1;

var hour$1 = newInterval$1(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond$1 - date.getMinutes() * durationMinute$1);
}, function(date, step) {
  date.setTime(+date + step * durationHour$1);
}, function(start, end) {
  return (end - start) / durationHour$1;
}, function(date) {
  return date.getHours();
});

const timeHour = hour$1;

var month$1 = newInterval$1(function(date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setMonth(date.getMonth() + step);
}, function(start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date) {
  return date.getMonth();
});

const timeMonth = month$1;

var utcMinute$1 = newInterval$1(function(date) {
  date.setUTCSeconds(0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationMinute$1);
}, function(start, end) {
  return (end - start) / durationMinute$1;
}, function(date) {
  return date.getUTCMinutes();
});

const utcMinute$2 = utcMinute$1;

var utcHour$1 = newInterval$1(function(date) {
  date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationHour$1);
}, function(start, end) {
  return (end - start) / durationHour$1;
}, function(date) {
  return date.getUTCHours();
});

const utcHour$2 = utcHour$1;

var utcMonth$1 = newInterval$1(function(date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function(start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date) {
  return date.getUTCMonth();
});

const utcMonth$2 = utcMonth$1;

function ticker(year, month, week, day, hour, minute) {

  const tickIntervals = [
    [utcSecond,  1,      durationSecond$1],
    [utcSecond,  5,  5 * durationSecond$1],
    [utcSecond, 15, 15 * durationSecond$1],
    [utcSecond, 30, 30 * durationSecond$1],
    [minute,  1,      durationMinute$1],
    [minute,  5,  5 * durationMinute$1],
    [minute, 15, 15 * durationMinute$1],
    [minute, 30, 30 * durationMinute$1],
    [  hour,  1,      durationHour$1  ],
    [  hour,  3,  3 * durationHour$1  ],
    [  hour,  6,  6 * durationHour$1  ],
    [  hour, 12, 12 * durationHour$1  ],
    [   day,  1,      durationDay   ],
    [   day,  2,  2 * durationDay   ],
    [  week,  1,      durationWeek$1  ],
    [ month,  1,      durationMonth ],
    [ month,  3,  3 * durationMonth ],
    [  year,  1,      durationYear  ]
  ];

  function ticks(start, stop, count) {
    const reverse = stop < start;
    if (reverse) [start, stop] = [stop, start];
    const interval = count && typeof count.range === "function" ? count : tickInterval(start, stop, count);
    const ticks = interval ? interval.range(start, +stop + 1) : []; // inclusive stop
    return reverse ? ticks.reverse() : ticks;
  }

  function tickInterval(start, stop, count) {
    const target = Math.abs(stop - start) / count;
    const i = bisector(([,, step]) => step).right(tickIntervals, target);
    if (i === tickIntervals.length) return year.every(tickStep(start / durationYear, stop / durationYear, count));
    if (i === 0) return millisecond$2.every(Math.max(tickStep(start, stop, count), 1));
    const [t, step] = tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i];
    return t.every(step);
  }

  return [ticks, tickInterval];
}

const [utcTicks, utcTickInterval] = ticker(utcYear$1, utcMonth$2, utcSunday$1, utcDay, utcHour$2, utcMinute$2);
const [timeTicks, timeTickInterval] = ticker(timeYear, timeMonth, sunday$1, timeDay, timeHour, timeMinute);

function date(t) {
  return new Date(t);
}

function number(t) {
  return t instanceof Date ? +t : +new Date(+t);
}

function calendar(ticks, tickInterval, year, month, week, day, hour, minute, second, format) {
  var scale = continuous(),
      invert = scale.invert,
      domain = scale.domain;

  var formatMillisecond = format(".%L"),
      formatSecond = format(":%S"),
      formatMinute = format("%I:%M"),
      formatHour = format("%I %p"),
      formatDay = format("%a %d"),
      formatWeek = format("%b %d"),
      formatMonth = format("%B"),
      formatYear = format("%Y");

  function tickFormat(date) {
    return (second(date) < date ? formatMillisecond
        : minute(date) < date ? formatSecond
        : hour(date) < date ? formatMinute
        : day(date) < date ? formatHour
        : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
        : year(date) < date ? formatMonth
        : formatYear)(date);
  }

  scale.invert = function(y) {
    return new Date(invert(y));
  };

  scale.domain = function(_) {
    return arguments.length ? domain(Array.from(_, number)) : domain().map(date);
  };

  scale.ticks = function(interval) {
    var d = domain();
    return ticks(d[0], d[d.length - 1], interval == null ? 10 : interval);
  };

  scale.tickFormat = function(count, specifier) {
    return specifier == null ? tickFormat : format(specifier);
  };

  scale.nice = function(interval) {
    var d = domain();
    if (!interval || typeof interval.range !== "function") interval = tickInterval(d[0], d[d.length - 1], interval == null ? 10 : interval);
    return interval ? domain(nice(d, interval)) : scale;
  };

  scale.copy = function() {
    return copy(scale, calendar(ticks, tickInterval, year, month, week, day, hour, minute, second, format));
  };

  return scale;
}

function time() {
  return initRange.apply(calendar(timeTicks, timeTickInterval, timeYear, timeMonth, sunday$1, timeDay, timeHour, timeMinute, utcSecond, timeFormat).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]), arguments);
}

function utcTime() {
  return initRange.apply(calendar(utcTicks, utcTickInterval, utcYear$1, utcMonth$2, utcSunday$1, utcDay, utcHour$2, utcMinute$2, utcSecond, utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]), arguments);
}

var baseIteratee = _baseIteratee,
    baseUniq = _baseUniq;

/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The order of result values is determined by the
 * order they occur in the array. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniqBy(array, iteratee) {
  return (array && array.length) ? baseUniq(array, baseIteratee(iteratee)) : [];
}

var uniqBy_1 = uniqBy;

var baseGetTag = _baseGetTag,
    isObjectLike = isObjectLike_1;

/** `Object#toString` result references. */
var dateTag = '[object Date]';

/**
 * The base implementation of `_.isDate` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 */
function baseIsDate$1(value) {
  return isObjectLike(value) && baseGetTag(value) == dateTag;
}

var _baseIsDate = baseIsDate$1;

var baseIsDate = _baseIsDate,
    baseUnary = _baseUnary,
    nodeUtil = _nodeUtil.exports;

/* Node.js helper references. */
var nodeIsDate = nodeUtil && nodeUtil.isDate;

/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 *
 * _.isDate('Mon April 23 2012');
 * // => false
 */
var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

var isDate_1 = isDate;

var t0 = new Date,
    t1 = new Date;

function newInterval(floori, offseti, count, field) {

  function interval(date) {
    return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
  }

  interval.floor = function(date) {
    return floori(date = new Date(+date)), date;
  };

  interval.ceil = function(date) {
    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
  };

  interval.round = function(date) {
    var d0 = interval(date),
        d1 = interval.ceil(date);
    return date - d0 < d1 - date ? d0 : d1;
  };

  interval.offset = function(date, step) {
    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
  };

  interval.range = function(start, stop, step) {
    var range = [], previous;
    start = interval.ceil(start);
    step = step == null ? 1 : Math.floor(step);
    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
    do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
    while (previous < start && start < stop);
    return range;
  };

  interval.filter = function(test) {
    return newInterval(function(date) {
      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
    }, function(date, step) {
      if (date >= date) {
        if (step < 0) while (++step <= 0) {
          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
        } else while (--step >= 0) {
          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
        }
      }
    });
  };

  if (count) {
    interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    interval.every = function(step) {
      step = Math.floor(step);
      return !isFinite(step) || !(step > 0) ? null
          : !(step > 1) ? interval
          : interval.filter(field
              ? function(d) { return field(d) % step === 0; }
              : function(d) { return interval.count(0, d) % step === 0; });
    };
  }

  return interval;
}

var millisecond = newInterval(function() {
  // noop
}, function(date, step) {
  date.setTime(+date + step);
}, function(start, end) {
  return end - start;
});

// An optimized implementation for this simple case.
millisecond.every = function(k) {
  k = Math.floor(k);
  if (!isFinite(k) || !(k > 0)) return null;
  if (!(k > 1)) return millisecond;
  return newInterval(function(date) {
    date.setTime(Math.floor(date / k) * k);
  }, function(date, step) {
    date.setTime(+date + step * k);
  }, function(start, end) {
    return (end - start) / k;
  });
};

const p$1 = millisecond;

var durationSecond = 1e3;
var durationMinute = 6e4;
var durationHour = 36e5;
var durationWeek = 6048e5;

var second = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds());
}, function(date, step) {
  date.setTime(+date + step * durationSecond);
}, function(start, end) {
  return (end - start) / durationSecond;
}, function(date) {
  return date.getUTCSeconds();
});

const g = second;

var minute = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getMinutes();
});

const x = minute;

var hour = newInterval(function(date) {
  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getHours();
});

const T$1 = hour;

function weekday(i) {
  return newInterval(function(date) {
    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step * 7);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
  });
}

var sunday = weekday(0);
var monday = weekday(1);
var tuesday = weekday(2);
var wednesday = weekday(3);
var thursday = weekday(4);
var friday = weekday(5);
var saturday = weekday(6);

var month = newInterval(function(date) {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setMonth(date.getMonth() + step);
}, function(start, end) {
  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
}, function(date) {
  return date.getMonth();
});

const N = month;

var year = newInterval(function(date) {
  date.setMonth(0, 1);
  date.setHours(0, 0, 0, 0);
}, function(date, step) {
  date.setFullYear(date.getFullYear() + step);
}, function(start, end) {
  return end.getFullYear() - start.getFullYear();
}, function(date) {
  return date.getFullYear();
});

// An optimized implementation for this simple case.
year.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
    date.setMonth(0, 1);
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step * k);
  });
};

const I = year;

var utcMinute = newInterval(function(date) {
  date.setUTCSeconds(0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationMinute);
}, function(start, end) {
  return (end - start) / durationMinute;
}, function(date) {
  return date.getUTCMinutes();
});

const k = utcMinute;

var utcHour = newInterval(function(date) {
  date.setUTCMinutes(0, 0, 0);
}, function(date, step) {
  date.setTime(+date + step * durationHour);
}, function(start, end) {
  return (end - start) / durationHour;
}, function(date) {
  return date.getUTCHours();
});

const b$1 = utcHour;

function utcWeekday(i) {
  return newInterval(function(date) {
    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step * 7);
  }, function(start, end) {
    return (end - start) / durationWeek;
  });
}

var utcSunday = utcWeekday(0);
var utcMonday = utcWeekday(1);
var utcTuesday = utcWeekday(2);
var utcWednesday = utcWeekday(3);
var utcThursday = utcWeekday(4);
var utcFriday = utcWeekday(5);
var utcSaturday = utcWeekday(6);

var utcMonth = newInterval(function(date) {
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCMonth(date.getUTCMonth() + step);
}, function(start, end) {
  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
}, function(date) {
  return date.getUTCMonth();
});

const z$1 = utcMonth;

var utcYear = newInterval(function(date) {
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
}, function(date, step) {
  date.setUTCFullYear(date.getUTCFullYear() + step);
}, function(start, end) {
  return end.getUTCFullYear() - start.getUTCFullYear();
}, function(date) {
  return date.getUTCFullYear();
});

// An optimized implementation for this simple case.
utcYear.every = function(k) {
  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
    date.setUTCMonth(0, 1);
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step * k);
  });
};

const P$1 = utcYear;

function $(){return $=Object.assign?Object.assign.bind():function(n){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&(n[e]=r[e]);}return n},$.apply(this,arguments)}var J=[function(n){return n.setMilliseconds(0)},function(n){return n.setSeconds(0)},function(n){return n.setMinutes(0)},function(n){return n.setHours(0)},function(n){return n.setDate(1)},function(n){return n.setMonth(0)}],K={millisecond:[],second:J.slice(0,1),minute:J.slice(0,2),hour:J.slice(0,3),day:J.slice(0,4),month:J.slice(0,5),year:J.slice(0,6)},L=function(n){return function(t){return K[n].forEach((function(n){n(t);})),t}},Q=function(n){var t=n.format,r=void 0===t?"native":t,e=n.precision,a=void 0===e?"millisecond":e,u=n.useUTC,c=void 0===u||u,s=L(a);return function(n){if(void 0===n)return n;if("native"===r||n instanceof Date)return s(n);var t=c?utcParse(r):timeParse(r);return s(t(n))}},W$1=function(n,t,r,e){var a,i,o,c,s=n.min,d=void 0===s?0:s,f=n.max,l=void 0===f?"auto":f,m=n.stacked,v=void 0!==m&&m,y=n.reverse,p=void 0!==y&&y,h=n.clamp,g=void 0!==h&&h,x=n.nice,k=void 0!==x&&x;"auto"===d?a=!0===v?null!=(i=t.minStacked)?i:0:t.min:a=d;"auto"===l?o=!0===v?null!=(c=t.maxStacked)?c:0:t.max:o=l;var T=linear().rangeRound("x"===e?[0,r]:[r,0]).domain(p?[o,a]:[a,o]).clamp(g);return !0===k?T.nice():"number"==typeof k&&T.nice(k),X$1(T,v)},X$1=function(n,t){void 0===t&&(t=!1);var r=n;return r.type="linear",r.stacked=t,r},Y$1=function(n,t,r){var e=point().range([0,r]).domain(t.all);return e.type="point",e},_=function(n,t,r,e){var a=n.round,i=void 0===a||a,o=band().range("x"===e?[0,r]:[r,0]).domain(t.all).round(i);return nn(o)},nn=function(n){var t=n;return t.type="band",t},tn=function(n,t,r){var e,a,i=n.format,o=void 0===i?"native":i,u=n.precision,c=void 0===u?"millisecond":u,s=n.min,l=void 0===s?"auto":s,m=n.max,v=void 0===m?"auto":m,y=n.useUTC,p=void 0===y||y,h=n.nice,g=void 0!==h&&h,x=Q({format:o,precision:c,useUTC:p});e="auto"===l?x(t.min):"native"!==o?x(l):l,a="auto"===v?x(t.max):"native"!==o?x(v):v;var k=p?utcTime():time();k.range([0,r]),e&&a&&k.domain([e,a]),!0===g?k.nice():"object"!=typeof g&&"number"!=typeof g||k.nice(g);var T=k;return T.type="time",T.useUTC=p,T},rn=function(n,t,r,e){var a,i=n.base,o=void 0===i?10:i,u=n.min,c=void 0===u?"auto":u,s=n.max,d=void 0===s?"auto":s;if(t.all.some((function(n){return 0===n})))throw new Error("a log scale domain must not include or cross zero");var f,m,v=!1;if(t.all.filter((function(n){return null!=n})).forEach((function(n){v||(void 0===a?a=Math.sign(n):Math.sign(n)!==a&&(v=!0));})),v)throw new Error("a log scale domain must be strictly-positive or strictly-negative");f="auto"===c?t.min:c,m="auto"===d?t.max:d;var y=log().domain([f,m]).rangeRound("x"===e?[0,r]:[r,0]).base(o).nice();return y.type="log",y},en=function(n,t,r,e){var a,i,o=n.constant,u=void 0===o?1:o,c=n.min,s=void 0===c?"auto":c,d=n.max,f=void 0===d?"auto":d,l=n.reverse,v=void 0!==l&&l;a="auto"===s?t.min:s,i="auto"===f?t.max:f;var y=symlog().constant(u).rangeRound("x"===e?[0,r]:[r,0]).nice();!0===v?y.domain([i,a]):y.domain([a,i]);var p=y;return p.type="symlog",p},an=function(n){return "x"===n?"y":"x"},on=function(n,t){return n===t},un=function(n,t){return n.getTime()===t.getTime()};function cn(n,t,r,e){switch(n.type){case"linear":return W$1(n,t,r,e);case"point":return Y$1(n,t,r);case"band":return _(n,t,r,e);case"time":return tn(n,t,r);case"log":return rn(n,t,r,e);case"symlog":return en(n,t,r,e);default:throw new Error("invalid scale spec")}}var sn=function(n,t,r){var e;if("stacked"in r&&r.stacked){var a=n.data["x"===t?"xStacked":"yStacked"];return null==a?null:r(a)}return null!=(e=r(n.data[t]))?e:null},dn=function(n,t,r,e,a){var i=n.map((function(n){return function(n){return $({},n,{data:n.data.map((function(n){return {data:$({},n)}}))})}(n)})),o=fn(i,t,r);"stacked"in t&&!0===t.stacked&&vn(o,i),"stacked"in r&&!0===r.stacked&&yn(o,i);var u=cn(t,o.x,e,"x"),c=cn(r,o.y,a,"y"),s=i.map((function(n){return $({},n,{data:n.data.map((function(n){return $({},n,{position:{x:sn(n,"x",u),y:sn(n,"y",c)}})}))})}));return $({},o,{series:s,xScale:u,yScale:c})},fn=function(n,t,r){return {x:ln(n,"x",t),y:ln(n,"y",r)}},ln=function(a,i,o,u){var c=void 0===u?{}:u,s=c.getValue,d=void 0===s?function(n){return n.data[i]}:s,f=c.setValue,l=void 0===f?function(n,t){n.data[i]=t;}:f;if("linear"===o.type)a.forEach((function(n){n.data.forEach((function(n){var t=d(n);t&&l(n,parseFloat(String(t)));}));}));else if("time"===o.type&&"native"!==o.format){var m=Q(o);a.forEach((function(n){n.data.forEach((function(n){var t=d(n);t&&l(n,m(t));}));}));}var v=[];switch(a.forEach((function(n){n.data.forEach((function(n){v.push(d(n));}));})),o.type){case"linear":var y=sortBy_1(uniq_1(v).filter((function(n){return null!==n})),(function(n){return n}));return {all:y,min:Math.min.apply(Math,y),max:Math.max.apply(Math,y)};case"time":var p=uniqBy_1(v,(function(n){return n.getTime()})).slice(0).sort((function(n,t){return t.getTime()-n.getTime()})).reverse();return {all:p,min:p[0],max:last_1(p)};default:var h=uniq_1(v);return {all:h,min:h[0],max:last_1(h)}}},mn=function(n,t,r){var i=an(n),o=[];t[i].all.forEach((function(t){var u=isDate_1(t)?un:on,c=[];r.forEach((function(r){var a=r.data.find((function(n){return u(n.data[i],t)})),s=null,d=null;if(void 0!==a){if(null!==(s=a.data[n])){var f=last_1(c);void 0===f?d=s:null!==f&&(d=f+s);}a.data["x"===n?"xStacked":"yStacked"]=d;}c.push(d),null!==d&&o.push(d);}));})),t[n].minStacked=Math.min.apply(Math,o),t[n].maxStacked=Math.max.apply(Math,o);},vn=function(n,t){return mn("x",n,t)},yn=function(n,t){return mn("y",n,t)},pn=function(n){var t=n.bandwidth();if(0===t)return n;var r=t/2;return n.round()&&(r=Math.round(r)),function(t){var e;return (null!=(e=n(t))?e:0)+r}},hn={millisecond:[p$1,p$1],second:[g,g],minute:[x,k],hour:[T$1,b$1],day:[newInterval((function(n){return n.setHours(0,0,0,0)}),(function(n,t){return n.setDate(n.getDate()+t)}),(function(n,t){return (t.getTime()-n.getTime())/864e5}),(function(n){return Math.floor(n.getTime()/864e5)})),newInterval((function(n){return n.setUTCHours(0,0,0,0)}),(function(n,t){return n.setUTCDate(n.getUTCDate()+t)}),(function(n,t){return (t.getTime()-n.getTime())/864e5}),(function(n){return Math.floor(n.getTime()/864e5)}))],week:[sunday,utcSunday],sunday:[sunday,utcSunday],monday:[monday,utcMonday],tuesday:[tuesday,utcTuesday],wednesday:[wednesday,utcWednesday],thursday:[thursday,utcThursday],friday:[friday,utcFriday],saturday:[saturday,utcSaturday],month:[N,z$1],year:[I,P$1]},gn=Object.keys(hn),xn=new RegExp("^every\\s*(\\d+)?\\s*("+gn.join("|")+")s?$","i"),kn=function(n,t){if(Array.isArray(t))return t;if("string"==typeof t&&"useUTC"in n){var r=t.match(xn);if(r){var e=r[1],a=r[2],i=hn[a][n.useUTC?1:0];if("day"===a){var o,u,c=n.domain(),s=c[0],d=c[1],f=new Date(d);return f.setDate(f.getDate()+1),null!=(o=null==(u=i.every(Number(null!=e?e:1)))?void 0:u.range(s,f))?o:[]}if(void 0===e)return n.ticks(i);var l=i.every(Number(e));if(l)return n.ticks(l)}throw new Error("Invalid tickValues: "+t)}if("ticks"in n){if(void 0===t)return n.ticks();if("number"==typeof(m=t)&&isFinite(m)&&Math.floor(m)===m)return n.ticks(t)}var m;return n.domain()};

function p(){return p=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n]);}return t},p.apply(this,arguments)}var b=function(t){var e,i=t.axis,n=t.scale,r=t.ticksPosition,o=t.tickValues,l=t.tickSize,s=t.tickPadding,c=t.tickRotation,f=t.truncateTickAt,u=t.engine,d=void 0===u?"svg":u,x=kn(n,o),y=fi[d],g="bandwidth"in n?pn(n):n,k={lineX:0,lineY:0},v={textX:0,textY:0},b="object"==typeof document&&"rtl"===document.dir,T=y.align.center,P=y.baseline.center;"x"===i?(e=function(t){var e;return {x:null!=(e=g(t))?e:0,y:0}},k.lineY=l*("after"===r?1:-1),v.textY=(l+s)*("after"===r?1:-1),P="after"===r?y.baseline.top:y.baseline.bottom,0===c?T=y.align.center:"after"===r&&c<0||"before"===r&&c>0?(T=y.align[b?"left":"right"],P=y.baseline.center):("after"===r&&c>0||"before"===r&&c<0)&&(T=y.align[b?"right":"left"],P=y.baseline.center)):(e=function(t){var e;return {x:0,y:null!=(e=g(t))?e:0}},k.lineX=l*("after"===r?1:-1),v.textX=(l+s)*("after"===r?1:-1),T="after"===r?y.align.left:y.align.right);return {ticks:x.map((function(t){var i="string"==typeof t?function(t){var e=String(t).length;return f&&f>0&&e>f?""+String(t).slice(0,f).concat("..."):""+t}(t):t;return p({key:t instanceof Date?""+t.valueOf():""+t,value:i},e(t),k,v)})),textAlign:T,textBaseline:P}},T=function(t,e){if(void 0===t||"function"==typeof t)return t;if("time"===e.type){var i=timeFormat(t);return function(t){return i(t instanceof Date?t:new Date(t))}}return format$1(t)},P=function(t){var e,i=t.width,n=t.height,r=t.scale,a=t.axis,o=t.values,l=(e=o,Array.isArray(e)?o:void 0)||kn(r,o),s="bandwidth"in r?pn(r):r,c="x"===a?l.map((function(t){var e,i;return {key:t instanceof Date?""+t.valueOf():""+t,x1:null!=(e=s(t))?e:0,x2:null!=(i=s(t))?i:0,y1:0,y2:n}})):l.map((function(t){var e,n;return {key:t instanceof Date?""+t.valueOf():""+t,x1:0,x2:i,y1:null!=(e=s(t))?e:0,y2:null!=(n=s(t))?n:0}}));return c},S=react.exports.memo((function(t){var e,n=t.value,r=t.format,a=t.lineX,l=t.lineY,s=t.onClick,f=t.textBaseline,u=t.textAnchor,d=t.animatedProps,x=Et(),m=x.axis.ticks.line,h=x.axis.ticks.text,k=null!=(e=null==r?void 0:r(n))?e:n,v=react.exports.useMemo((function(){var t={opacity:d.opacity};return s?{style:p({},t,{cursor:"pointer"}),onClick:function(t){return s(t,k)}}:{style:t}}),[d.opacity,s,k]);return jsxRuntime.exports.jsxs(animated.g,p({transform:d.transform},v,{children:[jsxRuntime.exports.jsx("line",{x1:0,x2:a,y1:0,y2:l,style:m}),h.outlineWidth>0&&jsxRuntime.exports.jsx(animated.text,{dominantBaseline:f,textAnchor:u,transform:d.textTransform,style:h,strokeWidth:2*h.outlineWidth,stroke:h.outlineColor,strokeLinejoin:"round",children:""+k}),jsxRuntime.exports.jsx(animated.text,{dominantBaseline:f,textAnchor:u,transform:d.textTransform,style:h,children:""+k})]}))})),A=function(e){var r=e.axis,a=e.scale,s=e.x,d=void 0===s?0:s,x=e.y,m=void 0===x?0:x,h=e.length,v=e.ticksPosition,P=e.tickValues,A=e.tickSize,W=void 0===A?5:A,O=e.tickPadding,w=void 0===O?5:O,B=e.tickRotation,X=void 0===B?0:B,Y=e.format,C=e.renderTick,z=void 0===C?S:C,V=e.truncateTickAt,j=e.legend,D=e.legendPosition,R=void 0===D?"end":D,E=e.legendOffset,L=void 0===E?0:E,q=e.onClick,F=e.ariaHidden,H=Et(),N=H.axis.legend.text,I=react.exports.useMemo((function(){return T(Y,a)}),[Y,a]),J=b({axis:r,scale:a,ticksPosition:v,tickValues:P,tickSize:W,tickPadding:w,tickRotation:X,truncateTickAt:V}),G=J.ticks,K=J.textAlign,M=J.textBaseline,Q=null;if(void 0!==j){var U,Z=0,$=0,_=0;"y"===r?(_=-90,Z=L,"start"===R?(U="start",$=h):"middle"===R?(U="middle",$=h/2):"end"===R&&(U="end")):($=L,"start"===R?U="start":"middle"===R?(U="middle",Z=h/2):"end"===R&&(U="end",Z=h)),Q=jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment,{children:[N.outlineWidth>0&&jsxRuntime.exports.jsx("text",{transform:"translate("+Z+", "+$+") rotate("+_+")",textAnchor:U,style:p({dominantBaseline:"central"},N),strokeWidth:2*N.outlineWidth,stroke:N.outlineColor,strokeLinejoin:"round",children:j}),jsxRuntime.exports.jsx("text",{transform:"translate("+Z+", "+$+") rotate("+_+")",textAnchor:U,style:p({dominantBaseline:"central"},N),children:j})]});}var tt=Zr(),et=tt.animate,it=tt.config,nt=useSpring({transform:"translate("+d+","+m+")",lineX2:"x"===r?h:0,lineY2:"x"===r?0:h,config:it,immediate:!et}),rt=react.exports.useCallback((function(t){return {opacity:1,transform:"translate("+t.x+","+t.y+")",textTransform:"translate("+t.textX+","+t.textY+") rotate("+X+")"}}),[X]),at=react.exports.useCallback((function(t){return {opacity:0,transform:"translate("+t.x+","+t.y+")",textTransform:"translate("+t.textX+","+t.textY+") rotate("+X+")"}}),[X]),ot=useTransition(G,{keys:function(t){return t.key},initial:rt,from:at,enter:rt,update:rt,leave:{opacity:0},config:it,immediate:!et});return jsxRuntime.exports.jsxs(animated.g,{transform:nt.transform,"aria-hidden":F,children:[ot((function(e,i,n,r){return react.exports.createElement(z,p({tickIndex:r,format:I,rotate:X,textBaseline:M,textAnchor:K,truncateTickAt:V,animatedProps:e},i,q?{onClick:q}:{}))})),jsxRuntime.exports.jsx(animated.line,{style:H.axis.domain.line,x1:0,x2:nt.lineX2,y1:0,y2:nt.lineY2}),Q]})},W=react.exports.memo(A),O={ticksPosition:K$1.oneOf(["before","after"]),tickValues:K$1.oneOfType([K$1.number,K$1.arrayOf(K$1.oneOfType([K$1.number,K$1.string,K$1.instanceOf(Date)])),K$1.string]),rotateOnTickLength:K$1.shape({angle:K$1.number,length:K$1.number}),tickSize:K$1.number,tickPadding:K$1.number,tickRotation:K$1.number,format:K$1.oneOfType([K$1.func,K$1.string]),renderTick:K$1.func,legend:K$1.node,legendPosition:K$1.oneOf(["start","middle","end"]),legendOffset:K$1.number,ariaHidden:K$1.bool},w=K$1.shape(O),B=["top","right","bottom","left"],X=react.exports.memo((function(t){var e=t.xScale,i=t.yScale,n=t.width,r=t.height,a={top:t.top,right:t.right,bottom:t.bottom,left:t.left};return jsxRuntime.exports.jsx(jsxRuntime.exports.Fragment,{children:B.map((function(t){var o=a[t];if(!o)return null;var l="top"===t||"bottom"===t;return jsxRuntime.exports.jsx(W,p({},o,{axis:l?"x":"y",x:"right"===t?n:0,y:"bottom"===t?r:0,scale:l?e:i,length:l?n:r,ticksPosition:"top"===t||"left"===t?"before":"after",truncateTickAt:o.truncateTickAt}),t)}))})})),Y=react.exports.memo((function(t){var e=t.animatedProps,i=Et();return jsxRuntime.exports.jsx(animated.line,p({},e,i.grid.line))})),C=react.exports.memo((function(t){var e=t.lines,i=Zr(),n=i.animate,a=i.config,o=useTransition(e,{keys:function(t){return t.key},initial:function(t){return {opacity:1,x1:t.x1,x2:t.x2,y1:t.y1,y2:t.y2}},from:function(t){return {opacity:0,x1:t.x1,x2:t.x2,y1:t.y1,y2:t.y2}},enter:function(t){return {opacity:1,x1:t.x1,x2:t.x2,y1:t.y1,y2:t.y2}},update:function(t){return {opacity:1,x1:t.x1,x2:t.x2,y1:t.y1,y2:t.y2}},leave:{opacity:0},config:a,immediate:!n});return jsxRuntime.exports.jsx("g",{children:o((function(t,e){return react.exports.createElement(Y,p({},e,{key:e.key,animatedProps:t}))}))})})),z=react.exports.memo((function(t){var e=t.width,n=t.height,r=t.xScale,a=t.yScale,o=t.xValues,l=t.yValues,s=react.exports.useMemo((function(){return !!r&&P({width:e,height:n,scale:r,axis:"x",values:o})}),[r,o,e,n]),c=react.exports.useMemo((function(){return !!a&&P({width:e,height:n,scale:a,axis:"y",values:l})}),[n,e,a,l]);return jsxRuntime.exports.jsxs(jsxRuntime.exports.Fragment,{children:[s&&jsxRuntime.exports.jsx(C,{lines:s}),c&&jsxRuntime.exports.jsx(C,{lines:c})]})})),V=function(t,e){var i,n=e.axis,r=e.scale,a=e.x,o=void 0===a?0:a,l=e.y,c=void 0===l?0:l,f=e.length,u=e.ticksPosition,d=e.tickValues,x=e.tickSize,m=void 0===x?5:x,h=e.tickPadding,y=void 0===h?5:h,g=e.tickRotation,k=void 0===g?0:g,v=e.format,p=e.legend,T=e.legendPosition,P=void 0===T?"end":T,S=e.legendOffset,A=void 0===S?0:S,W=e.theme,O=b({axis:n,scale:r,ticksPosition:u,tickValues:d,tickSize:m,tickPadding:y,tickRotation:k,engine:"canvas"}),w=O.ticks,B=O.textAlign,X=O.textBaseline;t.save(),t.translate(o,c),t.textAlign=B,t.textBaseline=X;var Y=W.axis.ticks.text;t.font=(Y.fontWeight?Y.fontWeight+" ":"")+Y.fontSize+"px "+Y.fontFamily,(null!=(i=W.axis.domain.line.strokeWidth)?i:0)>0&&(t.lineWidth=Number(W.axis.domain.line.strokeWidth),t.lineCap="square",W.axis.domain.line.stroke&&(t.strokeStyle=W.axis.domain.line.stroke),t.beginPath(),t.moveTo(0,0),t.lineTo("x"===n?f:0,"x"===n?0:f),t.stroke());var C="function"==typeof v?v:function(t){return ""+t};if(w.forEach((function(e){var i;(null!=(i=W.axis.ticks.line.strokeWidth)?i:0)>0&&(t.lineWidth=Number(W.axis.ticks.line.strokeWidth),t.lineCap="square",W.axis.ticks.line.stroke&&(t.strokeStyle=W.axis.ticks.line.stroke),t.beginPath(),t.moveTo(e.x,e.y),t.lineTo(e.x+e.lineX,e.y+e.lineY),t.stroke());var n=C(e.value);t.save(),t.translate(e.x+e.textX,e.y+e.textY),t.rotate(ni(k)),Y.outlineWidth>0&&(t.strokeStyle=Y.outlineColor,t.lineWidth=2*Y.outlineWidth,t.lineJoin="round",t.strokeText(""+n,0,0)),W.axis.ticks.text.fill&&(t.fillStyle=Y.fill),t.fillText(""+n,0,0),t.restore();})),void 0!==p){var z=0,V=0,j=0,D="center";"y"===n?(j=-90,z=A,"start"===P?(D="start",V=f):"middle"===P?(D="center",V=f/2):"end"===P&&(D="end")):(V=A,"start"===P?D="start":"middle"===P?(D="center",z=f/2):"end"===P&&(D="end",z=f)),t.translate(z,V),t.rotate(ni(j)),t.font=(W.axis.legend.text.fontWeight?W.axis.legend.text.fontWeight+" ":"")+W.axis.legend.text.fontSize+"px "+W.axis.legend.text.fontFamily,W.axis.legend.text.fill&&(t.fillStyle=W.axis.legend.text.fill),t.textAlign=D,t.textBaseline="middle",t.fillText(p,0,0);}t.restore();},j=function(t,e){var i=e.xScale,n=e.yScale,r=e.width,a=e.height,o=e.top,l=e.right,s=e.bottom,c=e.left,f=e.theme,u={top:o,right:l,bottom:s,left:c};B.forEach((function(e){var o=u[e];if(!o)return null;var l="top"===e||"bottom"===e,s="top"===e||"left"===e?"before":"after",c=l?i:n,d=T(o.format,c);V(t,p({},o,{axis:l?"x":"y",x:"right"===e?r:0,y:"bottom"===e?a:0,scale:c,format:d,length:l?r:a,ticksPosition:s,theme:f}));}));},D=function(t,e){var i=e.width,n=e.height,r=e.scale,a=e.axis,o=e.values;P({width:i,height:n,scale:r,axis:a,values:o}).forEach((function(e){t.beginPath(),t.moveTo(e.x1,e.y1),t.lineTo(e.x2,e.y2),t.stroke();}));};

export { D, X, band as b, cn as c, dn as d, j, nn as n, uniqBy_1 as u, w, z };

