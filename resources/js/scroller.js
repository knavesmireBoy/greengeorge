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

  return top * percent + elementHeight - window.innerHeight;
}

function inc() {
  let n = window.innerWidth;
  if (n > 1025) return 3;
  if (n > 768 && n <= 1024) return 2;
  return 1;
}

let doWhen = (pred, action, arg) => {
    if (getResult(pred)) {
      return action(arg);
    }
  },
  subMethod = (o, p, m, v) => o[p][m](v),
  curry4 = (f) => (a) => (b) => (c) => (d) => f(d, c, b, a),
  curry22 = (f) => (a) => (b) => () => f(b, a),
  curry44 = (f) => (a) => (b) => (c) => (d) => () => f(d, c, b, a),
  exec = curry4(subMethod)("active")("add")("classList"),
  lastKnownScrollPosition = 0,
  ticking = false,
  els = document.querySelectorAll("#gal a"),
  i = 0,
  log = console.log,
  el = els[0],
  handler1 = (el, els, i, cb) => (e) => {
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
  scroller = (el, els, i, cb) => (e) => {
    lastKnownScrollPosition = window.scrollY;
    let j = getScrollThreshold(el, 1.1),
      n = window.innerWidth,
      inc = 1;
    if (n > 1025) inc = 3;
    if (n > 768 && n <= 1024) inc = 2;
    if (lastKnownScrollPosition > j) {
      doWhen(els[i++], cb, el);
    }
  },
  handler = curry22(throttle)(22)(scroller(el, els, 0, exec));
exec(el);
document.addEventListener("scroll", handler);
//document.addEventListener("scroll", handler);
