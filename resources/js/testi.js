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
  fubar = (t) => {
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
  },
  animator = document.querySelector(".testimonials article");

function testi() {
  elapsed = Date.now();
}

function play(j) {
  let now;

  return function player(e, t = 0) {
    const parent = e.target.parentNode,
      container = mmeta.byTagScope(parent)("div"),
      activate = curry4(subMethod)("animed")("add")("classList");

    var cb = identity,
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
      if (j) {
        activate(container);
       // t = `${Math.floor(now / 1000)}` % 30;
       // k = fubar(t);
        cb = e.target.id === "forward" ? inserter : appender;
        setTimeout(cb);
      } else {
        let now = Date.now() - elapsed,
        t = `${Math.floor(now / 1000)}` % 30;
        k = fubar(t);
        y = 0,
        hold = [],
        articles;
        console.log(`seconds elapsed = ${Math.floor(now / 1000)}`);
        j++;
        while (container.firstChild) {
          hold.push(container.removeChild(container.firstChild));
        }
        hold = hold.filter((n) => n.nodeType === 1);
        hold = mmeta.reverse(hold);
        while (hold[y]) {
          container.appendChild(hold[y++]);
        }
        articles = mmeta.byTagScope(container)("article", true);
        y = i;
        while (k) {
          container.insertBefore(articles[y], articles[0]);
          y--;
          k--;
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
