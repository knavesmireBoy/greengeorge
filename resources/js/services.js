/*jslint nomen: true */
/* eslint-disable indent */
/* eslint-disable no-param-reassign */
/*global greenGeorge: false */
if (!window.greenGeorge) {
    window.greenGeorge = {};
  }

  function paint(node, val) {
    node.style.backgroundColor = val;
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
  
  let inc = 0,
    t = 500,
    margins = [100, 52, 34.333],
    request,
    requester,
    start,
    starter;
  
  const meta = greenGeorge.meta,
    utils = greenGeorge.utils,
    getProp = (o, p) => o[p],
    comp = meta.compose,
    sub = (o, p, m, v) => o[p][m](v),
    prevoke = (p, v) => (o, m) => sub(o, p, m, v),
    curry2 = meta.curryRight(2),
    curry22 = meta.curryRight(2, true),
    getTarget = curry2(getProp)("currentTarget"),
    preActive = prevoke("classList", "pause"),
    preMove = prevoke("classList", "mv"),
    activate = curry2(preActive)("add"),
    deactivate = curry2(preActive)("remove"),
    doActive = comp(activate, getTarget),
    undoActive = comp(deactivate, getTarget),
    doAlt = meta.doAlternate(),
    finder = (nodes) => (node) => {
      let i = 0,
        l = nodes.length;
      while (i < l) {
        if (nodes[i] === node) {
          break;
        }
        i++;
      }
      return i;
    },
    spotify = (nodes, values, cb) => (j) => {
      let i = nodes.length,
        [dflt, current] = values;
      while (i--) {
        if (i === j) {
          cb(nodes[i], current);
        } else {
          cb(nodes[i], dflt);
        }
      }
    },
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
    service = document.querySelector(".services"),
    control = document.getElementById("control"),
    liveArticles = (service && service.getElementsByTagName("article")) || [],
    articles = (service && service.querySelectorAll("article")) || [],
    i = articles.length,
    el = articles[0],
    next = el,
    validate = () => true,
    validator = (a) => (b) => a !== b,
    move = (node, val) => (node.style.marginLeft = val),
    cycle = spotify(
      control.getElementsByTagName("span"),
      ["rgba(255,255,255, .2)", "white"],
      paint
    ),
    cb = comp(cycle, finder(articles)),
    stepper = (
      element,
      data,
      validator,
      callback,
      dur = 500,
      inc = 0,
      start = undefined
    ) => {
      let [travel, factor] = resize(data, 1),
        duration;
  
      return (timestamp) => {
        if (!start && inc) {
          duration = travel;
        } else if (!inc) {
          duration = dur;
        }
        start = start === undefined ? timestamp : start;
  
        const elapsed = timestamp - start,
          shift = Math.min(0.1 * elapsed, duration);
  
        if (inc) {
          if (shift < inc) {
            move(element, `-${shift / factor}%`);
            request = requestAnimationFrame(step);
          } else {
            inc = 0;
            start = undefined;
            element = loop(element);
            callback(element);
            if (validator(element)) {
              request = requestAnimationFrame(step);
            } else {
              cancelAnimationFrame(request);
            }
          }
        } else {
          if (shift < duration) {
            request = requestAnimationFrame(step);
          } else {
            inc = travel;
            start = undefined;
            request = requestAnimationFrame(step);
          }
        }
      };
    },
    step = stepper(articles[0], margins, validator(next), cb);
  
  function controller(e) {
    let a = meta.toArray(this.childNodes).filter( n => n.nodeName === 'SPAN'),
      live = meta.toArray(liveArticles).filter( n => n.nodeName === 'ARTICLE'),
      parent = liveArticles[0].parentNode,
      f = finder(a),
      i = f(e.target),
      j = 0,
      article;
  
    if (e.target !== this) {
      cycle(i);
      cancelAnimationFrame(request);
      article = articles[i];
      j = live.indexOf(article);
      i = 0;
      while (i < j) {
        parent.appendChild(live[i]);
        i++;
      }
    }
  }
  if (el) {
    request = requestAnimationFrame(step);
    control.addEventListener("click", controller);
    cb(el);
    setServicesBgImage(liveArticles, ["a", "b", "c", "d", "e", "f"]);
  }
  
