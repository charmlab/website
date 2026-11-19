(function () {
  var map = document.getElementById('audience-map');
  if (!map) return;
  var svg = map.querySelector('svg'), g = document.getElementById('aud-bubbles'), pop = document.getElementById('aud-pop');
  var NS = 'http://www.w3.org/2000/svg';
  var A = [
    { k: 'pub', name: 'Public', slogan: 'Use AI', icon: '\uf0ac', fa: 'fa-globe', color: '#E07A1F', count: '~10,000 reached', x: 115, y: 40, side: 'r', items: [
      ['fa-instagram', 'Prince of AI (Farsi AI education)', 'https://instagram.com/princeofai/'],
      ['fa-youtube-play', 'Farsi AI mini-course', 'https://www.youtube.com/watch?v=ykIbUBQ87Ww&list=PLH8sm6beVh0c'],
      ['fa-podcast', 'AI for Autism (BBC)', 'https://www.bbc.co.uk/sounds/play/m0023dsw'],
      ['fa-youtube-play', 'From AI to Life Lessons', 'https://youtu.be/j61gU7QDztE'],
      ['fa-medium', 'Success Studio blog', 'https://amirhkarimi.medium.com/']
    ]},
    { k: 'stu', name: 'Students', slogan: 'Build AI', icon: '\uf19d', fa: 'fa-graduation-cap', color: '#5A8F1E', count: '~1,000 taught', x: 285, y: 95, side: 'r', items: [
      ['fa-map-o', 'The AI Learning Map', 'https://teaching.amirhkarimi.com'],
      ['fa-youtube-play', 'Machine Learning Essentials (YouTube)', 'https://www.youtube.com/channel/UCNCjX-fsGlbJ3SWCSx-P2pw/playlists'],
      ['fa-youtube-play', 'Dimensionality Reduction', 'https://www.youtube.com/watch?v=P7sxhm6AYjo&ab_channel=Amir-HosseinKarimi']
    ]},
    { k: 'lead', name: 'Leaders', slogan: 'Lead with AI', icon: '\uf0b1', fa: 'fa-briefcase', color: '#C99700', count: '~100 reached', x: 200, y: 150, side: 'l', items: [
      ['fa-institution', 'House of Commons PROC testimony on AI', 'https://www.youtube.com/watch?v=WtP1FCMhsBE&t=2s'],
      ['fa-building', 'AI-CTO program, University of Waterloo (WatSPEED)', 'https://watspeed.uwaterloo.ca/programs-and-courses/course-chief-technology-ai-officer-program.html']
    ]},
    { k: 'sch', name: 'Scholars', slogan: 'Advance AI', icon: '\uf0c3', fa: 'fa-flask', color: '#2F7BC4', count: '~10 mentored', x: 365, y: 205, side: 'l', items: [
      ['fa-flask', 'CHARM Lab', '/research/'],
      ['fa-youtube-play', 'Algorithmic Recourse (TMLS 2024)', 'https://www.youtube.com/watch?v=amgBv-E3-sQ&list=PLH-rpi_agJT1SxLbG_VIxwMBWWsLmrTBk'],
      ['fa-sitemap', 'Causal Explainable AI (KDD 2023)', 'https://sites.google.com/asu.edu/kdd-2023-tutorial/home'],
      ['fa-users', 'CausEthical ML workshop (ELLIS 2022)', 'https://sites.google.com/view/uds-causethical-ml-seminar/home'],
      ['fa-microphone', 'Invited talks: MIT, Harvard, ETH Zurich, CMU Qatar, Google DeepMind (2021)', 'https://www.youtube.com/watch?v=KLbjQk6lW2c']
    ]}
  ];
  var R = 24;
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var a in attrs) e.setAttribute(a, attrs[a]); if (parent) parent.appendChild(e); return e; }
  A.forEach(function (d, i) {
    var b = el('g', { 'class': 'aud-bub', tabindex: '0', role: 'button', 'aria-label': d.name + ': ' + d.slogan, 'data-k': d.k }, g);
    el('circle', { cx: d.x, cy: d.y, r: R + 6, fill: d.color, 'fill-opacity': '0.12' }, b);
    el('circle', { cx: d.x, cy: d.y, r: R + 2, fill: 'none', stroke: d.color, 'stroke-width': '1.5', 'class': 'aud-halo', style: 'animation-delay:' + (i * 0.65) + 's' }, b);
    el('circle', { cx: d.x, cy: d.y, r: R, fill: d.color, 'fill-opacity': '0.28', stroke: d.color, 'stroke-width': '1' }, b);
    var ic = el('text', { x: d.x, y: d.y, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'class': 'aud-icon', fill: d.color, 'aria-hidden': 'true' }, b);
    ic.textContent = d.icon; d.ic = ic;
    var tx = d.side === 'r' ? d.x + R + 10 : d.x - R - 10, an = d.side === 'r' ? 'start' : 'end';
    el('text', { x: tx, y: d.y - 2, 'text-anchor': an, 'class': 'aud-name' }, g).textContent = d.name;
    el('text', { x: tx, y: d.y + 14, 'text-anchor': an, 'class': 'aud-slogan' }, g).textContent = d.slogan;
    d.node = b;
  });
  // Center each glyph on its actual ink (measured with canvas), not the font's em box.
  var ctx = document.createElement('canvas').getContext('2d');
  function centerIcons() {
    ctx.font = '20px FontAwesome'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    A.forEach(function (d) {
      var m = ctx.measureText(d.icon);
      if (!m.actualBoundingBoxAscent && !m.actualBoundingBoxDescent) return;
      d.ic.removeAttribute('dominant-baseline');
      d.ic.setAttribute('x', d.x - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2);
      d.ic.setAttribute('y', d.y + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);
    });
  }
  if (document.fonts && document.fonts.load) {
    document.fonts.load('20px FontAwesome').then(centerIcons, centerIcons);
    document.fonts.ready.then(centerIcons);
  } else { window.addEventListener('load', centerIcons); }

  // Google Analytics: one 'select_audience' per audience and method per page view
  // (so hovering back and forth doesn't flood GA), and every panel link click.
  var sent = {};
  function ga(name, params) { if (typeof window.gtag === 'function') window.gtag('event', name, params); }
  function track(d, method) {
    if (!method || sent[d.k + method]) return;
    sent[d.k + method] = true;
    ga('select_audience', { audience: d.name, method: method });
  }

  var cur = null;
  function show(d, method) {
    track(d, method);
    var h = '<h5><i class="fa ' + d.fa + '" aria-hidden="true" style="color:' + d.color + '"></i>' + d.name + '</h5><p class="s">' + d.slogan + '</p><p class="c">' + d.count + '</p><ul>';
    d.items.forEach(function (it) {
      var label = it[2] ? '<a href="' + it[2] + '"' + (it[2].charAt(0) === '/' ? '' : ' target="_blank" rel="noopener"') + '>' + it[1] + '</a>' : it[1];
      h += '<li><i class="fa ' + it[0] + '" aria-hidden="true"></i><span>' + label + '</span></li>';
    });
    pop.classList.remove('show'); void pop.offsetWidth;
    pop.innerHTML = h + '</ul>'; pop.classList.add('show'); cur = d.k;
    A.forEach(function (x) { x.node.classList.toggle('on', x.k === d.k); });
  }
  A.forEach(function (d) {
    d.node.addEventListener('mouseenter', function () { if (cur !== d.k) show(d, 'hover'); });
    d.node.addEventListener('click', function () { show(d, 'click'); });
    d.node.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(d, 'keyboard'); } });
  });
  pop.addEventListener('click', function (e) {
    var a = e.target.closest('a'); if (!a) return;
    var sel = A.filter(function (x) { return x.k === cur; })[0];
    ga('click_audience_item', { audience: sel ? sel.name : cur, label: a.textContent.trim(), href: a.getAttribute('href') });
  });
  show(A[3]);
})();
