// logs.js — 系統操作日誌頁面

// ── 假資料 ──
let logsData = [
    { log_id: 1,  user: 'Paul',   action: '新增',   target_type: 'Projects',    target_name: '築本官網重設計',       note: null,             created_at: '2026-06-01 09:12:00' },
    { log_id: 2,  user: 'Paul',   action: '編輯',   target_type: 'Projects',    target_name: '築本官網重設計',       note: null,             created_at: '2026-06-02 11:35:00' },
    { log_id: 3,  user: 'Joseph', action: '新增',   target_type: 'Clients',     target_name: '得嘉野餐飲集團',       note: null,             created_at: '2026-06-03 14:00:00' },
    { log_id: 4,  user: 'Paul',   action: '狀態變更', target_type: 'Projects',  target_name: '品牌識別設計',         note: '由 draft 改為 published', created_at: '2026-06-05 10:20:00' },
    { log_id: 5,  user: 'Oreo',   action: '新增',   target_type: 'Assets',      target_name: 'Hero Banner 動畫',    note: null,             created_at: '2026-06-06 13:45:00' },
    { log_id: 6,  user: 'Paul',   action: '刪除',   target_type: 'Ideas',       target_name: '舊版 Landing Page',   note: '誤操作，已還原', created_at: '2026-06-07 09:00:00' },
    { log_id: 7,  user: 'Joseph', action: '編輯',   target_type: 'Clients',     target_name: '得嘉野餐飲集團',       note: null,             created_at: '2026-06-08 16:10:00' },
    { log_id: 8,  user: 'Paul',   action: '新增',   target_type: 'Meetings',    target_name: 'Q2 方向討論',          note: null,             created_at: '2026-06-10 09:30:00' },
    { log_id: 9,  user: 'Paul',   action: '新增',   target_type: 'API Products', target_name: 'Facebook 粉絲數 API', note: null,            created_at: '2026-06-11 11:00:00' },
    { log_id: 10, user: 'Oreo',   action: '編輯',   target_type: 'Assets',      target_name: 'Hero Banner 動畫',    note: null,             created_at: '2026-06-12 14:55:00' },
    { log_id: 11, user: 'Paul',   action: '狀態變更', target_type: 'Requests',  target_name: 'contact@example.com', note: null,             created_at: '2026-06-13 10:05:00' },
    { log_id: 12, user: 'Joseph', action: '新增',   target_type: 'Ideas',       target_name: '多語言切換功能',       note: null,             created_at: '2026-06-14 15:20:00' },
    { log_id: 13, user: 'Paul',   action: '編輯',   target_type: 'API Products', target_name: 'Facebook 粉絲數 API', note: null,            created_at: '2026-06-15 09:40:00' },
    { log_id: 14, user: 'Paul',   action: '新增',   target_type: 'Assets',      target_name: 'Footer 元件',         note: null,             created_at: '2026-06-16 13:00:00' },
    { log_id: 15, user: 'Oreo',   action: '狀態變更', target_type: 'Assets',    target_name: 'Footer 元件',         note: null,             created_at: '2026-06-17 11:30:00' },
    { log_id: 16, user: 'Joseph', action: '編輯',   target_type: 'Meetings',    target_name: 'Q2 方向討論',          note: null,             created_at: '2026-06-18 16:45:00' },
    { log_id: 17, user: 'Paul',   action: '新增',   target_type: 'Projects',    target_name: 'API 報價系統',         note: null,             created_at: '2026-06-19 08:50:00' },
    { log_id: 18, user: 'Paul',   action: '刪除',   target_type: 'Assets',      target_name: '舊版 Logo SVG',        note: null,             created_at: '2026-06-19 09:15:00' },
    { log_id: 19, user: 'Oreo',   action: '新增',   target_type: 'Assets',      target_name: '新版 Logo SVG',        note: null,             created_at: '2026-06-19 09:30:00' },
    { log_id: 20, user: 'Joseph', action: '狀態變更', target_type: 'Ideas',     target_name: '多語言切換功能',       note: '已採用，列入下季開發', created_at: '2026-06-19 10:00:00' },
    { log_id: 21, user: 'Paul',   action: '編輯',   target_type: 'Clients',     target_name: '得嘉野餐飲集團',       note: null,             created_at: '2026-06-19 14:20:00' },
    { log_id: 22, user: 'Paul',   action: '新增',   target_type: 'Meetings',    target_name: '後台系統開發進度同步', note: null,             created_at: '2026-06-19 15:00:00' },
];

// ── Action badge 顏色 ──
const LOG_ACTION_STYLE = {
    '新增':   { bg: 'rgba(0,212,100,0.12)',  border: 'rgba(0,212,100,0.3)',  color: '#00d464' },
    '編輯':   { bg: 'rgba(0,180,255,0.12)',  border: 'rgba(0,180,255,0.3)',  color: '#00b4ff' },
    '刪除':   { bg: 'rgba(255,80,80,0.12)',  border: 'rgba(255,80,80,0.3)',  color: '#ff5050' },
    '狀態變更': { bg: 'rgba(255,180,0,0.12)', border: 'rgba(255,180,0,0.3)', color: '#ffb400' },
};

// ── 篩選狀態 ──
let logFilterKeyword    = '';
let logFilterAction     = '';
let logFilterTargetType = '';
let logFilterDateFrom   = '';
let logFilterDateTo     = '';
let logCurrentPage      = 1;
const LOG_PAGE_SIZE     = 20;

// ── 備注編輯狀態 ──
let logEditingId = null;

// ── 主渲染 ──
function renderLogsPage() {
    logFilterKeyword    = '';
    logFilterAction     = '';
    logFilterTargetType = '';
    logFilterDateFrom   = '';
    logFilterDateTo     = '';
    logCurrentPage      = 1;
    logEditingId        = null;

    document.getElementById('main-content').innerHTML = `
        <div class="page-header">
            <h1 class="page-title">ACTIVITY LOGS</h1>
            <p class="page-subtitle">系統操作日誌 — 唯讀，日誌由後端自動寫入</p>
        </div>

        <!-- 篩選列 -->
        <div class="logs-toolbar">
            <div class="logs-toolbar__filters">
                <input
                    id="log-search"
                    class="admin-input logs-search"
                    type="text"
                    placeholder="搜尋操作者 / 對象名稱"
                    oninput="logOnSearch(this.value)"
                />
                <select id="log-action-filter" class="admin-input admin-select logs-select" onchange="logOnActionFilter(this.value)">
                    <option value="">所有動作</option>
                    <option value="新增">新增</option>
                    <option value="編輯">編輯</option>
                    <option value="刪除">刪除</option>
                    <option value="狀態變更">狀態變更</option>
                </select>
                <select id="log-type-filter" class="admin-input admin-select logs-select" onchange="logOnTypeFilter(this.value)">
                    <option value="">所有模組</option>
                    <option value="Projects">Projects</option>
                    <option value="Assets">Assets</option>
                    <option value="Clients">Clients</option>
                    <option value="Ideas">Ideas</option>
                    <option value="Meetings">Meetings</option>
                    <option value="Requests">Requests</option>
                    <option value="Members">Members</option>
                    <option value="API Products">API Products</option>
                </select>
                <input
                    id="log-date-from"
                    class="admin-input logs-date"
                    type="date"
                    onchange="logOnDateFrom(this.value)"
                />
                <span class="logs-date-sep">—</span>
                <input
                    id="log-date-to"
                    class="admin-input logs-date"
                    type="date"
                    onchange="logOnDateTo(this.value)"
                />
                <button class="admin-btn" onclick="logResetFilters()">重置</button>
            </div>
        </div>

        <!-- 表格 -->
        <div id="logs-table-wrap"></div>

        <!-- 備注 Modal -->
        <div class="modal-overlay" id="log-note-modal">
            <div class="modal-box modal-box--confirm" style="width:480px">
                <div class="modal-head">
                    <span>編輯備注</span>
                    <button class="admin-btn" onclick="logCloseNoteModal()">✕</button>
                </div>
                <div class="modal-body">
                    <p class="form-label" id="log-note-modal-meta" style="margin-bottom:0.75rem;line-height:1.8"></p>
                    <div class="form-row">
                        <label class="form-label">備注內容</label>
                        <textarea
                            id="log-note-input"
                            class="admin-input admin-textarea"
                            placeholder="輸入備注，如「誤操作，已還原」"
                            style="min-height:100px"
                        ></textarea>
                    </div>
                    <div class="form-actions">
                        <button class="admin-btn" onclick="logCloseNoteModal()">取消</button>
                        <button class="admin-btn admin-btn--primary" onclick="logSaveNote()">儲存備注</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    logRenderTable();
}

// ── 過濾邏輯 ──
function logGetFiltered() {
    return logsData.filter(log => {
        const kw = logFilterKeyword.toLowerCase();
        if (kw && !log.user.toLowerCase().includes(kw) && !(log.target_name || '').toLowerCase().includes(kw)) return false;
        if (logFilterAction && log.action !== logFilterAction) return false;
        if (logFilterTargetType && log.target_type !== logFilterTargetType) return false;
        if (logFilterDateFrom && log.created_at.slice(0, 10) < logFilterDateFrom) return false;
        if (logFilterDateTo   && log.created_at.slice(0, 10) > logFilterDateTo)   return false;
        return true;
    }).sort((a, b) => b.log_id - a.log_id);
}

// ── 表格渲染 ──
function logRenderTable() {
    const filtered = logGetFiltered();
    const total    = filtered.length;
    const pages    = Math.ceil(total / LOG_PAGE_SIZE) || 1;
    if (logCurrentPage > pages) logCurrentPage = 1;

    const slice = filtered.slice((logCurrentPage - 1) * LOG_PAGE_SIZE, logCurrentPage * LOG_PAGE_SIZE);

    const wrap = document.getElementById('logs-table-wrap');
    if (!wrap) return;

    if (total === 0) {
        wrap.innerHTML = `<p class="assets-empty">找不到符合條件的日誌</p>`;
        return;
    }

    const rows = slice.map((log, i) => {
        const style   = LOG_ACTION_STYLE[log.action] || { bg: 'transparent', border: '#1a3a60', color: '#e0e0e0' };
        const badge   = `<span style="
            font-size:0.63rem;letter-spacing:1.5px;padding:0.22rem 0.55rem;
            background:${style.bg};border:1px solid ${style.border};color:${style.color};
            white-space:nowrap;
        ">${log.action}</span>`;

        const noteCell = log.note
            ? `<span style="color:var(--admin-text);font-size:0.8rem">${log.note}</span>`
            : `<span style="color:var(--admin-text-muted)">—</span>`;

        const dt = log.created_at.slice(0, 16).replace('T', ' ');

        return `
            <tr>
                <td class="td-index">${(logCurrentPage - 1) * LOG_PAGE_SIZE + i + 1}</td>
                <td style="white-space:nowrap;color:var(--admin-text-muted);font-size:0.78rem">${dt}</td>
                <td style="white-space:nowrap">${log.user}</td>
                <td>${badge}</td>
                <td style="color:var(--admin-text-muted);font-size:0.8rem">${log.target_type}</td>
                <td>${log.target_name || '<span style="color:var(--admin-text-muted)">—</span>'}</td>
                <td>${noteCell}</td>
                <td>
                    <div class="td-actions">
                        <button class="admin-btn" onclick="logOpenNoteModal(${log.log_id})">備注</button>
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
                    <th>時間</th>
                    <th>操作者</th>
                    <th>動作</th>
                    <th>模組</th>
                    <th>對象名稱</th>
                    <th>備注</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        ${logRenderPagination(pages)}
    `;
}

// ── 分頁 ──
function logRenderPagination(pages) {
    if (pages <= 1) return '';
    let btns = '';
    for (let p = 1; p <= pages; p++) {
        btns += `<button class="page-btn ${p === logCurrentPage ? 'is-active' : ''}" onclick="logGoPage(${p})">${p}</button>`;
    }
    return `<div class="pagination">${btns}</div>`;
}

function logGoPage(p) {
    logCurrentPage = p;
    logRenderTable();
}

// ── 篩選 handlers ──
function logOnSearch(val)      { logFilterKeyword    = val; logCurrentPage = 1; logRenderTable(); }
function logOnActionFilter(val){ logFilterAction     = val; logCurrentPage = 1; logRenderTable(); }
function logOnTypeFilter(val)  { logFilterTargetType = val; logCurrentPage = 1; logRenderTable(); }
function logOnDateFrom(val)    { logFilterDateFrom   = val; logCurrentPage = 1; logRenderTable(); }
function logOnDateTo(val)      { logFilterDateTo     = val; logCurrentPage = 1; logRenderTable(); }

function logResetFilters() {
    logFilterKeyword = logFilterAction = logFilterTargetType = logFilterDateFrom = logFilterDateTo = '';
    logCurrentPage = 1;
    document.getElementById('log-search').value        = '';
    document.getElementById('log-action-filter').value = '';
    document.getElementById('log-type-filter').value   = '';
    document.getElementById('log-date-from').value     = '';
    document.getElementById('log-date-to').value       = '';
    logRenderTable();
}

// ── 備注 Modal ──
function logOpenNoteModal(id) {
    const log = logsData.find(l => l.log_id === id);
    if (!log) return;
    logEditingId = id;

    const dt = log.created_at.slice(0, 16).replace('T', ' ');
    document.getElementById('log-note-modal-meta').innerHTML =
        `<span style="color:var(--admin-text-muted)">${dt} ／ ${log.user} ／ ${log.action} ／ ${log.target_type}</span>` +
        (log.target_name ? `<br><span style="color:var(--admin-text)">${log.target_name}</span>` : '');

    document.getElementById('log-note-input').value = log.note || '';
    document.getElementById('log-note-modal').classList.add('is-active');
}

function logCloseNoteModal() {
    logEditingId = null;
    document.getElementById('log-note-modal').classList.remove('is-active');
}

function logSaveNote() {
    if (!logEditingId) return;
    const note = document.getElementById('log-note-input').value.trim();
    const log  = logsData.find(l => l.log_id === logEditingId);
    if (log) log.note = note || null;

    // TODO: PATCH /api/logs/:id/note
    logCloseNoteModal();
    logRenderTable();
}