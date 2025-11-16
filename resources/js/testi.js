function insert(hook, node) {
  return uutils.insertAfter(node, hook);
}
//note mmeta etc.. avoid binding clashes from previous script
const mmeta = greenGeorge.meta,
  uutils = greenGeorge.utils,
  log = console.log,
  identity = mmeta.identity,
  ptL = mmeta.doPartial(),
  defer = mmeta.doPartial(true),
  compose = mmeta.compose,
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
  pprevoke = (m) => (o, v) => o[m](v),
  invok = (o, m, k, v) => o[m](k, v),
  curry4 = (f) => (a) => (b) => (c) => (d) => f(d, c, b, a),
  ccurry2 = mmeta.curryRight(2),
  append = ptL(pprevoke("appendChild")),
  make = uutils.doMakeDefer;

function play(e) {
  const parent = e.target.parentNode,
    container = mmeta.byTagScope(parent)("div"),
    articles = mmeta.byTagScope(container)("article", true),
    i = articles.length - 1,
    appender = defer(invk, container, "appendChild", articles[0]),
    inserter = defer(
      invok,
      container,
      "insertBefore",
      articles[i],
      articles[0]
    );
    let cb = identity;

  if (e.target.nodeName === "P") {
    cb = e.target.nextElementSibling ? appender : inserter;
  }
  setTimeout(cb);
}

function builder() {
  const getParent = ccurry2(getprop)("parentNode"),
    climb = compose(getParent, invoke),
    forward = defer(invk, document, "createTextNode", ">"),
    back = defer(invk, document, "createTextNode", "<"),
    listen = curry4(invok)(play)("click")("addEventListener"),
    textFooter = compose(
      listen,
      getParent,
      climb,
      ptL(compduo, forward),
      append,
      ptL(composer, make("p")),
      append,
      getParent,
      ptL(insert, mmeta.$Q(".testimonials h2")),
      climb,
      ptL(compduo, back),
      append,
      make("p")
    );
  textFooter();
}

document.addEventListener("DOMContentLoaded", builder);
