function insert(hook, node) {
  return uutils.insertAfter(node, hook);
}

function testi() {
  elapsed = Date.now();
}

var elapsed;
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
  subMethod = (o, p, m, v) => o[p][m](v),
  prepair = (m, k) => (o, v) => o[m](k, v),
  curry4 = mmeta.curryRight(4),
  curry44 = mmeta.curryRight(4, true),
  cu1 = mmeta.curryRight(1, true),
  cu2 = mmeta.curryRight(2),
  cu22 = mmeta.curryRight(2, true),
  cu13 = mmeta.curryLeft(3),
  compvoke = (f1, f2, seed) => compose(f2, f1)(seed),
  prepSubMethod = (p, v) => (o, m) => o[p][m](...v),
  getParent = cu2(getprop)("parentNode"),
  make = uutils.doMakeDefer,
  mover = (t, flag = false) => {
    if (flag) {
      if (t < 7) {
        return 1;
      }
      if (t >= 7 && t < 14) {
        return 2;
      }
      if (t >= 14 && t < 21) {
        return 3;
      }
      return 0;
    } else {
      if (t < 7) {
        return 1;
      }
      if (t >= 7 && t < 14) {
        return 0;
      }
      if (t >= 14 && t < 21) {
        return 3;
      }
      return 2;
    }
  },
  animator = document.querySelector(".testimonials article");

function play(ran = 0, frame_length = 7) {
  const section = mmeta.$Q(".testimonials"),
    fade = curry44(subMethod)("fade")("add")("classList")(section);

  let i,
    j = 0;

  setTimeout(fade, 4444);

  return function player(e) {
    const container = mmeta.byTagScope(section)("div"),
      articles = mmeta.byTagScope(container)("article", true),
      activate = curry4(subMethod)("animed")("add")("classList"),
      appender = container && ptL(invk, container, "appendChild"),
      inserter = container ? ptL(invok, container, "insertBefore") : identity,
      getRefNode = uutils.getFirstNodeFactory(container),
      getLastNode = uutils.getLastNodeFactory(container),
      appendTo = defer(composer, getRefNode, appender),
      insertNode = compose(
        ptL(composer, getRefNode),
        cu2(composer)(inserter),
        getLastNode
      ),
      transformfactory = prepSubMethod("classList", ["transform", "transit"]),
      transformRevfactory = prepSubMethod("classList", ["transform"]),
      transitfactory = prepSubMethod("classList", ["transit"]);

    let forward = false,
      exec,
      undo,
      now = Date.now() - elapsed,
      timer = 1000,
      mod = frame_length * articles.length,
      t = `${Math.floor(now / 1000)}` % mod; //modulo by duration of the animation

    if (e.target.nodeName === "P") {
      forward = e.target.id === "forward";

      if (forward) {
        exec = cu22(transformfactory)("add")(container);
        undo = compose(cu2(transformfactory)("remove"), getParent, appendTo);
      } else {
        exec = compose(
          cu2(transformRevfactory)("add"),
          pass(cu2(transitfactory)("remove")),
          getParent,
          insertNode
        );
        undo = compose(
          cu2(transitfactory)("add"),
          pass(cu2(transformRevfactory)("remove")),
          mmeta.always(container)
        );
        timer = 1;
      }

      if (!ran) {
        activate(section);
        i = mover(t, forward);
        ran++;
        exec = forward ? appendTo : insertNode;
        while (i--) {
          exec();
        }
      } else {
        exec();
        setTimeout(undo, timer);
      }
    }
  };
}
// x * % = 1300 62.43
function builder() {
  const insert = (hook, node) => uutils.insertAfter(node, hook),
    climb = compose(getParent, invoke),
    append = ptL(pprevoke("appendChild")),
    forward = defer(invk, document, "createTextNode", ">"),
    back = defer(invk, document, "createTextNode", "<"),
    listen = curry4(invok)(play())("click")("addEventListener"),
    settingId = compose(pass, cu2(prepair("setAttribute", "id"))),
    textFooter = compose(
      listen,
      getParent,
      climb,
      ptL(compduo, forward),
      append,
      settingId("forward"),
      ptL(composer, make("p")),
      append,
      getParent,
      ptL(insert, mmeta.$Q(".testimonials h2")),
      climb,
      ptL(compduo, back),
      append,
      settingId("back"),
      make("p")
    );
  textFooter();
}

document.addEventListener("DOMContentLoaded", builder);
animator.addEventListener("animationstart", testi, false);

//animator.addEventListener("animationiteration", testi, false);
