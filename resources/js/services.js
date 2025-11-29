/*jslint nomen: true */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */
/*global greenGeorge: false */
if (!window.greenGeorge) {
  window.greenGeorge = {};
}

var elapsed;

function testi() {
  elapsed = Date.now();
}

function looper(f, collection, ...args) {
  let i = 0;
  while (f(collection[i], ...args)) {
    i++;
  }
  return i;
}

function getAnimationState(t, flag = false) {
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
}
let inc = 0,
  t = 500,
  margins = [100, 52, 34.333],
  request,
  requester,
  start,
  starter;

//note meta etc.. avoid binding clashes from previous script
const meta = greenGeorge.meta,
  utils = greenGeorge.utils,
  log = console.log,
  ptL = meta.doPartial(),
  pApply = meta.pApply,
  negate = meta.negator,
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
  service = document.querySelector(".services"),
  control = document.getElementById("control"),
  livespans = control.getElementsByTagName("span"),
  section = meta.$Q(".services"),
  container = meta.byTagScope(section)("div"),
  appender = ptL(invk, container, "appendChild"),
  inserter = ptL(invok, container, "insertBefore"),
  inserterControl = ptL(invok, control, "insertBefore"),
  equals = (a, b) => a === b,

  getRefNodeFactory = () => {

    return null;

  },
  getRefNode = ptL(
    composer,
    defer(getprop, container, "firstChild"),
    defer(utils.getNextElement)
  ),
  getControlRefNode = ptL(
    composer,
    defer(getprop, control, "firstChild"),
    defer(utils.getNextElement)
  ),
  getLastNode = defer(
    composer,
    defer(getprop, container, "lastChild"),
    defer(utils.getPrevElement)
  ),
  getControlLastNode = defer(
    composer,
    defer(getprop, control, "lastChild"),
    defer(utils.getPrevElement)
  ),
  appendTo = defer(composer, getRefNode, appender),
  insertB4 = compose(
    ptL(composer, getRefNode),
    cu2(composer)(inserter),
    getLastNode
  ),
  spotshifter = compose(
    ptL(invk, control, "appendChild"),
    defer(utils.getNextElement, control.firstChild)
  ),
  spotshifterbak = compose(
    ptL(composer, getControlRefNode),
    cu2(composer)(inserterControl),
    getControlLastNode
  ),
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
    enter: meta.identity,
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
    enter: insertB4,
  },
  transit = {
    exec: cu2(transitfactory)("add"),
    undo: cu2(transitfactory)("remove"),
  },
  domino =
    (n, fns) =>
    (x = 0) => {
      let i = n,
        fn = fns[x];
      while (n--) {
        fn();
      }
      n = i;
    };

function play(callback) {
  var contains = cu2(hifactory)("contains"),
    serv = meta.$Q(".services"),
    arts = serv.getElementsByTagName("article"),
    findtarget = negate(pApply(equals)),
    findcurrent = negate(pApply(contains));

  return function (e) {
    function tick(action, state) {
      return function (t, r, i, k) {
        let j = 0;
        //init();//this would be insertB4 if going back, needs to run BEFORE, transform/transit classes are applied

        state.enter();
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
        return [(i -= 1), rev];
      };

    let reqst = 0,
      offset = 0,
      dur = 600,
      rev = 0,
      mytimer = tick(ticker(appendTo), transformer);

    if (this.nodeType === 1 && tgt.nodeName === "SPAN") {
      reqst = looper(findtarget, livespans, tgt);
      offset = looper(findcurrent, livespans);
      if (reqst === offset) {
        return;
      }
      if (reqst < offset) {
        mytimer = tick(ticker(meta.identity), transformerRev);
        rev = 1;
      }
      reqst = Math.abs((reqst -= offset));
      async function player(timerfunc, duration, ...args) {
        const result = await timerfunc(duration, ...args),
          [i, rev] = result,
          next = pApply(player, timerfunc, duration, i, rev);
        callback(rev);
        if (i > 0) {
          setTimeout(next, duration);
        }
      }
      player(mytimer, dur, reqst, rev);
    }
  };
}

highlighter.exec(livespans[0]);
meta
  .$("control")
  .addEventListener("click", play(domino(5, [spotshifter, spotshifterbak])));
