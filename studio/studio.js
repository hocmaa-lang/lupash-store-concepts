// Concept C — "Calm Studio". Catalog snapshot comes from ../assets/data.js (Shopify, 1 Nov 2026).
var Studio = (function () {
  var A = '../assets/';
  var FREE = 100;
  var L = window.LUPASH;
  var by = {};
  L.products.forEach(function (p) { by[p.id] = p; });

  // Per-product detail used by this concept. Players/time/contents come from the Shopify descriptions;
  // ratings are the Amazon star averages recorded at onboarding (no review counts, per brand rules).
  var X = {
    cbtiger:  { skill: 'Naming feelings',     tone: 'sage',   rating: 4.5, players: '2–6', time: '20–30', box: '47 cards' },
    together: { skill: 'Getting along',       tone: 'butter', rating: 4.5, players: '2–8', time: '15–30', box: '108 cards' },
    cbtrail:  { skill: 'Thoughts & feelings', tone: 'mist',   rating: 4.6, players: '2–5', time: '30–50', box: '100 cards, board, die', long: 'Travel across the land and answer questions along the road. Kids talk about confidence, worry and pride without being asked to sit down and discuss their feelings.' },
    cbtime:   { skill: 'Pride & progress',    tone: 'butter', rating: 4.4, players: '2–6', time: '30–50', box: '80 cards, board, die', long: 'Plays like Snakes and Ladders across three zones: past, present and future. Where a child lands decides what they talk about.' },
    cbtrees:  { skill: 'Having a go',         tone: 'sage',   rating: 5.0, players: '2–4', time: '20–40', box: '90 cards, 44 trees, board', long: 'Replant the forest: answer a question or take on a task to plant each tree. Real strategy, so kids play to win and the talking arrives on its own.' },
    cbtrip:   { skill: 'Understanding others', tone: 'rose',  rating: 5.0, players: '2–6', time: '20–40', box: '130 cards, 6 tokens, board', long: 'The pictures do the asking. Children respond, vote on each other’s answers and explain themselves. Works across reading levels.' },
    flash:    { skill: 'First feelings',      tone: 'sage' },
    monsters: { skill: 'Coping ideas',        tone: 'rose' },
    veg:      { skill: 'Coping ideas',        tone: 'sage',   rating: 4.6 },
    poster:   { skill: 'Daily check-in',      tone: 'lilac' },
    mworld:   { skill: 'Mindfulness',         tone: 'mist' },
    mland:    { skill: 'Calm',                tone: 'lilac',  rating: 4.6 }
  };
  var FEEL = [
    { k: 'all',   label: 'All games',              c: '#1E2A3F', ids: null },
    { k: 'anger', label: 'Anger & frustration',    c: '#E3A890', ids: ['cbtiger','monsters','veg','poster','flash'] },
    { k: 'worry', label: 'Worry',                  c: '#A9BFCC', ids: ['cbtrail','cbtiger','mland','mworld'] },
    { k: 'friends', label: 'Friendship & sharing', c: '#E8C979', ids: ['together','cbtrip','cbtrees'] },
    { k: 'confidence', label: 'Confidence',        c: '#9DB09A', ids: ['cbtrail','cbtime','cbtrees'] },
    { k: 'calm',  label: 'Calm',                   c: '#B9A7CB', ids: ['mland','mworld','poster'] },
    { k: 'first', label: 'First feelings · 3–5',   c: '#F0B48A', ids: ['flash','monsters','poster','veg'] }
  ];
  var ORDER = ['cbtiger','together','monsters','flash','cbtrail','cbtime','poster','cbtrees','cbtrip','mland','mworld','veg'];

  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  var num = function (p) { return parseFloat(String(p).replace('$', '')); };
  var money = function (n) { return '$' + n.toFixed(2); };
  var stars = function (r) { return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r)); };
  var $ = function (id) { return document.getElementById(id); };

  // ---- cart (kept per viewer in localStorage so it survives home -> product page) ----
  var cart = {};
  try { cart = JSON.parse(localStorage.getItem('lp-studio-cart') || '{}') || {}; } catch (e) { cart = {}; }
  function save() { try { localStorage.setItem('lp-studio-cart', JSON.stringify(cart)); } catch (e) {} }
  function item(id) {
    if (by[id]) return { id: id, title: by[id].title, price: num(by[id].price), img: by[id].img, tone: (X[id] || {}).tone || 'sand' };
    var b = L.bundles.filter(function (x) { return slug(x.title) === id; })[0];
    return b ? { id: id, title: b.title, price: num(b.price), img: b.img, tone: 'sand' } : null;
  }
  function slug(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
  function subtotal() { var s = 0; for (var k in cart) { var it = item(k); if (it) s += it.price * cart[k]; } return s; }
  function count() { var c = 0; for (var k in cart) c += cart[k]; return c; }
  function add(id, n) { cart[id] = (cart[id] || 0) + (n || 1); save(); renderCart(); openCart(); }
  function renderCart() {
    document.querySelectorAll('.cartN').forEach(function (e) { e.textContent = count(); });
    var sub = subtotal(), left = Math.max(0, FREE - sub);
    if (!$('drItems')) return;
    $('shipMsg').innerHTML = sub === 0 ? 'Free US shipping on orders over <b>$100</b>.' : left > 0 ? 'You’re <b>' + money(left) + '</b> away from free US shipping.' : '<b>You’ve unlocked free US shipping.</b>';
    $('shipFill').style.width = Math.min(100, sub / FREE * 100) + '%';
    var keys = Object.keys(cart);
    $('drItems').innerHTML = keys.length ? keys.map(function (k) { var it = item(k); return '<div class="dr-item"><div class="t tint-' + it.tone + '"><img src="' + A + it.img + '" alt=""></div><div><div class="n">' + esc(it.title) + '</div><div class="q">Qty ' + cart[k] + ' · <button class="notify rm" data-id="' + k + '">Remove</button></div></div><div class="p">' + money(it.price * cart[k]) + '</div></div>'; }).join('') : '<div class="dr-empty">Your cart is empty.</div>';
    $('drItems').querySelectorAll('.rm').forEach(function (b) { b.onclick = function () { delete cart[b.dataset.id]; save(); renderCart(); }; });
    // suggest in-stock games that are not in the cart yet, cheapest first, to close the gap to $100
    var ups = ['together','flash','monsters','poster','cbtiger','cbtime'].filter(function (id) { return !cart[id] && by[id].stock > 0; }).slice(0, left > 0 && sub > 0 ? 2 : 0);
    $('drUp').innerHTML = ups.length ? '<h4>Close the gap</h4>' + ups.map(function (id) { var p = by[id]; return '<div class="up"><div class="t tint-' + X[id].tone + '"><img src="' + A + p.img + '" alt=""></div><span>' + esc(p.title) + ' · ' + p.price + '</span><button data-id="' + id + '">Add</button></div>'; }).join('') : '';
    $('drUp').querySelectorAll('button').forEach(function (b) { b.onclick = function () { add(b.dataset.id); }; });
    $('drSub').textContent = money(sub);
  }
  function openCart() { $('drawer').classList.add('on'); $('scrim').classList.add('on'); $('drawer').setAttribute('aria-hidden', 'false'); }
  function closeCart() { $('drawer').classList.remove('on'); $('scrim').classList.remove('on'); $('drawer').setAttribute('aria-hidden', 'true'); }
  function wireChrome() {
    document.querySelectorAll('.cart-open').forEach(function (b) { b.onclick = openCart; });
    $('scrim').onclick = closeCart;
    document.querySelector('.dr-close').onclick = closeCart;
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeCart(); var q = $('quiz'); if (q) q.classList.remove('on'); } });
    renderCart();
  }
  function wireAdds(root) {
    root.querySelectorAll('.add').forEach(function (b) { b.onclick = function (e) { e.preventDefault(); add(b.dataset.id); }; });
    root.querySelectorAll('.ping').forEach(function (b) { b.onclick = function (e) { e.preventDefault(); b.textContent = 'We’ll email you'; }; });
  }

  // ---- cards ----
  function card(id) {
    var p = by[id], x = X[id], ins = p.stock > 0;
    var tag = !ins ? '<span class="pc-tag out">Back soon</span>' : p.stock <= 10 ? '<span class="pc-tag low">Only ' + p.stock + ' left</span>' : '';
    var href = id === 'cbtiger' ? 'product.html' : '#feelings';
    return '<article class="pc' + (ins ? '' : ' pc-out') + '"><div class="pc-media"><a href="' + href + '" class="pc-tile tint-' + x.tone + '"><img src="' + A + p.img + '" alt="' + esc(p.title) + '">' + tag + '</a>' +
      (ins ? '<button class="pc-quick add" data-id="' + id + '">Quick add</button>' : '') + '</div>' +
      '<span class="pill pill-' + x.tone + '">' + esc(x.skill) + '</span><a href="' + href + '" class="pc-name">' + esc(p.title) + '</a>' +
      '<div class="pc-meta"><span>' + p.age + (x.rating ? ' · <span class="stars" aria-label="' + x.rating + ' out of 5 on Amazon">★</span> ' + x.rating.toFixed(1) : '') + '</span>' +
      (ins ? '<span class="pc-price">' + p.price + '</span>' : '<button class="notify ping">Notify me</button>') + '</div></article>';
  }

  var feel = 'all';
  function renderGrid() {
    $('chips').innerHTML = FEEL.map(function (f) { return '<button class="chip" aria-pressed="' + (feel === f.k) + '" data-k="' + f.k + '"><i style="background:' + f.c + '"></i>' + esc(f.label) + '</button>'; }).join('');
    $('chips').querySelectorAll('.chip').forEach(function (c) { c.onclick = function () { feel = c.dataset.k; renderGrid(); }; });
    var f = FEEL.filter(function (x) { return x.k === feel; })[0];
    var ids = ORDER.filter(function (id) { return !f.ids || f.ids.indexOf(id) >= 0; });
    ids.sort(function (a, b) { return (by[b].stock > 0) - (by[a].stock > 0); });
    var inS = ids.filter(function (id) { return by[id].stock > 0; }).length;
    $('count').textContent = ids.length + ' games · ' + inS + ' ready to ship';
    $('grid').innerHTML = ids.map(card).join('');
    wireAdds($('grid'));
  }

  function renderBoards() {
    $('boardsGrid').innerHTML = ['cbtrail','cbtime','cbtrees','cbtrip'].map(function (id) {
      var p = by[id], x = X[id], ins = p.stock > 0;
      return '<article class="bd' + (ins ? '' : ' pc-out') + '"><div class="bd-img tint-' + x.tone + '"><img src="' + A + p.img + '" alt="' + esc(p.title) + ' box">' + (!ins ? '<span class="pc-tag out">Back soon</span>' : p.stock <= 10 ? '<span class="pc-tag low">Only ' + p.stock + ' left</span>' : '') + '</div>' +
        '<div class="bd-body"><span class="pill pill-' + x.tone + '">' + esc(x.skill) + '</span><h3 class="bd-name">' + p.title + '</h3><p class="bd-line">' + esc(x.long) + '</p>' +
        '<div class="specs"><div><b>' + x.players + '</b>players</div><div><b>' + x.time + '</b>minutes</div><div><b>' + p.age.replace('Ages ', '') + '</b>ages</div></div>' +
        '<div class="bd-foot"><span class="bd-price">' + p.price + '</span>' + (ins ? '<button class="btn btn-ink btn-sm add" data-id="' + id + '">Add to cart</button>' : '<button class="btn btn-line btn-sm ping">Notify me</button>') + '</div></div></article>';
    }).join('');
    wireAdds($('boardsGrid'));
  }

  function renderBundles() {
    var tones = ['butter','rose','sage','lilac','mist','sand'];
    var bs = L.bundles.slice().sort(function (a, b) { return (b.stock > 0) - (a.stock > 0); });
    $('bundleGrid').innerHTML = bs.map(function (b, i) {
      var ins = b.stock > 0, id = slug(b.title);
      return '<article class="bn' + (ins ? '' : ' bn-out') + '"><div class="bn-tile tint-' + tones[i] + '"><img src="' + A + b.img + '" alt="' + esc(b.title) + '"><span class="save">Save ' + b.save + '</span>' + (ins ? '' : '<span class="pc-tag out" style="left:auto;right:14px">Back soon</span>') + '</div>' +
        '<h3 class="pc-name">' + esc(b.title) + '</h3><p style="margin:0;color:var(--ink2);font-size:14.5px">' + esc(b.line) + '</p>' +
        '<div class="pc-meta"><span class="pc-price">' + b.price + '<span class="was">' + b.was + '</span></span>' + (ins ? '<button class="btn btn-ink btn-sm add" data-id="' + id + '">Add</button>' : '<button class="notify ping">Notify me</button>') + '</div></article>';
    }).join('');
    wireAdds($('bundleGrid'));
  }

  function renderRatings() {
    $('ratings').innerHTML = ['cbtiger','together','cbtrail','mland'].map(function (id) {
      var x = X[id];
      return '<div class="rt"><span class="rt-n">' + x.rating.toFixed(1) + '</span><span class="stars" aria-hidden="true">' + stars(x.rating) + '</span><span class="rt-g">' + by[id].title + '</span><span class="rt-s">Average star rating on Amazon</span></div>';
    }).join('');
  }

  // ---- quiz ----
  var qa = {};
  function quizOpen() { qa = {}; quizStep(); $('quiz').classList.add('on'); }
  function quizStep() {
    var body = $('quizBody');
    if (!qa.age) {
      body.innerHTML = '<p class="q-step">Step 1 of 2</p><h3 class="q-title">How old is the child you’re shopping for?</h3><div class="q-opts">' +
        [['3-5','3 to 5'],['6-8','6 to 8'],['9-14','9 to 14'],['group','A group or classroom']].map(function (o) { return '<button class="q-opt" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>';
      body.querySelectorAll('.q-opt').forEach(function (b) { b.onclick = function () { qa.age = b.dataset.v; quizStep(); }; });
    } else if (!qa.feel) {
      body.innerHTML = '<p class="q-step">Step 2 of 2</p><h3 class="q-title">What would you most like to help with?</h3><div class="q-opts">' +
        FEEL.slice(1, 6).map(function (f) { return '<button class="q-opt" data-v="' + f.k + '"><i style="background:' + f.c + '"></i>' + esc(f.label) + '</button>'; }).join('') + '<button class="q-opt" data-v="all"><i style="background:#1E2A3F"></i>A bit of everything</button></div>';
      body.querySelectorAll('.q-opt').forEach(function (b) { b.onclick = function () { qa.feel = b.dataset.v; quizStep(); }; });
    } else {
      var f = FEEL.filter(function (x) { return x.k === qa.feel; })[0];
      var ids = ORDER.filter(function (id) {
        var p = by[id];
        var ageOk = qa.age === 'group' ? ['together','cbtrip','cbtiger','cbtrees','cbtime','cbtrail'].indexOf(id) >= 0 : p.ages.indexOf(qa.age) >= 0;
        return ageOk && (!f.ids || f.ids.indexOf(id) >= 0);
      });
      ids.sort(function (a, b) { return (by[b].stock > 0) - (by[a].stock > 0); });
      if (!ids.length) ids = ['cbtiger', 'together'];
      body.innerHTML = '<p class="q-step">Your matches</p><h3 class="q-title">We’d <em>start</em> here.</h3><div class="q-res">' + ids.slice(0, 2).map(card).join('') + '</div><div style="margin-top:24px"><button class="link-arrow" id="qAgain">Start over</button></div>';
      wireAdds(body);
      $('qAgain').onclick = function () { qa = {}; quizStep(); };
    }
  }

  function home() {
    wireChrome();
    renderGrid(); renderBoards(); renderBundles(); renderRatings();
    wireAdds(document.querySelector('.hero'));
    document.querySelectorAll('.quiz-open').forEach(function (b) { b.onclick = quizOpen; });
    document.querySelector('.q-close').onclick = function () { $('quiz').classList.remove('on'); };
    $('quiz').onclick = function (e) { if (e.target === $('quiz')) $('quiz').classList.remove('on'); };
    document.querySelectorAll('.age').forEach(function (a) { a.addEventListener('click', function () { if (a.dataset.feel) { feel = a.dataset.feel; renderGrid(); } }); });
  }

  function product() {
    wireChrome();
    var base = num(by.cbtiger.price), q = 1;
    function upd() {
      var extra = 0;
      document.querySelectorAll('.set-pick input').forEach(function (c) { if (c.checked) extra += num(by[c.value].price); });
      var tot = base * q + extra, left = FREE - tot;
      $('qty').textContent = q;
      $('setTotal').textContent = money(tot);
      $('setShip').innerHTML = left > 0 ? 'Add <b>' + money(left) + '</b> more for free US shipping' : '<b>Free US shipping unlocked</b>';
      $('setFill').style.width = Math.min(100, tot / FREE * 100) + '%';
      var n = document.querySelectorAll('.set-pick input:checked').length;
      document.querySelectorAll('.atc').forEach(function (b) { b.textContent = n ? 'Add ' + (n + 1) + ' games · ' + money(tot) : 'Add to cart · ' + money(tot); });
    }
    $('inc').onclick = function () { q = Math.min(5, q + 1); upd(); };
    $('dec').onclick = function () { q = Math.max(1, q - 1); upd(); };
    document.querySelectorAll('.set-pick input').forEach(function (c) { c.onchange = upd; });
    document.querySelectorAll('.atc').forEach(function (b) { b.onclick = function () {
      cart.cbtiger = (cart.cbtiger || 0) + q;
      document.querySelectorAll('.set-pick input:checked').forEach(function (c) { cart[c.value] = (cart[c.value] || 0) + 1; });
      save(); renderCart(); openCart();
    }; });
    document.querySelectorAll('.thumb').forEach(function (t) { t.onclick = function () {
      var m = $('mainImg'); m.src = t.dataset.src; m.className = t.dataset.fit === 'cover' ? 'main cover' : 'main';
      document.querySelectorAll('.thumb').forEach(function (x) { x.setAttribute('aria-pressed', x === t); });
    }; });
    upd();
    $('related').innerHTML = ['together','flash','cbtrail','monsters'].map(card).join('');
    wireAdds($('related'));
  }

  return { home: home, product: product };
})();
