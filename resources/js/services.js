/*jslint nomen: true */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */
/*global greenGeorge: false */
if (!window.greenGeorge) {
  window.greenGeorge = {};
}

function loop(element) {
  element.parentNode.appendChild(element);
  element.style.marginLeft = 0;
  return element.parentNode.firstElementChild;
}

function setServicesBgImage(nodes, klasses) {
  let i = nodes.length;
  if (i === klasses.length) {
    while (i--) {
      nodes[i].classList.add(klasses[i]);
    }
  }
}

function myslider(hook, gang, i, delay) {
  const f = curry2(utils.getComputedStyle)("background-image"),
    urls = gang.map(f),
    exec = curry22(preMove)("add"),
    undo = curry2(preMove)("remove"),
    n = urls.length,
    j = i;

  let k = 0,
    t = 1;
  while (i < n) {
    hook.removeChild(gang[i++]);
  }
  i = j;

  while (k <= i) {
    gang[k].style.backgroundImage = urls[k];
    k++;
  }

  return function play(e) {
    if (e) {
      if (e.target.nodeName !== "FIGURE") {
        return;
      }
      e.stopPropagation();
      if (t) {
        clearTimeout(t);
        t = 0;
        activate(hook);
        //undo(hook);
        return;
      } else {
        deactivate(hook);
        //exec(hook)
        t = -1;
      }
    }
    let cb = () => {
        hook.insertBefore(hook.lastElementChild, hook.firstElementChild);
        undo(hook);
        i = i % n ? i : 0;
        hook.firstElementChild.style.backgroundImage = urls[i++];
        if(t) play();
    };
    if (t) {
      setTimeout(exec(hook));
      t = setTimeout(cb, t < 0 ? 0 : delay);
    }
  };
}

function paint(node, val) {
  node.style.backgroundColor = val;
}

function sub(o, p, m, v) {
  return o[p][m](v);
}

function prevoke(p, v) {
  return function (o, m) {
    return sub(o, p, m, v);
  };
}

let inc = 0,
  t = 500,
  margins = [100, 52, 34.333],
  request,
  start;

const meta = greenGeorge.meta,
  utils = greenGeorge.utils,
  getProp = (o, p) => o[p],
  comp = meta.compose,
  curry2 = meta.curryRight(2),
  curry22 = meta.curryRight(2, true),
  getTarget = curry2(getProp)("currentTarget"),
  preActive = prevoke("classList", "pause"),
  preMove = prevoke("classList", "mv"),
  activate = curry2(preActive)("add"),
  deactivate = curry2(preActive)("remove"),
  doActive = comp(activate, getTarget),
  undoActive = comp(deactivate, getTarget),
  doAlt = meta.doAlternate(),
  compose = (...fns) =>
    fns.reduce(
      (f, g) =>
        (...vs) =>
          f(g(...vs))
    ),
  finder = (nodes) => (node) => {
    let i = 0,
      l = nodes.length;
    while (i < l) {
      if (nodes[i] === node) {
        break;
      }
      i++;
    }
    return i;
  },
  spotify = (nodes, values, cb) => (j) => {
    let i = nodes.length,
      [dflt, current] = values;
    while (i--) {
      if (i === j) {
        cb(nodes[i], current);
      } else {
        cb(nodes[i], dflt);
      }
    }
  },
  resize = (margins, factor = 2.5) => {
    let width = window.innerWidth > 0 ? window.innerWidth : screen.width,
      int = 0;
    margins = margins.map((n) => n * factor);

    if (width > 768) {
      int = 1;
    }
    if (width > 1024) {
      int = 2;
    }
    return [margins[int], factor];
  },
  service = document.querySelector(".services"),
  control = document.getElementById("control"),
  player = document.getElementById("player"),
  aside = player.querySelector("aside"),
  figures = aside.querySelectorAll("figure"),
  liveArticles = (service && service.getElementsByTagName("article")) || [],
  articles = (service && service.querySelectorAll("article")) || [],
  i = articles.length,
  el = articles[0],
  next = el,
  validate = () => true,
  validator = (a) => (b) => a !== b,
  move = (node, val) => (node.style.marginLeft = val),
  cycle = spotify(
    control.getElementsByTagName("span"),
    ["rgba(255,255,255, .2)", "white"],
    paint
  ),
  cb = compose(cycle, finder(articles)),
  stepper = (
    element,
    data,
    validator,
    callback,
    dur = 500,
    inc = 0,
    start = undefined
  ) => {
    let [travel, factor] = resize(data, 1),
      duration;

    return (timestamp) => {
      if (!start && inc) {
        duration = travel;
      } else if (!inc) {
        duration = dur;
      }
      start = start === undefined ? timestamp : start;

      const elapsed = timestamp - start,
        shift = Math.min(0.1 * elapsed, duration);

      if (inc) {
        if (shift < inc) {
          move(element, `-${shift / factor}%`);
          request = requestAnimationFrame(step);
        } else {
          inc = 0;
          start = undefined;
          element = loop(element);
          callback(element);
          if (validator(element)) {
            request = requestAnimationFrame(step);
          } else {
            cancelAnimationFrame(request);
          }
        }
      } else {
        if (shift < duration) {
          request = requestAnimationFrame(step);
        } else {
          inc = travel;
          start = undefined;
          request = requestAnimationFrame(step);
        }
      }
    };
  },
  slideshow = myslider(aside, meta.toArray(figures), 2, 4000);

step = stepper(articles[0], margins, validator(next), cb);

function controller(e) {
  let a = Array.prototype.slice.call(this.childNodes),
    live = Array.prototype.slice.call(liveArticles),
    parent = liveArticles[0].parentNode,
    f = finder(a),
    i = f(e.target),
    j = 0,
    article;
  if (e.target !== this) {
    cycle(i);
    cancelAnimationFrame(request);
    article = articles[i];
    j = live.indexOf(article);
    i = 0;
    while (i < j) {
      parent.appendChild(live[i]);
      i++;
    }
  }
}

if (el) {
  request = requestAnimationFrame(step);
  control.addEventListener("click", controller);
  cb(el);
  setServicesBgImage(liveArticles, ["a", "b", "c", "d", "e", "f"]);
}

/*
const ev = (i) => (e) => {
    let f = curry2(utils.getComputedStyle)("background-image"),
      parent = getTarget(e).firstElementChild,
      nodes = meta.toArray(parent.childNodes).filter((n) => n.nodeType === 1),
      opts = [f(e.target), f(nodes[0])];
    doToggle(e);
    nodes[0].style.backgroundImage = opts[Number(!i)];
  },
  doToggle = doAlt([doActive, undoActive]);
if (player) {
  player.addEventListener("click", ev(1));
}
*/

aside.addEventListener("click", slideshow);
slideshow();
