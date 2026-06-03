// js/pages/portfolio.js
async function renderPortfolio() {
  const [res, sumRes] = await Promise.all([API.get('/api/portfolio'), API.get('/api/portfolio/summary')]);
  const port = res?.data || [];
  const sum  = sumRes?.data || {};

  document.getElementById('page-content').innerHTML = `
    <div class="toprow">
      <div><div class="page-title">Portfolio</div><div class="page-sub">${port.length} companies · ₹${sum.totalValue || 218} Cr current value</div></div>
      <div class="toprow-actions">
        <button class="btn" onclick="showToast('MIS report generation coming soon')">MIS report</button>
        <button class="btn btn-primary" onclick="navigate('analytics')">Analytics →</button>
      </div>
    </div>
    <div class="mrow mrow-4">
      <div class="met"><div class="met-label">Total invested</div><div class="met-val">₹${sum.totalInvested || 96.4} Cr</div></div>
      <div class="met"><div class="met-label">Current value</div><div class="met-val">₹${sum.totalValue || 218} Cr</div><div class="met-sub up">${sum.avgMoic || 2.26}x MOIC</div></div>
      <div class="met"><div class="met-label">Avg. IRR</div><div class="met-val">${sum.avgIrr || 32}%</div><div class="met-sub up">Above target</div></div>
      <div class="met"><div class="met-label">Companies</div><div class="met-val">${port.length}</div><div class="met-sub">2 exits YTD</div></div>
    </div>
    <div class="three-col">
      ${port.map(p => `
        <div class="card" style="cursor:pointer;" onclick="showToast('${p.name} detail view coming soon')">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            ${avatar(p.init, p.bg, p.tc, 36)}
            <div>
              <div style="font-size:13px;font-weight:600;">${p.name}</div>
              <div style="font-size:11px;color:var(--text3);">${p.sector} · ${p.city}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px;">
            <div><div style="font-size:10px;color:var(--text3);">Invested</div><div style="font-size:13px;font-weight:600;">${fmtCr(p.invested)}</div></div>
            <div><div style="font-size:10px;color:var(--text3);">Current value</div><div style="font-size:13px;font-weight:600;color:var(--green);">${fmtCr(p.value)}</div></div>
            <div><div style="font-size:10px;color:var(--text3);">MOIC</div><div style="font-size:13px;font-weight:600;">${p.moic}x</div></div>
            <div><div style="font-size:10px;color:var(--text3);">IRR</div><div style="font-size:13px;font-weight:600;color:${p.irr>=30?'var(--green)':'var(--text)'};">${p.irr}%</div></div>
          </div>
          ${progBar(Math.min(100, Math.round(p.moic/3.5*100)), p.tc)}
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:8px;border-top:1px solid var(--border);">
            <span style="font-size:11px;color:var(--text3);">Invested ${p.date}</span>
            <span class="badge badge-analyst">${p.stage}</span>
          </div>
        </div>`).join('')}
    </div>
  `;
}

// js/pages/analytics.js
async function renderAnalytics() {
  const [kpisRes, flowRes, sectorRes, funnelRes] = await Promise.all([
    API.get('/api/analytics/kpis'),
    API.get('/api/analytics/monthly-flow'),
    API.get('/api/analytics/sectors'),
    API.get('/api/analytics/funnel'),
  ]);
  const kpis   = kpisRes?.data   || {};
  const flow   = flowRes?.data   || {};
  const sectors= sectorRes?.data || [];
  const funnel = funnelRes?.data || [];

  document.getElementById('page-content').innerHTML = `
    <div class="toprow">
      <div><div class="page-title">Analytics</div><div class="page-sub">FY 2025–26 · All investments & pipeline</div></div>
      <div class="toprow-actions">
        <button class="btn" onclick="showToast('PDF export coming soon')">Export PDF</button>
      </div>
    </div>
    <div class="mrow mrow-5">
      <div class="met"><div class="met-label">Total deployed</div><div class="met-val">₹${kpis.totalDeployed||96.4} Cr</div><div class="met-sub up">+22% YoY</div></div>
      <div class="met"><div class="met-label">Portfolio value</div><div class="met-val">₹${kpis.portfolioValue||218} Cr</div><div class="met-sub up">2.26x MOIC</div></div>
      <div class="met"><div class="met-label">Blended IRR</div><div class="met-val">${kpis.blendedIRR||34}%</div><div class="met-sub up">+4pp vs last yr</div></div>
      <div class="met"><div class="met-label">Conversion rate</div><div class="met-val">${kpis.conversionRate||8.3}%</div><div class="met-sub" style="color:var(--text3);">App → Invested</div></div>
      <div class="met"><div class="met-label">Active deals</div><div class="met-val">${kpis.activeDeals||12}</div><div class="met-sub">In pipeline</div></div>
    </div>
    <div class="two-col">
      <div class="card">
        <div class="card-head"><div class="card-title">Monthly deal flow</div></div>
        <div style="position:relative;height:220px;"><canvas id="chart-flow"></canvas></div>
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title">Deployment by sector</div></div>
        ${sectors.map(s => `
          <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);">
            <span style="font-size:12px;color:var(--text2);flex:1;">${s.sector}</span>
            <div style="flex:2;">${progBar(s.pct, '#378ADD')}</div>
            <span style="font-size:12px;font-weight:600;min-width:40px;text-align:right;">₹${s.deployed} Cr</span>
            <span style="font-size:11px;color:var(--text3);min-width:28px;">${s.pct}%</span>
          </div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-head"><div class="card-title">Deal funnel</div></div>
      <div style="display:grid;grid-template-columns:repeat(${funnel.length},1fr);gap:2px;">
        ${funnel.map((f,i) => `
          <div style="text-align:center;padding:12px 8px;background:var(--bg2);border-radius:6px;">
            <div style="font-size:20px;font-weight:600;">${f.count}</div>
            <div style="font-size:11px;color:var(--text3);margin-top:3px;">${f.stage}</div>
          </div>`).join('')}
      </div>
    </div>
  `;

  // Render Chart.js chart
  setTimeout(() => {
    const ctx = document.getElementById('chart-flow');
    if (!ctx || !flow.labels) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: flow.labels,
        datasets: [
          { label:'Applications', data: flow.applications, backgroundColor:'#B5D4F4', borderRadius:3 },
          { label:'Investments',  data: flow.investments,  backgroundColor:'#1D9E75', borderRadius:3, yAxisID:'y2' },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid:{display:false}, ticks:{font:{size:11},color:'#888'} },
          y: { grid:{color:'rgba(128,128,128,0.1)'}, ticks:{font:{size:11},color:'#888'} },
          y2: { position:'right', grid:{display:false}, ticks:{font:{size:11},color:'#888'} },
        }
      }
    });
  }, 100);
}

// js/pages/duedil.js
async function renderDueDiligence() {
  const res = await API.get('/api/deals?stage=Due%20Diligence');
  const companies = res?.data || [];

  document.getElementById('page-content').innerHTML = `
    <div class="toprow">
      <div><div class="page-title">Due diligence</div><div class="page-sub">${companies.length} companies under active review</div></div>
      <div class="toprow-actions">
        <button class="btn btn-primary" onclick="showToast('DD checklist template coming soon')">New checklist</button>
      </div>
    </div>
    <div class="two-col">
      <div>
        ${companies.map(c => `
          <div class="card" style="cursor:pointer;" onclick="showToast('DD detail for ${c.name} — full view coming soon')">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              ${avatar(c.init, c.bg, c.tc, 34)}
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:600;">${c.name}</div>
                <div style="font-size:11px;color:var(--text3);">${c.sector} · ${c.city} · ${fmtCr(c.ask)} ask</div>
              </div>
              <div style="font-size:18px;font-weight:600;">${c.score}</div>
            </div>
            ${progBar(c.score, c.tc)}
            <div style="display:flex;gap:6px;margin-top:8px;">
              ${prioBadge(c.priority)}
              <span class="badge badge-neutral">${c.analyst}</span>
              <span style="font-size:11px;color:var(--text3);margin-left:auto;">${c.days}d in DD</span>
            </div>
          </div>`).join('')}
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title">DD workflow steps</div></div>
        ${[
          {title:'Financial review',     desc:'Audited financials, projections, unit economics',done:true},
          {title:'Legal & compliance',   desc:'Incorporation, IP, regulatory checks',done:true},
          {title:'Market analysis',      desc:'TAM/SAM, competitors, customer references',done:false,active:true},
          {title:'Technical audit',      desc:'Product, tech stack, architecture review',done:false},
          {title:'Team assessment',      desc:'Founder background, key hires, org structure',done:false},
          {title:'IC memo preparation',  desc:'Investment thesis, risks, recommendation',done:false},
        ].map((s,i,arr) => `
          <div class="wf-step">
            <div class="wf-left">
              <div class="wf-num${s.done?' done':s.active?' active':''}">${s.done?'✓':i+1}</div>
              ${i<arr.length-1?'<div class="wf-line"></div>':''}
            </div>
            <div class="wf-body">
              <div class="wf-title">${s.title}${s.active?' <span class="badge badge-analyst" style="font-size:9px;">Active</span>':s.done?' <span class="badge badge-agreed" style="font-size:9px;">Done</span>':''}</div>
              <div class="wf-desc">${s.desc}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;
}

// js/pages/termsheet.js
async function renderTermsheet() {
  const res = await API.get('/api/termsheet');
  const sheets = res?.data || [];
  let sel = 0;

  function render() {
    const s = sheets[sel];
    document.getElementById('ts-clauses').innerHTML = s ? `
      <div style="margin-bottom:10px;font-size:13px;font-weight:600;">${s.dealName} — ${s.agreedClauses}/${s.totalClauses} agreed</div>
      ${progBar(Math.round(s.agreedClauses/s.totalClauses*100), s.color)}
      <div style="margin-top:12px;display:flex;flex-direction:column;gap:8px;">
        ${[
          ['Investment','₹'+s.ask+' Cr','agreed'],
          ['Instrument',s.instrument,'agreed'],
          ['Equity stake',s.equity+'%',s.status==='Negotiating'?'open':'agreed'],
          ['Post-money','₹'+s.postMoney+' Cr',s.status==='Negotiating'?'open':'agreed'],
          ['Liquidation pref','1× non-participating','agreed'],
          ['Anti-dilution','Broad-based WA',s.status==='Negotiating'?'flagged':'agreed'],
          ['Board seat','1 VC + 2 Founder + 1 Ind.',s.status==='Negotiating'?'open':'agreed'],
          ['Pro-rata rights','Next 2 rounds','agreed'],
          ['Drag-along','75%','agreed'],
          ['ESOP pool','10% pre-money','agreed'],
          ['Founder lock-in','3 years, 1yr cliff','agreed'],
        ].map(([k,v,st]) => `
          <div style="display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--bg2);border-radius:6px;">
            <div style="width:7px;height:7px;border-radius:50%;background:${st==='agreed'?'var(--green)':st==='flagged'?'var(--red)':'var(--amber)'};flex-shrink:0;"></div>
            <span style="flex:1;font-size:12px;font-weight:500;">${k}</span>
            <span style="font-size:12px;color:var(--text2);">${v}</span>
            <span class="badge badge-${st}">${st}</span>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="showToast('Full TS document generation coming soon')">Draft full TS →</button>
        <button class="btn" onclick="showToast('Founder email drafted!')">Email founders</button>
      </div>
    ` : '<div style="color:var(--text3);padding:20px;text-align:center;">Select a deal</div>';
  }

  document.getElementById('page-content').innerHTML = `
    <div class="toprow">
      <div><div class="page-title">Term sheet</div><div class="page-sub">${sheets.length} active term sheets · Negotiation in progress</div></div>
      <div class="toprow-actions">
        <button class="btn btn-primary" onclick="showToast('New TS draft — coming soon')">+ Draft new TS</button>
      </div>
    </div>
    <div class="mrow mrow-4">
      <div class="met"><div class="met-label">Active TSs</div><div class="met-val">${sheets.length}</div></div>
      <div class="met"><div class="met-label">Total committed</div><div class="met-val">₹${sheets.reduce((s,t)=>s+t.ask,0).toFixed(1)} Cr</div></div>
      <div class="met"><div class="met-label">Signed</div><div class="met-val">${sheets.filter(s=>s.status==='Signed').length}</div><div class="met-sub up">Closing in progress</div></div>
      <div class="met"><div class="met-label">Negotiating</div><div class="met-val">${sheets.filter(s=>s.status==='Negotiating').length}</div><div class="met-sub">Active discussion</div></div>
    </div>
    <div class="two-col">
      <div>
        ${sheets.map((s,i) => `
          <div class="card" style="cursor:pointer;${sel===i?'border-color:'+s.color+';border-width:2px;':''}" onclick="selTS(${i})">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <div style="width:10px;height:10px;border-radius:50%;background:${s.color};flex-shrink:0;"></div>
              <div style="font-size:13px;font-weight:600;flex:1;">${s.dealName}</div>
              <span class="badge badge-${s.status==='Signed'?'agreed':s.status==='Negotiating'?'open':'medium'}">${s.status}</span>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;font-size:12px;color:var(--text2);">
              <span>₹${s.ask} Cr</span>
              <span>·</span>
              <span>${s.equity}% equity</span>
              <span>·</span>
              <span>${s.instrument}</span>
            </div>
            ${progBar(Math.round(s.agreedClauses/s.totalClauses*100), s.color, 4)}
            <div style="font-size:10px;color:var(--text3);margin-top:4px;">${s.agreedClauses}/${s.totalClauses} clauses agreed · ${s.analyst}</div>
          </div>`).join('')}
      </div>
      <div class="card" id="ts-clauses"></div>
    </div>
  `;

  window.selTS = (i) => { sel = i; render(); document.querySelectorAll('#page-content .card').forEach((c,ci) => { if(ci>4 && ci <= 4+sheets.length) c.style.borderWidth = ci===4+i?'2px':'1px'; }); };
  render();
}

// js/pages/team.js
async function renderTeam() {
  const [membersRes, tasksRes] = await Promise.all([
    API.get('/api/team/members'),
    API.get('/api/team/tasks'),
  ]);
  const members = membersRes?.data || [];
  const tasks   = tasksRes?.data   || [];
  let taskFilter = 'All';

  function filteredTasks() {
    if (taskFilter === 'All') return tasks;
    if (taskFilter === 'Done') return tasks.filter(t => t.done);
    return tasks.filter(t => t.prio === taskFilter && !t.done);
  }

  function renderTasks() {
    const f = filteredTasks();
    document.getElementById('task-list').innerHTML = f.map(t => `
      <div class="chk-item" onclick="togTeamTask(${t.id})">
        <div class="chk-box${t.done?' done':''}">${t.done?'✓':''}</div>
        <div style="flex:1;">
          <div class="chk-label${t.done?' crossed':''}">${t.title}</div>
          <div style="display:flex;gap:6px;margin-top:2px;">
            ${prioBadge(t.prio)}
            <span style="font-size:10px;color:var(--text3);">${t.deal}</span>
          </div>
        </div>
        <div style="text-align:right;">${dueLabel(t.due, t.done)}<div style="font-size:10px;color:var(--text3);">${t.assignee}</div></div>
      </div>`).join('') || '<div style="padding:16px;text-align:center;color:var(--text3);">No tasks</div>';
  }

  document.getElementById('page-content').innerHTML = `
    <div class="toprow">
      <div><div class="page-title">Team workspace</div><div class="page-sub">${members.length} members · ${tasks.filter(t=>!t.done).length} active tasks</div></div>
      <div class="toprow-actions">
        <button class="btn" onclick="showToast('Standup agenda generated!')">Standup agenda</button>
        <button class="btn btn-primary" onclick="addTeamTask()">+ New task</button>
      </div>
    </div>
    <div class="mrow mrow-4">
      <div class="met"><div class="met-label">Active tasks</div><div class="met-val">${tasks.filter(t=>!t.done).length}</div></div>
      <div class="met"><div class="met-label">Completed</div><div class="met-val">${tasks.filter(t=>t.done).length}</div><div class="met-sub up">This week</div></div>
      <div class="met"><div class="met-label">High priority</div><div class="met-val">${tasks.filter(t=>!t.done&&t.prio==='High').length}</div><div class="met-sub dn">Need attention</div></div>
      <div class="met"><div class="met-label">Members</div><div class="met-val">${members.length}</div><div class="met-sub">2 at high load</div></div>
    </div>
    <div class="two-col">
      <div class="card">
        <div class="card-head"><div class="card-title">My tasks — Priya S.</div></div>
        <div class="pill-bar">
          ${['All','High','Medium','Low','Done'].map(f => `<button class="pill${f===taskFilter?' active':''}" onclick="setTeamFilter('${f}')">${f}</button>`).join('')}
        </div>
        <div id="task-list"></div>
      </div>
      <div>
        <div class="card">
          <div class="card-head"><div class="card-title">Team workload</div></div>
          ${members.map(m => `
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);">
              ${avatar(m.init, m.bg, m.tc, 30)}
              <div style="flex:1;min-width:0;">
                <div style="font-size:12px;font-weight:600;">${m.name}</div>
                <div>${roleBadge(m.role)}</div>
              </div>
              <div style="width:120px;">
                <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3);margin-bottom:3px;"><span>${m.tasks} tasks</span><span style="color:${m.load>=80?'var(--red)':m.load>=60?'var(--amber)':'var(--green)'};">${m.load}%</span></div>
                ${progBar(m.load, m.load>=80?'#E24B4A':m.load>=60?'#EF9F27':'#1D9E75', 5)}
              </div>
            </div>`).join('')}
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title">Quick add task</div></div>
          <input class="fi-input" id="qt-title" placeholder="Task title..." style="width:100%;margin-bottom:8px;"/>
          <div style="display:flex;gap:8px;">
            <select class="fi" id="qt-prio" style="flex:1;"><option>High</option><option selected>Medium</option><option>Low</option></select>
            <select class="fi" id="qt-deal" style="flex:1;"><option>FinNova AI</option><option>AgriLink</option><option>General</option></select>
            <button class="btn btn-primary" onclick="quickTeamTask()">Add</button>
          </div>
        </div>
      </div>
    </div>
  `;

  window.setTeamFilter = f => { taskFilter = f; document.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.textContent === f)); renderTasks(); };
  window.togTeamTask = async (id) => {
    const r = await API.patch(`/api/team/tasks/${id}/toggle`, {});
    if (r?.success) { const t = tasks.find(t=>t.id===id); if(t) t.done=r.data.done; renderTasks(); }
  };
  window.quickTeamTask = async () => {
    const title = document.getElementById('qt-title').value.trim();
    if (!title) return;
    const r = await API.post('/api/team/tasks', { title, prio: document.getElementById('qt-prio').value, deal: document.getElementById('qt-deal').value });
    if (r?.success) { tasks.push(r.data); document.getElementById('qt-title').value=''; renderTasks(); showToast('Task added!'); }
  };
  window.addTeamTask = () => showToast('Full task form — coming soon');

  renderTasks();
}
