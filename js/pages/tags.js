// js/pages/tags.js — Tags / 分類 / 作者 / Members 頁面

// ── 假資料 ──
const tagsData = {
    tags: [
        { id: 1, name: '品牌設計' },
        { id: 2, name: 'UI/UX' },
        { id: 3, name: '動態設計' },
        { id: 4, name: '插畫' },
    ],
    categories: [
        { id: 1, name: 'LAYOUT' },
        { id: 2, name: 'MOTION' },
        { id: 3, name: 'PRINT' },
    ],
    authors: [
        { id: 1, name: 'Paul' },
        { id: 2, name: 'Alice' },
    ],
    members: [
        { id: 1, name: 'Paul', role: '工程師' },
        { id: 2, name: 'Alice', role: '設計師' },
    ],
};

let activeTab = 'tags';

// ── Tab 設定 ──
const tabConfig = {
    tags:       { label: 'Tags',   fields: ['name'] },
    categories: { label: '分類',   fields: ['name'] },
    authors:    { label: '作者',   fields: ['name'] },
    members:    { label: 'Members', fields: ['name', 'role'] },
};

// ── 渲染主頁面 ──
function renderTagsPage() {
    document.getElementById('main-content').innerHTML = `
        <div class="page-header">
            <h1 class="page-title">TAGS / 分類 / 作者 / MEMBERS</h1>
            <p class="page-subtitle">參考資料管理</p>
        </div>

        <div class="ref-tabs">
            ${Object.entries(tabConfig).map(([key, cfg]) => `
                <button class="ref-tab ${key === activeTab ? 'is-active' : ''}"
                        onclick="switchTab('${key}')">
                    ${cfg.label}
                </button>
            `).join('')}
        </div>

        <div id="ref-panel"></div>
    `;

    renderPanel();
}

// ── 渲染當前 tab 的內容 ──
function renderPanel() {
    const data = tagsData[activeTab];
    const isMembers = activeTab === 'members';

    document.getElementById('ref-panel').innerHTML = `
        <div class="ref-panel">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>名稱</th>
                        ${isMembers ? '<th>職稱</th>' : ''}
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map((item, i) => `
                        <tr>
                            <td class="td-index">${i + 1}</td>
                            <td>
                                <span class="ref-name" id="name-${item.id}">${item.name}</span>
                                <input class="ref-inline-input" id="input-name-${item.id}"
                                       value="${item.name}" style="display:none;">
                            </td>
                            ${isMembers ? `
                            <td>
                                <span class="ref-name" id="role-${item.id}">${item.role}</span>
                                <input class="ref-inline-input" id="input-role-${item.id}"
                                       value="${item.role}" style="display:none;">
                            </td>` : ''}
                            <td class="td-actions">
                                <button class="admin-btn" id="edit-btn-${item.id}"
                                        onclick="startEdit(${item.id})">編輯</button>
                                <button class="admin-btn" id="save-btn-${item.id}"
                                        onclick="saveEdit(${item.id})" style="display:none;">儲存</button>
                                <button class="admin-btn admin-btn--danger"
                                        onclick="deleteItem(${item.id})">刪除</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="ref-add-row">
                <input class="admin-input" id="new-name" placeholder="${isMembers ? '姓名' : '名稱'}">
                ${isMembers ? '<input class="admin-input" id="new-role" placeholder="職稱">' : ''}
                <button class="admin-btn admin-btn--primary" onclick="addItem()">+ 新增</button>
            </div>
        </div>
    `;
}

// ── Tab 切換 ──
function switchTab(tab) {
    activeTab = tab;
    renderTagsPage();
}

// ── 新增 ──
function addItem() {
    const nameInput = document.getElementById('new-name');
    const name = nameInput.value.trim();
    if (!name) return;

    const data = tagsData[activeTab];
    const newId = data.length ? Math.max(...data.map(d => d.id)) + 1 : 1;

    if (activeTab === 'members') {
        const roleInput = document.getElementById('new-role');
        const role = roleInput.value.trim();
        data.push({ id: newId, name, role: role || '—' });
    } else {
        data.push({ id: newId, name });
    }

    renderPanel();
}

// ── 編輯（inline） ──
function startEdit(id) {
    document.getElementById(`name-${id}`).style.display = 'none';
    document.getElementById(`input-name-${id}`).style.display = 'inline-block';
    document.getElementById(`edit-btn-${id}`).style.display = 'none';
    document.getElementById(`save-btn-${id}`).style.display = 'inline-block';

    if (activeTab === 'members') {
        document.getElementById(`role-${id}`).style.display = 'none';
        document.getElementById(`input-role-${id}`).style.display = 'inline-block';
    }
}

function saveEdit(id) {
    const data = tagsData[activeTab];
    const item = data.find(d => d.id === id);
    const newName = document.getElementById(`input-name-${id}`).value.trim();
    if (!newName) return;

    item.name = newName;

    if (activeTab === 'members') {
        item.role = document.getElementById(`input-role-${id}`).value.trim() || '—';
    }

    renderPanel();
}

// ── 刪除 ──
function deleteItem(id) {
    if (!confirm('確定刪除？')) return;
    tagsData[activeTab] = tagsData[activeTab].filter(d => d.id !== id);
    renderPanel();
}