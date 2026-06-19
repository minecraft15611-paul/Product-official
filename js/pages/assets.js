// js/pages/assets.js — Assets 頁面

// ── 假資料 ──
let assetsData = [
    {
        id: 1, title: 'Hero Section 動畫背景', slug: 'hero-section-animation',
        preview_url: '',
        description: '首頁 Hero 區塊的粒子動畫背景，可調整密度與顏色。',
        code_snippet: `const canvas = document.getElementById('hero-canvas');\nconst ctx = canvas.getContext('2d');\n// 粒子初始化邏輯...`,
        status: 'published', sort_order: 1,
        author_id: 1, author_name: 'Paul',
        category_id: 1, category_name: 'Animation',
        project_id: 1, project_name: '築本官網重設計',
        tag_ids: [1, 2], tag_names: ['canvas', 'animation'],
    },
    {
        id: 2, title: '通用 Modal 元件', slug: 'universal-modal-component',
        preview_url: '',
        description: '支援 backdrop blur、淡入淡出動畫的通用 Modal，可嵌入任何頁面。',
        code_snippet: `function openModal(id) {\n  document.getElementById(id).classList.add('is-active');\n}\nfunction closeModal(id) {\n  document.getElementById(id).classList.remove('is-active');\n}`,
        status: 'published', sort_order: 2,
        author_id: 1, author_name: 'Paul',
        category_id: 2, category_name: 'UI Component',
        project_id: null, project_name: null,
        tag_ids: [3], tag_names: ['vanilla-js'],
    },
    {
        id: 3, title: '品牌色彩 CSS 變數包', slug: 'brand-color-variables',
        preview_url: '',
        description: '築本品牌色彩系統的完整 CSS 變數定義，前台與後台分開。',
        code_snippet: `:root {\n  --accent-blue: #1a4fff;\n  --admin-accent: #00d4ff;\n  --bg-dark: #0a0a0a;\n}`,
        status: 'published', sort_order: 3,
        author_id: 2, author_name: 'Oreo',
        category_id: 3, category_name: 'Style',
        project_id: null, project_name: null,
        tag_ids: [4, 5], tag_names: ['css', 'design-system'],
    },
    {
        id: 4, title: 'Slug 產生器函式', slug: 'slug-generator-function',
        preview_url: '',
        description: '將中英文混合標題轉換為 URL-friendly slug 的通用函式。',
        code_snippet: `function toSlug(str) {\n  return str\n    .toLowerCase()\n    .replace(/[\\u4e00-\\u9fff]/g, '')\n    .replace(/[^a-z0-9\\s-]/g, '')\n    .trim()\n    .replace(/\\s+/g, '-');\n}`,
        status: 'draft', sort_order: 4,
        author_id: 1, author_name: 'Paul',
        category_id: 4, category_name: 'Utility',
        project_id: null, project_name: null,
        tag_ids: [3], tag_names: ['vanilla-js'],
    },
    {
        id: 5, title: '卡片 Hover 光暈效果', slug: 'card-hover-glow',
        preview_url: '',
        description: '科技感卡片的 hover 動畫，含底部藍線展開與光暈效果。',
        code_snippet: `.card {\n  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;\n}\n.card:hover {\n  border-color: rgba(26, 79, 255, 0.5);\n  box-shadow: 0 0 28px rgba(26, 79, 255, 0.15);\n  transform: translateY(-5px);\n}`,
        status: 'archived', sort_order: 5,
        author_id: 2, author_name: 'Oreo',
        category_id: 3, category_name: 'Style',
        project_id: 1, project_name: '築本官網重設計',
        tag_ids: [4, 6], tag_names: ['css', 'animation'],
    },
];

// ── 假資料：下拉選單來源 ──
const authorsOptions = [
    { id: 1, name: 'Paul' },
    { id: 2, name: 'Oreo' },
    { id: 3, name: 'Joseph' },
];

const categoriesOptions = [
    { id: 1, name: 'Animation' },
    { id: 2, name: 'UI Component' },
    { id: 3, name: 'Style' },
    { id: 4, name: 'Utility' },
];

const projectsOptions = [
    { id: 1, name: '築本官網重設計' },
    { id: 2, name: '品牌識別設計' },
    { id: 3, name: 'API 報價系統' },
];

const tagsOptions = [
    { id: 1, name: 'canvas' },
    { id: 2, name: 'animation' },
    { id: 3, name: 'vanilla-js' },
    { id: 4, name: 'css' },
    { id: 5, name: 'design-system' },
    { id: 6, name: 'hover' },
];

// ── 常數 ──
const ASSET_STATUS_LABEL = {
    published: { text: 'PUBLISHED', cls: 'status--published' },
    draft:     { text: 'DRAFT',     cls: 'status--draft' },
    archived:  { text: 'ARCHIVED',  cls: 'status--archived' },
};

const PAGE_SIZE_ASSETS = 10;
let assetsCurrentPage = 1;
let assetsEditingId = null;
let assetsSelectedTagIds = [];
let assetsFilterStatus = '';
let assetsFilterKeyword = '';

// ── 主渲染 ──
function renderAssetsPage() {
    assetsCurrentPage = 1;
    assetsFilterStatus = '';
    assetsFilterKeyword = '';

    document.getElementById('main-content').innerHTML = `
        <div class="page-header">
            <h1 class="page-title">ASSETS</h1>
            <p class="page-subtitle">素材庫管理</p>
        </div>

        <div class="page-toolbar assets-toolbar">
            <div class="assets-toolbar__filters">
                <input class="admin-input assets-search"
                       id="assets-search"
                       placeholder="搜尋名稱 / Slug..."
                       oninput="assetsOnSearch(this.value)">
                <select class="admin-input admin-select assets-status-filter"
                        id="assets-status-filter"
                        onchange="assetsOnStatusFilter(this.value)">
                    <option value="">全部狀態</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                </select>
            </div>
            <button class="admin-btn admin-btn--primary" onclick="openAssetModal()">+ 新增素材</button>
        </div>

        <table class="admin-table">
            <thead>
                <tr>
                    <th>名稱</th>
                    <th style="width:120px;">分類</th>
                    <th style="width:80px;">作者</th>
                    <th>Tags</th>
                    <th style="width:110px;">狀態</th>
                    <th style="width:1%;white-space:nowrap;">操作</th>
                </tr>
            </thead>
            <tbody id="assets-tbody"></tbody>
        </table>

        <div class="pagination" id="assets-pagination"></div>

        <!-- Modal -->
        <div class="modal-overlay" id="asset-modal">
            <div class="modal-box modal-box--wide">
                <div class="modal-head">
                    <span id="asset-modal-title">新增素材</span>
                    <button class="admin-btn" onclick="closeAssetModal()">關閉 ✕</button>
                </div>
                <div class="modal-body">

                    <!-- 區塊一：基本資訊 -->
                    <div class="modal-section-label">基本資訊</div>

                    <div class="form-row form-row--half">
                        <div>
                            <label class="form-label">名稱 *</label>
                            <input class="admin-input" id="af-title"
                                   placeholder="素材名稱"
                                   oninput="assetAutoSlug()">
                        </div>
                        <div>
                            <label class="form-label">Slug *</label>
                            <input class="admin-input" id="af-slug"
                                   placeholder="url-friendly-slug">
                        </div>
                    </div>

                    <div class="form-row form-row--half">
                        <div>
                            <label class="form-label">狀態</label>
                            <select class="admin-input admin-select" id="af-status">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div>
                            <label class="form-label">排序</label>
                            <input class="admin-input" id="af-sort"
                                   type="number" value="0" min="0">
                        </div>
                    </div>

                    <!-- 區塊二：內容 -->
                    <div class="modal-section-label">內容</div>

                    <div class="form-row">
                        <label class="form-label">預覽圖網址</label>
                        <input class="admin-input" id="af-preview"
                               placeholder="https://...">
                    </div>

                    <div class="form-row">
                        <label class="form-label">描述</label>
                        <textarea class="admin-input admin-textarea" id="af-desc"
                                  placeholder="素材用途說明"></textarea>
                    </div>

                    <div class="form-row">
                        <label class="form-label">Code Snippet</label>
                        <textarea class="admin-input admin-textarea admin-code-area"
                                  id="af-code"
                                  placeholder="貼上可重複使用的程式碼..."></textarea>
                    </div>

                    <!-- 區塊三：關聯 -->
                    <div class="modal-section-label">關聯</div>

                    <div class="form-row form-row--third">
                        <div>
                            <label class="form-label">作者</label>
                            <select class="admin-input admin-select" id="af-author">
                                <option value="">— 選擇作者 —</option>
                                ${authorsOptions.map(a =>
                                    `<option value="${a.id}">${a.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="form-label">分類</label>
                            <select class="admin-input admin-select" id="af-category">
                                <option value="">— 選擇分類 —</option>
                                ${categoriesOptions.map(c =>
                                    `<option value="${c.id}">${c.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="form-label">專案（選填）</label>
                            <select class="admin-input admin-select" id="af-project">
                                <option value="">— 無關聯專案 —</option>
                                ${projectsOptions.map(p =>
                                    `<option value="${p.id}">${p.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <label class="form-label">Tags</label>
                        <div class="tag-picker" id="af-tags">
                            ${tagsOptions.map(t => `
                                <button type="button"
                                        class="tag-pill"
                                        data-tag-id="${t.id}"
                                        onclick="toggleAssetTag(${t.id})">
                                    ${t.name}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="form-actions">
                        <button class="admin-btn" onclick="closeAssetModal()">取消</button>
                        <button class="admin-btn admin-btn--primary" onclick="saveAsset()">儲存</button>
                    </div>

                </div>
            </div>
        </div>

        <!-- Confirm Dialog -->
        <div class="modal-overlay" id="asset-confirm-modal">
            <div class="modal-box modal-box--confirm">
                <div class="modal-head">
                    <span>確認刪除</span>
                </div>
                <div class="modal-body">
                    <p class="confirm-message">確定要刪除此素材？此操作無法復原。</p>
                    <div class="form-actions">
                        <button class="admin-btn" onclick="closeAssetConfirm()">取消</button>
                        <button class="admin-btn admin-btn--danger" id="asset-confirm-ok">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    renderAssetsTable();
}

// ── 取得過濾後資料 ──
function getFilteredAssets() {
    return assetsData.filter(a => {
        const matchKeyword = !assetsFilterKeyword ||
            a.title.toLowerCase().includes(assetsFilterKeyword.toLowerCase()) ||
            a.slug.toLowerCase().includes(assetsFilterKeyword.toLowerCase());
        const matchStatus = !assetsFilterStatus || a.status === assetsFilterStatus;
        return matchKeyword && matchStatus;
    });
}

// ── 表格渲染 ──
function renderAssetsTable() {
    const filtered = getFilteredAssets();
    const start = (assetsCurrentPage - 1) * PAGE_SIZE_ASSETS;
    const pageData = filtered.slice(start, start + PAGE_SIZE_ASSETS);

    document.getElementById('assets-tbody').innerHTML = pageData.length
        ? pageData.map(a => {
            const s = ASSET_STATUS_LABEL[a.status] || ASSET_STATUS_LABEL.draft;
            const tags = (a.tag_names || [])
                .map(t => `<span class="tag-badge">${t}</span>`)
                .join('');
            return `
                <tr>
                    <td>
                        <div class="project-title">${a.title}</div>
                        <div class="project-slug">${a.slug}</div>
                    </td>
                    <td>${a.category_name || '—'}</td>
                    <td>${a.author_name || '—'}</td>
                    <td><div class="tag-badge-group">${tags || '—'}</div></td>
                    <td><span class="status-badge ${s.cls}">${s.text}</span></td>
                    <td>
                        <div class="td-actions">
                            <button class="admin-btn" onclick="openAssetModal(${a.id})">編輯</button>
                            <button class="admin-btn admin-btn--danger" onclick="confirmDeleteAsset(${a.id})">刪除</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('')
        : `<tr><td colspan="6" class="assets-empty">沒有符合條件的素材</td></tr>`;

    renderAssetsPagination(filtered.length);
}

// ── 分頁 ──
function renderAssetsPagination(total) {
    const totalPages = Math.ceil(total / PAGE_SIZE_ASSETS);
    const el = document.getElementById('assets-pagination');
    if (totalPages <= 1) { el.innerHTML = ''; return; }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === assetsCurrentPage ? 'is-active' : ''}"
                         onclick="assetsGoPage(${i})">${i}</button>`;
    }
    el.innerHTML = html;
}

function assetsGoPage(n) {
    assetsCurrentPage = n;
    renderAssetsTable();
}

// ── 搜尋 / 篩選 ──
function assetsOnSearch(val) {
    assetsFilterKeyword = val;
    assetsCurrentPage = 1;
    renderAssetsTable();
}

function assetsOnStatusFilter(val) {
    assetsFilterStatus = val;
    assetsCurrentPage = 1;
    renderAssetsTable();
}

// ── Modal ──
function openAssetModal(id = null) {
    assetsEditingId = id;
    assetsSelectedTagIds = [];

    document.getElementById('asset-modal-title').textContent = id ? '編輯素材' : '新增素材';

    if (id) {
        const a = assetsData.find(d => d.id === id);
        document.getElementById('af-title').value    = a.title;
        document.getElementById('af-slug').value     = a.slug;
        document.getElementById('af-status').value   = a.status;
        document.getElementById('af-sort').value     = a.sort_order;
        document.getElementById('af-preview').value  = a.preview_url || '';
        document.getElementById('af-desc').value     = a.description || '';
        document.getElementById('af-code').value     = a.code_snippet || '';
        document.getElementById('af-author').value   = a.author_id || '';
        document.getElementById('af-category').value = a.category_id || '';
        document.getElementById('af-project').value  = a.project_id || '';
        assetsSelectedTagIds = [...(a.tag_ids || [])];
    } else {
        ['af-title','af-slug','af-preview','af-desc','af-code'].forEach(id => {
            document.getElementById(id).value = '';
        });
        document.getElementById('af-status').value   = 'draft';
        document.getElementById('af-sort').value     = '0';
        document.getElementById('af-author').value   = '';
        document.getElementById('af-category').value = '';
        document.getElementById('af-project').value  = '';
    }

    renderTagPills();
    document.getElementById('asset-modal').classList.add('is-active');
}

function closeAssetModal() {
    document.getElementById('asset-modal').classList.remove('is-active');
    assetsEditingId = null;
    assetsSelectedTagIds = [];
}

// ── Tag Picker ──
function renderTagPills() {
    document.querySelectorAll('#af-tags .tag-pill').forEach(btn => {
        const tid = parseInt(btn.dataset.tagId);
        btn.classList.toggle('is-selected', assetsSelectedTagIds.includes(tid));
    });
}

function toggleAssetTag(tagId) {
    const idx = assetsSelectedTagIds.indexOf(tagId);
    if (idx === -1) {
        assetsSelectedTagIds.push(tagId);
    } else {
        assetsSelectedTagIds.splice(idx, 1);
    }
    renderTagPills();
}

// ── Slug 自動產生 ──
function assetAutoSlug() {
    if (assetsEditingId) return;
    const title = document.getElementById('af-title').value;
    document.getElementById('af-slug').value = assetToSlug(title);
}

function assetToSlug(str) {
    return str
        .toLowerCase()
        .replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// ── 儲存 ──
function saveAsset() {
    const title = document.getElementById('af-title').value.trim();
    const slug  = document.getElementById('af-slug').value.trim();
    if (!title || !slug) {
        alert('名稱與 Slug 為必填');
        return;
    }

    const authorId   = parseInt(document.getElementById('af-author').value) || null;
    const categoryId = parseInt(document.getElementById('af-category').value) || null;
    const projectId  = parseInt(document.getElementById('af-project').value) || null;

    const authorObj   = authorsOptions.find(a => a.id === authorId);
    const categoryObj = categoriesOptions.find(c => c.id === categoryId);
    const projectObj  = projectsOptions.find(p => p.id === projectId);
    const tagNames    = assetsSelectedTagIds.map(tid => {
        const t = tagsOptions.find(t => t.id === tid);
        return t ? t.name : '';
    }).filter(Boolean);

    const payload = {
        title, slug,
        preview_url:  document.getElementById('af-preview').value.trim(),
        description:  document.getElementById('af-desc').value.trim(),
        code_snippet: document.getElementById('af-code').value.trim(),
        status:       document.getElementById('af-status').value,
        sort_order:   parseInt(document.getElementById('af-sort').value) || 0,
        author_id:    authorId,
        author_name:  authorObj ? authorObj.name : null,
        category_id:  categoryId,
        category_name: categoryObj ? categoryObj.name : null,
        project_id:   projectId,
        project_name: projectObj ? projectObj.name : null,
        tag_ids:      [...assetsSelectedTagIds],
        tag_names:    tagNames,
    };

    if (assetsEditingId) {
        const idx = assetsData.findIndex(d => d.id === assetsEditingId);
        assetsData[idx] = { ...assetsData[idx], ...payload };
    } else {
        const newId = assetsData.length ? Math.max(...assetsData.map(d => d.id)) + 1 : 1;
        assetsData.push({ id: newId, ...payload });
    }

    closeAssetModal();
    renderAssetsTable();
}

// ── 刪除確認 ──
let assetPendingDeleteId = null;

function confirmDeleteAsset(id) {
    assetPendingDeleteId = id;
    document.getElementById('asset-confirm-modal').classList.add('is-active');
    document.getElementById('asset-confirm-ok').onclick = executeDeleteAsset;
}

function closeAssetConfirm() {
    document.getElementById('asset-confirm-modal').classList.remove('is-active');
    assetPendingDeleteId = null;
}

function executeDeleteAsset() {
    assetsData = assetsData.filter(d => d.id !== assetPendingDeleteId);
    const filtered = getFilteredAssets();
    const maxPage = Math.ceil(filtered.length / PAGE_SIZE_ASSETS) || 1;
    if (assetsCurrentPage > maxPage) assetsCurrentPage = maxPage;
    closeAssetConfirm();
    renderAssetsTable();
}