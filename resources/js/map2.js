const tagTester = (name) => {
    const tag = "[object " + name + "]";
    return (obj) => toString.call(obj) === tag;
  },
  pass = (f) => (arg) => {
    f(arg);
    return arg;
  },
  log = pass(console.log),
  invoke = f => f(),
  invokeV = (o, m, v) => o[m](v),
  invokeKV = (o, m, k, v) => o[m](k, v),
  prevoker = (m, k) => (o, v) => o[m](k, v),
  prevoke = (m) => (o, v) => o[m](v),
  getta = (o, p) => o[p],
  compose = (...fns) =>
    fns.reduce(
      (f, g) =>
        (...vs) =>
          f(g(...vs))
    ),
    composer = (f1, f2) => compose(f2, f1),
  isNumber = tagTester("Number"),
  doPartial = (flag) => {
    return function p(f, ...args) {
      if (!isNumber(flag)) {
        if (f.length === args.length) {
          return flag ? () => f(...args) : f(...args);
        }
      } else {
        if (f.length + flag === args.length) {
          return f(...args);
        }
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
  hook = query(".map"),
  para = query("#map"),
  link = create("a"),
  setAttrs = ptL(prevoker, 'setAttribute'),
  setHref = prevoker('setAttribute', 'href'),
  setWidth = curry2(prevoker('setAttribute', 'width'))(425),
  setHeight = curry2(prevoker('setAttribute', 'height'))(350),
  setTarget = curry2(prevoker('setAttribute', 'target'))('_blank'),
  setSource = curry2(prevoker('setAttribute', 'src'))("https://www.openstreetmap.org/export/embed.html?bbox=-0.08222579956054689%2C51.540383176643516%2C-0.046992301940917976%2C51.55831649890036&amp;layer=mapnik"),
  prependLink = curry3(invokeV)(link)('appendChild'),
  setLinkHref = curry2(setHref)("https://www.openstreetmap.org/?#map=15/51.54935/-0.06461"),
  appendToSection = ptL(invokeV, hook, 'appendChild'),
  prepend = prevoke('appendChild'), 
  makeIframe = compose(setTarget, curry2(getta)('parentNode'), invoke, ptL(composer, doText("View Larger Map")), ptL(prepend), pass(setLinkHref), prependLink, curry2(getta)('parentNode'), appendToSection, pass(setSource), pass(setWidth), pass(setHeight), create);


  makeIframe('iframe');
  para.parentNode.removeChild(para);