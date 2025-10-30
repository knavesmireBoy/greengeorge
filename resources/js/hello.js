function resize(margins, i = 2.5) {
  let width = window.innerWidth > 0 ? window.innerWidth : screen.width,
    int = 0;
  margins = margins.map((n) => n * i);
  if (width > 768) {
    int = 1;
  }
  if (width > 1024) {
    int = 2;
  }
  return [margins[int], i];
}

function flip(element) {
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

let start,
  service = document.querySelector(".services"),
  articles = (service && service.getElementsByTagName("article")) || [],
  i = articles.length,
  element = articles[0],
  next = element,
  inc = 0,
  t = 500,
  margins = [34.333, 52, 100],
  [margin, j] = resize(margins, 1),
  validate = () => true,


  stepper = () => () {
    
  };


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

setServicesBgImage(articles, ["a", "b", "c", "d", "e", "f"]);

if (element) {
  requestAnimationFrame(step);
}
