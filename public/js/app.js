// js/app.js — Router & sidebar controller

const PAGES = {
  dashboard: renderDashboard,
  pipeline:  renderPipeline,
  portfolio: renderPortfolio,
  screening: renderScreening,
  duedil:    renderDueDiligence,
  termsheet: renderTermsheet,
  team:      renderTeam,
  analytics: renderAnalytics,
};

let currentPage = 'dashboard';

function navigate(page) {
  if (!PAGES[page]) return;
  currentPage = page;

  // Update sidebar active state
  document.querySelectorAll('.sb-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Clear & render
  const content = document.getElementById('page-content');
  content.innerHTML = '<div style="padding:40px;text-align:center;color:#999;">Loading...</div>';

  PAGES[page]();
}

// Sidebar click handler
document.querySelectorAll('.sb-item[data-page]').forEach(item => {
  item.addEventListener('click', () => navigate(item.dataset.page));
});

// Screening = pipeline filtered to 'Screening' stage
function renderScreening() {
  renderPipeline('Screening');
}

// Start on dashboard
navigate('dashboard');
