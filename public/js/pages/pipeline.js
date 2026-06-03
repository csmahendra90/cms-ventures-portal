// js/pages/pipeline.js
async function renderPipeline(defaultStage = 'All') {
  const res = await API.get('/api/deals');
  let deals = res?.data || [];
  let curStage = defaultStage, sortKey = 'score', sortAsc = false, search = '';

  function filtered() {
    let d = [...deals];
    if (curStage !== 'All') d = d.filter(x => x.stage === curStage);
    if (search) d = d.filter(x => x.name.toLowerCase().includes(search) || x.sector.toLowerCase().includes(search));
    d.sort((a,b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'string') return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortAsc ? av - bv : bv - av;
    });
    return d;
  }

  function render() {
    const f = filtered();
    document.getElementById('pipeline-count').textContent = `Showing ${f.length} of ${deals.length}`;
    document.getElementById('pipeline-body').innerHTML = f.map(d => `
      <tr>
        <td><div style="display:flex;align-items:center;gap:8px;">${avatar(d.init,d.bg,d.tc,28)}<span style="font-weight:600;">${d.name}</span></div></td>
        <td style="color:var(--text2);">${d.sector}</td>
        <td style="color:var(--text3);">${d.city}</td>
        <td>${fmtCr(d.ask)}</td>
        <td>${scoreBar(d.score, 48)}</td>
        <td>${stageBadge(d.stage)}</td>
        <td>${prioBadge(d.priority)}</td>
        <td style="color:var(--text2);">${d.analyst}</td>
        <td>${d.days}d</td>
        <td>
          <div style="display:flex;gap:5px;">
            <button class="btn btn-sm" onclick="moveStage(${d.id})">Move</button>
            <button class="btn btn-sm" onclick="showToast('${d.name} details loaded')">View</button>
          </div>
        </td>
      </tr>
    `).join('') || `<tr><td colspan="10" style="text-align:center;padding:20px;color:var(--text3);">No deals found</td></tr>`;

    document.querySelectorAll('.stage-pill-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.stage === curStage)
    );
  }

  const stages = ['All','Screening','Due Diligence','Term Sheet','Passed'];
  const totalAsk = deals.reduce((s,d) => s + d.ask, 0).toFixed(1);

  document.getElementById('page-content').innerHTML = `
    <div class="toprow">
      <div><div class="page-title">Pipeline</div><div class="page-sub">${deals.length} deals · ₹${totalAsk} Cr total ask</div></div>
      <div class="toprow-actions">
        <button class="btn" onclick="showToast('Export coming soon')">Export</button>
        <button class="btn btn-primary" onclick="openNewDealModal()">+ Add deal</button>
      </div>
    </div>
    <div class="mrow mrow-5">
      <div class="met"><div class="met-label">Total deals</div><div class="met-val">${deals.length}</div></div>
      <div class="met"><div class="met-label">Total ask</div><div class="met-val">₹${totalAsk} Cr</div></div>
      <div class="met"><div class="met-label">Screening</div><div class="met-val">${deals.filter(d=>d.stage==='Screening').length}</div></div>
      <div class="met"><div class="met-label">Due diligence</div><div class="met-val">${deals.filter(d=>d.stage==='Due Diligence').length}</div></div>
      <div class="met"><div class="met-label">Term sheet</div><div class="met-val">${deals.filter(d=>d.stage==='Term Sheet').length}</div></div>
    </div>
    <div class="pill-bar">
      ${stages.map(s => `<button class="pill stage-pill-btn${s===curStage?' active':''}" data-stage="${s}" onclick="setPipeStage('${s}')">${s} (${s==='All'?deals.length:deals.filter(d=>d.stage===s).length})</button>`).join('')}
    </div>
    <div class="search-row">
      <input class="fi-input" type="text" placeholder="Search startup or sector..." oninput="pipeSearch(this.value)" style="width:220px;"/>
      <select class="fi" onchange="pipeSearch('')">
        <option value="">All sectors</option>
        ${[...new Set(deals.map(d=>d.sector))].map(s=>`<option>${s}</option>`).join('')}
      </select>
      <select class="fi" onchange="">
        <option value="">All priorities</option>
        <option>High</option><option>Medium</option><option>Low</option>
      </select>
      <span class="results-count" id="pipeline-count"></span>
    </div>
    <div class="tbl-wrap">
      <table>
        <thead><tr>
          <th style="width:17%;" onclick="pipeSort('name')">Startup <span class="sort-arr">↕</span></th>
          <th style="width:10%;" onclick="pipeSort('sector')">Sector <span class="sort-arr">↕</span></th>
          <th style="width:9%;"  onclick="pipeSort('city')">City <span class="sort-arr">↕</span></th>
          <th style="width:8%;"  onclick="pipeSort('ask')">Ask <span class="sort-arr">↕</span></th>
          <th style="width:10%;" onclick="pipeSort('score')">Score <span class="sort-arr">↕</span></th>
          <th style="width:12%;" onclick="pipeSort('stage')">Stage <span class="sort-arr">↕</span></th>
          <th style="width:9%;"  onclick="pipeSort('priority')">Priority <span class="sort-arr">↕</span></th>
          <th style="width:9%;"  onclick="pipeSort('analyst')">Analyst <span class="sort-arr">↕</span></th>
          <th style="width:6%;"  onclick="pipeSort('days')">Days <span class="sort-arr">↕</span></th>
          <th style="width:10%;">Actions</th>
        </tr></thead>
        <tbody id="pipeline-body"></tbody>
      </table>
    </div>

    <!-- New Deal Modal -->
    <div class="modal-overlay" id="modal-new-deal" onclick="if(event.target===this)closeModal('modal-new-deal')">
      <div class="modal-box">
        <div class="modal-title">Add new startup</div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Startup name</label><input class="form-input" id="nd-name" placeholder="e.g. FinNova AI"/></div>
          <div class="form-group"><label class="form-label">Founder</label><input class="form-input" id="nd-founder" placeholder="Founder name"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Sector</label>
            <select class="form-select" id="nd-sector"><option>Fintech</option><option>HealthTech</option><option>AgriTech</option><option>EdTech</option><option>CleanTech</option><option>SaaS</option><option>DeepTech</option></select></div>
          <div class="form-group"><label class="form-label">City</label><input class="form-input" id="nd-city" placeholder="e.g. Mumbai"/></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Funding ask (₹ Cr)</label><input class="form-input" id="nd-ask" type="number" placeholder="5"/></div>
          <div class="form-group"><label class="form-label">Priority</label>
            <select class="form-select" id="nd-prio"><option>High</option><option selected>Medium</option><option>Low</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">One-line pitch</label><input class="form-input" id="nd-pitch" placeholder="What does the startup do?"/></div>
        <div class="modal-footer">
          <button class="btn" onclick="closeModal('modal-new-deal')">Cancel</button>
          <button class="btn btn-primary" onclick="submitNewDeal()">Add to pipeline</button>
        </div>
      </div>
    </div>
  `;

  window.setPipeStage = s => { curStage = s; render(); };
  window.pipeSearch  = s => { search = s.toLowerCase(); render(); };
  window.pipeSort    = k => { if(sortKey===k) sortAsc=!sortAsc; else { sortKey=k; sortAsc=false; } render(); };
  window.openNewDealModal = () => openModal('modal-new-deal');
  window.submitNewDeal = async () => {
    const name = document.getElementById('nd-name').value.trim();
    if (!name) return showToast('Startup name required');
    const r = await API.post('/api/deals', {
      name, sector: document.getElementById('nd-sector').value,
      city: document.getElementById('nd-city').value,
      ask:  document.getElementById('nd-ask').value,
      priority: document.getElementById('nd-prio').value,
    });
    if (r?.success) {
      deals.push(r.data);
      closeModal('modal-new-deal');
      showToast(`${name} added to pipeline!`);
      render();
    }
  };
  window.moveStage = async (id) => {
    const stages = ['Screening','Due Diligence','Term Sheet','Invested','Passed'];
    const deal = deals.find(d => d.id === id);
    if (!deal) return;
    const next = stages[stages.indexOf(deal.stage) + 1] || 'Passed';
    const r = await API.patch(`/api/deals/${id}/stage`, { stage: next });
    if (r?.success) { deal.stage = next; render(); showToast(`Moved to ${next}`); }
  };

  render();
}
