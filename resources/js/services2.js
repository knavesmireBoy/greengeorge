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
  invk = (o, m, v) => o[m](v),
  prevoke = (m) => (o, v) => o[m](v),
  invok = (o, m, k, v) => o[m](k, v),
  subMethod = (o, p, m, v) => o[p][m](v),
  subKlas = (p, v) => o[p][m](v),
  prepair = (m, k) => (o, v) => o[m](k, v),
  prepSubMethod = (p, v) => (o, m) => o[p][m](v),
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
  highlighter = {
    exec: cu2(hifactory)("add"),
    undo: cu2(hifactory)("remove"),
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
  inserter = defer(invok, container, "insertBefore"),
  doremove = mayremove(container),
  doappend = append(container),
  validateNode = cu13(compvoke)(cu2(getprop)("nodeType"))(
    cu2((a, b) => a === b)(1)
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
  cb = compose(cycle, finder(articles));

function testi() {
  elapsed = Date.now();
}

function play(callback, offset = 0, index = 0) {
  var spans = meta.toArray(meta.$Q("#control span", true)),
    serv = meta.$Q(".services"),
    add = curry4(subMethod)("mv")("add")("classList"),
    rem = curry44(subMethod)("mv")("remove")("classList")(serv),
    contains = cu2(hifactory)("contains");

  return function (e) {
    function tick(action) {
      return function (t, r, i, o) {
        add(serv);
        setTimeout(rem, t);
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(action(r, i, o));
          }, t);
        });
      };
    }

    const tgt = e.target,
      serv = meta.$Q(".services"),
      articles = meta.$Q(".services article", true),
      len = articles.length,
      mover = (r, i, o) => {
        appender(articles[i]);
        i++;
        o++;
        r--;
        return [r, i, o];
      },
      mytimer = tick(mover);

    let req = 0,
    k = 0;

    if (this.nodeType === 1 && tgt.nodeName === "SPAN") {
      while (spans[req] !== tgt) {
        req++;
      }

      while (!contains(spans[k])) {
        k++;
      }

      log(k, offset);

      req -= offset;
      if (req < 0) {
        req = len + req;
      }

      async function func(f, t, ...args) {
        const result = await f(t, ...args);
        let [r, i, o] = result;
        callback(articles[i]);
        offset = o % len;
        if (r > 0) {
          return func(f, t, r, i, o);
        }
      }
      func(mytimer, 750, req, 0, offset);
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
meta.$("control").addEventListener("click", play(cb));

//control.addEventListener("click", controller);
