/*window.onload = maxWindow;

function maxWindow() {
  window.moveTo(0, 0);

  if (document.all) {
    top.window.resizeTo(screen.availWidth, screen.availHeight);
  } else if (document.layers || document.getElementById) {
    if (
      top.window.outerHeight < screen.availHeight ||
      top.window.outerWidth < screen.availWidth
    ) {
      top.window.outerHeight = screen.availHeight;
      top.window.outerWidth = screen.availWidth;
    }
  }
}
*/
function getNextElement(node, type = 1) {
  if (node && node.nodeType === type) {
    return node;
  }
  if (node && node.nextSibling) {
    return getNextElement(node.nextSibling);
  }
  return null;
}

function insertAfter(newElement, targetElement) {
  var parent = targetElement.parentNode;
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement);
  } else if (newElement) {
    parent.insertBefore(newElement, getNextElement(targetElement.nextSibling));
  }
  return newElement;
}

function isFullScreen() {
  return (
    (document.fullscreenElement && document.fullscreenElement !== null) ||
    (document.webkitFullscreenElement &&
      document.webkitFullscreenElement !== null) ||
    (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
    (document.msFullscreenElement && document.msFullscreenElement !== null)
  );
}

function doRequestFullScreen(el) {
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
}

function fullscreen() {}
let throttlePause;

function throttle(callback, time) {
  if (throttlePause) {
    return;
  }
  throttlePause = true;
  setTimeout(() => {
    callback();
    throttlePause = false;
  }, time);
}

function fade(i) {
  let elem = document.getElementById("esc");
  if (i > 0) {
    elem.style.opacity = i / 100;
    setTimeout(defer(fade, i - 2), 66);
  } else {
    exit(elem);
  }
}

const defer = (f, arg) => () => f(arg),
  box = document.getElementById("lightbox"),
  clika = document.getElementById("fullscreen"),
  controls = document.getElementById("controls"),
  xit = document.getElementById("exit"),
  esc = document.getElementById("esc"),
  img = document.querySelector("#lightbox figure img"),
  subMethod = (o, p, m, v) => o[p][m](v),
  curry4 = (f) => (a) => (b) => (c) => (d) => f(d, c, b, a),
  curry44 = (f) => (a) => (b) => (c) => (d) => () => f(d, c, b, a),
  exec = curry44(subMethod)("fader")("add")("classList"),
  undo = curry4(subMethod)("fader")("remove")("classList"),
  exit = function (elem) {
    if (elem) elem.parentNode.removeChild(elem);
    document.getElementById("exit").className = "fader";
  },
  quit = (el) => {
    el.parentNode.removeChild(el);
  },
  toggle = (el) => {
    let l,
      r,
      fig = el.parentNode,
      main = fig.parentNode;
    if (fig.previousElementSibling) {
      l = fig.previousElementSibling;
      r = fig.nextElementSibling;
      main = fig.parentNode;
      main.removeChild(l);
      main.removeChild(r);
      fig.style.margin = 0;
      fig.style.borderWidth = 0;
    } else {
      l = document.createElement("p");
      r = document.createElement("p");
      l.innerHTML = "&lt";
      r.innerHTML = "&gt;";
      main.appendChild(r);
      main.insertBefore(l, fig);
      fig.style.margin = ".75em";
      fig.style.borderWidth = "1px";
    }
  },
  zoom = (cb, n = 150) => {
    const el = document.createElement("p"),
      esc = document.getElementById("esc"),
      box = document.getElementById("lightbox");

    if (box.requestFullscreen) {
      box.requestFullscreen();
    }

    if (!esc) {
      el.innerHTML = "to exit fullscreen, press <kbd>esc</kbd";
      el.id = "esc";
      box.insertBefore(el, box.firstElementChild);
      cb(n);
    }
    if (isFullScreen()) {
      document
        .exitFullscreen?.()
        .then(() => console.log("Document Exited from Full screen mode"))
        .catch((err) => console.error(`${err}!`));
    }
  },
  direct = (e) => {
    const el = e.target,
      esc = document.getElementById("esc"),
      box = document.getElementById("lightbox");
    if (el.previousElementSibling && el.nextElementSibling) {
      return toggle(document.querySelector("#lightbox figure img"));
    }
    if (el.previousElementSibling && !el.nextElementSibling) {
      //return exit(esc);
      return quit(box);
    }
    if (el.nextElementSibling && !el.previousElementSibling) {
      return zoom(fade);
    }
  },
  slider = (e) => {
    let el = e.target,
      fig = el.parentNode,
      main = fig.parentNode,
      neu = main.lastElementChild;

    setTimeout(function () {
      insertAfter(neu, main.firstElementChild);
      insertAfter(fig, main.lastElementChild);
      main.classList.remove("mv");
      main.classList.add("mvd");
    }, 100);
    main.classList.add("mv");
    setTimeout(function () {
      main.classList.remove("mvd");
    }, 150);
  };

img.parentNode.parentNode.addEventListener("click", slider);

controls.addEventListener("click", direct);

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(exec(document.querySelector("#lightbox")), 4000);
});

box.addEventListener("mousemove", (e) => {
  let el = document.querySelector("#lightbox");
  undo(el);
  throttle(exec(el), 10000);
});
