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
  el = document.createElement("p"),
  exit = function () {
    let elem = document.getElementById("esc");
    if (elem) elem.parentNode.removeChild(elem);
  },
  defer = (f, i) => () => f(i);

clika.addEventListener("click", function () {
  if (box.requestFullscreen) {
    box.requestFullscreen();
  }
  if (!esc) {
    el.innerHTML = "to exit fullscreen press <kbd>ESC</kbd";
    el.id = "esc";
    box.insertBefore(el, box.firstElementChild);
    el.style.position = "absloute";
    el.style.top = 0;
    el.style.left = "50%";
    el.style.color = "lightgreen";
    fade(100);
  }
});

xit.addEventListener("click", (e) => {
  console.log(e);
  let box = document.getElementById("lightbox");
  box.parentNode.removeChild(box);
});
