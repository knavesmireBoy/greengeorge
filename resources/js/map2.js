/*
const controller = new AbortController(),
{ signal } = controller;

fetch("/api/slow-data", { signal })
  .then((res) => res.json())
  .then(console.log)
  .catch((err) => {
    if (err.name === "AbortError") {
      console.log("Fetch aborted successfully.");
    }
  });

// Call this to cancel the request
// e.g., in a component's unmount lifecycle
controller.abort();
*/
/*
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      //console.log('A child node has been added or removed.');
      console.log(mutation.addedNodes);
      //console.log(mutation.removedNodes);
    }
  });
});

// Start observing the document body for configured mutations
observer.observe(document.body, {
  childList: true, // observe direct children
  subtree: true,   // and all descendants
});

// Later, you can stop observing
//observer.disconnect();
*/

const pass = (f) => (arg) => {
    f(arg);
    return arg;
  },
  log = pass(console.log),
  invoke = (f) => f(),
  invokeV = (o, m, v) => o[m](v),
  prevoker = (m, k) => (o, v) => o[m](k, v),
  prevoke = (m) => (o, v) => o[m](v),
  getta = (o, p) => o[p],
  compose = (...fns) =>
    fns.reduce(
      (f, g) =>
        (...vs) =>
          f(g(...vs))
    ),
  composeRight =
    (...fns) =>
    (initialValue) =>
      fns.reduceRight((acc, fn) => fn(acc), initialValue),
  composer = (f1, f2) => compose(f2, f1),
  doPartial = (flag) => {
    return function p(f, ...args) {
      if (f.length === args.length) {
        return flag ? () => f(...args) : f(...args);
      }
      return (...rest) => p(f, ...args, ...rest);
    };
  },
  curry2 = (fn) => (b) => (a) => fn(a, b),
  curry3 = (fn) => (c) => (b) => (a) => fn(a, b, c),
  ptL = doPartial(),
  defer = doPartial(true),
  doDoc = ptL(invokeV, document),
  doDocDefer = defer(invokeV, document),
  query = doDoc("querySelector"),
  create = doDoc("createElement"),
  doText = doDocDefer("createTextNode"),
  setAttrs = ptL(prevoker, "setAttribute"),
  mapsrc =
    "https://www.openstreetmap.org/export/embed.html?bbox=-0.08222579956054689%2C51.540383176643516%2C-0.046992301940917976%2C51.55831649890036&amp;layer=mapnik",
  hook = query(".hook"),
  para = query(".hook > p"),
  link = create("a"),
  setWidth = curry2(setAttrs("width"))(425),
  setHeight = curry2(setAttrs("height"))(350),
  setSource = curry2(setAttrs("src"))(mapsrc),
  setTarget = curry2(setAttrs("target"))("_blank"),
  prependLink = curry3(invokeV)(link)("appendChild"),
  setLinkHref = curry2(setAttrs("href"))(
    "https://www.openstreetmap.org/?#map=15/51.54935/-0.06461"
  ),
  appendToSection = ptL(invokeV, hook, "appendChild"),
  awaitTextNode = prevoke("appendChild"),
  makeIframe = compose(
    invoke,
    ptL(composer, doText("View Larger Map")),
    ptL(awaitTextNode),
    pass(setTarget),
    pass(setLinkHref),
    prependLink,
    curry2(getta)("parentNode"),
    appendToSection,
    pass(setSource),
    pass(setWidth),
    pass(setHeight),
    create
  );

  
if (para) {
  makeIframe("iframe");
  para.parentNode.removeChild(para);
}
  