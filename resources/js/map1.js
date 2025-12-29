const map = document.querySelector('.map'),
para = document.getElementById('map'),
txt = document.createTextNode("View Larger Map"),
iframe = document.createElement('iframe'),
link = document.createElement('a');

iframe.setAttribute('src', "https://www.openstreetmap.org/export/embed.html?bbox=-0.08222579956054689%2C51.540383176643516%2C-0.046992301940917976%2C51.55831649890036&amp;layer=mapnik");
iframe.setAttribute('width', 425);
iframe.setAttribute('height', 350);
link.setAttribute('href', "https://www.openstreetmap.org/?#map=15/51.54935/-0.06461");

para.parentNode.removeChild(para);
map.appendChild(iframe);
map.appendChild(link);
link.appendChild(txt);
