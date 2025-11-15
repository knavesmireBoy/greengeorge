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

function builder() {
  const append = ptL(prevoke("appendChild")),
    make = utils.doMakeDefer,
    whilst = curry2(meta.doWhen),
    getParent = curry2(getprop)("parentNode"),
    getParent2 = compose(getParent, getParent),
    getParent3 = compose(getParent, getParent2),
    climb = compose(getParent, invoke),
    climber = compose(getParent, climb),
    myMaker = (str, f = (a) => a) =>
      compose(whilst(append), f, getRes, whilst(ptL(compduo, make(str)))),
    forward = defer(invk, document, "createTextNode", ">"),
    back = defer(invk, document, "createTextNode", "<"),
    paraForward = myMaker("p", settingId("forward")),
    paraBack = myMaker("p", settingId("back")),
    textForward = whilst(ptL(compduo, forward)),
    textBack = whilst(ptL(compduo, back)),
    settingId = compose(pass, curry2(mittel("setAttribute", "id"))),
    perform = compose(ptL(insert, meta.$Q(".testimonial h2")), paraBack),
    doTextNode = ptL(invk, document, "createTextNode");

    const ptxt = compose(doTextNode, always("fred")),

    textFooter = compose(
      climb,
      ptL(compduo, ptxt),
      perform,
      make("p")
    );
}
