(function () {
  var root = document.getElementById('audience-map');
  if (!root) return;
  var pyr = document.getElementById('aud-pyr'), head = document.getElementById('aud-head'), grid = document.getElementById('aud-cards');

  // Layers top (frontier) to bottom (public). Width = lifetime audience (log scale).
  // Item types set the card style: paper, video, podcast, ticket, social, cert, map, lab.
  var L = [
    { k: 'sch', name: 'Scholars', tag: 'frontiers', slogan: 'Advance AI', count: '~10', glyph: '\uf0c3', icon: 'fa-flask', rgb: '55,138,221', dk: '#1f6db5', items: [
      ['lab', 'CHARM Lab', 'Research, people, and how to join', '/research/'],
      ['video', 'Algorithmic Recourse', 'TMLS 2024 tutorial', 'https://www.youtube.com/watch?v=amgBv-E3-sQ&list=PLH-rpi_agJT1SxLbG_VIxwMBWWsLmrTBk', 'tmls-recourse'],
      ['cover', 'Causal Explainable AI', 'KDD 2023 tutorial', 'https://sites.google.com/asu.edu/kdd-2023-tutorial/home', 'kdd-2023'],
      ['ticket', 'CausEthical ML', 'ELLIS 2022 workshop', 'https://sites.google.com/view/uds-causethical-ml-seminar/home'],
      ['video', 'Invited talks', 'MIT, Harvard, ETH Zurich, CMU Qatar, Google DeepMind (2021)', 'https://www.youtube.com/watch?v=KLbjQk6lW2c', 'invited-talks']
    ]},
    { k: 'lead', name: 'Leaders', tag: 'strategic', slogan: 'Lead with AI', count: '~100', glyph: '\uf0b1', icon: 'fa-briefcase', rgb: '184,132,43', dk: '#8a5f17', items: [
      ['video', 'PROC testimony on AI', 'House of Commons of Canada', 'https://www.youtube.com/watch?v=WtP1FCMhsBE&t=2s', 'proc-testimony'],
      ['cover', 'AI-CTO program', 'WatSPEED, University of Waterloo', 'https://watspeed.uwaterloo.ca/programs-and-courses/course-chief-technology-ai-officer-program.html', 'ai-cto']
    ]},
    { k: 'stu', name: 'Students', tag: 'foundations', slogan: 'Build AI', count: '~1,000', glyph: '\uf19d', icon: 'fa-graduation-cap', rgb: '99,153,34', dk: '#3b6d11', items: [
      ['map', 'The AI Learning Map', 'teaching.amirhkarimi.com', 'https://teaching.amirhkarimi.com'],
      ['video', 'Machine Learning Essentials', 'YouTube course', 'https://www.youtube.com/playlist?list=PLx_aA2L2NMhNyPMCnl177ZBVD6C8lhSYj', 'ml-essentials'],
      ['video', 'Dimensionality Reduction', 'YouTube', 'https://www.youtube.com/watch?v=P7sxhm6AYjo&ab_channel=Amir-HosseinKarimi', 'dimensionality-reduction']
    ]},
    { k: 'pub', name: 'Public', tag: 'basic', slogan: 'Use AI', count: '~10,000', glyph: '\uf0ac', icon: 'fa-globe', rgb: '242,140,40', dk: '#a9530c', items: [
      ['social', 'Prince of AI', 'Farsi AI education on Instagram', 'https://instagram.com/princeofai/'],
      ['video', 'Farsi AI mini-course', 'YouTube', 'https://www.youtube.com/watch?v=ykIbUBQ87Ww&list=PLH8sm6beVh0c', 'farsi-minicourse'],
      ['podcast', 'AI for Autism', 'BBC Sounds', 'https://www.bbc.co.uk/sounds/play/m0023dsw'],
      ['video', 'From AI to Life Lessons', 'YouTube', 'https://youtu.be/j61gU7QDztE', 'ai-life-lessons'],
      ['paper', 'Success Studio', 'Medium blog', 'https://amirhkarimi.medium.com/']
    ]}
  ];

  function rgba(c, a) { return 'rgba(' + c + ',' + a + ')'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  function visual(t, d, img) {
    var tint = rgba(d.rgb, 0.14), i, s = '';
    if (img) {
      return '<div class="aud-vis aud-img"><img src="/assets/covers/' + img + '.jpg" alt="" loading="lazy" decoding="async">' +
        (t === 'video' ? '<span class="aud-play"><i class="fa fa-play" aria-hidden="true"></i></span>' : '') + '</div>';
    }
    switch (t) {
      case 'paper':
        return '<div class="aud-vis" style="background:var(--aud-neutral)"><span class="aud-pin" style="background:' + d.dk + '"></span><div class="aud-sheet"><i></i><i></i><i></i><i></i><i></i><i style="width:60%"></i></div></div>';
      case 'video':
        for (i = 0; i < 9; i++) s += '<b></b>';
        return '<div class="aud-vis aud-film"><div class="aud-sp" style="top:6px">' + s + '</div><div class="aud-play"><i class="fa fa-play" aria-hidden="true"></i></div><div class="aud-sp" style="bottom:6px">' + s + '</div></div>';
      case 'podcast':
        [10, 22, 34, 18, 42, 28, 14, 36, 24, 12, 30, 20, 8].forEach(function (h) { s += '<b style="height:' + h + 'px;background:' + d.dk + '"></b>'; });
        return '<div class="aud-vis" style="background:' + tint + '"><div class="aud-wave">' + s + '</div></div>';
      case 'ticket':
        return '<div class="aud-vis" style="background:' + tint + '"><div class="aud-ticket" style="color:' + d.dk + ';border:1px dashed ' + d.dk + '">ADMIT ONE</div><style>#audience-map .aud-ticket::before,#audience-map .aud-ticket::after{background:' + tint + '}</style></div>';
      case 'social':
        return '<div class="aud-vis" style="background:' + tint + '"><div class="aud-phone" style="border-color:' + d.dk + '"><span class="av" style="background:' + d.dk + '"></span><i style="background:' + d.dk + '"></i><i style="background:' + rgba(d.rgb, 0.6) + ';width:14px"></i></div></div>';
      case 'cert':
        return '<div class="aud-vis" style="background:' + tint + '"><div class="aud-cert" style="border-color:' + d.dk + ';color:' + d.dk + '"><i class="fa fa-certificate" aria-hidden="true"></i></div></div>';
      case 'map':
        return '<div class="aud-vis" style="background:' + tint + '"><svg width="112" height="60" viewBox="0 0 112 60" aria-hidden="true"><path d="M8 50 C 30 10, 50 55, 70 25 S 100 15, 104 10" fill="none" stroke="' + d.dk + '" stroke-width="2" stroke-dasharray="3 4"/><circle cx="8" cy="50" r="4" fill="' + d.dk + '"/><circle cx="104" cy="10" r="5" fill="none" stroke="' + d.dk + '" stroke-width="2"/></svg></div>';
      default:
        return '<div class="aud-vis" style="background:' + tint + '"><i class="fa fa-flask aud-big" aria-hidden="true" style="color:' + d.dk + '"></i></div>';
    }
  }

  // Pyramid: one triangle sliced into four equal-height bands, so the sides are
  // perfectly straight. Band bottoms are at 1/4, 2/4, 3/4 and 4/4 of the base,
  // which matches each layer being 10x the audience of the one above (log scale).
  var VW = 210, VH = 184, BH = VH / 4, GAP = 4, NS = 'http://www.w3.org/2000/svg';
  function xl(y) { return VW / 2 - (VW / 2) * (y / VH); }
  function xr(y) { return VW / 2 + (VW / 2) * (y / VH); }
  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + VW + ' ' + VH);
  svg.setAttribute('class', 'aud-tri');
  svg.setAttribute('aria-hidden', 'true');
  var labels = '';
  L.forEach(function (d, i) {
    var y0 = i * BH + (i ? GAP / 2 : 0), y1 = (i + 1) * BH - (i < 3 ? GAP / 2 : 0);
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'aud-band'); g.setAttribute('data-k', d.k);
    var poly = document.createElementNS(NS, 'polygon');
    poly.setAttribute('points', [xl(y0), y0, xr(y0), y0, xr(y1), y1, xl(y1), y1].join(' '));
    poly.setAttribute('class', 'aud-poly');
    poly.style.setProperty('--on', 'rgb(' + d.rgb + ')');
    poly.style.setProperty('--off', rgba(d.rgb, 0.22));
    var ic = document.createElementNS(NS, 'text');
    ic.setAttribute('class', 'aud-ic'); ic.setAttribute('text-anchor', 'middle');
    ic.style.setProperty('--on', '#fff'); ic.style.setProperty('--off', d.dk);
    ic.textContent = d.glyph;
    d.ic = ic; d.cy = y0 + (y1 - y0) * (i === 0 ? 0.66 : 0.55);
    g.appendChild(poly); g.appendChild(ic); svg.appendChild(g);
    labels += '<div class="aud-lb" tabindex="0" role="button" data-k="' + d.k + '" aria-label="' + d.name + ': ' + d.slogan + '">' +
      '<div class="n">' + d.name + '</div><div class="s s-sm"><em>' + d.slogan + '</em></div></div>' +
      '<div class="aud-tg" data-k="' + d.k + '"><em class="sl">' + d.slogan + '</em></div>';
  });
  pyr.innerHTML = '<div class="aud-lbs">' + labels + '</div><div class="aud-tri-wrap"></div>';
  pyr.querySelector('.aud-tri-wrap').appendChild(svg);

  // Center each icon on its drawn ink (canvas measurement), not the font's em box.
  var ctx = document.createElement('canvas').getContext('2d');
  function placeIcons() {
    ctx.font = '18px FontAwesome'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    L.forEach(function (d) {
      var m = ctx.measureText(d.glyph), cx = VW / 2;
      var dx = (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2 || 0;
      var dy = ((m.actualBoundingBoxAscent || 14) - (m.actualBoundingBoxDescent || 0)) / 2;
      d.ic.setAttribute('x', cx - dx); d.ic.setAttribute('y', d.cy + dy);
    });
  }
  placeIcons();
  if (document.fonts && document.fonts.load) { document.fonts.load('18px FontAwesome').then(placeIcons, placeIcons); }

  // Google Analytics: one 'select_audience' per audience and method per page view, plus card clicks.
  var sent = {};
  function ga(name, params) { if (typeof window.gtag === 'function') window.gtag('event', name, params); }

  var cur = null;
  function show(d, method) {
    if (method && !sent[d.k + method]) { sent[d.k + method] = true; ga('select_audience', { audience: d.name, method: method }); }
    if (cur === d.k) return;
    cur = d.k;
    root.querySelectorAll('.aud-band, .aud-lb, .aud-tg').forEach(function (r) { r.classList.toggle('on', r.getAttribute('data-k') === d.k); });
    head.innerHTML = '<b style="color:' + d.dk + '">' + d.name + '</b><span>' + d.slogan + ' · ' + d.items.length + ' items</span>';
    var c = '';
    d.items.forEach(function (it, i) {
      var ext = it[3].charAt(0) !== '/';
      c += '<a class="aud-cd" href="' + esc(it[3]) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + ' style="animation-delay:' + (i * 60) + 'ms" data-audience="' + d.name + '">' +
        visual(it[0], d, it[4]) + '<p class="tt">' + esc(it[1]) + '</p><p class="mt">' + esc(it[2]) + '</p></a>';
    });
    grid.innerHTML = c;
  }

  var hoverT = null;
  root.querySelectorAll('.aud-band, .aud-lb, .aud-tg').forEach(function (el) {
    var d = L.filter(function (x) { return x.k === el.getAttribute('data-k'); })[0];
    el.addEventListener('mouseenter', function () { clearTimeout(hoverT); hoverT = setTimeout(function () { show(d, 'hover'); }, 150); });
    el.addEventListener('mouseleave', function () { clearTimeout(hoverT); });
    el.addEventListener('click', function () { show(d, 'click'); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(d, 'keyboard'); } });
  });
  grid.addEventListener('click', function (e) {
    var a = e.target.closest('a.aud-cd'); if (!a) return;
    ga('click_audience_item', { audience: a.getAttribute('data-audience'), label: a.querySelector('.tt').textContent, href: a.getAttribute('href') });
  });

  show(L[0]);
})();
