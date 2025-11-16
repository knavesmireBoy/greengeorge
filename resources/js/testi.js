function insert(hook, node) {
  return utils.insertAfter(node, hook);
}

const meta = greenGeorge.meta,
  utils = greenGeorge.utils,
  always = meta.always,
  negator = meta.negator,
  identity = meta.identity,
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
  curry44 = (f) => (a) => (b) => (c) => (d) => () => f(d, c, b, a);

function foo(e) {
  const parent = e.target.parentNode,
    container = meta.byTagScope(parent)("div"),
    article = meta.byTagScope(container)("article"),
    articles = meta.byTagScope(container)("article", true),
    i = articles.length - 1,
    move = curry44(subMethod)("mv")("add")("classList")(container),
    unmove = curry44(subMethod)("mv")("remove")("classList")(container),
    moved = curry44(subMethod)("mvd")("add")("classList")(container),
    unmoved = curry44(subMethod)("mvd")("remove")("classList")(container)

  if (parent.nodeName === "SECTION") {
    
  }
  //setTimeout(move, 1111);
  //setTimeout(unmove, 3100);
  setTimeout(() => {
    //container.appendChild(article);


   // unmove();
   container.insertBefore(articles[i], articles[0]);
  }, 3200);
  //setTimeout(moved, 3100);
  //setTimeout(unmoved, 400);
}

function builder() {
  const append = ptL(prevoke("appendChild")),
    make = utils.doMakeDefer,
    getParent = curry2(getprop)("parentNode"),
    climb = compose(getParent, invoke),
    forward = defer(invk, document, "createTextNode", ">"),
    back = defer(invk, document, "createTextNode", "<"),
    listen = curry4(invok)(foo)("click")("addEventListener"),
    textFooter = compose(
      listen,
      getParent,
      climb,
      ptL(compduo, forward),
      append,
      invoke,
      ptL(compduo, make("p")),
      append,
      getParent,
      ptL(insert, meta.$Q(".testimonials h2")),
      climb,
      ptL(compduo, back),
      append,
      make("p")
    );
  textFooter();
}

document.addEventListener("DOMContentLoaded", builder);
