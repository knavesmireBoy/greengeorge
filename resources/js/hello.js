let service = document.querySelector(".services"),
  log = console.log,
  articles = service.getElementsByTagName("article"),
  i = articles.length,
  alpha = ["a", "b", "c", "d", "e", "f"];

while (i--) {
  articles[i].className = alpha[i];
}

let element = articles[0],
  next = element,
  start,
  pc = 34333,
  inc = 0,
  int = 0.1,
  t = 1000;

function flip(element) {
  element.parentNode.appendChild(element);
  element.style.marginLeft = 0;
  return element.parentNode.firstElementChild;
}

function step(timestamp) {
  if (!start && inc) {
    t = inc / 100;
    int = 0.5;
  }
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = timestamp - start,
    shift = Math.min(int * elapsed, t);

  if (inc) {
    if (shift < inc / 100) {
      let px = `-${shift / 10}%`;
      element.style.marginLeft = px;
      requestAnimationFrame(step);
    } else {
      inc = 0;
      t = 1000;
      start = undefined;
      element = flip(element);
      if (element !== next) {
        requestAnimationFrame(step);
      }
    }
  } else {
    if (shift < t) {
      requestAnimationFrame(step);
    } else {
      inc = pc;
      start = undefined;
      requestAnimationFrame(step);
    }
  }
}
requestAnimationFrame(step);
