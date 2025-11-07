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

function insert(hook, node) {
  return hook.parentNode.insertBefore(node, hook);
}

function baseName(str)
{
   var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") != -1)       
        base = base.substring(0, base.lastIndexOf("."));
   return base;
}


const meta = greenGeorge.meta,
  utils = greenGeorge.utils,
  always = meta.always,
  negator = meta.negator,
  ptL = meta.doPartial(),
  pApply = meta.pApply,
  defer = meta.doPartial(true),
  compose = meta.compose,
  compduo = (f1, f2) => compose(f2, f1),
  getprop = (o, p) => o[p],
  pass = (f) => (arg) => {
    f(arg);
    return arg;
  },
  wrap = (arg) => (fn) => {
    fn(arg);
    return arg;
  },
  tagTester = (name) => {
    const tag = "[object " + name + "]";
    return function (obj) {
      return toString.call(obj) === tag;
    };
  },
  isFunction = tagTester("Function"),
  getRes = (o) => (isFunction(o) ? o() : o),
  doWhen = (pred, action) => {
    if (getRes(pred)) {
      return action(pred);
    }
  },
  log = console.log,
  invoke = (f) => f(),
  invoker = (f, a) => f(a),
  safeInvoke = (f) => {
    isFunction(f) ? f() : null;
  },
  invk = (o, m, v) => o[m](v),
  prevoke = (m) => (o, v) => o[m](v),
  mittel = (m, k) => (o, v) => o[m](k, v),
  invok = (o, m, k, v) => o[m](k, v),
  subMethod = (o, p, m, v) => o[p][m](v),
  curry4 = (f) => (a) => (b) => (c) => (d) => f(d, c, b, a),
  curry2 = meta.curryRight(2),
  curry3 = meta.curryRight(3),
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

function reactor(e) {
  e.preventDefault();

  if (!e.target.src) {
    return;
  }

  let append = ptL(prevoke("appendChild")),
    make = utils.doMakeDefer,
    whilst = curry2(meta.doWhen),
    doMap = curry3(invk)(getRes)("map"),
    getSrc = defer(invk, e.target, "getAttribute", "src"),
    settingId = compose(pass, curry2(mittel("setAttribute", "id"))),
    settingSrc = compose(pass, curry2(mittel("setAttribute", "src"))),
    settingSrc2 = compose(pass, ptL(mittel("setAttribute", "src"))),
    setId = curry4(invok)("lightbox")("id")("setAttribute"),
    getParent = curry2(getprop)("parentNode"),
    getParent2 = compose(getParent, getParent),
    getParent3 = compose(getParent, getParent, getParent),
    climb = compose(getParent, invoke),
    climber = compose(getParent, climb),
    textLeft = defer(invk, document, "createTextNode", "<"),
    textRight = defer(invk, document, "createTextNode", ">"),
    textSrc = compose(ptL(invk, document, "createTextNode"), baseName, getSrc),
    textCount = defer(invk, document, "createTextNode", "1/1"),
    makePara = compose(getRes, whilst(ptL(compduo, make("p")))),
    makeDiv = compose(getRes, whilst(ptL(compduo, make("div")))),
    makeHeader = compose(getRes, whilst(ptL(compduo, make("header")))),
    makeFooter = compose(getRes, whilst(ptL(compduo, make("footer")))),
    makeMain = compose(getRes, whilst(ptL(compduo, make("main")))),
    makeParaText = whilst(ptL(compduo, textCount)),
    textFooterSrc = compose(climb, ptL(compduo, textSrc), append, make("p")),
    paracomp = ptL(compduo, make("p")),
    applySrc = compose(curry2(mittel("setAttribute", "src")), getSrc),
    imgcomp = compose(
      getParent,
      getRes,
      curry2(invoker)(applySrc()),
      wrap,
      getRes,
      ptL(compduo, make("img")),
      append,
      make("figure")
    ),
    headparas = pApply(
      invk,
      [
        paracomp(settingId("fullscreen")),
        paracomp(settingId("zoom")),
        paracomp(settingId("exit")),
      ],
      "map"
    ),
    mainparas = pApply(
      invk,
      [
        compose(climb, ptL(compduo, textLeft), append, make("p")),
        imgcomp,
        compose(climb, ptL(compduo, textRight), append, make("p")),
      ],
      "map"
    ),
    lightbox = meta.$("lightbox"),
    perform = compose(ptL(insert, meta.$("gallery")), pass(setId), make("div")),
    hasLightbox = compose(whilst(perform), negator(always(lightbox)));
  let cb = compose(
    getRes,
    curry2(invoker)(textFooterSrc),
    curry2(compduo),
    whilst(append),
    makeFooter,
    whilst(append),
    getParent2,
    utils.getZero,
    doMap,
    mainparas,
    curry2(compduo),
    whilst(append),
    makeMain,
    whilst(append),
    getParent3,
    utils.getZero,
    doMap,
    headparas,
    curry2(compduo),
    whilst(append),
    makeDiv,
    whilst(append),
    climber,
    makeParaText,
    whilst(append),
    makePara,
    whilst(append),
    makeHeader,
    whilst(append),
    hasLightbox
  );
  cb();
}
gallery.addEventListener("click", reactor);
