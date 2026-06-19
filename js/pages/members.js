// members.js — 成員管理頁面

// ── 假資料 ──
let membersData = [
    {
        id: 1,
        name: 'Paul Wang',
        role: '工程師',
        email: 'paul@zhuben.studio',
    },
    {
        id: 2,
        name: 'Oreo',
        role: '美術編輯',
        email: 'oreo@zhuben.studio',
    },
    {
        id: 3,
        name: 'Joseph',
        role: '導演',
        email: 'joseph@zhuben.studio',
    },
];

// ── 狀態 ──
let memberEditingId = null;

// ── 主渲染 ──
function renderMembersPage() {
    document.getElementById('main-content').innerHTML = `
        <div class="page-header">
            <h1 class="page-title">MEMBERS</h1>
            <p class="page-subtitle">成員管理</p>
        </div>

        <div class="page-toolbar">
            <button class="admin-btn admin-btn--primary" onclick="memberOpenModal(null)">+ 新增成員</button>
        </div>

        <div id="member-table-wrap"></div>

        <!-- Modal 新增/編輯 -->
        <div class="modal-overlay" id="member-modal">
            <div class="modal-box">
                <div class="modal-head">
                    <span id="member-modal-title">新增成員</span>
                    <button class="admin-btn" onclick="memberCloseModal()">✕</button>
                </div>
                <div class="modal-body" id="member-modal-body"></div>
            </div>
        </div>

        <!-- Modal 刪除確認 -->
        <div class="modal-overlay" id="member-confirm-modal">
            <div class="modal-box modal-box--confirm">
                <div class="modal-head">
                    <span>確認刪除</span>
                    <button class="admin-btn" onclick="memberCloseConfirm()">✕</button>
                </div>
                <div class="modal-body">
                    <p class="confirm-message" id="member-confirm-msg"></p>
                    <div class="form-actions">
                        <button class="admin-btn" onclick="memberCloseConfirm()">取消</button>
                        <button class="admin-btn admin-btn--danger" id="member-confirm-ok">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    memberRenderTable();
}

// ── 渲染表格 ──
function memberRenderTable() {
    const wrap = document.getElementById('member-table-wrap');
    if (!wrap) return;

    if (membersData.length === 0) {
        wrap.innerHTML = `<div class="assets-empty" style="border: 1px dashed var(--admin-border); padding: 3rem; text-align: center; color: var(--admin-text-muted); letter-spacing: 2px; font-size: 0.8rem;">尚無成員</div>`;
        return;
    }

    const rows = membersData.map((m, i) => `
        <tr>
            <td class="td-index">${i + 1}</td>
            <td>
                <div class="project-title">${m.name}</div>
            </td>
            <td style="color: var(--admin-text-muted); font-size: 0.82rem;">${m.role}</td>
            <td>
                <a href="mailto:${m.email}" style="color: var(--admin-accent); text-decoration: none; font-size: 0.82rem;">${m.email}</a>
            </td>
            <td>
                <div class="td-actions">
                    <button class="admin-btn" onclick="memberOpenModal(${m.id})">編輯</button>
                    <button class="admin-btn admin-btn--danger" onclick="memberConfirmDelete(${m.id})">刪除</button>
                </div>
            </td>
        </tr>
    `).join('');

    wrap.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>姓名</th>
                    <th>角色</th>
                    <th>Email</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

// ── Modal 開關 ──
function memberOpenModal(id) {
    memberEditingId = id;
    const m = id ? membersData.find(d => d.id === id) : null;

    document.getElementById('member-modal-title').textContent = id ? '編輯成員' : '新增成員';
    document.getElementById('member-modal-body').innerHTML = `
        <div class="form-row">
            <label class="form-label">姓名 *</label>
            <input class="admin-input" id="mb-f-name" value="${m ? m.name : ''}" placeholder="e.g. Paul Wang" />
        </div>
        <div class="form-row">
            <label class="form-label">角色</label>
            <input class="admin-input" id="mb-f-role" value="${m ? m.role : ''}" placeholder="e.g. 工程師" />
        </div>
        <div class="form-row">
            <label class="form-label">Email</label>
            <input class="admin-input" id="mb-f-email" type="email" value="${m ? m.email : ''}" placeholder="e.g. paul@zhuben.studio" />
        </div>
        <div class="form-actions">
            <button class="admin-btn" onclick="memberCloseModal()">取消</button>
            <button class="admin-btn admin-btn--primary" onclick="memberSave()">儲存</button>
        </div>
    `;

    document.getElementById('member-modal').classList.add('is-active');
}

function memberCloseModal() {
    document.getElementById('member-modal').classList.remove('is-active');
    memberEditingId = null;
}

// ── 儲存 ──
function memberSave() {
    const name = document.getElementById('mb-f-name').value.trim();
    if (!name) { alert('姓名為必填'); return; }

    const payload = {
        name,
        role:  document.getElementById('mb-f-role').value.trim(),
        email: document.getElementById('mb-f-email').value.trim(),
    };

    if (memberEditingId) {
        const idx = membersData.findIndex(d => d.id === memberEditingId);
        if (idx !== -1) membersData[idx] = { ...membersData[idx], ...payload };
    } else {
        const newId = membersData.length ? Math.max(...membersData.map(d => d.id)) + 1 : 1;
        membersData.push({ id: newId, ...payload });
    }

    memberCloseModal();
    memberRenderTable();
}

// ── 刪除確認 ──
function memberConfirmDelete(id) {
    const m = membersData.find(d => d.id === id);
    if (!m) return;
    document.getElementById('member-confirm-msg').textContent = `確定要刪除「${m.name}」？`;
    document.getElementById('member-confirm-ok').onclick = () => memberDelete(id);
    document.getElementById('member-confirm-modal').classList.add('is-active');
}

function memberCloseConfirm() {
    document.getElementById('member-confirm-modal').classList.remove('is-active');
}

function memberDelete(id) {
    membersData = membersData.filter(d => d.id !== id);
    memberCloseConfirm();
    memberRenderTable();
}