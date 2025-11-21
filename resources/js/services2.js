function insert(hook, node) {
  return utils.insertAfter(node, hook);
}

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
  prepair = (m, k) => (o, v) => o[m](k, v),
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
  section = meta.$Q(".services"),
  container = meta.byTagScope(section)("div"),
  doremove = mayremove(container),
  doappend = append(container),
  validateNode = cu13(compvoke)(cu2(getprop)("nodeType"))(
    cu2((a, b) => a === b)(1)
  );

function testi() {
  elapsed = Date.now();
}

function play(offset = 0) {
  var spans = meta.toArray(meta.$Q("#control span", true)),
    _articles = meta.toArray(meta.byTagScope(container)("article", true)),
    l = _articles.length,
    i = l - 1;
  return function (e) {
    let tgt = e.target,
      request = 0,
      domindex = 0,
      realindex = 0,
      articles = meta.$Q(".services article", true);
    if (this.nodeType === 1 && tgt.nodeName === "SPAN") {
      while (spans[request] !== tgt) {
        request++;
      }
      domindex = i - request;
      domindex += offset;
      domindex = domindex % l;
      request = (i - domindex);

      while (request) {
       container.insertBefore(articles[i], container.firstChild);
        i--;
        request--;
        offset++;
      }
      i = l - 1;
      offset % l;
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
  articles = meta.byTagScope(container)("article", true);
}
document.addEventListener("DOMContentLoaded", init);
meta.$("control").addEventListener("click", play());
// x * % = 1300 62.43
