function throttle(callback, time) {
  if (throttled) {
    return;
  }
  throttled = true;
  setTimeout(() => {
    callback();
    throttled = false;
  }, time);
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

const tagTester = (name) => {
    const tag = "[object " + name + "]";
    return function (obj) {
      return toString.call(obj) === tag;
    };
  },
  isFunction = tagTester("Function"),
  getResult = (o) => (isFunction(o) ? o() : o),
  doWhen = (pred, action) => {
    if (getResult(pred)) {
      return action(pred);
    }
  },
  log = console.log,
  subMethod = (o, p, m, v) => o[p][m](v),
  curry4 = (f) => (a) => (b) => (c) => (d) => f(d, c, b, a),
  curry2 = (f) => (a) => (b) => f(b, a),
  curry22 = (f) => (a) => (b) => () => f(b, a),
  curry44 = (f) => (a) => (b) => (c) => (d) => () => f(d, c, b, a),
  gt = (a, b) => a > b,
  gtThan = curry2(gt),
  activate = curry4(subMethod)("active")("add")("classList"),
  thenactivate = curry44(subMethod)("active")("add")("classList"),
  gallery = document.getElementById("gal"),
  els = document.querySelectorAll("#gal a"),
  query = (n, flag = false) => {
    if (flag) {
      return n <= 768 ? 768 : 1024;
    }
    if (n > 1025) return 3;
    if (n > 768 && n <= 1024) return 2;
    return 1;
  },
  scroller = (el, els, i, cb, e) => (ev) => {
    //el is the NEXT element primed for receiving the active class
    //not we are only revealing on scroll, not hiding and if we're starting at desktop there would be no need to query
    lastKnownScrollPosition = window.scrollY;
    let n = window.innerWidth,
      j = getScrollThreshold(el, 1),
      k = 0,
      inc = query(n);
    if (e === "resize") {
      if (predicate(n)) {
        i++;
        //if we've moved to a BIGGER window size expecting another active element
        //apply a class of active to the previous element - els[i - 1] AFTER (i++) - not the primed one (to stay in sync)
        el = els[i - 1];
        doWhen(el, cb);
        predicate = gtThan(query(n, true));
      }
    }
    if (lastKnownScrollPosition > j) {
      while (k < inc) {
        el = els[i + k];
        doWhen(el, cb);
        k++;
      }
      i += k;
      el = els[i - 1];
    }
  },
  inc = query(window.innerWidth);

  let throttled,
  resizePause,
  j = 0,
  i = 0,
  el = els[0],
  predicate = gtThan(query(window.innerWidth, true)),
  lastKnownScrollPosition = 0,
  prevWidth = window.innerWidth;

while (j < inc) {
  el = els[i + j];
  setTimeout(thenactivate(el), 66);
  j++;
}
i = j;

document.addEventListener(
  "scroll",
  curry22(throttle)(22)(scroller(el, els, i, activate, "scroll"))
);

log(gallery)

gallery.addEventListener("click", (e) => {
  log(e);
  e.preventDefault();
});
