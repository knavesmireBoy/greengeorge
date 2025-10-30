let service = document.querySelector(".services"),
  log = console.log,
  articles = service.getElementsByTagName("article"),
  f = (node) => node.parentNode.appendChild(node),
  delay = (node) => () => node.parentNode.appendChild(node),
  func = (f, t) => setTimeout(f, t),
  defer = (f, t) => () => f(t);

let element = articles[0],
  next = element,
  start,
  pc = 343,
  inc = 0,
  t = 200;

function step(timestamp) {
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = timestamp - start,
    shift = Math.min(0.1 * elapsed, t);
  //log(timestamp);
  if (shift < t) {
    requestAnimationFrame(step);
  } else {
    //inc = pc;
    start = undefined;
    element.style.marginLeft = `-34.33%`;
    element.parentNode.appendChild(element);
    element.style.marginLeft = 0;
    element = element.parentNode.firstElementChild;
    if (element !== next) {
      requestAnimationFrame(step);
    }
  }
}

requestAnimationFrame(step);
