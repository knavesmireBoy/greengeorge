let tagTester = (name) => {
    const tag = "[object " + name + "]";
    return function (obj) {
      return toString.call(obj) === tag;
    };
  },
  isArray = tagTester("Array"),
  isBoolean = tagTester("Boolean"),
  isFunction = tagTester("Function"),
  isNumber = tagTester("Number"),
  isString = tagTester("String"),
  getResult = (o) => (isFunction(o) ? o() : o),
  throttlePause;

function throttle(callback, time) {
  if (throttlePause) {
    return;
  }
  throttlePause = true;
  setTimeout(() => {
    callback();
    throttlePause = false;
  }, time);
}

function getComputedStyle(element, property) {
  const toCamelCase = function (variable) {
    return variable.replace(/-([a-z])/g, function (str, letter) {
      return letter.toUpperCase();
    });
  };
  element = getResult(element);
  if (!element || !property) {
    return null;
  }
  let computedStyle = null,
    def = document.defaultView || window;
  if (typeof element.currentStyle !== "undefined") {
    computedStyle = element.currentStyle;
  } else if (def && def.getComputedStyle && isFunction(def.getComputedStyle)) {
    computedStyle = def.getComputedStyle(element, null);
  }
  if (computedStyle) {
    try {
      return (
        computedStyle.getPropertyValue(property) ||
        computedStyle.getPropertyValue(toCamelCase(property))
      );
    } catch (e) {
      return computedStyle[property] || computedStyle[toCamelCase(property)];
    }
  }
}

function getGreater(a, b) {
  return getResult(a) > getResult(b);
}

function getPageOffset(bool) {
  var d = document.documentElement || document.body.parentNode || document.body,
    x = d.scrollLeft,
    y = d.scrollTop;
  return bool ? x : y;
}

function getElementOffset(el) {
  //https://medium.com/snips-ai/make-your-next-microsite-beautifully-readable-with-this-simple-javascript-technique-ffa1a18d6de2
  var top = 0,
    left = 0;
  // grab the offset of the element relative to it's parent,
  // then repeat with the parent relative to it's parent,
  // ... until we reach an element without parents.
  do {
    top += el.offsetTop;
    left += el.offsetLeft;
    //https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    el = el.offsetParent;
  } while (el);
  return {
    top: top,
    left: left,
  };
}

function getScrollThreshold(el, percent) {
  if (!el) {
    return Infinity;
  }
  var top,
    elementHeight = el.offsetHeight || el.getBoundingClientRect().height;
  ({ top } = getElementOffset(el));

  return (top * percent + elementHeight) - window.innerHeight;
}

function inc() {
  let n = window.innerWidth;
  if (n > 1025) return 3;
  if (n > 768 && n <= 1024) return 2;
  return 1;
}

let doWhen = (pred, action) => {
    if (getResult(pred)) {
      return action(pred);
    }
  },
  subMethod = (o, p, m, v) => o[p][m](v),
  curry4 = (f) => (a) => (b) => (c) => (d) => f(d, c, b, a),
  curry22 = (f) => (a) => (b) => () => f(b, a),
  curry44 = (f) => (a) => (b) => (c) => (d) => () => f(d, c, b, a),
  exec = curry4(subMethod)("active")("add")("classList"),
  execDefer = curry44(subMethod)("active")("add")("classList"),
  lastKnownScrollPosition = 0,
  ticking = false,
  els = document.querySelectorAll("#gal a"),
  i = 0,
  j = 0,
  log = console.log,
  el = els[0],
  handler = (el, els, i, cb) => (e) => {
    lastKnownScrollPosition = window.scrollY;
    let j = getScrollThreshold(el, 1.1);
    if (!ticking) {
      setTimeout(() => {
        if (lastKnownScrollPosition > j) {
          el = els[i++];
          doWhen(el, cb, el);
        }
        ticking = false;
      }, 20);
      ticking = true;
    }
  },
  query = () => {
    let n = window.innerWidth;
    if (n > 1025) return 3;
    if (n > 768 && n <= 1024) return 2;
    return 1;
  },
  scroller = (el, els, i, cb) => (e) => {
    lastKnownScrollPosition = window.scrollY;
    let j = getScrollThreshold(el, 1),
      x = getScrollThreshold(els[i + 1], 1),
      k = 0,
      inc = query();
    if (lastKnownScrollPosition > j) {
      while (k < inc) {
        el = els[i + k];
        doWhen(el, cb);
        k++;
      }
      i += k;
      el = els[i-1];
    }
  },
  incr = query();

while (j < incr) {
  el = els[i + j];
  setTimeout(execDefer(el), 66);
  j++;
}

i = j;
document.addEventListener(
  "scroll",
  curry22(throttle)(22)(scroller(el, els, i, exec))
);
