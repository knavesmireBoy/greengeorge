

let tagTester = (name) => {
    const tag = "[object " + name + "]";
    return function (obj) {
      return toString.call(obj) === tag;
    };
  },
  isArray = tagTester("Array"),
  isBoolean = tagTester("Boolean"),
  isFunction = tagTester("Function"),
  isNumber = tagTester("Number"),
  isString = tagTester("String"),
  getResult = (o) => (isFunction(o) ? o() : o);

function getComputedStyle(element, property) {
    const toCamelCase = function (variable) {
      return variable.replace(/-([a-z])/g, function (str, letter) {
        return letter.toUpperCase();
      });
    };
    element = getResult(element);
    if (!element || !property) {
      return null;
    }
    let computedStyle = null,
      def = document.defaultView || window;
    if (typeof element.currentStyle !== "undefined") {
      computedStyle = element.currentStyle;
    } else if (
      def &&
      def.getComputedStyle &&
      isFunction(def.getComputedStyle)
    ) {
      computedStyle = def.getComputedStyle(element, null);
    }
    if (computedStyle) {
      try {
        return (
          computedStyle.getPropertyValue(property) ||
          computedStyle.getPropertyValue(toCamelCase(property))
        );
      } catch (e) {
        return (
          computedStyle[property] || computedStyle[toCamelCase(property)]
        );
      }
    }
  }

function getGreater(a, b) {
  return getResult(a) > getResult(b);
}

function getPageOffset(bool) {
  var d = document.documentElement || document.body.parentNode || document.body,
    x = d.scrollLeft,
    y = d.scrollTop;
  return bool ? x : y;
}

function getElementOffset(el) {
  //https://medium.com/snips-ai/make-your-next-microsite-beautifully-readable-with-this-simple-javascript-technique-ffa1a18d6de2
  var top = 0,
    left = 0;
  // grab the offset of the element relative to it's parent,
  // then repeat with the parent relative to it's parent,
  // ... until we reach an element without parents.
  do {
    top += el.offsetTop;
    left += el.offsetLeft;
    //https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    el = el.offsetParent;
  } while (el);
  return {
    top: top,
    left: left,
  };
}

function getScrollThreshold(el, percent) {

    if(!el){
        return Infinity;
    }
  var top,
    elementHeight = el.offsetHeight || el.getBoundingClientRect().height;
  ({ top } = getElementOffset(el));

  return (top * percent + elementHeight) - window.innerHeight;
}

let lastKnownScrollPosition = 0,
  ticking = false,
  els = document.querySelectorAll("#gal a"),
  i = 0,
  log = console.log,
  el = els[0];
el.classList.add("active");

  log(getComputedStyle(els[0], 'opacity'));

document.addEventListener("scroll", (event) => {
  lastKnownScrollPosition = window.scrollY;

  let j = getScrollThreshold(el, 1.1);

  log(j, )
  if (!ticking) {
    setTimeout(() => {
      if (lastKnownScrollPosition > j) {
        i++;
        log(i);
        el = els[i];
        if (el) {
          el.classList.add("active");
        }
      }
      ticking = false;
    }, 20);
    ticking = true;
  }
});
