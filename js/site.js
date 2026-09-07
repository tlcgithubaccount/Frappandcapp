/* Frapp & Capp site script. Progressive enhancement only: every page reads
   fully without this file. Modules: nav toggle, reading controls, live open
   status, print-in indices, order builder, forms, video facade. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var body = document.body;

  /* ---------- Nav toggle ---------- */
  var toggle = document.getElementById('navtoggle');
  var nav = document.getElementById('nav');
  function setNav(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setNav(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(e.target) && !toggle.contains(e.target)) setNav(false);
    });
  }

  /* ---------- Reading controls (persist in localStorage) ---------- */
  function setPref(key, attr, value, on) {
    if (on) doc.setAttribute(attr, value); else doc.removeAttribute(attr);
    try { if (on) localStorage.setItem(key, value); else localStorage.removeItem(key); } catch (e) {}
  }
  function bindToggle(id, key, attr, value) {
    var b = document.getElementById(id);
    if (!b) return;
    b.setAttribute('aria-pressed', doc.getAttribute(attr) === value ? 'true' : 'false');
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      setPref(key, attr, value, on);
    });
  }
  bindToggle('toggle-text', 'fc-text', 'data-text', 'big');
  bindToggle('toggle-contrast', 'fc-contrast', 'data-contrast', 'high');

  /* ---------- Live open status ---------- */
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function sydneyNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', weekday: 'long', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      return { day: DAYS.indexOf(o.weekday), mins: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
    } catch (e) { return null; }
  }
  function toMins(hhmm) { var p = hhmm.split(':'); return parseInt(p[0], 10) * 60 + parseInt(p[1] || '0', 10); }
  function fmt(hhmm) {
    var m = toMins(hhmm), h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'pm' : 'am';
    h = h % 12; if (h === 0) h = 12;
    return h + (mm ? ':' + (mm < 10 ? '0' : '') + mm : '') + ap;
  }
  function statusFor(el, now) {
    var opens = el.getAttribute('data-opens') || '09:30', closes = el.getAttribute('data-closes') || '15:00';
    var days = (el.getAttribute('data-days') || '1,2,3,4,5').split(',').map(function (d) { return parseInt(d, 10); });
    var open = toMins(opens), close = toMins(closes), today = days.indexOf(now.day) > -1;
    if (today && now.mins >= open && now.mins < close) return { state: 'open', text: 'Open now, until ' + fmt(closes) };
    if (today && now.mins < open) return { state: 'closed', text: 'Opens today at ' + fmt(opens) };
    var next = null, i;
    for (i = 1; i <= 7; i++) { var d = (now.day + i) % 7; if (days.indexOf(d) > -1) { next = d; break; } }
    if (next === null) return { state: 'closed', text: 'Closed' };
    var when = (next === (now.day + 1) % 7) ? 'tomorrow' : DAYS[next];
    return { state: 'closed', text: (today ? 'Closed now' : 'Closed today') + ', opens ' + when + ' ' + fmt(opens) };
  }
  function updateStatus() {
    var now = sydneyNow(); if (!now) return;
    var els = document.querySelectorAll('[data-open-status]');
    for (var i = 0; i < els.length; i++) {
      var s = statusFor(els[i], now);
      els[i].textContent = s.text;
      els[i].setAttribute('data-state', s.state);
    }
    var todayRows = document.querySelectorAll('.hours .line[data-day]');
    for (var j = 0; j < todayRows.length; j++) todayRows[j].classList.toggle('today', parseInt(todayRows[j].getAttribute('data-day'), 10) === now.day);
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Print-in: index children that have no --i yet ---------- */
  var prints = document.querySelectorAll('.print');
  for (var p = 0; p < prints.length; p++) {
    var kids = prints[p].children;
    for (var k = 0; k < kids.length; k++) if (!kids[k].style.getPropertyValue('--i')) kids[k].style.setProperty('--i', k);
  }

  /* ---------- Order builder (any page with #menu-list and #order-items JSON) ---------- */
  var list = document.getElementById('menu-list'), itemsEl = document.getElementById('order-items');
  if (list && itemsEl) {
    var data = {};
    try { data = JSON.parse(itemsEl.textContent); } catch (e) { data = {}; }
    var ITEMS = data.items || [], SKILLS = data.skills || {}, ALT = typeof data.altMilk === 'number' ? data.altMilk : 0.8;
    var qty = {}; ITEMS.forEach(function (it) { if (it.start) qty[it.id] = it.start; });
    var lines = document.getElementById('docket-lines'), total = document.getElementById('docket-total'), skills = document.getElementById('docket-skills'), alt = document.getElementById('altmilk');
    function money(v) { return v.toFixed(2); }
    function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
    function renderList() {
      var h = '';
      ITEMS.forEach(function (it) {
        if (it.group) h += '<li class="group">' + esc(it.group) + '</li>';
        h += '<li class="item"><span class="nm">' + esc(it.name) + (it.note ? '<small>' + esc(it.note) + '</small>' : '') + '</span>' +
          '<span class="pr">' + (it.price === null ? 'Ask' : money(it.price)) + '</span>' +
          '<span class="qty"><button type="button" data-id="' + esc(it.id) + '" data-d="-1" aria-label="Remove one ' + esc(it.name) + '">&minus;</button>' +
          '<output id="q-' + esc(it.id) + '" aria-label="' + esc(it.name) + ' quantity">' + (qty[it.id] || 0) + '</output>' +
          '<button type="button" data-id="' + esc(it.id) + '" data-d="1" aria-label="Add one ' + esc(it.name) + '">+</button></span></li>';
      });
      list.innerHTML = h;
    }
    function renderDocket() {
      var h = '', sum = 0, milkQty = 0, set = {}, order = [], any = false;
      ITEMS.forEach(function (it) {
        var q = qty[it.id] || 0; if (!q) return; any = true;
        var amt = it.price === null ? 'Ask' : money(it.price * q);
        if (it.price !== null) sum += it.price * q;
        if ((it.skills || []).indexOf('milk') > -1) milkQty += q;
        (it.skills || []).forEach(function (key) { (SKILLS[key] || []).forEach(function (s) { if (!set[s]) { set[s] = true; order.push(s); } }); });
        h += '<div class="line"><span class="q">' + q + '</span><span class="lbl">' + esc(it.name) + '</span><span class="dots"></span><span class="amt">' + amt + '</span></div>';
      });
      if (alt && alt.checked && milkQty) { sum += ALT * milkQty; h += '<div class="line"><span class="q">' + milkQty + '</span><span class="lbl">Alt milk</span><span class="dots"></span><span class="amt">' + money(ALT * milkQty) + '</span></div>'; }
      if (!any) h = '<div class="line empty"><span class="lbl">Nothing yet. Add something.</span></div>';
      if (lines) lines.innerHTML = h;
      if (total) total.textContent = money(sum);
      if (skills) {
        var sh = ''; order.forEach(function (s) { sh += '<li>' + esc(s) + '</li>'; });
        if (data.baseSkill) sh += '<li class="base">' + esc(data.baseSkill) + '</li>';
        skills.innerHTML = sh;
      }
    }
    list.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var id = b.getAttribute('data-id'), d = parseInt(b.getAttribute('data-d'), 10);
      qty[id] = Math.max(0, Math.min(9, (qty[id] || 0) + d));
      var out = document.getElementById('q-' + id); if (out) out.textContent = qty[id];
      renderDocket();
    });
    if (alt) alt.addEventListener('change', renderDocket);
    renderList(); renderDocket();
  }

  /* ---------- Forms: post JSON to the configured endpoint, else honest mailto fallback ---------- */
  var endpoint = (body.getAttribute('data-form-endpoint') || '').trim();
  var siteEmail = body.getAttribute('data-email') || '';
  var forms = document.querySelectorAll('form[data-form]');
  function setStatus(form, state, text) {
    var s = form.querySelector('.form-status');
    if (!s) { s = document.createElement('p'); s.className = 'form-status'; s.setAttribute('role', 'status'); s.setAttribute('aria-live', 'polite'); form.appendChild(s); }
    s.setAttribute('data-state', state); s.textContent = text;
  }
  function validate(form) {
    var ok = true;
    var fields = form.querySelectorAll('[required]');
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i], wrap = f.closest('.field'), err = wrap ? wrap.querySelector('.err') : null;
      var bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      if (wrap) wrap.classList.toggle('error', bad);
      if (err) err.textContent = bad ? (f.type === 'email' ? 'Enter an email address we can reply to.' : 'This one is needed.') : '';
      if (bad && ok) { f.focus(); ok = false; }
    }
    return ok;
  }
  for (var fi = 0; fi < forms.length; fi++) {
    (function (form) {
      form.setAttribute('novalidate', '');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (form.querySelector('.hp input') && form.querySelector('.hp input').value) return;
        if (!validate(form)) { setStatus(form, 'error', 'A couple of fields need attention above.'); return; }
        var fd = new FormData(form), payload = {}, lines = [];
        fd.forEach(function (v, k) { if (k !== 'website') { payload[k] = v; lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ': ' + v); } });
        payload.form = form.getAttribute('data-form'); payload.page = location.href;
        var btn = form.querySelector('[type="submit"]');
        if (endpoint) {
          if (btn) btn.setAttribute('aria-disabled', 'true');
          setStatus(form, 'sending', 'Sending your message.');
          fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r; })
            .then(function () { setStatus(form, 'ok', 'Sent. A real person from the team will get back to you.'); form.reset(); })
            .catch(function () { setStatus(form, 'error', 'That did not send. Please email us directly at ' + siteEmail + ' and we will reply.'); })
            .then(function () { if (btn) btn.removeAttribute('aria-disabled'); });
        } else {
          var subject = form.getAttribute('data-mailto-subject') || 'Website enquiry';
          location.href = 'mailto:' + siteEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
          setStatus(form, 'ok', 'Your email app should open with this message ready to send. If it did not, email us at ' + siteEmail + '.');
        }
      });
    })(forms[fi]);
  }

  /* ---------- Video facade: swap poster button for the embed on click ---------- */
  var vids = document.querySelectorAll('.video[data-video]');
  for (var vi = 0; vi < vids.length; vi++) {
    (function (box) {
      var btn = box.querySelector('.video-play'); if (!btn) return;
      btn.addEventListener('click', function () {
        var id = box.getAttribute('data-video'), title = box.getAttribute('data-title') || 'Video';
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
        f.title = title; f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'; f.setAttribute('allowfullscreen', '');
        box.innerHTML = ''; box.appendChild(f);
      });
    })(vids[vi]);
  }
})();
