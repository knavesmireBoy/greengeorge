function insert(hook, node) {
  return uutils.insertAfter(node, hook);
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
  ccurry2 = mmeta.curryRight(2),
  append = ptL(pprevoke("appendChild")),
  make = uutils.doMakeDefer,
  fubar = (t, flag = false) => {
    if (flag) {
      if (t <= 7) {
        return 0;
      }
      if (t > 7 && t <= 14) {
        return 1;
      }
      if (t > 14 && t <= 21) {
        return 2;
      }
      return 3;
    } else {
      if (t <= 7) {
        return 3;
      }
      if (t > 7 && t <= 14) {
        return 2;
      }
      if (t > 14 && t <= 21) {
        return 1;
      }
      return 0;
    }
  },
  animator = document.querySelector(".testimonials article");

function testi() {
  elapsed = Date.now();
}

function play(j) {

  return function player(e, t = 0) {
    const parent = e.target.parentNode,
      container = mmeta.byTagScope(parent)("div"),
      activate = curry4(subMethod)("animed")("add")("classList");

    var cb = identity,
      forward = false,
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
    if (e.target.nodeName === "P") {
      forward = e.target.id === "forward";
      if (j) {
        activate(container);
        cb = forward ? inserter : appender;
        setTimeout(cb);
      } else {
        let now = Date.now() - elapsed,
          t = `${Math.floor(now / 1000)}` % 28, //modulo by duration of the animation
          k = fubar(t, forward),
          y = 0,
          hold = [];
        j++;

        while (k) {
          container.insertBefore(articles[i], articles[0]);
          i--;
          k--;
        }
        if (forward) {
          while (container.firstChild) {
            hold.push(container.removeChild(container.firstChild));
          }
          hold = hold.filter((n) => n.nodeType === 1);
          hold = mmeta.reverse(hold);
          while (hold[y]) {
            container.appendChild(hold[y++]);
          }
          articles = mmeta.byTagScope(container)("article", true);
          i = articles.length;
          while (k) {
            container.insertBefore(articles[i], articles[0]);
            i--;
            k--;
          }
        }
        activate(parent);
      }
    }
  };
}

function builder() {
  const getParent = ccurry2(getprop)("parentNode"),
    climb = compose(getParent, invoke),
    forward = defer(invk, document, "createTextNode", ">"),
    back = defer(invk, document, "createTextNode", "<"),
    listen = curry4(invok)(play(0))("click")("addEventListener"),
    settingId = compose(pass, curry2(prepair("setAttribute", "id"))),
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

//testi();
