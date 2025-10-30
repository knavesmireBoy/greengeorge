let service = document.querySelector(".services"),
  articles = (service && service.getElementsByTagName("article")) || [],
  i = articles.length,
  alpha = ["a", "b", "c", "d", "e", "f"],
  //margins = [85.8325, 130, 250],
  margins = [34.333, 53, 100],
  margins2 = [];

while (i--) {
  articles[i].className = alpha[i];
}
//desired percentage offset but divided by 40 (which gives about the right transition)
function resize(margins, i = 2.5) {
  let width = window.innerWidth > 0 ? window.innerWidth : screen.width,
    int = 0;
    margins = margins.map(n => n * i);
  if (width > 768) {
    int = 1;
  }
  if (width > 1024) {
    int = 2;
  }
  return [margins[int], i];
}

let element = articles[0],
  next = element,
  start,
  inc = 0,
  t = 500,
  [margin, j] = resize(margins, 1);

function flip(element) {
  element.parentNode.appendChild(element);
  element.style.marginLeft = 0;
  return element.parentNode.firstElementChild;
}

function step(timestamp) {
  if (!start && inc) {
    t = inc;
  } else {
    t = 500;
  }
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = timestamp - start,
    shift = Math.min(0.1 * elapsed, t);

  if (inc) {
    if (shift < inc) {
      let px = `-${shift / j}%`;
      element.style.marginLeft = px;
      requestAnimationFrame(step);
    } else {
      inc = 0;
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
      inc = margin;
      start = undefined;
      requestAnimationFrame(step);
    }
  }
}
if (element) {
  requestAnimationFrame(step);
}
