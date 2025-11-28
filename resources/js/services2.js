/*jslint nomen: true */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */
/*global greenGeorge: false */
if (!window.greenGeorge) {
  window.greenGeorge = {};
}

function paint(node, val) {
  node.style.backgroundColor = val;
}

function insert(hook, node) {
  return utils.insertAfter(node, hook);
}

let inc = 0,
  t = 500,
  margins = [100, 52, 34.333],
  request,
  requester,
  start,
  starter;

var elapsed;
//note meta etc.. avoid binding clashes from previous script
const meta = greenGeorge.meta,
  utils = greenGeorge.utils,
  log = console.log,
  identity = meta.identity,
  ptL = meta.doPartial(),
  getRes = meta.getResult,
  defer = meta.doPartial(true),
  compose = meta.compose,
  compduo = (f1, f2) => compose(f2, f1),
  composer = (f1, f2) => compose(f2, f1)(),
  getprop = (o, p) => o[p],
  pass = (f) => (arg) => {
    f(arg);
    return arg;
  },
  wrap = (arg) => (fn) => {
    fn(arg);
    return arg;
  },
  invoke = (f) => f(),
  invokeArg = (f, a) => f(a),
  invk = (o, m, v) => o[m](v),
  prevoke = (m) => (o, v) => o[m](v),
  invok = (o, m, k, v) => o[m](k, v),
  subMethod = (o, p, m, v) => o[p][m](v),
  subKlas = (p, v) => o[p][m](v),
  prepair = (m, k) => (o, v) => o[m](k, v),
  prepSubMethod = (p, v) => (o, m) => o[p][m](...v),
  curry4 = meta.curryRight(4),
  curry44 = meta.curryRight(4, true),
  cu1 = meta.curryRight(1, true),
  cu2 = meta.curryRight(2),
  cu22 = meta.curryRight(2, true),
  cu13 = meta.curryLeft(3),
  compvoke = (f1, f2, seed) => compose(f2, f1)(seed),
  append = ptL(prevoke("appendChild")),
  remove = ptL(prevoke("removeChild")),
  mayremove = ptL(prevoke("removeChild")),
  pusher = ptL(prevoke("push")),
  make = utils.doMakeDefer,
  getbest = (fn, coll, arg) => {
    let cb = coll.reduce((a, b) => (fn(arg) ? a : b));
    return cb(arg);
  },
  hifactory = prepSubMethod("classList", "hi"),
  transformfactory = prepSubMethod("classList", ["transform", "transit"]),
  transformAltfactory = prepSubMethod("classList", ["transform"]),
  transitfactory = prepSubMethod("classList", ["transit"]),
  highlighter = {
    exec: cu2(hifactory)("add"),
    undo: cu2(hifactory)("remove"),
  },
  transformer = {
    exec: cu2(transformfactory)("add"),
    undo: cu2(transformfactory)("remove"),
  },
  transformerAlt = {
    exec: compose(
      cu2(transformAltfactory)("add"),
      pass(cu2(transitfactory)("remove"))
    ),
    undo: compose(
      cu2(transitfactory)("add"),
      pass(cu2(transformAltfactory)("remove"))
    ),
  },
  transit = {
    exec: cu2(transitfactory)("add"),
    undo: cu2(transitfactory)("remove"),
  },
  mover = (t, flag = false) => {
    if (flag) {
      if (t < 7) {
        return 0;
      }
      if (t >= 7 && t < 14) {
        return 1;
      }
      if (t >= 14 && t < 21) {
        return 2;
      }
      return 3;
    } else {
      if (t < 7) {
        return 3;
      }
      if (t >= 7 && t < 14) {
        return 2;
      }
      if (t >= 14 && t < 21) {
        return 1;
      }
      return 0;
    }
  },
  myservices = document.querySelectorAll(".services article"),
  service = document.querySelector(".services"),
  control = document.getElementById("control"),
  liveArticles = (service && service.getElementsByTagName("article")) || [],
  articles = (service && service.querySelectorAll("article")) || [],
  el = articles[0],
  section = meta.$Q(".services"),
  container = meta.byTagScope(section)("div"),
  appender = ptL(invk, container, "appendChild"),
  inserter = ptL(invok, container, "insertBefore"),
  getRef = defer(utils.getNextElement, container.firstChild),
  getLast = defer(utils.getPrevElement, container.lastChild),
  getRefNode = ptL(
    composer,
    defer(getprop, container, "firstChild"),
    defer(utils.getNextElement)
  ),
  getLastNode = defer(
    composer,
    defer(getprop, container, "lastChild"),
    defer(utils.getPrevElement)
  ),
  insertB4 = compose(
    ptL(composer, getRefNode),
    cu2(composer)(inserter),
    getLastNode
  ),
  fubar = defer(composer, getRefNode, appender),
  doremove = mayremove(container),
  doappend = append(container),
  validateNode = cu13(compvoke)(cu2(getprop)("nodeType"))(
    cu2((a, b) => a === b)(1)
  ),
  spanshifter = compose(
    ptL(invk, control, "appendChild"),
    defer(utils.getNextElement, control.firstChild)
  ),
  finder = (nodes) => (node) => {
    let i = 0,
      l = nodes.length;
    while (i < l) {
      if (nodes[i] === node) {
        break;
      }
      i++;
    }
    return i;
  },
  spotify = (nodes, o) => (j) => {
    let i = nodes.length;
    while (i--) {
      if (i === j) {
        o.exec(nodes[i]);
      } else {
        o.undo(nodes[i]);
      }
    }
  },
  cycle = spotify(control.getElementsByTagName("span"), highlighter),
  cb = compose(cycle, finder(articles)),
  foo = (n, f) => () => {
    let i = n;
    while (n--) {
      f();
    }
    n = i;
  };

function testi() {
  elapsed = Date.now();
}

function play(callback) {
  var control = meta.$("control"),
    spans = control.getElementsByTagName("span"),
    serv = meta.$Q(".services"),
    adder = ptL(subMethod, serv, "classList", "add"),
    remvr = defer(subMethod, serv, "classList", "remove"),
    contains = cu2(hifactory)("contains"),
    arts = serv.getElementsByTagName("article");

  return function (e) {
    function tick(action, o, f = () => true) {
      return function (t, r, i, k) {
        let j = 0;
        f();
        while (arts[j]) {
          o.exec(arts[j]);
          j++;
        }

        setTimeout(function () {
          let j = 0;
          while (arts[j]) {
            o.undo(arts[j]);
            j++;
          }
        }, t);

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(action(r, i, k));
          }, t);
        });
      };
    }

    const tgt = e.target,
      articles = meta.$Q(".services article", true),
      len = articles.length,
      mover = (r, i, k) => {
        fubar();
        i++;
        r--;
        return [r, i, k];
      },
      mova = (r, i, k) => {
        i++;
        r--;
        return [r, i, k];
      };

    let req = 0,
      k = 0,
      j = 0,
      dur = 600,
      mytimer = tick(mover, transformer);

    if (this.nodeType === 1 && tgt.nodeName === "SPAN") {
      while (spans[req] !== tgt) {
        req++;
      }

      while (!contains(spans[k])) {
        k++;
      }

      if (req < k) {
        mytimer = tick(mova, transformerAlt, insertB4);
        // dur = 300 * Math.abs(req - k);
        // dur = 300;
      }

      req -= k;

      if (req < 0) {
        //  req = len + req;
      }

      req = Math.abs(req);

      async function func(f, t, ...args) {
        const result = await f(t, ...args),
          [r, i, o] = result,
          next = meta.pApply(func, f, t, r, i, o);
        callback();
        if (r > 0) {
          setTimeout(next, t);
        }
      }
      func(mytimer, dur, req, 0, k);
    }
  };
}

function init(e) {
  let y = 0,
    node,
    hold = [],
    dopush = pusher(hold),
    thenpush = compose(dopush, doremove),
    maypush = ptL(getbest, validateNode, [thenpush, doremove]),
    getElement = cu2(getprop)("lastChild");
  while ((node = getElement(container))) {
    maypush(node);
  }
  while (hold[y]) {
    doappend(hold[y++]);
  }
}

function controller(e) {
  let a = meta.toArray(this.childNodes).filter((n) => n.nodeName === "SPAN"),
    live = meta.toArray(liveArticles).filter((n) => n.nodeName === "ARTICLE"),
    parent = liveArticles[0].parentNode,
    f = finder(a),
    i = f(e.target),
    j = 0,
    article;

  if (e.target !== this) {
    cycle(i);
    cancelAnimationFrame(request);
    article = articles[i];
    j = live.indexOf(article);
    i = 0;
    while (i < j) {
      parent.appendChild(live[i]);
      i++;
    }
  }
}

////document.addEventListener("DOMContentLoaded", init);
cb(el);
meta.$("control").addEventListener("click", play(foo(5, spanshifter)));

//control.addEventListener("click", controller);
