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

function fade(i) {
  let elem = document.getElementById("esc");
  if (i > 0) {
    elem.style.opacity = i / 100;
    setTimeout(defer(fade, i - 2), 66);
  } else {
    exit(elem);
  }
}

const box = document.getElementById("lightbox"),
  clika = document.getElementById("fullscreen"),
  xit = document.getElementById("exit"),
  esc = document.getElementById("esc"),
  img = document.querySelector("#lightbox figure img"),
  exit = function () {
    let elem = document.getElementById("esc");
    if (elem) elem.parentNode.removeChild(elem);
    xit.className = "fader";
  },
  defer = (f, i) => () => f(i);

img.addEventListener("click", (e) => {
  let l,
    r,
    el = e.target,
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
    fig.style.margin = '.75em';
    fig.style.borderWidth = '1px';
  }
});

clika.addEventListener("click", (e) => {
  if (box.requestFullscreen) {
    box.requestFullscreen();
  }
  if (!esc) {
    let el = document.createElement("p");
    el.innerHTML = "to exit fullscreen, press <kbd>esc</kbd";
    el.id = "esc";
    box.insertBefore(el, box.firstElementChild);
    fade(150);
  }
});

xit.addEventListener("click", (e) => {
  let box = document.getElementById("lightbox");
  box.parentNode.removeChild(box);
});

document.addEventListener("DOMContentLoaded", () => {
  let el = document.querySelector("#lightbox");
  setTimeout(() => {
    el.classList.add("fader");
  }, 4000);
});

box.addEventListener("mousemove", (e) => {
  let el = document.querySelector("#lightbox");
  el.classList.remove("fader");
  setTimeout(() => {
    el.classList.add("fader");
  }, 10000);
});
