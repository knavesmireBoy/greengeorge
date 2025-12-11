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

//note animation duration set to 36s in CSS
function getAnimationState(t) {
  if (t < 6) {
    return 0;
  }
  if (t < 12) {
    return 1;
  }
  if (t < 18) {
    return 2;
  }
  if (t < 24) {
    return 3;
  }
  if (t < 30) {
    return 4;
  }
  return 5;
}

function play(callback, frame_length = 6, ran = 0) {
  var serv = meta.$Q(".services"),
    arts = serv && serv.getElementsByTagName("article"),
    findtarget = negate(pApply((a, b) => a === b)),
    findcurrent = negate(pApply(cu2(hifactory)("contains"))),
    tmr = 1000;

  if (!serv) {
    return identity;
  }

  return function (e) {
    let now = Date.now() - elapsed,
      mod = frame_length * arts.length,
      t = `${Math.floor(now / tmr)}` % mod, //modulo by duration of the animation
      z;

    function tick(action, state) {
      return function (timer, req, count, rev) {
        let j = 0;
        state.enter();
        while (arts[j]) {
          state.exec(arts[j]);
          j++;
        }
        setTimeout((i) => {
          let j = 0;
          while (arts[j]) {
            state.undo(arts[j]);
            j++;
          }
        }, timer);

        return new Promise((resolve, reject) => {
          setTimeout((i) => {
            resolve(action(req, count, rev));
          }, timer);
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
      my_promise = tick(ticker(appendTo), transformer);

    if (this.nodeType === 1 && tgt.nodeName === "SPAN") {
      //set document up for js so animation state is translated to positioning of articles;
      //ie run appendTo until we're in sync then respond to the request as normal
      if (!ran) {
        ran++;
        z = getAnimationState(t);
        runner.exec(meta.$Q("#services"));
        highlighter.exec(livespans[z]);
        while (z > 0) {
          appendTo();
          z--;
        }
      }

      reqst = looper(findtarget, livespans, tgt);
      offset = looper(findcurrent, livespans);

      if (reqst === offset) {
        return;
      }
      if (reqst < offset) {
        my_promise = tick(ticker(identity), transformerRev);
        rev = 1;
      }
      reqst = Math.abs((reqst -= offset));

      async function player(mypromise, duration, ...args) {
        const result = await mypromise(duration, ...args),
          [i, rev] = result,
          next = pApply(player, mypromise, duration, i, rev);
        callback(rev);
        if (i > 0) {
          setTimeout(next, duration);
        }
      }
      player(my_promise, dur, reqst, rev);
    }
  };
}

let inc = 0,
  t = 500,
  margins = [100, 52, 34.333],
  request,
  requester,
  start,
  starter;

const meta = greenGeorge.meta,
  utils = greenGeorge.utils,
  log = console.log,
  identity = meta.identity,
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
  livespans = control && control.getElementsByTagName("span"),
  section = meta.$Q(".services"),
  container = section && meta.byTagScope(section)("div"),
  appender = container && ptL(invk, container, "appendChild"),
  inserter = container ? ptL(invok, container, "insertBefore") : identity,
  inserterControl = control ? ptL(invok, control, "insertBefore") : identity,
  animator = document.querySelector(".services article"),
  getRefNodeFactory = (node) => {
    if (node) {
      return ptL(
        composer,
        defer(getprop, node, "firstChild"),
        defer(utils.getNextElement)
      );
    }
    return identity;
  },
  getLastNodeFactory = (node) => {
    if (node) {
      return defer(
        composer,
        defer(getprop, node, "lastChild"),
        defer(utils.getPrevElement)
      );
    }
    return identity;
  },
  getRefNode = getRefNodeFactory(container),
  getControlRefNode = getRefNodeFactory(control),
  getLastNode = getLastNodeFactory(container),
  getControlLastNode = getLastNodeFactory(control),
  appendTo = defer(composer, getRefNode, appender),
  insertNode = compose(
    ptL(composer, getRefNode),
    cu2(composer)(inserter),
    getLastNode
  ),
  spotshifter = control
    ? compose(
        ptL(invk, control, "appendChild"),
        defer(utils.getNextElement, control.firstChild)
      )
    : identity,
  spotshifterbak = control
    ? compose(
        ptL(composer, getControlRefNode),
        cu2(composer)(inserterControl),
        getControlLastNode
      )
    : identity,
  hifactory = prepSubMethod("classList", ["hi"]),
  ranfactory = prepSubMethod("classList", ["ran"]),
  transformfactory = prepSubMethod("classList", ["transform", "transit"]),
  transformRevfactory = prepSubMethod("classList", ["transform"]),
  transitfactory = prepSubMethod("classList", ["transit"]),
  highlighter = {
    exec: cu2(hifactory)("add"),
    undo: cu2(hifactory)("remove"),
  },
  runner = {
    exec: cu2(ranfactory)("add"),
    undo: cu2(ranfactory)("remove"),
  },
  transformer = {
    exec: cu2(transformfactory)("add"),
    undo: cu2(transformfactory)("remove"),
    enter: identity,
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
    enter: insertNode,
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

//highlighter.exec(livespans[0]);
meta
  .$("control")
  .addEventListener(
    "click",
    play(domino(livespans.length - 1, [spotshifter, spotshifterbak]))
  );
animator.addEventListener("animationstart", testi, false);
