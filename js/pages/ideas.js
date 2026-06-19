// ideas.js — 點子管理頁面

// ── 假資料 ──
let ideasData = [
    {
        id: 1,
        title: '後台加入深色/淺色切換',
        description: '讓管理員可以切換後台主題，減少長時間盯螢幕的疲勞。',
        proposer: 'Paul',
        status: '新點子',
        project_id: null,
        project_name: null,
        created_at: '2026-06-01',
    },
    {
        id: 2,
        title: 'API 商品頁加入試用申請表單',
        description: '讓潛在客戶可以直接在商品頁填寫試用申請，降低聯絡門檻。',
        proposer: 'Joseph',
        status: '討論中',
        project_id: 1,
        project_name: '築本官網重設計',
        created_at: '2026-06-05',
    },
    {
        id: 3,
        title: '定期發送專案進度週報給客戶',
        description: '每週五自動彙整本週完成項目，Email 發給對應客戶。',
        proposer: 'Oreo',
        status: '已採用',
        project_id: null,
        project_name: null,
        created_at: '2026-05-20',
    },
    {
        id: 4,
        title: '在官網加入合作夥伴 Logo 牆',
        description: '展示曾合作過的品牌，增加信任感。',
        proposer: 'Paul',
        status: '已放棄',
        project_id: 1,
        project_name: '築本官網重設計',
        created_at: '2026-05-10',
    },
    {
        id: 5,
        title: 'Meetings 頁面加入 AI 摘要功能',
        description: '會議記錄輸入後，自動產出重點摘要與待辦清單。',
        proposer: 'Paul',
        status: '新點子',
        project_id: null,
        project_name: null,
        created_at: '2026-06-15',
    },
];

// ── 提出者選項 ──
const IDEA_PROPOSERS = ['Paul', 'Oreo', 'Joseph'];

// ── 專案選項（假資料） ──
const IDEA_PROJECTS = [
    { id: 1, name: '築本官網重設計' },
    { id: 2, name: '品牌識別設計' },
    { id: 3, name: 'API 報價系統' },
];

// ── 狀態設定 ──
const IDEA_STATUS = {
    '新點子': { label: '新點子', cls: 'status--draft',        next: '討論中' },
    '討論中': { label: '討論中', cls: 'status--published',    next: '已採用' },
    '已採用': { label: '已採用', cls: 'idea-status--adopted', next: '已放棄' },
    '已放棄': { label: '已放棄', cls: 'status--archived',     next: '新點子' },
};

// ── 狀態篩選 / 搜尋 ──
let ideaFilterStatus = '';
let ideaFilterKeyword = '';
let ideaEditingId = null;

// ── 主渲染 ──
function renderIdeasPage() {
    ideaFilterStatus = '';
    ideaFilterKeyword = '';

    document.getElementById('main-content').innerHTML = `
        <style>
            .idea-status--adopted {
                background: rgba(0, 255, 160, 0.08);
                color: #00ffa0;
                border: 1px solid rgba(0, 255, 160, 0.3);
            }
        </style>

        <div class="page-header">
            <h1 class="page-title">IDEAS</h1>
            <p class="page-subtitle">點子管理 — 隨手記錄，追蹤進展</p>
        </div>

        <!-- Toolbar -->
        <div class="assets-toolbar page-toolbar" style="justify-content: space-between; margin-bottom: 1.25rem;">
            <div class="assets-toolbar__filters">
                <input
                    type="text"
                    class="admin-input assets-search"
                    placeholder="搜尋點子..."
                    id="idea-search"
                    oninput="ideaOnSearch(this.value)"
                />
                <select class="admin-input assets-status-filter admin-select" onchange="ideaOnStatusFilter(this.value)">
                    <option value="">全部狀態</option>
                    <option value="新點子">新點子</option>
                    <option value="討論中">討論中</option>
                    <option value="已採用">已採用</option>
                    <option value="已放棄">已放棄</option>
                </select>
            </div>
            <button class="admin-btn admin-btn--primary" onclick="ideaOpenModal(null)">+ 新增點子</button>
        </div>

        <!-- Table -->
        <div id="idea-table-wrap"></div>

        <!-- Modal 新增/編輯 -->
        <div class="modal-overlay" id="idea-modal">
            <div class="modal-box">
                <div class="modal-head">
                    <span id="idea-modal-title">新增點子</span>
                    <button class="admin-btn" onclick="ideaCloseModal()">✕</button>
                </div>
                <div class="modal-body" id="idea-modal-body"></div>
            </div>
        </div>

        <!-- Modal 刪除確認 -->
        <div class="modal-overlay" id="idea-confirm-modal">
            <div class="modal-box modal-box--confirm">
                <div class="modal-head">
                    <span>確認刪除</span>
                    <button class="admin-btn" onclick="ideaCloseConfirm()">✕</button>
                </div>
                <div class="modal-body">
                    <p class="confirm-message" id="idea-confirm-msg"></p>
                    <div class="form-actions">
                        <button class="admin-btn" onclick="ideaCloseConfirm()">取消</button>
                        <button class="admin-btn admin-btn--danger" id="idea-confirm-ok">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    ideaRenderTable();
}

// ── 渲染表格 ──
function ideaRenderTable() {
    const filtered = ideasData.filter(item => {
        const matchKeyword = item.title.includes(ideaFilterKeyword) ||
                             (item.description && item.description.includes(ideaFilterKeyword));
        const matchStatus  = ideaFilterStatus ? item.status === ideaFilterStatus : true;
        return matchKeyword && matchStatus;
    });

    const wrap = document.getElementById('idea-table-wrap');
    if (!wrap) return;

    if (filtered.length === 0) {
        wrap.innerHTML = `<div class="assets-empty" style="border: 1px dashed var(--admin-border); padding: 3rem; text-align: center; color: var(--admin-text-muted); letter-spacing: 2px; font-size: 0.8rem;">查無資料</div>`;
        return;
    }

    const rows = filtered.map((item, i) => {
        const s = IDEA_STATUS[item.status] || IDEA_STATUS['新點子'];
        return `
            <tr>
                <td class="td-index">${i + 1}</td>
                <td>
                    <div class="project-title">${item.title}</div>
                    ${item.description ? `<div class="project-slug">${item.description}</div>` : ''}
                </td>
                <td style="white-space: nowrap; color: var(--admin-text-muted); font-size: 0.8rem;">${item.proposer}</td>
                <td style="white-space: nowrap; color: var(--admin-text-muted); font-size: 0.8rem;">${item.project_name || '—'}</td>
                <td style="white-space: nowrap; font-size: 0.75rem; color: var(--admin-text-muted);">${item.created_at}</td>
                <td>
                    <span
                        class="status-badge ${s.cls}"
                        style="cursor: pointer; user-select: none;"
                        title="點擊切換狀態"
                        onclick="ideaCycleStatus(${item.id})"
                    >${s.label}</span>
                </td>
                <td>
                    <div class="td-actions">
                        <button class="admin-btn" onclick="ideaOpenModal(${item.id})">編輯</button>
                        <button class="admin-btn admin-btn--danger" onclick="ideaConfirmDelete(${item.id})">刪除</button>
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
                    <th>點子</th>
                    <th>提出者</th>
                    <th>關聯專案</th>
                    <th>建立日期</th>
                    <th>狀態</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

// ── 搜尋 / 篩選 ──
function ideaOnSearch(val) {
    ideaFilterKeyword = val.trim();
    ideaRenderTable();
}

function ideaOnStatusFilter(val) {
    ideaFilterStatus = val;
    ideaRenderTable();
}

// ── 狀態循環切換 ──
function ideaCycleStatus(id) {
    const item = ideasData.find(d => d.id === id);
    if (!item) return;
    item.status = IDEA_STATUS[item.status].next;
    ideaRenderTable();
}

// ── Modal 開關 ──
function ideaOpenModal(id) {
    ideaEditingId = id;
    const item = id ? ideasData.find(d => d.id === id) : null;

    document.getElementById('idea-modal-title').textContent = id ? '編輯點子' : '新增點子';

    document.getElementById('idea-modal-body').innerHTML = `
        <div class="form-row">
            <label class="form-label">標題 *</label>
            <input class="admin-input" id="idea-f-title" value="${item ? item.title : ''}" placeholder="這個點子叫什麼..." />
        </div>

        <div class="form-row">
            <label class="form-label">描述</label>
            <textarea class="admin-input admin-textarea" id="idea-f-desc" placeholder="簡短說明這個點子的內容或動機...">${item ? (item.description || '') : ''}</textarea>
        </div>

        <div class="form-row--half">
            <div class="form-row">
                <label class="form-label">提出者</label>
                <select class="admin-input admin-select" id="idea-f-proposer">
                    ${IDEA_PROPOSERS.map(p => `
                        <option value="${p}" ${item && item.proposer === p ? 'selected' : ''}>${p}</option>
                    `).join('')}
                </select>
            </div>
            <div class="form-row">
                <label class="form-label">狀態</label>
                <select class="admin-input admin-select" id="idea-f-status">
                    <option value="新點子"     ${(!item || item.status === '新點子') ? 'selected' : ''}>新點子</option>
                    <option value="討論中" ${item && item.status === '討論中'    ? 'selected' : ''}>討論中</option>
                    <option value="已採用" ${item && item.status === '已採用'    ? 'selected' : ''}>已採用</option>
                    <option value="已放棄" ${item && item.status === '已放棄'    ? 'selected' : ''}>已放棄</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <label class="form-label">關聯專案（選填）</label>
            <select class="admin-input admin-select" id="idea-f-project">
                <option value="">— 無 —</option>
                ${IDEA_PROJECTS.map(p => `
                    <option value="${p.id}" ${item && item.project_id === p.id ? 'selected' : ''}>${p.name}</option>
                `).join('')}
            </select>
        </div>

        <div class="form-actions">
            <button class="admin-btn" onclick="ideaCloseModal()">取消</button>
            <button class="admin-btn admin-btn--primary" onclick="ideaSave()">儲存</button>
        </div>
    `;

    document.getElementById('idea-modal').classList.add('is-active');
}

function ideaCloseModal() {
    document.getElementById('idea-modal').classList.remove('is-active');
    ideaEditingId = null;
}

// ── 儲存 ──
function ideaSave() {
    const title     = document.getElementById('idea-f-title').value.trim();
    const desc      = document.getElementById('idea-f-desc').value.trim();
    const proposer  = document.getElementById('idea-f-proposer').value;
    const status    = document.getElementById('idea-f-status').value;
    const projectId = parseInt(document.getElementById('idea-f-project').value) || null;
    const projectObj = IDEA_PROJECTS.find(p => p.id === projectId);

    if (!title) {
        alert('標題為必填');
        return;
    }

    if (ideaEditingId) {
        const idx = ideasData.findIndex(d => d.id === ideaEditingId);
        if (idx !== -1) {
            ideasData[idx] = {
                ...ideasData[idx],
                title, description: desc, proposer, status,
                project_id: projectId,
                project_name: projectObj ? projectObj.name : null,
            };
        }
    } else {
        const today = new Date().toISOString().slice(0, 10);
        const newId = ideasData.length ? Math.max(...ideasData.map(d => d.id)) + 1 : 1;
        ideasData.push({
            id: newId, title, description: desc, proposer, status,
            project_id: projectId,
            project_name: projectObj ? projectObj.name : null,
            created_at: today,
        });
    }

    ideaCloseModal();
    ideaRenderTable();
}

// ── 刪除確認 ──
function ideaConfirmDelete(id) {
    const item = ideasData.find(d => d.id === id);
    if (!item) return;

    document.getElementById('idea-confirm-msg').textContent = `確定要刪除「${item.title}」？`;
    document.getElementById('idea-confirm-ok').onclick = () => ideaDelete(id);
    document.getElementById('idea-confirm-modal').classList.add('is-active');
}

function ideaCloseConfirm() {
    document.getElementById('idea-confirm-modal').classList.remove('is-active');
}

function ideaDelete(id) {
    ideasData = ideasData.filter(d => d.id !== id);
    ideaCloseConfirm();
    ideaRenderTable();
}