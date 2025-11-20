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
  curry44 = mmeta.curryRight(4, true),
  ccurry2 = mmeta.curryRight(2),
  append = ptL(pprevoke("appendChild")),
  make = uutils.doMakeDefer,
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
  animator = document.querySelector(".testimonials article");

function testi() {
  elapsed = Date.now();
}

function play(j, frame_length = 7) {
  const section = mmeta.$Q(".testimonials"),
    fade = curry44(subMethod)("fade")("add")("classList")(section);

  setTimeout(fade, 4444);

  return function player(e, t = 0) {
    const container = mmeta.byTagScope(section)("div"),
      activate = curry4(subMethod)("animed")("add")("classList");

    var cb = identity,
      forward = false,
      articles = mmeta.byTagScope(container)("article", true),
      i = articles.length - 1,
      mod = frame_length * articles.length,
      appender = defer(invk, container, "appendChild"),
      inserter = defer(invok, container, "insertBefore", articles[i]);
    if (e.target.nodeName === "P") {
      forward = e.target.id === "forward";
      if (j) {
        cb = forward ? inserter : appender;
        setTimeout(cb(container.firstChild));
      } else {
        let now = Date.now() - elapsed,
          t = `${Math.floor(now / 1000)}` % mod, //modulo by duration of the animation
          k = mover(t, forward),
          y = 0,
          node,
          hold = [];
        j++;

        if (forward) {
          while ((node = container.lastChild)) {
            hold.push(container.removeChild(node));
          }
          while (hold[y]) {
            container.appendChild(hold[y++]);
          }
          articles = mmeta.byTagScope(container)("article", true);
        } else {
          while ((node = container.firstChild)) {
            let el = container.removeChild(node);
            if (node.nodeType === 1) {
              hold.push(el);
            }
          }
          while (hold[y]) {
            container.appendChild(hold[y++]);
          }
        }

        while (k) {
          container.insertBefore(articles[i], container.firstChild);
          i--;
          k--;
        }
        activate(section);

        setTimeout(defer(player, e), 1000);
      }
    }
  };
}
// x * % = 1300 62.43
function builder() {
  const getParent = ccurry2(getprop)("parentNode"),
    climb = compose(getParent, invoke),
    forward = defer(invk, document, "createTextNode", ">"),
    back = defer(invk, document, "createTextNode", "<"),
    listen = curry4(invok)(play(0))("click")("addEventListener"),
    settingId = compose(pass, ccurry2(prepair("setAttribute", "id"))),
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

//testi();
