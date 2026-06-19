// clients.js — 客戶管理頁面

// ── 假資料 ──
let clientsData = [
    {
        id: 1,
        company: '范氏企業',
        contact: '范總',
        email: 'fan@example.com',
        phone: '0912-345-678',
        status: 'ended',
        note: '品牌識別設計專案，已交付完畢。',
        maintain_items: '',
        maintain_fee: '',
        maintain_until: '',
    },
    {
        id: 2,
        company: '得嘉野餐廳',
        contact: '王老闆',
        email: 'dejia@example.com',
        phone: '02-2345-6789',
        status: 'maintaining',
        note: '官網建置完成，目前進行月費維護。',
        maintain_items: '網站更新、主機管理、Facebook 粉絲數同步',
        maintain_fee: 'NT$ 3,000 / 月',
        maintain_until: '2026-12-31',
    },
    {
        id: 3,
        company: '裕達科技',
        contact: '李專員',
        email: 'li@yuda.com.tw',
        phone: '0987-654-321',
        status: 'active',
        note: 'API 報價系統開發中。',
        maintain_items: '',
        maintain_fee: '',
        maintain_until: '',
    },
];

// ── 狀態設定 ──
const CLIENT_STATUS = {
    active:      { label: '合作中',   cls: 'status--published' },
    maintaining: { label: '維護中',   cls: 'status--draft' },
    ended:       { label: '合作結束', cls: 'status--archived' },
};

// ── 狀態 ──
let clientFilterKeyword = '';
let clientFilterStatus = '';
let clientEditingId = null;

// ── 主渲染 ──
function renderClientsPage() {
    clientFilterKeyword = '';
    clientFilterStatus = '';

    document.getElementById('main-content').innerHTML = `
        <div class="page-header">
            <h1 class="page-title">CLIENTS</h1>
            <p class="page-subtitle">客戶管理 — 合作中 / 維護中 / 合作結束</p>
        </div>

        <!-- Toolbar -->
        <div class="assets-toolbar page-toolbar" style="justify-content: space-between; margin-bottom: 1.25rem;">
            <div class="assets-toolbar__filters">
                <input
                    type="text"
                    class="admin-input assets-search"
                    placeholder="搜尋公司 / 聯絡人..."
                    oninput="clientOnSearch(this.value)"
                />
                <select class="admin-input assets-status-filter admin-select" onchange="clientOnStatusFilter(this.value)">
                    <option value="">全部狀態</option>
                    <option value="active">合作中</option>
                    <option value="maintaining">維護中</option>
                    <option value="ended">合作結束</option>
                </select>
            </div>
            <button class="admin-btn admin-btn--primary" onclick="clientOpenModal(null)">+ 新增客戶</button>
        </div>

        <!-- Table -->
        <div id="client-table-wrap"></div>

        <!-- Modal 新增/編輯 -->
        <div class="modal-overlay" id="client-modal">
            <div class="modal-box modal-box--wide">
                <div class="modal-head">
                    <span id="client-modal-title">新增客戶</span>
                    <button class="admin-btn" onclick="clientCloseModal()">✕</button>
                </div>
                <div class="modal-body" id="client-modal-body"></div>
            </div>
        </div>

        <!-- Modal 刪除確認 -->
        <div class="modal-overlay" id="client-confirm-modal">
            <div class="modal-box modal-box--confirm">
                <div class="modal-head">
                    <span>確認刪除</span>
                    <button class="admin-btn" onclick="clientCloseConfirm()">✕</button>
                </div>
                <div class="modal-body">
                    <p class="confirm-message" id="client-confirm-msg"></p>
                    <div class="form-actions">
                        <button class="admin-btn" onclick="clientCloseConfirm()">取消</button>
                        <button class="admin-btn admin-btn--danger" id="client-confirm-ok">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    clientRenderTable();
}

// ── 渲染表格 ──
function clientRenderTable() {
    const filtered = clientsData.filter(c => {
        const matchKeyword = c.company.includes(clientFilterKeyword) ||
                             c.contact.includes(clientFilterKeyword);
        const matchStatus  = clientFilterStatus ? c.status === clientFilterStatus : true;
        return matchKeyword && matchStatus;
    });

    const wrap = document.getElementById('client-table-wrap');
    if (!wrap) return;

    if (filtered.length === 0) {
        wrap.innerHTML = `<div class="assets-empty" style="border: 1px dashed var(--admin-border); padding: 3rem; text-align: center; color: var(--admin-text-muted); letter-spacing: 2px; font-size: 0.8rem;">查無資料</div>`;
        return;
    }

    const rows = filtered.map((c, i) => {
        const s = CLIENT_STATUS[c.status] || CLIENT_STATUS.active;
        const maintainUntil = c.status === 'maintaining' && c.maintain_until
            ? `<div class="project-slug">到期：${c.maintain_until}</div>`
            : '';

        return `
            <tr>
                <td class="td-index">${i + 1}</td>
                <td>
                    <div class="project-title">${c.company}</div>
                    <div class="project-slug">${c.contact}</div>
                </td>
                <td>
                    <div style="font-size: 0.82rem;">
                        <a href="mailto:${c.email}" style="color: var(--admin-accent); text-decoration: none;">${c.email}</a>
                    </div>
                    <div class="project-slug">${c.phone || '—'}</div>
                </td>
                <td>
                    ${c.maintain_items
                        ? `<div style="font-size: 0.78rem; color: var(--admin-text-muted);">${c.maintain_items}</div>`
                        : '<div style="color: var(--admin-text-muted); font-size: 0.78rem;">—</div>'
                    }
                    ${maintainUntil}
                </td>
                <td style="white-space: nowrap; font-size: 0.8rem; color: var(--admin-text-muted);">
                    ${c.maintain_fee || '—'}
                </td>
                <td><span class="status-badge ${s.cls}">${s.label}</span></td>
                <td>
                    <div class="td-actions">
                        <button class="admin-btn" onclick="clientOpenModal(${c.id})">編輯</button>
                        <button class="admin-btn admin-btn--danger" onclick="clientConfirmDelete(${c.id})">刪除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    wrap.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>公司 / 聯絡人</th>
                    <th>聯絡方式</th>
                    <th>維護項目</th>
                    <th>月費</th>
                    <th>狀態</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

// ── 搜尋 / 篩選 ──
function clientOnSearch(val) {
    clientFilterKeyword = val.trim();
    clientRenderTable();
}

function clientOnStatusFilter(val) {
    clientFilterStatus = val;
    clientRenderTable();
}

// ── Modal 開關 ──
function clientOpenModal(id) {
    clientEditingId = id;
    const c = id ? clientsData.find(d => d.id === id) : null;

    document.getElementById('client-modal-title').textContent = id ? '編輯客戶' : '新增客戶';

    document.getElementById('client-modal-body').innerHTML = `

        <div class="modal-section-label">基本資料</div>

        <div class="form-row--half">
            <div class="form-row">
                <label class="form-label">公司名稱 *</label>
                <input class="admin-input" id="cl-f-company" value="${c ? c.company : ''}" placeholder="e.g. 得嘉野餐廳" />
            </div>
            <div class="form-row">
                <label class="form-label">聯絡人</label>
                <input class="admin-input" id="cl-f-contact" value="${c ? c.contact : ''}" placeholder="e.g. 王老闆" />
            </div>
        </div>

        <div class="form-row--half">
            <div class="form-row">
                <label class="form-label">Email</label>
                <input class="admin-input" id="cl-f-email" type="email" value="${c ? c.email : ''}" placeholder="e.g. contact@example.com" />
            </div>
            <div class="form-row">
                <label class="form-label">電話</label>
                <input class="admin-input" id="cl-f-phone" value="${c ? c.phone : ''}" placeholder="e.g. 0912-345-678" />
            </div>
        </div>

        <div class="form-row">
            <label class="form-label">狀態</label>
            <select class="admin-input admin-select" id="cl-f-status" onchange="clientToggleMaintain(this.value)">
                <option value="active"      ${(!c || c.status === 'active')      ? 'selected' : ''}>合作中</option>
                <option value="maintaining" ${c && c.status === 'maintaining'    ? 'selected' : ''}>維護中</option>
                <option value="ended"       ${c && c.status === 'ended'          ? 'selected' : ''}>合作結束</option>
            </select>
        </div>

        <!-- 維護欄位（維護中才顯示） -->
        <div id="cl-maintain-section" style="display: ${c && c.status === 'maintaining' ? 'flex' : 'none'}; flex-direction: column; gap: 1rem;">
            <div class="modal-section-label">維護資訊</div>

            <div class="form-row">
                <label class="form-label">維護項目</label>
                <input class="admin-input" id="cl-f-maintain-items" value="${c ? (c.maintain_items || '') : ''}" placeholder="e.g. 網站更新、主機管理" />
            </div>

            <div class="form-row--half">
                <div class="form-row">
                    <label class="form-label">月費</label>
                    <input class="admin-input" id="cl-f-maintain-fee" value="${c ? (c.maintain_fee || '') : ''}" placeholder="e.g. NT$ 3,000 / 月" />
                </div>
                <div class="form-row">
                    <label class="form-label">合約到期日</label>
                    <input class="admin-input" id="cl-f-maintain-until" type="date" value="${c ? (c.maintain_until || '') : ''}" />
                </div>
            </div>
        </div>

        <div class="modal-section-label">備註</div>

        <div class="form-row">
            <textarea class="admin-input admin-textarea" id="cl-f-note" placeholder="內部備忘...">${c ? (c.note || '') : ''}</textarea>
        </div>

        <div class="form-actions">
            <button class="admin-btn" onclick="clientCloseModal()">取消</button>
            <button class="admin-btn admin-btn--primary" onclick="clientSave()">儲存</button>
        </div>
    `;

    document.getElementById('client-modal').classList.add('is-active');
}

// ── 維護欄位顯示切換 ──
function clientToggleMaintain(val) {
    const section = document.getElementById('cl-maintain-section');
    if (!section) return;
    section.style.display = val === 'maintaining' ? 'flex' : 'none';
}

function clientCloseModal() {
    document.getElementById('client-modal').classList.remove('is-active');
    clientEditingId = null;
}

// ── 儲存 ──
function clientSave() {
    const company = document.getElementById('cl-f-company').value.trim();
    if (!company) { alert('公司名稱為必填'); return; }

    const status = document.getElementById('cl-f-status').value;

    const payload = {
        company,
        contact:        document.getElementById('cl-f-contact').value.trim(),
        email:          document.getElementById('cl-f-email').value.trim(),
        phone:          document.getElementById('cl-f-phone').value.trim(),
        status,
        note:           document.getElementById('cl-f-note').value.trim(),
        maintain_items: status === 'maintaining' ? document.getElementById('cl-f-maintain-items').value.trim() : '',
        maintain_fee:   status === 'maintaining' ? document.getElementById('cl-f-maintain-fee').value.trim() : '',
        maintain_until: status === 'maintaining' ? document.getElementById('cl-f-maintain-until').value : '',
    };

    if (clientEditingId) {
        const idx = clientsData.findIndex(d => d.id === clientEditingId);
        if (idx !== -1) clientsData[idx] = { ...clientsData[idx], ...payload };
    } else {
        const newId = clientsData.length ? Math.max(...clientsData.map(d => d.id)) + 1 : 1;
        clientsData.push({ id: newId, ...payload });
    }

    clientCloseModal();
    clientRenderTable();
}

// ── 刪除確認 ──
function clientConfirmDelete(id) {
    const c = clientsData.find(d => d.id === id);
    if (!c) return;
    document.getElementById('client-confirm-msg').textContent = `確定要刪除「${c.company}」？`;
    document.getElementById('client-confirm-ok').onclick = () => clientDelete(id);
    document.getElementById('client-confirm-modal').classList.add('is-active');
}

function clientCloseConfirm() {
    document.getElementById('client-confirm-modal').classList.remove('is-active');
}

function clientDelete(id) {
    clientsData = clientsData.filter(d => d.id !== id);
    clientCloseConfirm();
    clientRenderTable();
}