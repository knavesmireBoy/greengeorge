/*jslint nomen: true */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */
/*global greenGeorge: false */
if (!window.greenGeorge) {
  window.greenGeorge = {};
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
  invk = (o, m, v) => o[m](v),
  prevoke = (m) => (o, v) => o[m](v),
  invok = (o, m, k, v) => o[m](k, v),
  prepSubMethod = (p, v) => (o, m) => o[p][m](...v),
  cu2 = meta.curryRight(2),
  hifactory = prepSubMethod("classList", ["hi"]),
  transformfactory = prepSubMethod("classList", ["transform", "transit"]),
  transformRevfactory = prepSubMethod("classList", ["transform"]),
  transitfactory = prepSubMethod("classList", ["transit"]),
  highlighter = {
    exec: cu2(hifactory)("add"),
    undo: cu2(hifactory)("remove"),
  },
  transformer = {
    exec: cu2(transformfactory)("add"),
    undo: cu2(transformfactory)("remove"),
  },
  transformerRev = {
    exec: compose(
      cu2(transformRevfactory)("add"),
      pass(cu2(transitfactory)("remove"))
    ),
    undo: compose(
      cu2(transitfactory)("add"),
      pass(cu2(transformRevfactory)("remove"))
    ),
  },
  transit = {
    exec: cu2(transitfactory)("add"),
    undo: cu2(transitfactory)("remove"),
  },
  animed = (t, flag = false) => {
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
  service = document.querySelector(".services"),
  control = document.getElementById("control"),
  livespans = control.getElementsByTagName("span"),
  section = meta.$Q(".services"),
  container = meta.byTagScope(section)("div"),
  appender = ptL(invk, container, "appendChild"),
  inserter = ptL(invok, container, "insertBefore"),
  inserterControl = ptL(invok, control, "insertBefore"),
  getRefNode = ptL(
    composer,
    defer(getprop, container, "firstChild"),
    defer(utils.getNextElement)
  ),
  getLastNode = defer(
    composer,
    defer(getprop, container, "lastChild"),
    defer(utils.getPrevElement)
  ),
  insertB4 = compose(
    ptL(composer, getRefNode),
    cu2(composer)(inserter),
    getLastNode
  ),
  getControlRefNode = ptL(
    composer,
    defer(getprop, control, "firstChild"),
    defer(utils.getNextElement)
  ),
  getControlLastNode = defer(
    composer,
    defer(getprop, control, "lastChild"),
    defer(utils.getPrevElement)
  ),
  spotshifterbak = compose(
    ptL(composer, getControlRefNode),
    cu2(composer)(inserterControl),
    getControlLastNode
  ),
  appendTo = defer(composer, getRefNode, appender),
  spotshifter = compose(
    ptL(invk, control, "appendChild"),
    defer(utils.getNextElement, control.firstChild)
  ),
  domino = (n, fns) => (x = 0) => {
    let i = n,
    fn = fns[x];
    while (n--) {
      fn();
    }
    n = i;
  };

function testi() {
  elapsed = Date.now();
}

function play(callback) {
  var contains = cu2(hifactory)("contains"),
    serv = meta.$Q(".services"),
    arts = serv.getElementsByTagName("article");

  return function (e) {
    function tick(action, state, init = () => true) {
      return function (t, r, i, k) {
        let j = 0;
        init();//this would be insertB4 if going back, needs to run BEFORE, transform/transit classes are applied
        while (arts[j]) {
          state.exec(arts[j]);
          j++;
        }
        setTimeout(function () {
          let j = 0;
          while (arts[j]) {
            state.undo(arts[j]);
            j++;
          }
        }, t);

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(action(r, i, k));
          }, t);
        });
      };
    }

    const tgt = e.target,
      ticker = (cb) => (i, rev) => {
        cb();
        return [i-=1, rev];
      };

    let reqst = 0,
      offset = 0,
      dur = 600,
      rev = 0,
      mytimer = tick(ticker(appendTo), transformer);

    if (this.nodeType === 1 && tgt.nodeName === "SPAN") {
      while (livespans[reqst] !== tgt) {
        reqst++;
      }

      while (!contains(livespans[offset])) {
        offset++;
      }

      if (reqst < offset) {
        mytimer = tick(ticker(meta.identity), transformerRev, insertB4);
        rev = 1;
      }
      reqst -= offset;
      reqst = Math.abs(reqst);
      async function func(f, t, ...args) {
        const result = await f(t, ...args),
          [i, rev] = result,
          next = meta.pApply(func, f, t, i, rev);
        callback(rev);
        if (i > 0) {
          setTimeout(next, t);
        }
      }
      func(mytimer, dur, reqst, rev);
    }
  };
}

highlighter.exec(livespans[0]);
meta.$("control").addEventListener("click", play(domino(5, [spotshifter, spotshifterbak])));
