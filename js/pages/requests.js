// requests.js — 客戶詢問列表

// ── 假資料 ──
let requestsData = [
    {
        id: 1,
        name: '陳大明',
        email: 'daming.chen@example.com',
        subject: '網站設計詢價',
        message: '您好，我們公司需要重新設計企業官網，想了解貴工作室的報價與工作流程，請問方便提供相關資訊嗎？',
        submitted_at: '2026-06-18 14:32',
        status: 'new',
        note: '',
    },
    {
        id: 2,
        name: '林小芳',
        email: 'xiaofang.lin@example.com',
        subject: 'API 商品試用申請',
        message: '想了解圖片壓縮 API 的試用方案，我們目前每月大約有 5000 次的壓縮需求，請問有適合的方案嗎？',
        submitted_at: '2026-06-17 09:15',
        status: 'read',
        note: '已寄報價單，等待回覆。',
    },
    {
        id: 3,
        name: '王建國',
        email: 'jianguo.wang@example.com',
        subject: '品牌識別設計合作',
        message: '我們是一家新創公司，正在尋找品牌設計合作夥伴，包含 Logo、名片、社群視覺等，希望能進一步討論。',
        submitted_at: '2026-06-15 16:45',
        status: 'replied',
        note: '已安排 6/22 線上會議。',
    },
    {
        id: 4,
        name: 'Sarah Wu',
        email: 'sarah.wu@example.com',
        subject: 'OCR API 整合諮詢',
        message: 'Hi, we are looking for an OCR solution to integrate into our document management system. Could you share more details about your OCR API capabilities and pricing?',
        submitted_at: '2026-06-14 11:20',
        status: 'replied',
        note: '英文客戶，已用英文回覆。',
    },
];

// ── 狀態設定 ──
const REQ_STATUS = {
    new:     { label: '新進',   cls: 'status--draft',     next: 'read' },
    read:    { label: '已讀',   cls: 'status--published', next: 'replied' },
    replied: { label: '已回覆', cls: 'status--archived',  next: 'new' },
};

// ── 狀態 ──
let reqFilterKeyword = '';
let reqViewingId = null;

// ── 主渲染 ──
function renderRequestsPage() {
    reqFilterKeyword = '';

    document.getElementById('main-content').innerHTML = `
        <div class="page-header">
            <h1 class="page-title">REQUESTS</h1>
            <p class="page-subtitle">客戶詢問列表 — 唯讀</p>
        </div>

        <!-- Toolbar -->
        <div class="assets-toolbar page-toolbar" style="justify-content: space-between; margin-bottom: 1.25rem;">
            <div class="assets-toolbar__filters">
                <input
                    type="text"
                    class="admin-input assets-search"
                    placeholder="搜尋姓名 / Email / 主旨..."
                    oninput="reqOnSearch(this.value)"
                />
            </div>
        </div>

        <!-- Table -->
        <div id="req-table-wrap"></div>

        <!-- Modal 詳細內容 -->
        <div class="modal-overlay" id="req-modal">
            <div class="modal-box modal-box--wide">
                <div class="modal-head">
                    <span id="req-modal-title">詢問詳情</span>
                    <button class="admin-btn" onclick="reqCloseModal()">✕</button>
                </div>
                <div class="modal-body" id="req-modal-body"></div>
            </div>
        </div>
    `;

    reqRenderTable();
}

// ── 渲染表格 ──
function reqRenderTable() {
    const filtered = requestsData.filter(r => {
        const kw = reqFilterKeyword;
        return r.name.includes(kw) || r.email.includes(kw) || r.subject.includes(kw);
    });

    const wrap = document.getElementById('req-table-wrap');
    if (!wrap) return;

    if (filtered.length === 0) {
        wrap.innerHTML = `<div class="assets-empty" style="border: 1px dashed var(--admin-border); padding: 3rem; text-align: center; color: var(--admin-text-muted); letter-spacing: 2px; font-size: 0.8rem;">查無資料</div>`;
        return;
    }

    const rows = filtered.map((r, i) => {
        const s = REQ_STATUS[r.status] || REQ_STATUS.new;
        const preview = r.message.length > 40 ? r.message.slice(0, 40) + '...' : r.message;

        return `
            <tr style="cursor: pointer;" onclick="reqOpenModal(${r.id})">
                <td class="td-index">${i + 1}</td>
                <td>
                    <div class="project-title">${r.name}</div>
                    <div class="project-slug">${r.email}</div>
                </td>
                <td>
                    <div style="font-size: 0.82rem; color: var(--admin-text);">${r.subject}</div>
                    <div style="font-size: 0.75rem; color: var(--admin-text-muted); margin-top: 2px;">${preview}</div>
                </td>
                <td style="white-space: nowrap; color: var(--admin-text-muted); font-size: 0.75rem;">${r.submitted_at}</td>
                <td>
                    <span
                        class="status-badge ${s.cls}"
                        style="cursor: pointer; user-select: none;"
                        title="點擊切換狀態"
                        onclick="event.stopPropagation(); reqCycleStatus(${r.id})"
                    >${s.label}</span>
                </td>
            </tr>
        `;
    }).join('');

    wrap.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>客戶</th>
                    <th>詢問內容</th>
                    <th>時間</th>
                    <th>狀態</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

// ── 搜尋 ──
function reqOnSearch(val) {
    reqFilterKeyword = val.trim();
    reqRenderTable();
}

// ── 狀態循環切換 ──
function reqCycleStatus(id) {
    const r = requestsData.find(d => d.id === id);
    if (!r) return;
    r.status = REQ_STATUS[r.status].next;
    reqRenderTable();
}

// ── Modal 開關 ──
function reqOpenModal(id) {
    reqViewingId = id;
    const r = requestsData.find(d => d.id === id);
    if (!r) return;

    const s = REQ_STATUS[r.status] || REQ_STATUS.new;

    document.getElementById('req-modal-title').textContent = r.subject;
    document.getElementById('req-modal-body').innerHTML = `

        <div class="modal-section-label">客戶資訊</div>

        <div class="form-row--half">
            <div class="form-row">
                <label class="form-label">姓名</label>
                <div style="font-size: 0.85rem; color: var(--admin-text); padding: 0.4rem 0;">${r.name}</div>
            </div>
            <div class="form-row">
                <label class="form-label">Email</label>
                <div style="font-size: 0.85rem; color: var(--admin-accent); padding: 0.4rem 0;">
                    <a href="mailto:${r.email}" style="color: var(--admin-accent); text-decoration: none;">${r.email}</a>
                </div>
            </div>
        </div>

        <div class="form-row--half">
            <div class="form-row">
                <label class="form-label">送出時間</label>
                <div style="font-size: 0.85rem; color: var(--admin-text-muted); padding: 0.4rem 0;">${r.submitted_at}</div>
            </div>
            <div class="form-row">
                <label class="form-label">狀態</label>
                <div style="padding: 0.4rem 0;">
                    <span
                        class="status-badge ${s.cls}"
                        style="cursor: pointer; user-select: none;"
                        title="點擊切換狀態"
                        onclick="reqCycleStatusFromModal(${r.id})"
                    >${s.label}</span>
                </div>
            </div>
        </div>

        <div class="modal-section-label">詢問內容</div>

        <div style="font-size: 0.85rem; color: var(--admin-text); line-height: 1.8; padding: 0.75rem; background: #050d18; border: 1px solid var(--admin-border);">
            ${r.message.replace(/\n/g, '<br>')}
        </div>

        <div class="modal-section-label">備註</div>

        <div class="form-row">
            <textarea
                class="admin-input admin-textarea"
                id="req-note-input"
                placeholder="內部備註，僅團隊可見..."
                style="min-height: 80px;"
            >${r.note || ''}</textarea>
        </div>

        <div class="form-actions">
            <button class="admin-btn" onclick="reqCloseModal()">關閉</button>
            <button class="admin-btn admin-btn--primary" onclick="reqSaveNote(${r.id})">儲存備註</button>
        </div>
    `;

    document.getElementById('req-modal').classList.add('is-active');
}

function reqCloseModal() {
    document.getElementById('req-modal').classList.remove('is-active');
    reqViewingId = null;
}

// ── Modal 內切換狀態 ──
function reqCycleStatusFromModal(id) {
    reqCycleStatus(id);
    // 重新渲染 Modal 內的狀態 badge
    const r = requestsData.find(d => d.id === id);
    if (!r) return;
    const s = REQ_STATUS[r.status] || REQ_STATUS.new;
    const badge = document.querySelector('#req-modal-body .status-badge');
    if (badge) {
        badge.className = `status-badge ${s.cls}`;
        badge.textContent = s.label;
    }
}

// ── 儲存備註 ──
function reqSaveNote(id) {
    const note = document.getElementById('req-note-input').value.trim();
    const r = requestsData.find(d => d.id === id);
    if (!r) return;
    r.note = note;
    reqCloseModal();
    reqRenderTable();
}