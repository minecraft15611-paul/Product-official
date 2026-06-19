// js/pages/projects.js — Projects 頁面

// ── 假資料 ──
let projectsData = [
    {
        id: 1, title: '築本官網重設計', slug: 'zhuben-website-redesign',
        client_name: '築本數位工作室', cover_url: '',
        description: '工作室官網全面翻新，強調科技感與高級感。',
        project_url: 'https://zhuben.studio',
        completed_at: '2026-03-15', status: 'published', sort_order: 1,
    },
    {
        id: 2, title: '品牌識別設計', slug: 'brand-identity-design',
        client_name: '范氏企業', cover_url: '',
        description: 'Logo、名片、品牌色彩系統完整規劃。',
        project_url: '',
        completed_at: '2026-01-20', status: 'published', sort_order: 2,
    },
    {
        id: 3, title: 'API 報價系統', slug: 'api-quote-system',
        client_name: '裕達科技', cover_url: '',
        description: '自動化報價單產生系統，串接內部 ERP。',
        project_url: '',
        completed_at: '', status: 'draft', sort_order: 3,
    },
    {
        id: 4, title: '電商平台前端', slug: 'ecommerce-frontend',
        client_name: '橙果商行', cover_url: '',
        description: 'Vue 3 電商前端，含購物車與會員系統。',
        project_url: '',
        completed_at: '2025-11-30', status: 'archived', sort_order: 4,
    },
];

const PROJ_STATUS_LABEL = {
    published: { text: 'PUBLISHED', cls: 'status--published' },
    draft:     { text: 'DRAFT',     cls: 'status--draft' },
    archived:  { text: 'ARCHIVED',  cls: 'status--archived' },
};

const PAGE_SIZE = 10;
let currentPage = 1;
let editingId = null;

// ── 主渲染 ──
function renderProjectsPage() {
    document.getElementById('main-content').innerHTML = `
        <div class="page-header">
            <h1 class="page-title">PROJECTS</h1>
            <p class="page-subtitle">專案管理</p>
        </div>

        <div class="page-toolbar">
            <button class="admin-btn admin-btn--primary" onclick="openModal()">+ 新增專案</button>
        </div>

        <table class="admin-table">
            <thead>
                <tr>
                    <th>名稱</th>
                    <th>客戶</th>
                    <th>狀態</th>
                    <th>完成日期</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="projects-tbody"></tbody>
        </table>

        <div class="pagination" id="pagination"></div>

        <!-- Modal -->
        <div class="modal-overlay" id="project-modal">
            <div class="modal-box">
                <div class="modal-head">
                    <span id="modal-title-label">新增專案</span>
                    <button class="admin-btn" onclick="closeModal()">關閉 ✕</button>
                </div>
                <div class="modal-body">
                    <div class="form-row">
                        <label class="form-label">名稱 *</label>
                        <input class="admin-input" id="f-title" placeholder="專案名稱"
                               oninput="autoSlug()">
                    </div>
                    <div class="form-row">
                        <label class="form-label">Slug *</label>
                        <input class="admin-input" id="f-slug" placeholder="url-friendly-path">
                    </div>
                    <div class="form-row">
                        <label class="form-label">客戶名稱</label>
                        <input class="admin-input" id="f-client" placeholder="客戶名稱">
                    </div>
                    <div class="form-row">
                        <label class="form-label">封面圖網址</label>
                        <input class="admin-input" id="f-cover" placeholder="https://...">
                    </div>
                    <div class="form-row">
                        <label class="form-label">專案網址</label>
                        <input class="admin-input" id="f-url" placeholder="https://...">
                    </div>
                    <div class="form-row">
                        <label class="form-label">描述</label>
                        <textarea class="admin-input admin-textarea" id="f-desc"
                                  placeholder="專案描述"></textarea>
                    </div>
                    <div class="form-row form-row--half">
                        <div>
                            <label class="form-label">完成日期</label>
                            <input class="admin-input" id="f-date" type="date">
                        </div>
                        <div>
                            <label class="form-label">狀態</label>
                            <select class="admin-input admin-select" id="f-status">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <label class="form-label">排序</label>
                        <input class="admin-input" id="f-sort" type="number" value="0" min="0">
                    </div>
                    <div class="form-actions">
                        <button class="admin-btn" onclick="closeModal()">取消</button>
                        <button class="admin-btn admin-btn--primary" onclick="saveProject()">儲存</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderTable();
}

// ── 表格渲染 ──
function renderTable() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageData = projectsData.slice(start, start + PAGE_SIZE);

    document.getElementById('projects-tbody').innerHTML = pageData.map(p => {
        const s = PROJ_STATUS_LABEL[p.status] || PROJ_STATUS_LABEL.draft;
        return `
            <tr>
                <td>
                    <div class="project-title">${p.title}</div>
                    <div class="project-slug">${p.slug}</div>
                </td>
                <td>${p.client_name || '—'}</td>
                <td><span class="status-badge ${s.cls}">${s.text}</span></td>
                <td>${p.completed_at || '—'}</td>
                <td>
                    <div class="td-actions">
                        <button class="admin-btn" onclick="openModal(${p.id})">編輯</button>
                        <button class="admin-btn admin-btn--danger" onclick="deleteProject(${p.id})">刪除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    renderPagination();
}

// ── 分頁 ──
function renderPagination() {
    const total = Math.ceil(projectsData.length / PAGE_SIZE);
    if (total <= 1) {
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    let html = '';
    for (let i = 1; i <= total; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'is-active' : ''}"
                         onclick="goPage(${i})">${i}</button>`;
    }
    document.getElementById('pagination').innerHTML = html;
}

function goPage(n) {
    currentPage = n;
    renderTable();
}

// ── Modal ──
function openModal(id = null) {
    editingId = id;
    document.getElementById('modal-title-label').textContent = id ? '編輯專案' : '新增專案';

    if (id) {
        const p = projectsData.find(d => d.id === id);
        document.getElementById('f-title').value  = p.title;
        document.getElementById('f-slug').value   = p.slug;
        document.getElementById('f-client').value = p.client_name;
        document.getElementById('f-cover').value  = p.cover_url;
        document.getElementById('f-url').value    = p.project_url;
        document.getElementById('f-desc').value   = p.description;
        document.getElementById('f-date').value   = p.completed_at;
        document.getElementById('f-status').value = p.status;
        document.getElementById('f-sort').value   = p.sort_order;
    } else {
        ['f-title','f-slug','f-client','f-cover','f-url','f-desc','f-date'].forEach(id => {
            document.getElementById(id).value = '';
        });
        document.getElementById('f-status').value = 'draft';
        document.getElementById('f-sort').value   = '0';
    }

    document.getElementById('project-modal').classList.add('is-active');
}

function closeModal() {
    document.getElementById('project-modal').classList.remove('is-active');
    editingId = null;
}

// ── Slug 自動產生 ──
function autoSlug() {
    if (editingId) return; // 編輯時不自動覆蓋
    const title = document.getElementById('f-title').value;
    document.getElementById('f-slug').value = toSlug(title);
}

function toSlug(str) {
    return str
        .toLowerCase()
        .replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, '') // 移除中文
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// ── 儲存 ──
function saveProject() {
    const title = document.getElementById('f-title').value.trim();
    const slug  = document.getElementById('f-slug').value.trim();
    if (!title || !slug) {
        alert('名稱與 Slug 為必填');
        return;
    }

    const payload = {
        title,
        slug,
        client_name:  document.getElementById('f-client').value.trim(),
        cover_url:    document.getElementById('f-cover').value.trim(),
        project_url:  document.getElementById('f-url').value.trim(),
        description:  document.getElementById('f-desc').value.trim(),
        completed_at: document.getElementById('f-date').value,
        status:       document.getElementById('f-status').value,
        sort_order:   parseInt(document.getElementById('f-sort').value) || 0,
    };

    if (editingId) {
        const idx = projectsData.findIndex(d => d.id === editingId);
        projectsData[idx] = { ...projectsData[idx], ...payload };
    } else {
        const newId = projectsData.length ? Math.max(...projectsData.map(d => d.id)) + 1 : 1;
        projectsData.push({ id: newId, ...payload });
    }

    closeModal();
    renderTable();
}

// ── 刪除 ──
function deleteProject(id) {
    if (!confirm('確定刪除此專案？')) return;
    projectsData = projectsData.filter(d => d.id !== id);
    if (currentPage > Math.ceil(projectsData.length / PAGE_SIZE)) currentPage = 1;
    renderTable();
}