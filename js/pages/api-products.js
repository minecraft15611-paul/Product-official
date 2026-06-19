// api-products.js — API 商品管理頁面

// ── 假資料 ──
const apiProductsData = [
    {
        id: 1,
        name: '圖片壓縮 API',
        slug: 'image-compress',
        description: '支援 JPG / PNG / WebP 格式，自動壓縮並回傳優化後的圖片 URL。',
        price: 'NT$ 1,200 / 月',
        tags: ['圖片處理', '壓縮', 'CDN'],
        status: 'published',
        // 對內欄位
        cost: 'NT$ 300 / 月',
        vendor: 'Cloudflare Images',
        tech_spec: 'Max 10MB per file, 1000 req/day, REST API',
        internal_note: '目前使用 Cloudflare Images 轉接，需注意流量上限。'
    },
    {
        id: 2,
        name: 'OCR 文字辨識 API',
        slug: 'ocr-text',
        description: '將圖片或 PDF 中的文字自動辨識並回傳結構化文字內容，支援繁中、英文。',
        price: 'NT$ 2,500 / 月',
        tags: ['OCR', 'PDF', '繁中'],
        status: 'published',
        cost: 'NT$ 800 / 月',
        vendor: 'Google Vision API',
        tech_spec: 'Max 20MB, 500 req/day, JSON response',
        internal_note: '計費單位為每千次，需確認客戶用量再議價。'
    },
    {
        id: 3,
        name: 'AI 文案生成 API',
        slug: 'ai-copy-gen',
        description: '輸入關鍵字與語氣，自動生成行銷文案、商品描述或社群貼文。',
        price: 'NT$ 3,800 / 月',
        tags: ['AI', '文案', 'GPT'],
        status: 'draft',
        cost: 'NT$ 1,200 / 月',
        vendor: 'OpenAI GPT-4o',
        tech_spec: 'Max 2000 tokens output, 200 req/day',
        internal_note: '產品尚在測試，prompt 調整中，暫不對外。'
    },
    {
        id: 4,
        name: '電商數據爬蟲 API',
        slug: 'ecom-scraper',
        description: '定時抓取指定電商平台的商品價格與庫存，回傳結構化 JSON。',
        price: 'NT$ 5,000 / 月',
        tags: ['爬蟲', '電商', '自動化'],
        status: 'archived',
        cost: 'NT$ 1,500 / 月',
        vendor: '自建 Puppeteer 服務',
        tech_spec: '每日最多 50 個商品監控，每 6 小時更新一次',
        internal_note: '已下架，部分平台封鎖爬蟲，維護成本過高。'
    }
];

// ── 狀態對應 ──
const AP_STATUS_LABEL = {
    published: '已上架',
    draft:     '草稿',
    archived:  '已下架'
};

const AP_STATUS_CLASS = {
    published: 'status--published',
    draft:     'status--draft',
    archived:  'status--archived'
};

// ── 所有可選 Tags ──
const ALL_TAGS = ['圖片處理', '壓縮', 'CDN', 'OCR', 'PDF', '繁中', 'AI', '文案', 'GPT', '爬蟲', '電商', '自動化'];

// ── 狀態 ──
let apFiltered = [...apiProductsData];
let apSearchKeyword = '';
let apStatusFilter = '';
let apEditingId = null;

// ── 主渲染 ──
function renderApiProductsPage() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">API PRODUCTS</h1>
            <p class="page-subtitle">API 商品管理 — 上架 / 草稿 / 下架</p>
        </div>

        <!-- Toolbar -->
        <div class="assets-toolbar page-toolbar" style="justify-content: space-between; margin-bottom: 1.25rem;">
            <div class="assets-toolbar__filters">
                <input
                    type="text"
                    class="admin-input assets-search"
                    placeholder="搜尋商品名稱..."
                    id="ap-search"
                    oninput="apOnSearch(this.value)"
                />
                <select class="admin-input assets-status-filter admin-select" id="ap-status-filter" onchange="apOnStatusFilter(this.value)">
                    <option value="">全部狀態</option>
                    <option value="published">已上架</option>
                    <option value="draft">草稿</option>
                    <option value="archived">已下架</option>
                </select>
            </div>
            <button class="admin-btn admin-btn--primary" onclick="apOpenModal(null)">+ 新增商品</button>
        </div>

        <!-- Table -->
        <div id="ap-table-wrap"></div>

        <!-- Modal 新增/編輯 -->
        <div class="modal-overlay" id="ap-modal">
            <div class="modal-box modal-box--wide">
                <div class="modal-head">
                    <span id="ap-modal-title">新增商品</span>
                    <button class="admin-btn" onclick="apCloseModal()">✕</button>
                </div>
                <div class="modal-body" id="ap-modal-body"></div>
            </div>
        </div>

        <!-- Modal 刪除確認 -->
        <div class="modal-overlay" id="ap-confirm-modal">
            <div class="modal-box modal-box--confirm">
                <div class="modal-head">
                    <span>確認刪除</span>
                    <button class="admin-btn" onclick="apCloseConfirm()">✕</button>
                </div>
                <div class="modal-body">
                    <p class="confirm-message" id="ap-confirm-msg"></p>
                    <div class="form-actions">
                        <button class="admin-btn" onclick="apCloseConfirm()">取消</button>
                        <button class="admin-btn admin-btn--danger" id="ap-confirm-ok">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    apRenderTable();
}

// ── 渲染表格 ──
function apRenderTable() {
    apFiltered = apiProductsData.filter(p => {
        const matchKeyword = p.name.includes(apSearchKeyword) || p.slug.includes(apSearchKeyword);
        const matchStatus  = apStatusFilter ? p.status === apStatusFilter : true;
        return matchKeyword && matchStatus;
    });

    const wrap = document.getElementById('ap-table-wrap');
    if (!wrap) return;

    if (apFiltered.length === 0) {
        wrap.innerHTML = `<div class="assets-empty" style="border: 1px dashed var(--admin-border); padding: 3rem; text-align: center; color: var(--admin-text-muted); letter-spacing: 2px; font-size: 0.8rem;">查無資料</div>`;
        return;
    }

    const rows = apFiltered.map((p, i) => `
        <tr>
            <td class="td-index">${i + 1}</td>
            <td>
                <div class="project-title">${p.name}</div>
                <div class="project-slug">${p.slug}</div>
            </td>
            <td style="max-width: 260px; color: var(--admin-text-muted); font-size: 0.8rem;">${p.description}</td>
            <td style="white-space: nowrap;">${p.price}</td>
            <td>
                <div class="tag-badge-group">
                    ${p.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}
                </div>
            </td>
            <td><span class="status-badge ${AP_STATUS_CLASS[p.status]}">${AP_STATUS_LABEL[p.status]}</span></td>
            <td>
                <div class="td-actions">
                    <button class="admin-btn" onclick="apOpenModal(${p.id})">編輯</button>
                    <button class="admin-btn admin-btn--danger" onclick="apConfirmDelete(${p.id})">刪除</button>
                </div>
            </td>
        </tr>
    `).join('');

    wrap.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>商品名稱</th>
                    <th>描述</th>
                    <th>定價</th>
                    <th>Tags</th>
                    <th>狀態</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

// ── 搜尋 / 篩選 ──
function apOnSearch(val) {
    apSearchKeyword = val.trim();
    apRenderTable();
}

function apOnStatusFilter(val) {
    apStatusFilter = val;
    apRenderTable();
}

// ── Modal 開關 ──
function apOpenModal(id) {
    apEditingId = id;
    const product = id ? apiProductsData.find(p => p.id === id) : null;
    const titleEl = document.getElementById('ap-modal-title');
    const bodyEl  = document.getElementById('ap-modal-body');

    titleEl.textContent = id ? '編輯商品' : '新增商品';

    const selectedTags = product ? product.tags : [];

    bodyEl.innerHTML = `
        <!-- 對外資訊 -->
        <div class="modal-section-label">對外資訊</div>

        <div class="form-row--half">
            <div class="form-row">
                <label class="form-label">商品名稱</label>
                <input class="admin-input" id="ap-f-name" value="${product ? product.name : ''}" placeholder="e.g. 圖片壓縮 API" />
            </div>
            <div class="form-row">
                <label class="form-label">Slug</label>
                <input class="admin-input" id="ap-f-slug" value="${product ? product.slug : ''}" placeholder="e.g. image-compress" />
            </div>
        </div>

        <div class="form-row">
            <label class="form-label">描述</label>
            <textarea class="admin-input admin-textarea" id="ap-f-desc" placeholder="簡短說明此 API 的用途...">${product ? product.description : ''}</textarea>
        </div>

        <div class="form-row--half">
            <div class="form-row">
                <label class="form-label">定價（對外顯示）</label>
                <input class="admin-input" id="ap-f-price" value="${product ? product.price : ''}" placeholder="e.g. NT$ 1,200 / 月" />
            </div>
            <div class="form-row">
                <label class="form-label">狀態</label>
                <select class="admin-input admin-select" id="ap-f-status">
                    <option value="draft"     ${(!product || product.status === 'draft')     ? 'selected' : ''}>草稿</option>
                    <option value="published" ${product && product.status === 'published'    ? 'selected' : ''}>已上架</option>
                    <option value="archived"  ${product && product.status === 'archived'     ? 'selected' : ''}>已下架</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <label class="form-label">Tags</label>
            <div class="tag-picker" id="ap-tag-picker">
                ${ALL_TAGS.map(t => `
                    <button type="button"
                        class="tag-pill ${selectedTags.includes(t) ? 'is-selected' : ''}"
                        onclick="apToggleTag(this, '${t}')">
                        ${t}
                    </button>
                `).join('')}
            </div>
        </div>

        <!-- 對內資訊 -->
        <div class="modal-section-label" style="margin-top: 0.5rem;">對內資訊（僅管理員可見）</div>

        <div class="form-row--half">
            <div class="form-row">
                <label class="form-label">成本</label>
                <input class="admin-input" id="ap-f-cost" value="${product ? product.cost : ''}" placeholder="e.g. NT$ 300 / 月" />
            </div>
            <div class="form-row">
                <label class="form-label">供應商 / 服務來源</label>
                <input class="admin-input" id="ap-f-vendor" value="${product ? product.vendor : ''}" placeholder="e.g. Cloudflare Images" />
            </div>
        </div>

        <div class="form-row">
            <label class="form-label">技術規格</label>
            <textarea class="admin-input admin-textarea admin-code-area" id="ap-f-tech" placeholder="Max 10MB, 1000 req/day...">${product ? product.tech_spec : ''}</textarea>
        </div>

        <div class="form-row">
            <label class="form-label">內部備註</label>
            <textarea class="admin-input admin-textarea" id="ap-f-note" placeholder="供團隊內部參考的說明...">${product ? product.internal_note : ''}</textarea>
        </div>

        <div class="form-actions">
            <button class="admin-btn" onclick="apCloseModal()">取消</button>
            <button class="admin-btn admin-btn--primary" onclick="apSave()">儲存</button>
        </div>
    `;

    document.getElementById('ap-modal').classList.add('is-active');
}

function apCloseModal() {
    document.getElementById('ap-modal').classList.remove('is-active');
    apEditingId = null;
}

// ── Tag 切換 ──
function apToggleTag(btn, tag) {
    btn.classList.toggle('is-selected');
}

// ── 儲存（假資料版） ──
function apSave() {
    const name   = document.getElementById('ap-f-name').value.trim();
    const slug   = document.getElementById('ap-f-slug').value.trim();
    const desc   = document.getElementById('ap-f-desc').value.trim();
    const price  = document.getElementById('ap-f-price').value.trim();
    const status = document.getElementById('ap-f-status').value;
    const cost   = document.getElementById('ap-f-cost').value.trim();
    const vendor = document.getElementById('ap-f-vendor').value.trim();
    const tech   = document.getElementById('ap-f-tech').value.trim();
    const note   = document.getElementById('ap-f-note').value.trim();

    const tags = [...document.querySelectorAll('#ap-tag-picker .tag-pill.is-selected')]
        .map(btn => btn.textContent.trim());

    if (!name || !slug) {
        alert('商品名稱與 Slug 為必填');
        return;
    }

    if (apEditingId) {
        const idx = apiProductsData.findIndex(p => p.id === apEditingId);
        if (idx !== -1) {
            apiProductsData[idx] = { ...apiProductsData[idx], name, slug, description: desc, price, tags, status, cost, vendor, tech_spec: tech, internal_note: note };
        }
    } else {
        const newId = Math.max(...apiProductsData.map(p => p.id)) + 1;
        apiProductsData.push({ id: newId, name, slug, description: desc, price, tags, status, cost, vendor, tech_spec: tech, internal_note: note });
    }

    apCloseModal();
    apRenderTable();
}

// ── 刪除確認 ──
function apConfirmDelete(id) {
    const product = apiProductsData.find(p => p.id === id);
    if (!product) return;

    document.getElementById('ap-confirm-msg').textContent = `確定要刪除「${product.name}」？此操作無法復原。`;
    document.getElementById('ap-confirm-ok').onclick = () => apDelete(id);
    document.getElementById('ap-confirm-modal').classList.add('is-active');
}

function apCloseConfirm() {
    document.getElementById('ap-confirm-modal').classList.remove('is-active');
}

function apDelete(id) {
    const idx = apiProductsData.findIndex(p => p.id === id);
    if (idx !== -1) apiProductsData.splice(idx, 1);
    apCloseConfirm();
    apRenderTable();
}