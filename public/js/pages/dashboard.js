// js/pages/dashboard.js
async function renderDashboard() {
  const [dealsRes, kpisRes, portfolioRes] = await Promise.all([
    API.get('/api/deals'),
    API.get('/api/analytics/kpis'),
    API.get('/api/portfolio/summary'),
  ]);

  const deals = dealsRes?.data || [];
  const kpis  = kpisRes?.data  || {};
  const port  = portfolioRes?.data || {};
  const recent = deals.slice(0, 5);

  document.getElementById('page-content').innerHTML = `
    <div class="toprow">
      <div>
        <div class="page-title">Dashboard</div>
        <div class="page-sub">March 2026 · Q4 Review</div>
      </div>
      <div class="toprow-actions">
        <button class="btn" onclick="navigate('pipeline')">View pipeline</button>
        <button class="btn btn-primary" onclick="navigate('pipeline')">+ New application</button>
      </div>
    </div>

    <div class="mrow mrow-4">
      <div class="met"><div class="met-label">Total AUM</div><div class="met-val">₹${kpis.totalAUM || 284} Cr</div><div class="met-sub up">+18% YoY</div></div>
      <div class="met"><div class="met-label">Active deals</div><div class="met-val">${deals.length}</div><div class="met-sub">Across all stages</div></div>
      <div class="met"><div class="met-label">Portfolio cos.</div><div class="met-val">${kpis.portfolioCos || 23}</div><div class="met-sub">2 exits YTD</div></div>
      <div class="met"><div class="met-label">Portfolio value</div><div class="met-val">₹${port.totalValue || 218} Cr</div><div class="met-sub up">${port.avgMoic || 2.26}x MOIC</div></div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-head">
          <div class="card-title">Active pipeline</div>
          <button class="btn btn-sm" onclick="navigate('pipeline')">View all →</button>
        </div>
        <div class="pill-bar" id="dash-stage-pills"></div>
        <div id="dash-deal-list"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div class="card">
          <div class="card-head"><div class="card-title">Recent activity</div></div>
          ${[
            {text:'<strong>AgriLink</strong> — Term sheet signed. ₹3 Cr seed round approved.', time:'2h ago', color:'#1D9E75'},
            {text:'<strong>FinNova AI</strong> — Legal due diligence started. Assigned to Priya S.', time:'5h ago', color:'#378ADD'},
            {text:'<strong>HealthXR</strong> — New application received. Awaiting screening.', time:'1d ago', color:'#EF9F27'},
            {text:'<strong>EduDost</strong> — Initial call completed. Promising EdTech play.', time:'2d ago', color:'#378ADD'},
            {text:'<strong>DriveX</strong> — Passed at IC. High burn, weak unit economics.', time:'3d ago', color:'#E24B4A'},
          ].map(a => `
            <div class="activity-item">
              <div class="a-dot" style="background:${a.color}22;border-color:${a.color};"></div>
              <div class="a-text">${a.text}</div>
              <div class="a-time">${a.time}</div>
            </div>`).join('')}
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title">Quick actions</div></div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${[
              ['View pipeline', () => navigate('pipeline')],
              ['Review applications', () => navigate('screening')],
              ['Team workspace', () => navigate('team')],
              ['Analytics report', () => navigate('analytics')],
            ].map(([label, fn]) => `<button class="btn" style="text-align:left;" onclick="${fn.toString().replace(/\n/g,' ')}">${label} →</button>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  // Stage filter pills
  const stages = ['All', 'Screening', 'Due Diligence', 'Term Sheet'];
  let activeStage = 'All';
  const pills = document.getElementById('dash-stage-pills');
  pills.innerHTML = stages.map(s => `
    <button class="pill${s === activeStage ? ' active' : ''}" onclick="dashFilter('${s}')">${s} (${s==='All'?deals.length:deals.filter(d=>d.stage===s).length})</button>
  `).join('');

  window.dashFilter = (stage) => {
    activeStage = stage;
    pills.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.textContent.startsWith(stage)));
    const filtered = stage === 'All' ? deals : deals.filter(d => d.stage === stage);
    renderDashDeals(filtered.slice(0, 6));
  };

  renderDashDeals(recent);
}

function renderDashDeals(deals) {
  document.getElementById('dash-deal-list').innerHTML = deals.map(d => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer;" onclick="navigate('pipeline')">
      ${avatar(d.init, d.bg, d.tc, 32)}
      <div style="flex:1;min-width:0;">
        <div style="font-size:13px;font-weight:600;">${d.name}</div>
        <div style="font-size:11px;color:var(--text3);">${d.sector} · ${d.city}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:12px;font-weight:500;">${fmtCr(d.ask)}</div>
        ${stageBadge(d.stage)}
      </div>
    </div>
  `).join('') || '<div style="padding:16px;text-align:center;color:var(--text3);font-size:13px;">No deals in this stage</div>';
}
