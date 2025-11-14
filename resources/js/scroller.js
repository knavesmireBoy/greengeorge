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

function getLocation(e) {
  var box = e.target.getBoundingClientRect(),
    threshold = (box.right - box.left) / 2;
  return e.clientX ? e.clientX - box.left > threshold : true;
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
  return hook.insertBefore(node, hook.firstElementChild);
}

function baseName(str) {
  var base = new String(str).substring(str.lastIndexOf("/") + 1);
  if (base.lastIndexOf(".") != -1)
    base = base.substring(0, base.lastIndexOf("."));
  return base;
}

function direct(e) {
  if (e.target.nodeName === "P") {
    const el = e.target,
      esc = document.getElementById("esc"),
      box = document.getElementById("lightbox");

    if (el.id === "fullscreen") {
      return toggler(document.querySelector("#lightbox figure img"));
    }
    if (el.id === "exit") {
      //return exit(esc);
      return quit(box);
    }
    if (el.id === "zoom") {
      return zoom(fade);
    }
  }
}

function isFullScreen() {
  return (
    (document.fullscreenElement && document.fullscreenElement !== null) ||
    (document.webkitFullscreenElement &&
      document.webkitFullscreenElement !== null) ||
    (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
    (document.msFullscreenElement && document.msFullscreenElement !== null)
  );
}

function fade(i) {
  let elem = document.getElementById("esc");
  if (i > 0) {
    elem.style.opacity = i / 100;
    setTimeout(defer(fade, i - 2), 66);
  } else {
    exit(elem);
  }
}

function slider(current) {
  const images = document.querySelectorAll("#gal img"),
    gang = meta.toArray(images),
    mapped = gang.map(curry3(invk)("src")("getAttribute")),
    n = mapped.length,
    setsrc = mittel("setAttribute", "src"),
    move = curry4(subMethod)("mv")("add")("classList"),
    unmove = curry4(subMethod)("mv")("remove")("classList"),
    moved = curry4(subMethod)("mvd")("add")("classList"),
    unmoved = curry44(subMethod)("mvd")("remove")("classList"),
    after = ptL(utils.insertAfter),
    before = prevoker("insertBefore");

  var i = mapped.findIndex((src) => src === current) + 1,
    swap = false;

  return function shuffle(e) {
    var img;

    if (e.target.nodeName !== "P") {
      if (e.target.nodeName !== "IMG") {
        return;
      } else {
        img = getLocation(e);
      }
    }

    let el = e.target,
      main = utils.getTargetNode(el, /main/i, "parentNode"),
      figures = main.querySelectorAll("figure"),
      currentfig = figures[1],
      nextfig = figures[0],
      next = nextfig.firstElementChild,
      current = currentfig.firstElementChild,
      rev = document.getElementsByClassName("rev")[0],
      doBefore = ptL(before, main),
      swapper = () => {
        if (document.getElementsByClassName("rev")[0]) {
          if (swap) {
            swap = false;
          } else {
            after(nextfig, main.firstElementChild);
            after(currentfig, main.lastElementChild);
          }
        } else {
          doBefore(currentfig, main.firstElementChild);
          doBefore(nextfig, main.lastElementChild);
        }
        unmove(main);
        moved(main);
      },
      j;
    main.classList.remove("lscp");
   
    if (el.innerHTML === "&gt;" || img) {
      if (rev) {
        main.parentNode.classList.remove("rev");
      }
      if (mapped[i + 1]) {
        setsrc(current, mapped[i]);
        setsrc(next, mapped[i++]);
      } else {
        setsrc(next, mapped[i]);
        i = 0;
      }
    } else {
      if (!rev) {
        main.parentNode.classList.add("rev");
        main.appendChild(nextfig);
        swap = true;
      }

      if (mapped[i - 1]) {
        if (!swap) {
          setsrc(next, mapped[i]);
          i--;
          j = mapped[i - 1] ? i - 1 : n - 1;
          setsrc(next, mapped[j]);
        }
      } else {
        i = mapped.length - 1;
        setsrc(current, mapped[i]);
        setsrc(next, mapped[i - 1]);
      }
    }
    if (currentfig.offsetHeight < currentfig.offsetWidth) {
      main.classList.add("lscp");
    }

    if (!swap) {
      setTimeout(swapper, 200);
      setTimeout(unmoved(main), 220);
      j = i % n || n;
      meta.$("caption").innerHTML = baseName(mapped[i]);
      meta.$("count").innerHTML = `${j}/${n}`;
      move(main);
    } else {
      swap = false;
      shuffle(e);
    }
  };
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
  prevoker = (m) => (o, k, v) => o[m](k, v),
  mittel = (m, k) => (o, v) => o[m](k, v),
  invok = (o, m, k, v) => o[m](k, v),
  subMethod = (o, p, m, v) => o[p][m](v),
  curry4 = (f) => (a) => (b) => (c) => (d) => f(d, c, b, a),
  curry2 = meta.curryRight(2),
  curry22 = meta.curryRight(2, true),
  curry3 = meta.curryRight(3),
  curry222 = (f) => (a) => (b) => () => f(b, a),
  curry44 = (f) => (a) => (b) => (c) => (d) => () => f(d, c, b, a),
  gt = (a, b) => a > b,
  gtThan = curry2(gt),
  activate = curry4(subMethod)("active")("add")("classList"),
  thenactivate = curry44(subMethod)("active")("add")("classList"),
  thenlscp = curry4(subMethod)("lscp")("add")("classList"),
  gallery = document.getElementById("gal"),
  els = document.querySelectorAll("#gal a"),
  exit = function (elem) {
    if (elem) elem.parentNode.removeChild(elem);
    document.getElementById("exit").className = "fader";
  },
  quit = (el) => {
    el.parentNode.removeChild(el);
  },
  toggle = (store) => (el) => {
    let fig = el.parentNode,
      main = fig.parentNode,
      p = main.querySelectorAll("p"),
      i = 0;
    if (p[0]) {
      while (p[i]) {
        store[i] = main.removeChild(p[i++]);
      }
      fig.style.margin = 0;
      fig.style.borderWidth = 0;
    } else {
      main.appendChild(store[1]);
      main.insertBefore(store[0], fig);
      store = [];
      fig.style.marginTop = ".75em";
      fig.style.marginBottom = ".75em";
      fig.style.borderWidth = "1px";
    }
  },
  toggler = toggle([]),
  zoom = (cb, n = 150) => {
    const el = document.createElement("p"),
      esc = document.getElementById("esc"),
      box = document.getElementById("lightbox");

    if (box.requestFullscreen) {
      box.requestFullscreen();
    } else {
      return;
    }

    if (!esc) {
      el.innerHTML = "to exit fullscreen, press <kbd>esc</kbd";
      el.id = "esc";
      box.insertBefore(el, box.firstElementChild);
      cb(n);
    }
    if (isFullScreen()) {
      document
        .exitFullscreen?.()
        .then(() => console.log("Document Exited from Full screen mode"))
        .catch((err) => console.error(`${err}!`));
    }
  },
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
    let x = el.offsetHeight || el.getBoundingClientRect().height;
    //if loading page half scrolled reveal all
    if (!lastKnownScrollPosition && window.scrollY > x) {
      while (els[i]) {
        doWhen(els[i], cb);
        i++;
      }
      i = 0;
      return;
    }

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
  curry222(throttle)(22)(scroller(el, els, i, activate, "scroll"))
);

function builder(e) {
  e.preventDefault();
  let src = e.target.getAttribute("src"),
    lscp = e.target.offsetHeight < e.target.offsetWidth,
    maybelscp = lscp ? thenlscp : (x) => x;
  if (!src) {
    return;
  }

  let append = ptL(prevoke("appendChild")),
    make = utils.doMakeDefer,
    whilst = curry2(meta.doWhen),
    myMaker = (str) =>
      compose(whilst(append), getRes, whilst(ptL(compduo, make(str)))),
    myMaker2 = (str, f = (a) => a) =>
      compose(whilst(append), f, getRes, whilst(ptL(compduo, make(str)))),
    doMap = curry3(invk)(getRes)("map"),
    mydirect = pass(curry4(invok)(direct)("click")("addEventListener")),
    myslider = pass(curry4(invok)(slider(src))("click")("addEventListener")),
    myslider2 = compose(pass(maybelscp), myslider),
    getSrc = defer(invk, e.target, "getAttribute", "src"),
    settingId = compose(pass, curry2(mittel("setAttribute", "id"))),
    setId = curry4(invok)("lightbox")("id")("setAttribute"),
    getParent = curry2(getprop)("parentNode"),
    getParent2 = compose(getParent, getParent),
    getParent3 = compose(getParent, getParent2),
    climb = compose(getParent, invoke),
    climber = compose(getParent, climb),
    textLeft = defer(invk, document, "createTextNode", "<"),
    textRight = defer(invk, document, "createTextNode", ">"),
    textSrc = compose(ptL(invk, document, "createTextNode"), baseName, getSrc),
    textCount = defer(invk, document, "createTextNode", "1/1"),
    makePara = myMaker2("p", settingId("count")),
    makeDiv = myMaker("div"),
    makeHeader = myMaker2("header", mydirect),
    makeFooter = myMaker("footer"),
    makeMain = myMaker2("main", myslider2),
    makeParaText = whilst(ptL(compduo, textCount)),
    textFooterSrc = compose(
      climb,
      ptL(compduo, textSrc),
      append,
      settingId("caption"),
      make("p")
    ),
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
        imgcomp,
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
    makeFooter,
    whilst(append),
    getParent2,
    utils.getZero,
    doMap,
    mainparas,
    curry2(compduo),
    makeMain,
    whilst(append),
    getParent3,
    utils.getZero,
    doMap,
    headparas,
    curry2(compduo),
    makeDiv,
    whilst(append),
    climber,
    makeParaText,
    makePara,
    makeHeader,
    whilst(append),
    hasLightbox
  );
  cb();
}
gallery.addEventListener("click", builder);
