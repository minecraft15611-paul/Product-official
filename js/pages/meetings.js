// meetings.js — 會議記錄頁面

// ── 假資料 ──
let meetingsData = [
    {
        id: 1,
        title: '工作室 Q2 方向討論',
        date: '2026-06-10',
        members: ['Paul', 'Oreo', 'Joseph'],
        project_id: null,
        project_name: null,
        status: 'done',
        points: '- 確認 Q2 主力產品為 API 商品線\n- 官網需在 7 月底前上線\n- 行銷方向以 LinkedIn 為主',
        conclusion: '聚焦 API 商品開發，官網同步推進，Joseph 負責對外社群。',
        todos: [
            { id: 1, content: '完成 API Products 頁面', assignee: 'Paul', due: '2026-06-30', status: 'doing' },
            { id: 2, content: '撰寫 LinkedIn 首篇貼文', assignee: 'Joseph', due: '2026-06-20', status: 'done' },
            { id: 3, content: '設計官網 Hero 區塊', assignee: 'Oreo', due: '2026-07-05', status: 'pending' },
        ],
    },
    {
        id: 2,
        title: '得嘉野網站維護會議',
        date: '2026-06-15',
        members: ['Paul', 'Joseph'],
        project_id: null,
        project_name: null,
        status: 'done',
        points: '- Facebook 粉絲數顯示異常，需排查 Supabase pipeline\n- 客戶希望新增菜單更新功能',
        conclusion: 'Paul 排查 API token 問題，菜單功能列入下一版需求。',
        todos: [
            { id: 1, content: '排查 Facebook Graph API token', assignee: 'Paul', due: '2026-06-18', status: 'done' },
            { id: 2, content: '評估菜單功能開發工時', assignee: 'Paul', due: '2026-06-25', status: 'pending' },
        ],
    },
    {
        id: 3,
        title: '後台系統開發進度同步',
        date: '2026-06-19',
        members: ['Paul', 'Oreo', 'Joseph'],
        project_id: null,
        project_name: null,
        status: 'scheduled',
        points: '',
        conclusion: '',
        todos: [],
    },
];

// ── 選項 ──
const MTG_MEMBERS = ['Paul', 'Oreo', 'Joseph'];

const MTG_PROJECTS = [
    { id: 1, name: '築本官網重設計' },
    { id: 2, name: '品牌識別設計' },
    { id: 3, name: 'API 報價系統' },
];

const MTG_STATUS = {
    scheduled: { label: 'SCHEDULED', cls: 'status--draft' },
    done:      { label: 'DONE',      cls: 'status--published' },
    cancelled: { label: 'CANCELLED', cls: 'status--archived' },
};

const TODO_STATUS = {
    pending: { label: '未開始', cls: '#4a7a9b',     next: 'doing' },
    doing:   { label: '進行中', cls: '#ffc800',     next: 'done' },
    done:    { label: '已完成', cls: '#00d4ff',     next: 'pending' },
};

// ── 狀態 ──
let mtgFilterStatus = '';
let mtgFilterKeyword = '';
let mtgEditingId = null;
let mtgTodos = [];   // 編輯中的待辦清單暫存

// ── 主渲染 ──
function renderMeetingsPage() {
    mtgFilterStatus = '';
    mtgFilterKeyword = '';

    document.getElementById('main-content').innerHTML = `
        <div class="page-header">
            <h1 class="page-title">MEETINGS</h1>
            <p class="page-subtitle">會議記錄 — 主題・結論・待辦</p>
        </div>

        <!-- Toolbar -->
        <div class="assets-toolbar page-toolbar" style="justify-content: space-between; margin-bottom: 1.25rem;">
            <div class="assets-toolbar__filters">
                <input
                    type="text"
                    class="admin-input assets-search"
                    placeholder="搜尋會議標題..."
                    oninput="mtgOnSearch(this.value)"
                />
                <select class="admin-input assets-status-filter admin-select" onchange="mtgOnStatusFilter(this.value)">
                    <option value="">全部狀態</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="done">Done</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            <button class="admin-btn admin-btn--primary" onclick="mtgOpenModal(null)">+ 新增會議</button>
        </div>

        <!-- Table -->
        <div id="mtg-table-wrap"></div>

        <!-- Modal 新增/編輯 -->
        <div class="modal-overlay" id="mtg-modal">
            <div class="modal-box modal-box--wide">
                <div class="modal-head">
                    <span id="mtg-modal-title">新增會議</span>
                    <button class="admin-btn" onclick="mtgCloseModal()">✕</button>
                </div>
                <div class="modal-body" id="mtg-modal-body"></div>
            </div>
        </div>

        <!-- Modal 刪除確認 -->
        <div class="modal-overlay" id="mtg-confirm-modal">
            <div class="modal-box modal-box--confirm">
                <div class="modal-head">
                    <span>確認刪除</span>
                    <button class="admin-btn" onclick="mtgCloseConfirm()">✕</button>
                </div>
                <div class="modal-body">
                    <p class="confirm-message" id="mtg-confirm-msg"></p>
                    <div class="form-actions">
                        <button class="admin-btn" onclick="mtgCloseConfirm()">取消</button>
                        <button class="admin-btn admin-btn--danger" id="mtg-confirm-ok">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    mtgRenderTable();
}

// ── 渲染表格 ──
function mtgRenderTable() {
    const filtered = meetingsData.filter(m => {
        const matchKeyword = m.title.includes(mtgFilterKeyword);
        const matchStatus  = mtgFilterStatus ? m.status === mtgFilterStatus : true;
        return matchKeyword && matchStatus;
    });

    const wrap = document.getElementById('mtg-table-wrap');
    if (!wrap) return;

    if (filtered.length === 0) {
        wrap.innerHTML = `<div class="assets-empty" style="border: 1px dashed var(--admin-border); padding: 3rem; text-align: center; color: var(--admin-text-muted); letter-spacing: 2px; font-size: 0.8rem;">查無資料</div>`;
        return;
    }

    const rows = filtered.map((m, i) => {
        const s = MTG_STATUS[m.status] || MTG_STATUS.scheduled;
        const todoDone  = m.todos.filter(t => t.status === 'done').length;
        const todoTotal = m.todos.length;
        const todoText  = todoTotal > 0 ? `${todoDone} / ${todoTotal}` : '—';
        const todoColor = todoTotal > 0 && todoDone === todoTotal ? '#00d4ff' : 'var(--admin-text-muted)';

        return `
            <tr>
                <td class="td-index">${i + 1}</td>
                <td>
                    <div class="project-title">${m.title}</div>
                    <div class="project-slug">${m.members.join('・')}</div>
                </td>
                <td style="white-space: nowrap; color: var(--admin-text-muted); font-size: 0.8rem;">${m.date}</td>
                <td style="white-space: nowrap; color: var(--admin-text-muted); font-size: 0.8rem;">${m.project_name || '—'}</td>
                <td style="white-space: nowrap; font-size: 0.8rem; color: ${todoColor};">${todoText}</td>
                <td><span class="status-badge ${s.cls}">${s.label}</span></td>
                <td>
                    <div class="td-actions">
                        <button class="admin-btn" onclick="mtgOpenModal(${m.id})">編輯</button>
                        <button class="admin-btn admin-btn--danger" onclick="mtgConfirmDelete(${m.id})">刪除</button>
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
                    <th>會議</th>
                    <th>日期</th>
                    <th>關聯專案</th>
                    <th>待辦進度</th>
                    <th>狀態</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

// ── 搜尋 / 篩選 ──
function mtgOnSearch(val) {
    mtgFilterKeyword = val.trim();
    mtgRenderTable();
}

function mtgOnStatusFilter(val) {
    mtgFilterStatus = val;
    mtgRenderTable();
}

// ── Modal 開關 ──
function mtgOpenModal(id) {
    mtgEditingId = id;
    const m = id ? meetingsData.find(d => d.id === id) : null;
    mtgTodos = m ? JSON.parse(JSON.stringify(m.todos)) : [];

    document.getElementById('mtg-modal-title').textContent = id ? '編輯會議' : '新增會議';
    mtgRenderModalBody(m);
    document.getElementById('mtg-modal').classList.add('is-active');
}

function mtgRenderModalBody(m) {
    const selectedMembers = m ? m.members : [];

    document.getElementById('mtg-modal-body').innerHTML = `
        <!-- 基本資訊 -->
        <div class="modal-section-label">基本資訊</div>

        <div class="form-row">
            <label class="form-label">會議標題 *</label>
            <input class="admin-input" id="mtg-f-title" value="${m ? m.title : ''}" placeholder="e.g. Q2 方向討論" />
        </div>

        <div class="form-row--half">
            <div class="form-row">
                <label class="form-label">日期</label>
                <input class="admin-input" id="mtg-f-date" type="date" value="${m ? m.date : new Date().toISOString().slice(0,10)}" />
            </div>
            <div class="form-row">
                <label class="form-label">狀態</label>
                <select class="admin-input admin-select" id="mtg-f-status">
                    <option value="scheduled" ${(!m || m.status === 'scheduled') ? 'selected' : ''}>Scheduled</option>
                    <option value="done"      ${m && m.status === 'done'         ? 'selected' : ''}>Done</option>
                    <option value="cancelled" ${m && m.status === 'cancelled'    ? 'selected' : ''}>Cancelled</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <label class="form-label">參與成員</label>
            <div class="tag-picker" id="mtg-member-picker">
                ${MTG_MEMBERS.map(name => `
                    <button type="button"
                        class="tag-pill ${selectedMembers.includes(name) ? 'is-selected' : ''}"
                        onclick="this.classList.toggle('is-selected')">
                        ${name}
                    </button>
                `).join('')}
            </div>
        </div>

        <div class="form-row">
            <label class="form-label">關聯專案（選填）</label>
            <select class="admin-input admin-select" id="mtg-f-project">
                <option value="">— 無 —</option>
                ${MTG_PROJECTS.map(p => `
                    <option value="${p.id}" ${m && m.project_id === p.id ? 'selected' : ''}>${p.name}</option>
                `).join('')}
            </select>
        </div>

        <!-- 會議內容 -->
        <div class="modal-section-label">會議內容</div>

        <div class="form-row">
            <label class="form-label">討論重點（每行一條）</label>
            <textarea class="admin-input admin-textarea" id="mtg-f-points" style="min-height: 100px;" placeholder="- 討論項目一&#10;- 討論項目二">${m ? (m.points || '') : ''}</textarea>
        </div>

        <div class="form-row">
            <label class="form-label">結論</label>
            <textarea class="admin-input admin-textarea" id="mtg-f-conclusion" placeholder="本次會議的最終決議...">${m ? (m.conclusion || '') : ''}</textarea>
        </div>

        <!-- 待辦清單 -->
        <div class="modal-section-label">待辦清單</div>

        <div id="mtg-todos-wrap"></div>

        <div class="ref-add-row" style="margin-top: 1rem;">
            <input class="admin-input" id="mtg-todo-input" placeholder="新增待辦事項..." style="flex: 1;" />
            <select class="admin-input admin-select" id="mtg-todo-assignee" style="width: 120px;">
                ${MTG_MEMBERS.map(name => `<option value="${name}">${name}</option>`).join('')}
            </select>
            <input class="admin-input" id="mtg-todo-due" type="date" style="width: 150px;" />
            <button class="admin-btn admin-btn--primary" onclick="mtgAddTodo()">新增</button>
        </div>

        <div class="form-actions">
            <button class="admin-btn" onclick="mtgCloseModal()">取消</button>
            <button class="admin-btn admin-btn--primary" onclick="mtgSave()">儲存</button>
        </div>
    `;

    mtgRenderTodos();
}

// ── 待辦渲染 ──
function mtgRenderTodos() {
    const wrap = document.getElementById('mtg-todos-wrap');
    if (!wrap) return;

    if (mtgTodos.length === 0) {
        wrap.innerHTML = `<div style="color: var(--admin-text-muted); font-size: 0.8rem; letter-spacing: 1px; padding: 0.5rem 0;">尚無待辦事項</div>`;
        return;
    }

    wrap.innerHTML = mtgTodos.map((t, i) => {
        const ts = TODO_STATUS[t.status] || TODO_STATUS.pending;
        return `
            <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0; border-bottom: 1px solid var(--admin-border);">
                <span
                    style="font-size: 0.65rem; letter-spacing: 1px; padding: 0.2rem 0.6rem; border: 1px solid ${ts.cls}; color: ${ts.cls}; cursor: pointer; white-space: nowrap; border-radius: 2px;"
                    onclick="mtgCycleTodo(${i})"
                >${ts.label}</span>
                <span style="flex: 1; font-size: 0.82rem; color: var(--admin-text); ${t.status === 'done' ? 'opacity: 0.4; text-decoration: line-through;' : ''}">${t.content}</span>
                <span style="font-size: 0.75rem; color: var(--admin-text-muted); white-space: nowrap;">${t.assignee}</span>
                <span style="font-size: 0.75rem; color: var(--admin-text-muted); white-space: nowrap;">${t.due || '—'}</span>
                <button class="admin-btn admin-btn--danger" style="padding: 0.25rem 0.6rem; font-size: 0.7rem;" onclick="mtgRemoveTodo(${i})">✕</button>
            </div>
        `;
    }).join('');
}

// ── 待辦操作 ──
function mtgAddTodo() {
    const content  = document.getElementById('mtg-todo-input').value.trim();
    const assignee = document.getElementById('mtg-todo-assignee').value;
    const due      = document.getElementById('mtg-todo-due').value;

    if (!content) return;

    const newId = mtgTodos.length ? Math.max(...mtgTodos.map(t => t.id)) + 1 : 1;
    mtgTodos.push({ id: newId, content, assignee, due, status: 'pending' });
    document.getElementById('mtg-todo-input').value = '';
    document.getElementById('mtg-todo-due').value = '';
    mtgRenderTodos();
}

function mtgCycleTodo(idx) {
    const t = mtgTodos[idx];
    if (!t) return;
    t.status = TODO_STATUS[t.status].next;
    mtgRenderTodos();
}

function mtgRemoveTodo(idx) {
    mtgTodos.splice(idx, 1);
    mtgRenderTodos();
}

// ── 儲存 ──
function mtgSave() {
    const title = document.getElementById('mtg-f-title').value.trim();
    if (!title) { alert('會議標題為必填'); return; }

    const members = [...document.querySelectorAll('#mtg-member-picker .tag-pill.is-selected')]
        .map(btn => btn.textContent.trim());

    const projectId  = parseInt(document.getElementById('mtg-f-project').value) || null;
    const projectObj = MTG_PROJECTS.find(p => p.id === projectId);

    const payload = {
        title,
        date:         document.getElementById('mtg-f-date').value,
        status:       document.getElementById('mtg-f-status').value,
        members,
        project_id:   projectId,
        project_name: projectObj ? projectObj.name : null,
        points:       document.getElementById('mtg-f-points').value.trim(),
        conclusion:   document.getElementById('mtg-f-conclusion').value.trim(),
        todos:        JSON.parse(JSON.stringify(mtgTodos)),
    };

    if (mtgEditingId) {
        const idx = meetingsData.findIndex(d => d.id === mtgEditingId);
        if (idx !== -1) meetingsData[idx] = { ...meetingsData[idx], ...payload };
    } else {
        const newId = meetingsData.length ? Math.max(...meetingsData.map(d => d.id)) + 1 : 1;
        meetingsData.push({ id: newId, ...payload });
    }

    mtgCloseModal();
    mtgRenderTable();
}

function mtgCloseModal() {
    document.getElementById('mtg-modal').classList.remove('is-active');
    mtgEditingId = null;
    mtgTodos = [];
}

// ── 刪除確認 ──
function mtgConfirmDelete(id) {
    const m = meetingsData.find(d => d.id === id);
    if (!m) return;
    document.getElementById('mtg-confirm-msg').textContent = `確定要刪除「${m.title}」？`;
    document.getElementById('mtg-confirm-ok').onclick = () => mtgDelete(id);
    document.getElementById('mtg-confirm-modal').classList.add('is-active');
}

function mtgCloseConfirm() {
    document.getElementById('mtg-confirm-modal').classList.remove('is-active');
}

function mtgDelete(id) {
    meetingsData = meetingsData.filter(d => d.id !== id);
    mtgCloseConfirm();
    mtgRenderTable();
}