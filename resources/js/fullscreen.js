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
  };

img.addEventListener("click", (e) => {
  let el = e.target,
    fig = el.parentNode,
    l = fig.previousElementSibling,
    r = fig.nextElementSibling,
    store = [],
    main = fig.parentNode;
  main.appendChild(el);
  store.push(main.removeChild(fig));
  store.push(main.removeChild(l));
  store.push(main.removeChild(r));
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
    fade(200);
  }
});

xit.addEventListener("click", (e) => {
  let box = document.getElementById("lightbox");
  box.parentNode.removeChild(box);
});
