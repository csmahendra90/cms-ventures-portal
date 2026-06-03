// js/utils.js — Shared helpers

function badge(text, cls) {
  return `<span class="badge ${cls}">${text}</span>`;
}

function stageBadge(stage) {
  const map = {
    'Screening':     'badge-screening',
    'Due Diligence': 'badge-duedil',
    'Term Sheet':    'badge-termsheet',
    'Invested':      'badge-invested',
    'Passed':        'badge-passed',
  };
  return badge(stage, map[stage] || 'badge-neutral');
}

function prioBadge(p) {
  return badge(p, p === 'High' ? 'badge-high' : p === 'Medium' ? 'badge-medium' : 'badge-low');
}

function roleBadge(r) {
  const m = { Partner:'badge-partner', VP:'badge-vp', Associate:'badge-associate', Analyst:'badge-analyst', Intern:'badge-intern' };
  return badge(r, m[r] || 'badge-neutral');
}

function scoreBar(score, width = 52) {
  return `<span style="font-weight:500;">${score}</span>
    <span class="score-bar-bg" style="width:${width}px;margin-left:6px;">
      <span class="score-bar-fill" style="width:${score}%;display:block;height:100%;"></span>
    </span>`;
}

function dueLabel(due, done) {
  if (done) return '';
  if (due < '2026-04-01') return `<span style="color:var(--red);font-size:11px;font-weight:500;">Overdue</span>`;
  if (due === '2026-04-01') return `<span style="color:var(--amber);font-size:11px;font-weight:500;">Due today</span>`;
  return `<span style="color:var(--text3);font-size:11px;">${due.slice(5).replace('-','/')}</span>`;
}

function avatar(init, bg, tc, size = 34) {
  return `<div class="av" style="background:${bg};color:${tc};width:${size}px;height:${size}px;font-size:${Math.round(size*0.35)}px;">${init}</div>`;
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function fmtCr(v) { return '₹' + parseFloat(v).toFixed(1) + ' Cr'; }
function fmtPct(v) { return parseFloat(v).toFixed(1) + '%'; }

function progBar(pct, color = '#1a1a18', height = 6) {
  return `<div class="prog-bg" style="height:${height}px;">
    <div class="prog-fill" style="width:${pct}%;background:${color};height:${height}px;"></div>
  </div>`;
}

function switchInnerTab(secPrefix, name, el) {
  el.closest('.inner-tabs').querySelectorAll('.itab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll(`[id^="${secPrefix}-"]`).forEach(s => {
    s.classList.toggle('sec-hidden', s.id !== `${secPrefix}-${name}`);
  });
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
