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
  subMethod = (o, p, m, v) => o[p][m](v),
  prepair = (m, k) => (o, v) => o[m](k, v),
  curry4 = mmeta.curryRight(4),
  ccurry2 = mmeta.curryRight(2),
  append = ptL(pprevoke("appendChild")),
  make = uutils.doMakeDefer;

var elapsed;

function foo(e) {
  elapsed = Date.now();
}

function fubar(t) {
  if (t < 8) {
    return 0;
  }
  if (t > 8 && t < 14) {
    return 1;
  }

  if (t > 15 && t < 23) {
    return 2;
  }

  return 3;
}

function play(j) {
  let now;
  const el = document.querySelector(".testimonials article");
  el.addEventListener("animationstart", foo, false);

  return function player(e, t = 0) {
    const parent = e.target.parentNode,
      container = mmeta.byTagScope(parent)("div"),
      articles = mmeta.byTagScope(container)("article", true),
      i = articles.length - 1,
      activate = curry4(subMethod)("animed")("add")("classList"),
      appender = defer(invk, container, "appendChild", articles[0]),
      inserter = defer(
        invok,
        container,
        "insertBefore",
        articles[i],
        articles[0]
      );

    var cb = identity,
      t,
      k, y = 0;
    if (e.target.nodeName === "P") {
      if (j) {
        activate(container);
        t = `${Math.floor(now / 1000)}` % 30;
        k = fubar(t);
        //dn fl gd tb
        //dn //fl gd tb  = fl gd tb dn app1
        //dn fl //gd tb app2
        //dn fl gd//tb app3
        //cb = e.target.id === "forward" ? appender : inserter;
        cb = e.target.id === "forward" ? inserter : appender;
     

        setTimeout(cb);
      } else {
        activate(parent);
        now = Date.now() - elapsed;
        console.log(`seconds elapsed = ${Math.floor(now / 1000)}`);
        //console.log(articles[0].innerHTML, container.offsetWidth);

        t = `${Math.floor(now / 1000)}` % 30;
        k = fubar(t);
        j++;
        /*
        while(k > 0){
          container.appendChild(articles[y]);
          y++;
          k--;
        }
          */
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
