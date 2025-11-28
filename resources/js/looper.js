/*jslint nomen: true */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */
/*global greenGeorge: false */
if (!window.greenGeorge) {
  window.greenGeorge = {};
}

function myslider(hook, gang, i, delay, duration = 500) {
  const f = curry2(utils.getComputedStyle)("background-image"),
    urls = gang.map(f),
    exec = curry22(preMove)("add"),
    undo = curry2(preMove)("remove"),
    n = urls.length,
    j = i,
    sixty = "center 60%";
  pos = {
    8: "center 70%",
    6: sixty,
    14: sixty,
    15: "center 65%",
    16: sixty,
    12: "center 55%",
    10: "center 40%",
  };

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
        undo(hook);
        return;
      } else {
        deactivate(hook);
        t = -1;
      }
    }
    let cb = () => {
      hook.insertBefore(hook.lastElementChild, hook.firstElementChild);
      undo(hook);
      i = i % n ? i : 0;
      if (pos[i]) {
        hook.firstElementChild.style.backgroundPosition = pos[i];
      }
      hook.firstElementChild.style.backgroundImage = urls[i++];
      if (t) play();
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

let margins = [100, 52, 34.333];

const meta = greenGeorge.meta,
  utils = greenGeorge.utils,
  sub = (o, p, m, v) => o[p][m](v),
  prevoke = (p, v) => (o, m) => sub(o, p, m, v),
  curry2 = meta.curryRight(2),
  curry22 = meta.curryRight(2, true),
  preActive = prevoke("classList", "pause"),
  preMove = prevoke("classList", "mv"),
  activate = curry2(preActive)("add"),
  deactivate = curry2(preActive)("remove"),

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

  aside = player.querySelector("aside"),
  figures = aside.querySelectorAll("figure"),

  move = (node, val) => (node.style.marginLeft = val),
  slideshow = myslider(aside, meta.toArray(figures), 2, 4000);

aside.addEventListener("click", slideshow);
slideshow();
