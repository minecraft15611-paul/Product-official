// dashboard.js — Dashboard 頁面

function renderDashboardPage() {

    // ── 數字計算 ──
    const stats = {
        projectsTotal:     typeof projectsData     !== 'undefined' ? projectsData.length : 0,
        projectsPublished: typeof projectsData     !== 'undefined' ? projectsData.filter(p => p.status === 'published').length : 0,
        assetsTotal:       typeof assetsData       !== 'undefined' ? assetsData.length : 0,
        apiPublished:      typeof apiProductsData  !== 'undefined' ? apiProductsData.filter(p => p.status === 'published').length : 0,
        ideasRaw:          typeof ideasData        !== 'undefined' ? ideasData.filter(i => i.status === 'raw').length : 0,
        clientsActive:     typeof clientsData      !== 'undefined' ? clientsData.filter(c => c.status === 'active' || c.status === 'maintaining').length : 0,
        requestsNew:       typeof requestsData     !== 'undefined' ? requestsData.filter(r => r.status === 'new').length : 0,
    };

    // ── 維護合約到期警示（30 天內） ──
    const today = new Date();
    const in30  = new Date();
    in30.setDate(today.getDate() + 30);

    const expiringClients = typeof clientsData !== 'undefined'
        ? clientsData.filter(c => {
            if (c.status !== 'maintaining' || !c.maintain_until) return false;
            const d = new Date(c.maintain_until);
            return d >= today && d <= in30;
        })
        : [];

    // ── 最新 Requests（最多 5 筆新進） ──
    const latestRequests = typeof requestsData !== 'undefined'
        ? [...requestsData]
            .filter(r => r.status === 'new')
            .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
            .slice(0, 5)
        : [];

    // ── 待處理 Ideas（raw） ──
    const pendingIdeas = typeof ideasData !== 'undefined'
        ? ideasData.filter(i => i.status === 'raw').slice(0, 5)
        : [];

    // ── 快到期 Meetings 待辦 ──
    const urgentTodos = [];
    if (typeof meetingsData !== 'undefined') {
        meetingsData.forEach(m => {
            (m.todos || []).forEach(t => {
                if (t.status !== 'done' && t.due) {
                    const d = new Date(t.due);
                    if (d >= today && d <= in30) {
                        urgentTodos.push({ ...t, meetingTitle: m.title });
                    }
                }
            });
        });
        urgentTodos.sort((a, b) => new Date(a.due) - new Date(b.due));
    }

    document.getElementById('main-content').innerHTML = `
        <div class="page-header">
            <h1 class="page-title">DASHBOARD</h1>
            <p class="page-subtitle">工作室狀態總覽</p>
        </div>

        <!-- 數字卡片 -->
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
            ${dashCard('PROJECTS',    `${stats.projectsPublished} / ${stats.projectsTotal}`, '已上架 / 總數', 'projects')}
            ${dashCard('ASSETS',      stats.assetsTotal,       '素材總數',     'assets')}
            ${dashCard('API',         stats.apiPublished,      '已上架商品',   'api-products')}
            ${dashCard('IDEAS',       stats.ideasRaw,          '待整理點子',   'ideas')}
            ${dashCard('CLIENTS',     stats.clientsActive,     '進行中合作',   'clients')}
            ${dashCard('REQUESTS',    stats.requestsNew,       '新進詢問',     'requests', stats.requestsNew > 0)}
        </div>

        <!-- 警示：維護合約即將到期 -->
        ${expiringClients.length > 0 ? `
        <div style="margin-bottom: 2rem;">
            <div class="modal-section-label" style="margin-bottom: 1rem;">⚠ 維護合約即將到期（30 天內）</div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${expiringClients.map(c => `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: rgba(255, 200, 0, 0.05); border: 1px solid rgba(255, 200, 0, 0.2);">
                        <div>
                            <span style="font-size: 0.85rem; color: var(--admin-text);">${c.company}</span>
                            <span style="font-size: 0.75rem; color: var(--admin-text-muted); margin-left: 0.75rem;">${c.contact}</span>
                        </div>
                        <span style="font-size: 0.75rem; color: #ffc800; letter-spacing: 1px;">到期：${c.maintain_until}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <!-- 下方兩欄 -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">

            <!-- 最新詢問 -->
            <div>
                <div class="modal-section-label" style="margin-bottom: 1rem;">最新詢問</div>
                ${latestRequests.length > 0 ? `
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${latestRequests.map(r => `
                            <div style="padding: 0.75rem 1rem; background: var(--card-bg, #0e0e0e); border: 1px solid var(--admin-border); cursor: pointer;"
                                 onclick="window.location.hash='requests'">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                                    <span style="font-size: 0.82rem; color: var(--admin-text);">${r.name}</span>
                                    <span style="font-size: 0.7rem; color: var(--admin-text-muted);">${r.submitted_at}</span>
                                </div>
                                <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${r.subject}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : `<div style="color: var(--admin-text-muted); font-size: 0.8rem; letter-spacing: 1px; padding: 1rem 0;">目前沒有新進詢問</div>`}
            </div>

            <!-- 待整理點子 -->
            <div>
                <div class="modal-section-label" style="margin-bottom: 1rem;">待整理點子</div>
                ${pendingIdeas.length > 0 ? `
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${pendingIdeas.map(i => `
                            <div style="padding: 0.75rem 1rem; background: var(--card-bg, #0e0e0e); border: 1px solid var(--admin-border); cursor: pointer;"
                                 onclick="window.location.hash='ideas'">
                                <div style="font-size: 0.82rem; color: var(--admin-text); margin-bottom: 0.25rem;">${i.title}</div>
                                <div style="font-size: 0.72rem; color: var(--admin-text-muted);">${i.proposer}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : `<div style="color: var(--admin-text-muted); font-size: 0.8rem; letter-spacing: 1px; padding: 1rem 0;">沒有待整理的點子</div>`}
            </div>

        </div>

        <!-- 快到期待辦 -->
        ${urgentTodos.length > 0 ? `
        <div>
            <div class="modal-section-label" style="margin-bottom: 1rem;">快到期待辦（30 天內）</div>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>待辦事項</th>
                        <th>所屬會議</th>
                        <th>負責人</th>
                        <th>截止日</th>
                        <th>狀態</th>
                    </tr>
                </thead>
                <tbody>
                    ${urgentTodos.map(t => {
                        const ts = { pending: '未開始', doing: '進行中', done: '已完成' };
                        const tc = { pending: 'var(--admin-text-muted)', doing: '#ffc800', done: 'var(--admin-accent)' };
                        return `
                            <tr style="cursor: pointer;" onclick="window.location.hash='meetings'">
                                <td style="font-size: 0.82rem;">${t.content}</td>
                                <td style="font-size: 0.78rem; color: var(--admin-text-muted);">${t.meetingTitle}</td>
                                <td style="font-size: 0.78rem; color: var(--admin-text-muted);">${t.assignee}</td>
                                <td style="font-size: 0.78rem; color: var(--admin-text-muted); white-space: nowrap;">${t.due}</td>
                                <td style="font-size: 0.72rem; color: ${tc[t.status]}; white-space: nowrap;">${ts[t.status]}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}
    `;
}

// ── 數字卡片 helper ──
function dashCard(label, value, sub, hash, highlight = false) {
    return `
        <div onclick="window.location.hash='${hash}'"
             style="
                background: #0e0e0e;
                border: 1px solid ${highlight ? 'rgba(0,212,255,0.5)' : 'var(--admin-border)'};
                padding: 1.5rem 1.25rem;
                cursor: pointer;
                transition: border-color 0.3s, box-shadow 0.3s;
                ${highlight ? 'box-shadow: 0 0 16px rgba(0,212,255,0.15);' : ''}
             "
             onmouseenter="this.style.borderColor='rgba(0,212,255,0.4)'; this.style.boxShadow='0 0 16px rgba(0,212,255,0.1)';"
             onmouseleave="this.style.borderColor='${highlight ? 'rgba(0,212,255,0.5)' : 'var(--admin-border)'}'; this.style.boxShadow='${highlight ? '0 0 16px rgba(0,212,255,0.15)' : 'none'}';"
        >
            <div style="font-size: 0.6rem; letter-spacing: 3px; color: var(--admin-text-muted); margin-bottom: 0.75rem;">${label}</div>
            <div style="font-size: 1.8rem; font-weight: 300; color: ${highlight ? 'var(--admin-accent)' : 'var(--admin-text)'}; line-height: 1; margin-bottom: 0.4rem;">${value}</div>
            <div style="font-size: 0.7rem; letter-spacing: 1px; color: var(--admin-text-muted);">${sub}</div>
        </div>
    `;
}