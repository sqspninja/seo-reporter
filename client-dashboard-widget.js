(function () {
  const WIDGET_VERSION = '2026-05-24.3';
  const DEFAULT_DASHBOARD_SRC = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRiDP5-SSqPNCk6BI8ujx6OCPfr_WhKyCRk1WDSBwXXSJ1s5U0euzAeflbE-hLHAZ04bindi1yhYg4U/pub?output=csv';

  const DEFAULT_DASHBOARD_DATA = {
    bergen_design: {
      clientName: 'Bergen Design',
      reportLabel: 'April 2026',
      comparisonLabel: 'March 2026',
      lede: 'This month, Google showed Bergen Design more often and search clicks reached the strongest point in the six-month view.',
      snapshot: [
        {
          title: 'Search Performance',
          help: 'How many times your site appeared in Google search results, whether or not someone clicked.',
          primary: '13,578',
          caption: 'Times Bergen Design appeared in Google search results.',
          secondary: '91 clicks from Google',
          change: '+4.6% visibility vs last month',
          tone: 'good'
        },
        {
          title: 'New Visitors',
          primary: '37',
          caption: 'First-time visitors measured by GA4.',
          change: '+8.8% vs last month',
          tone: 'good'
        },
        {
          title: 'Average Google Position',
          help: 'The average spot where your site appeared in Google. Lower numbers are better: 1 is the top result.',
          primary: '9.57',
          caption: 'Average ranking in Google. Lower is better.',
          secondary: 'Previous month: 9.90',
          change: 'Improved 3.3%',
          tone: 'good'
        }
      ],
      keywords: [
        { keyword: 'squarespace plugins', clicks: 9, impressions: 949, ctr: '0.95%', position: '8.89' },
        { keyword: 'best squarespace plugins', clicks: 3, impressions: 118, ctr: '2.54%', position: '7.14' },
        { keyword: 'squarespace plugin', clicks: 3, impressions: 52, ctr: '5.77%', position: '8.62' },
        { keyword: 'squarespace blog plugins', clicks: 2, impressions: 29, ctr: '6.90%', position: '6.24' },
        { keyword: 'plugins for squarespace', clicks: 2, impressions: 27, ctr: '7.41%', position: '8.63' },
        { keyword: 'web design near me', clicks: 2, impressions: 6, ctr: '33.33%', position: '15.33' }
      ],
      pages: [
        { path: '/blog/my-top-10-favorite-squarespace-plugins', clicks: 53, impressions: 4061, ctr: '1.31%', position: '6.98' },
        { path: '/blog/squarespace-permissions-explained...', clicks: 18, impressions: 3921, ctr: '0.46%', position: '6.45' },
        { path: '/', clicks: 16, impressions: 3332, ctr: '0.48%', position: '16.79' },
        { path: '/web-design-paramus-nj', clicks: 3, impressions: 222, ctr: '1.35%', position: '10.57' },
        { path: '/blog/how-to-change-your-internal-built-in-domain...', clicks: 1, impressions: 194, ctr: '0.52%', position: '8.21' }
      ],
      trafficSources: [
        { source: 'Organic Search', users: 24, newUsers: 20, engagement: '64%' },
        { source: 'Direct', users: 8, newUsers: 6, engagement: '58%' },
        { source: 'Referral', users: 3, newUsers: 3, engagement: '67%' },
        { source: 'Social', users: 2, newUsers: 2, engagement: '50%' }
      ],
      keyActions: [
        { label: 'Booking / consultation clicks', value: 5 },
        { label: 'Contact page visits', value: 2 },
        { label: 'Phone / email clicks', value: 1 },
        { label: 'Other tracked actions', value: 1 }
      ],
      history: [
        { month: 'Nov', impressions: '8,700', clicks: 54 },
        { month: 'Dec', impressions: '7,900', clicks: 49 },
        { month: 'Jan', impressions: '9,800', clicks: 68 },
        { month: 'Feb', impressions: '11,300', clicks: 74 },
        { month: 'Mar', impressions: '12,980', clicks: 88 },
        { month: 'Apr', impressions: '13,578', clicks: 91 }
      ],
      opportunities: [
        {
          title: 'High Impressions, Low Clicks',
          description: 'Search results are showing, but people are not choosing them often enough.',
          items: ['Homepage: 3,332 impressions, 0.48% CTR', 'Permissions article: 3,921 impressions, 0.46% CTR']
        },
        {
          title: 'Close Ranking Opportunities',
          description: 'Searches close enough to improve with focused page updates.',
          items: ['squarespace plugins: avg position 8.89', 'homepage: avg position 16.79']
        },
        {
          title: 'Popular Pages With Weak Engagement',
          description: 'Pages people visit, but may need clearer next steps.',
          items: ['/60-minute-meeting: 40% engagement', '/30-minute-consultation: low engagement']
        }
      ],
      nextSteps: [
        { title: 'Recommendation placeholder', reason: 'Reason placeholder tied to one clear metric above.' },
        { title: 'Recommendation placeholder', reason: 'Reason placeholder tied to one clear metric above.' },
        { title: 'Recommendation placeholder', reason: 'Reason placeholder tied to one clear metric above.' }
      ]
    }
  };

  const state = {};

  function getData() {
    return window.CLIENT_DASHBOARD_DATA || DEFAULT_DASHBOARD_DATA;
  }

  function getLocalData(clientId) {
    return (window.CLIENT_DASHBOARD_DATA && window.CLIENT_DASHBOARD_DATA[clientId]) || DEFAULT_DASHBOARD_DATA[clientId];
  }

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let value = '';
    let quoted = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (char === '"' && quoted && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === ',' && !quoted) {
        row.push(value);
        value = '';
      } else if ((char === '\n' || char === '\r') && !quoted) {
        if (char === '\r' && next === '\n') index += 1;
        row.push(value);
        if (row.some((cell) => cell !== '')) rows.push(row);
        row = [];
        value = '';
      } else {
        value += char;
      }
    }

    row.push(value);
    if (row.some((cell) => cell !== '')) rows.push(row);
    return rows;
  }

  async function loadCsvData(src, clientId) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 7000);
    const separator = src.includes('?') ? '&' : '?';
    const requestUrl = `${src}${separator}_cd=${Date.now()}`;

    let response;
    try {
      response = await fetch(requestUrl, {
        cache: 'no-store',
        signal: controller.signal
      });
    } finally {
      window.clearTimeout(timeout);
    }

    if (!response.ok) throw new Error(`Dashboard CSV request failed: ${response.status}`);

    const rows = parseCsv(await response.text());
    const headers = rows.shift() || [];
    const clientIndex = headers.indexOf('client_id');
    const payloadIndex = headers.indexOf('payload_json');
    const match = rows.find((row) => row[clientIndex] === clientId);

    if (!match || payloadIndex === -1) return null;
    return JSON.parse(match[payloadIndex]);
  }

  function injectStyles() {
    if (document.getElementById('client-dashboard-widget-styles')) return;

    const style = document.createElement('style');
    style.id = 'client-dashboard-widget-styles';
    style.textContent = `
      [data-client-dashboard].client-dashboard{width:min(1120px,100%);margin:0 auto;--cd-gap:1rem;--cd-line:1px solid currentColor;--cd-muted:color-mix(in srgb,currentColor 62%,transparent);--cd-good:#176b3a;--cd-bad:#9d3b27}
      .client-dashboard *{box-sizing:border-box}
      .client-dashboard .cd-header,.client-dashboard .cd-snapshot,.client-dashboard .cd-section,.client-dashboard .cd-split,.client-dashboard .cd-grid,.client-dashboard .cd-history{display:grid;gap:var(--cd-gap)}
      .client-dashboard .cd-header{border-bottom:var(--cd-line);margin-bottom:1rem;padding-bottom:1rem}
      .client-dashboard .cd-version{font-size:.8rem;margin:0;color:var(--cd-muted)}
      .client-dashboard .cd-lede{max-width:72ch;margin:0 0 1.25rem}
      .client-dashboard .cd-snapshot{grid-template-columns:repeat(3,minmax(0,1fr));margin-bottom:1rem}
      .client-dashboard .cd-card,.client-dashboard .cd-section{border:var(--cd-line);padding:1rem}
      .client-dashboard .cd-muted,.client-dashboard .cd-caption,.client-dashboard .cd-note{color:var(--cd-muted)}
      .client-dashboard .cd-number{display:block;font-size:clamp(2.1rem,5vw,4rem);line-height:1;margin-bottom:.5rem}
      .client-dashboard .cd-change{display:inline-flex;border:var(--cd-line);padding:.25rem .5rem;font-size:.9rem}
      .client-dashboard .cd-change.good{color:var(--cd-good)}
      .client-dashboard .cd-change.bad{color:var(--cd-bad)}
      .client-dashboard .cd-section-header{display:flex;justify-content:space-between;gap:1rem;align-items:baseline;border-bottom:var(--cd-line);margin-bottom:.75rem;padding-bottom:.75rem}
      .client-dashboard .cd-sort{display:inline-flex;border:var(--cd-line)}
      .client-dashboard .cd-sort button{appearance:none;border:0;border-right:var(--cd-line);background:transparent;color:inherit;cursor:pointer;padding:.45rem .65rem;font:inherit}
      .client-dashboard .cd-sort button:last-child{border-right:0}
      .client-dashboard .cd-sort button[aria-pressed=true]{font-weight:700;text-decoration:underline;text-underline-offset:.18em}
      .client-dashboard table{width:100%;border-collapse:collapse}
      .client-dashboard th,.client-dashboard td{border-top:var(--cd-line);padding:.7rem .5rem;text-align:left;vertical-align:top}
      .client-dashboard th:first-child,.client-dashboard td:first-child{width:44%}
      .client-dashboard th:not(:first-child),.client-dashboard td:not(:first-child){text-align:right;white-space:nowrap}
      .client-dashboard .cd-row-title{display:block;font-weight:700;overflow-wrap:anywhere}
      .client-dashboard .cd-split{grid-template-columns:minmax(0,.58fr) minmax(0,.42fr);align-items:start}
      .client-dashboard .cd-stat-list{display:grid;gap:.75rem;margin:0;padding:0;list-style:none}
      .client-dashboard .cd-stat-row{display:grid;grid-template-columns:minmax(8rem,1fr) auto;gap:1rem;border-top:var(--cd-line);padding-top:.75rem}
      .client-dashboard .cd-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
      .client-dashboard .cd-list{margin:0;padding-left:1.1rem}
      .client-dashboard .cd-list li+li{margin-top:.45rem}
      .client-dashboard .cd-history{grid-template-columns:repeat(6,minmax(0,1fr))}
      .client-dashboard .cd-history-month{border-top:var(--cd-line);padding-top:.75rem}
      @media(max-width:820px){.client-dashboard .cd-snapshot,.client-dashboard .cd-split,.client-dashboard .cd-grid,.client-dashboard .cd-history{grid-template-columns:1fr}.client-dashboard .cd-section-header{display:grid}.client-dashboard table,.client-dashboard thead,.client-dashboard tbody,.client-dashboard tr,.client-dashboard th,.client-dashboard td{display:block}.client-dashboard thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}.client-dashboard tr{border-top:var(--cd-line);padding:.7rem 0}.client-dashboard td,.client-dashboard th,.client-dashboard th:first-child,.client-dashboard td:first-child,.client-dashboard th:not(:first-child),.client-dashboard td:not(:first-child){width:100%;border-top:0;padding:.25rem 0;text-align:left;white-space:normal}.client-dashboard td[data-label]::before{content:attr(data-label) ": ";font-weight:700}}
    `;
    document.head.appendChild(style);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatNumber(value) {
    if (value === '' || value === null || value === undefined) return '—';
    return Number(value).toLocaleString();
  }

  function sortedRows(rows, sortBy) {
    return [...rows].sort((a, b) => Number(b[sortBy]) - Number(a[sortBy]));
  }

  function titleWithHelp(item) {
    const title = escapeHtml(item.title);
    return item.help ? `<abbr title="${escapeHtml(item.help)}">${title}</abbr>` : title;
  }

  function renderSortToggle(tableId, sortBy) {
    return `<div class="cd-sort" aria-label="Sort ${escapeHtml(tableId)}">
      <button type="button" data-sort-table="${escapeHtml(tableId)}" data-sort-by="clicks" aria-pressed="${sortBy === 'clicks'}">Clicks</button>
      <button type="button" data-sort-table="${escapeHtml(tableId)}" data-sort-by="impressions" aria-pressed="${sortBy === 'impressions'}">Impressions</button>
    </div>`;
  }

  function renderSnapshot(items) {
    return `<section class="cd-snapshot" aria-label="Top snapshot">${items.map((item) => `
      <article class="cd-card">
        <h2>${titleWithHelp(item)}</h2>
        <strong class="cd-number">${escapeHtml(item.primary)}</strong>
        <p class="cd-caption">${escapeHtml(item.caption)}</p>
        ${item.secondary ? `<strong>${escapeHtml(item.secondary)}</strong>` : ''}
        <p><span class="cd-change ${escapeHtml(item.tone || '')}">${escapeHtml(item.change)}</span></p>
      </article>`).join('')}</section>`;
  }

  function renderSearchTable(title, caption, tableId, rows, sortBy, labelKey) {
    return `<section class="cd-section">
      <div class="cd-section-header"><div><h2>${escapeHtml(title)}</h2><p class="cd-caption">${escapeHtml(caption)}</p></div>${renderSortToggle(tableId, sortBy)}</div>
      <table><thead><tr><th>${escapeHtml(title === 'Keywords' ? 'Keyword' : 'Page')}</th><th>Clicks</th><th>Impressions</th><th>CTR</th><th>Avg position</th></tr></thead>
      <tbody>${sortedRows(rows, sortBy).map((row) => `<tr>
        <td data-label="${escapeHtml(title === 'Keywords' ? 'Keyword' : 'Page')}"><span class="cd-row-title">${escapeHtml(row[labelKey])}</span></td>
        <td data-label="Clicks">${formatNumber(row.clicks)}</td>
        <td data-label="Impressions">${formatNumber(row.impressions)}</td>
        <td data-label="CTR">${escapeHtml(row.ctr)}</td>
        <td data-label="Avg position">${escapeHtml(row.position)}</td>
      </tr>`).join('')}</tbody></table>
    </section>`;
  }

  function renderTrafficSources(rows) {
    return `<section class="cd-section"><div class="cd-section-header"><div><h2>Traffic Sources</h2><p class="cd-caption">Where visitors came from before reaching the site.</p></div></div>
      <table><thead><tr><th>Source</th><th>Users</th><th>New users</th><th>Engagement</th></tr></thead>
      <tbody>${rows.map((row) => `<tr><td data-label="Source">${escapeHtml(row.source)}</td><td data-label="Users">${formatNumber(row.users)}</td><td data-label="New users">${formatNumber(row.newUsers)}</td><td data-label="Engagement">${escapeHtml(row.engagement)}</td></tr>`).join('')}</tbody></table>
    </section>`;
  }

  function renderKeyActions(rows) {
    return `<section class="cd-section"><div class="cd-section-header"><div><h2>Key Actions</h2><p class="cd-caption">Business actions worth tracking every month.</p></div></div>
      <ul class="cd-stat-list">${rows.map((row) => `<li class="cd-stat-row"><span>${escapeHtml(row.label)}</span><strong>${formatNumber(row.value)}</strong></li>`).join('')}</ul>
    </section>`;
  }

  function renderHistory(rows) {
    return `<section class="cd-section"><div class="cd-section-header"><div><h2>Six-Month Snapshot</h2><p class="cd-caption">Stored monthly data makes the top numbers easier to understand over time.</p></div></div>
      <div class="cd-history">${rows.map((row) => `<article class="cd-history-month"><h3>${escapeHtml(row.month)}</h3><p><strong>${escapeHtml(row.impressions)}</strong> impressions</p><p class="cd-note">${formatNumber(row.clicks)} clicks</p></article>`).join('')}</div>
    </section>`;
  }

  function renderCardGrid(title, caption, rows, type) {
    return `<section class="cd-section"><div class="cd-section-header"><div><h2>${escapeHtml(title)}</h2><p class="cd-caption">${escapeHtml(caption)}</p></div></div>
      <div class="cd-grid">${rows.map((card) => `<article class="cd-card"><h3>${escapeHtml(card.title)}</h3><p class="cd-note">${escapeHtml(card.description || card.reason)}</p>${type === 'list' ? `<ul class="cd-list">${card.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}</article>`).join('')}</div>
    </section>`;
  }

  function renderDashboard(root, data, clientState) {
    const dataSourceLabel = data.__source === 'csv' ? 'live csv' : 'fallback data';

    root.classList.add('client-dashboard');
    root.innerHTML = `
      <header class="cd-header">
        <p class="cd-version">Dashboard widget ${escapeHtml(WIDGET_VERSION)} · ${escapeHtml(dataSourceLabel)} · ${data.reportMonth ? `data ${escapeHtml(data.reportMonth)}` : 'data source active'}</p>
        <p class="cd-muted">Monthly Analytics Dashboard</p>
        <h1>${escapeHtml(data.clientName)}</h1>
        <p>${escapeHtml(data.reportLabel)}, compared with ${escapeHtml(data.comparisonLabel)}</p>
      </header>
      <p class="cd-lede">${escapeHtml(data.lede)}</p>
      ${renderSnapshot(data.snapshot || [])}
      ${renderSearchTable('Keywords', `What people searched before seeing or clicking ${data.clientName}.`, 'keywords', data.keywords || [], clientState.keywordsSort, 'keyword')}
      ${renderSearchTable('Pages', 'The page paths that appeared in Google and brought people to the site.', 'pages', data.pages || [], clientState.pagesSort, 'path')}
      <div class="cd-split">${renderTrafficSources(data.trafficSources || [])}${renderKeyActions(data.keyActions || [])}</div>
      ${renderHistory(data.history || [])}
      ${renderCardGrid('Opportunities', 'Short data lists that point to where attention may be useful.', data.opportunities || [], 'list')}
      ${renderCardGrid('Next Steps', 'Placeholder cards for later notes or AI/manual recommendations.', data.nextSteps || [], 'cards')}
    `;
  }

  function mount(root) {
    const clientId = root.getAttribute('data-client-id');
    const src = root.getAttribute('data-dashboard-src') || window.CLIENT_DASHBOARD_SRC || DEFAULT_DASHBOARD_SRC;
    const shouldLoadCsv = src && root.getAttribute('data-dashboard-loaded') !== 'true';

    if (shouldLoadCsv) {
      root.textContent = 'Loading dashboard...';
      root.setAttribute('data-dashboard-loaded', 'true');
      loadCsvData(src, clientId)
        .then((data) => {
          window.CLIENT_DASHBOARD_DATA = window.CLIENT_DASHBOARD_DATA || {};
          if (data) window.CLIENT_DASHBOARD_DATA[clientId] = Object.assign({}, data, { __source: 'csv' });
          mount(root);
        })
        .catch((error) => {
          console.warn('[client-dashboard] Falling back to bundled dashboard data.', error);
          mount(root);
        });
      return;
    }

    const data = getLocalData(clientId);

    if (!data) {
      root.textContent = `No dashboard data found for client: ${clientId}`;
      return;
    }

    state[clientId] = state[clientId] || { keywordsSort: 'clicks', pagesSort: 'clicks' };
    renderDashboard(root, data, state[clientId]);

    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-sort-table]');
      if (!button) return;
      const tableId = button.getAttribute('data-sort-table');
      state[clientId][`${tableId}Sort`] = button.getAttribute('data-sort-by');
      renderDashboard(root, data, state[clientId]);
    });
  }

  function init() {
    injectStyles();
    document.querySelectorAll('[data-client-dashboard]').forEach(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
