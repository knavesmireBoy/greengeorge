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

function paint(node, val) {
  node.style.backgroundColor = val;
}

function dotty(nodes, values, painter) {
  return function (j) {
    let i = nodes.length;
    while (i--) {
      if (i === j) {
        painter(nodes[i], values[1]);
      } else {
        painter(nodes[i], values[0]);
      }
    }
  };
}

function finder(nodes) {  
  return function (node) {
    let i = 0,
    l = nodes.length;
    while (i < l) {
      if (nodes[i] === node) {
        break;
      }
      i++;
    }
    return i;
  };
}

function finder2(nodes) {  
  return function (node) {
    let i = nodes.length;
    while (i--) {
      if (nodes[i] === node) {
        break;
      }
    }
    return i;
  };
}

let start,
  service = document.querySelector(".services"),
  control = document.getElementById("control"),
  myarticles = (service && service.getElementsByTagName("article")) || [],
  articles = (service && service.querySelectorAll("article")) || [],
  i = articles.length,
  element = articles[0],
  next = element,
  inc = 0,
  t = 500,
  margins = [100, 52, 34.333, 52],
  //[margin, j] = resize(margins, 2),
  validate = () => true,
  validator = (a) => (b) => a !== b,
  move = (node, val) => (node.style.marginLeft = val),
  cycle = dotty(control.getElementsByTagName("span"), ["rgba(255,255,255, .2)", "white"], paint),
  cb = finder(articles),
  stepper = (start, t, inc, data, validator) => {
    let [x, i] = resize(data, 1);

    return (timestamp) => {
      if (!start && inc) {
        t = inc;
      } else {
        t = 500;
      }
      start = start === undefined ? timestamp : start;

      const elapsed = timestamp - start,
        shift = Math.min(0.1 * elapsed, t);

      if (inc) {
        if (shift < inc) {
          move(element, `-${shift / i}%`);
          requestAnimationFrame(step);
        } else {
          inc = 0;
          start = undefined;
          element = loop(element);
          cycle(cb(element));
          if (validator(element)) {
            requestAnimationFrame(step);
          }
        }
      } else {
        if (shift < t) {
          requestAnimationFrame(step);
        } else {
          inc = x;
          start = undefined;
          requestAnimationFrame(step);
        }
      }
    };
  };
step = stepper(start, 500, 0, margins, validator(next));

if (element) {
  cycle(cb(element));
  setServicesBgImage(myarticles, ["a", "b", "c", "d", "e", "f"]);
  requestAnimationFrame(step);
}
