// account.js — 帳號管理頁面

// ── 假資料 ──
const CURRENT_USER_ID = 1;

let accountUsers = [
    { user_id: 1, username: 'Paul',   email: 'paul@znuben.digital',   created_at: '2026-01-01 00:00:00', is_deleted: 0 },
    { user_id: 2, username: 'Oreo',   email: 'oreo@znuben.digital',   created_at: '2026-01-02 00:00:00', is_deleted: 0 },
    { user_id: 3, username: 'Joseph', email: 'joseph@znuben.digital', created_at: '2026-01-03 00:00:00', is_deleted: 0 },
];

let accountEditingId = null;

// ── 主渲染 ──
function renderAccountPage() {
    accountEditingId = null;

    document.getElementById('main-content').innerHTML = `
        <div class="page-header">
            <h1 class="page-title">ACCOUNT</h1>
            <p class="page-subtitle">帳號管理 — 修改登入資訊與密碼</p>
        </div>

        <div class="account-sections">

            <!-- 區塊一：我的帳號 -->
            <div class="account-card">
                <div class="account-card__title">我的帳號</div>
                <div class="account-card__body">
                    <div class="form-row">
                        <label class="form-label">建立時間</label>
                        <div class="account-static">${accountGetMe().created_at.slice(0, 10)}</div>
                    </div>
                    <div class="form-row">
                        <label class="form-label">使用者名稱</label>
                        <input id="account-username" class="admin-input" type="text" value="${accountGetMe().username}" />
                    </div>
                    <div class="form-row">
                        <label class="form-label">電子郵件</label>
                        <input id="account-email" class="admin-input" type="email" value="${accountGetMe().email}" />
                    </div>
                    <div id="account-profile-msg" class="account-msg"></div>
                    <div class="form-actions">
                        <button class="admin-btn admin-btn--primary" onclick="accountSaveProfile()">儲存變更</button>
                    </div>
                </div>
            </div>

            <!-- 修改密碼 -->
            <div class="account-card">
                <div class="account-card__title">修改密碼</div>
                <div class="account-card__body">
                    <div class="form-row">
                        <label class="form-label">舊密碼</label>
                        <input id="account-old-pw" class="admin-input" type="password" placeholder="輸入目前密碼" />
                    </div>
                    <div class="form-row">
                        <label class="form-label">新密碼</label>
                        <input id="account-new-pw" class="admin-input" type="password" placeholder="至少 8 個字元" />
                    </div>
                    <div class="form-row">
                        <label class="form-label">確認新密碼</label>
                        <input id="account-confirm-pw" class="admin-input" type="password" placeholder="再次輸入新密碼" />
                    </div>
                    <div id="account-pw-msg" class="account-msg"></div>
                    <div class="form-actions">
                        <button class="admin-btn admin-btn--primary" onclick="accountSavePassword()">更新密碼</button>
                    </div>
                </div>
            </div>

            <!-- 區塊二：所有帳號列表 -->
            <div class="account-card">
                <div class="account-card__title">所有帳號</div>
                <div class="account-card__body" style="padding:0">
                    <div id="account-users-table"></div>
                </div>
            </div>

            <!-- 區塊三：新增帳號 -->
            <div class="account-card">
                <div class="account-card__title">新增管理員帳號</div>
                <div class="account-card__body">
                    <div class="form-row--half">
                        <div class="form-row">
                            <label class="form-label">使用者名稱</label>
                            <input id="new-account-username" class="admin-input" type="text" placeholder="username" />
                        </div>
                        <div class="form-row">
                            <label class="form-label">電子郵件</label>
                            <input id="new-account-email" class="admin-input" type="email" placeholder="email@znuben.digital" />
                        </div>
                    </div>
                    <div class="form-row--half">
                        <div class="form-row">
                            <label class="form-label">初始密碼</label>
                            <input id="new-account-pw" class="admin-input" type="password" placeholder="至少 8 個字元" />
                        </div>
                        <div class="form-row">
                            <label class="form-label">確認密碼</label>
                            <input id="new-account-confirm-pw" class="admin-input" type="password" placeholder="再次輸入" />
                        </div>
                    </div>
                    <div id="new-account-msg" class="account-msg"></div>
                    <div class="form-actions">
                        <button class="admin-btn admin-btn--primary" onclick="accountCreateUser()">新增帳號</button>
                    </div>
                </div>
            </div>

        </div>

        <!-- 編輯帳號 Modal -->
        <div class="modal-overlay" id="account-edit-modal">
            <div class="modal-box" style="width:480px">
                <div class="modal-head">
                    <span>編輯帳號</span>
                    <button class="admin-btn" onclick="accountCloseEditModal()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="form-row">
                        <label class="form-label">使用者名稱</label>
                        <input id="edit-account-username" class="admin-input" type="text" />
                    </div>
                    <div class="form-row">
                        <label class="form-label">電子郵件</label>
                        <input id="edit-account-email" class="admin-input" type="email" />
                    </div>
                    <div class="form-row">
                        <label class="form-label">重設密碼 <span style="color:var(--admin-text-muted);font-size:0.65rem">（留空則不更改）</span></label>
                        <input id="edit-account-pw" class="admin-input" type="password" placeholder="輸入新密碼" />
                    </div>
                    <div class="form-row">
                        <label class="form-label">確認新密碼</label>
                        <input id="edit-account-confirm-pw" class="admin-input" type="password" placeholder="再次輸入新密碼" />
                    </div>
                    <div id="edit-account-msg" class="account-msg"></div>
                    <div class="form-actions">
                        <button class="admin-btn" onclick="accountCloseEditModal()">取消</button>
                        <button class="admin-btn admin-btn--primary" onclick="accountSaveEdit()">儲存</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    accountRenderUsersTable();
}

// ── 取得目前登入帳號 ──
function accountGetMe() {
    return accountUsers.find(u => u.user_id === CURRENT_USER_ID);
}

// ── 帳號列表渲染 ──
function accountRenderUsersTable() {
    const wrap = document.getElementById('account-users-table');
    if (!wrap) return;

    const active = accountUsers.filter(u => u.is_deleted === 0);

    const rows = active.map(u => {
        const isMe = u.user_id === CURRENT_USER_ID;
        return `
            <tr>
                <td>${u.username}${isMe ? ' <span style="font-size:0.65rem;color:var(--admin-accent);letter-spacing:1px">ME</span>' : ''}</td>
                <td style="color:var(--admin-text-muted);font-size:0.8rem">${u.email}</td>
                <td style="color:var(--admin-text-muted);font-size:0.78rem">${u.created_at.slice(0, 10)}</td>
                <td>
                    <div class="td-actions">
                        <button class="admin-btn" onclick="accountOpenEditModal(${u.user_id})">編輯</button>
                        ${!isMe ? `<button class="admin-btn admin-btn--danger" onclick="accountDisableUser(${u.user_id})">停用</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    wrap.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>使用者名稱</th>
                    <th>電子郵件</th>
                    <th>建立時間</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

// ── 儲存我的帳號資訊 ──
function accountSaveProfile() {
    const username = document.getElementById('account-username').value.trim();
    const email    = document.getElementById('account-email').value.trim();
    const msg      = document.getElementById('account-profile-msg');

    if (!username || !email) {
        accountShowMsg(msg, '使用者名稱與電子郵件不可為空', 'error');
        return;
    }

    // TODO: PATCH /api/account/profile  { username, email }
    accountGetMe().username = username;
    accountGetMe().email    = email;
    accountRenderUsersTable();
    accountShowMsg(msg, '帳號資訊已更新', 'success');
}

// ── 更新我的密碼 ──
function accountSavePassword() {
    const oldPw     = document.getElementById('account-old-pw').value;
    const newPw     = document.getElementById('account-new-pw').value;
    const confirmPw = document.getElementById('account-confirm-pw').value;
    const msg       = document.getElementById('account-pw-msg');

    if (!oldPw || !newPw || !confirmPw) {
        accountShowMsg(msg, '請填寫所有欄位', 'error');
        return;
    }
    if (newPw !== confirmPw) {
        accountShowMsg(msg, '新密碼與確認密碼不一致', 'error');
        return;
    }
    if (newPw.length < 8) {
        accountShowMsg(msg, '新密碼至少需要 8 個字元', 'error');
        return;
    }

    // TODO: PATCH /api/account/password  { oldPassword: oldPw, newPassword: newPw }
    document.getElementById('account-old-pw').value     = '';
    document.getElementById('account-new-pw').value     = '';
    document.getElementById('account-confirm-pw').value = '';
    accountShowMsg(msg, '密碼已更新', 'success');
}

// ── 編輯帳號 Modal ──
function accountOpenEditModal(id) {
    const user = accountUsers.find(u => u.user_id === id);
    if (!user) return;
    accountEditingId = id;

    document.getElementById('edit-account-username').value    = user.username;
    document.getElementById('edit-account-email').value       = user.email;
    document.getElementById('edit-account-pw').value          = '';
    document.getElementById('edit-account-confirm-pw').value  = '';
    document.getElementById('edit-account-msg').textContent   = '';
    document.getElementById('account-edit-modal').classList.add('is-active');
}

function accountCloseEditModal() {
    accountEditingId = null;
    document.getElementById('account-edit-modal').classList.remove('is-active');
}

function accountSaveEdit() {
    const username  = document.getElementById('edit-account-username').value.trim();
    const email     = document.getElementById('edit-account-email').value.trim();
    const pw        = document.getElementById('edit-account-pw').value;
    const confirmPw = document.getElementById('edit-account-confirm-pw').value;
    const msg       = document.getElementById('edit-account-msg');

    if (!username || !email) {
        accountShowMsg(msg, '使用者名稱與電子郵件不可為空', 'error');
        return;
    }
    if (pw && pw !== confirmPw) {
        accountShowMsg(msg, '新密碼與確認密碼不一致', 'error');
        return;
    }
    if (pw && pw.length < 8) {
        accountShowMsg(msg, '密碼至少需要 8 個字元', 'error');
        return;
    }

    // TODO: PATCH /api/account/:id  { username, email, ...(pw && { newPassword: pw }) }
    const user = accountUsers.find(u => u.user_id === accountEditingId);
    if (user) {
        user.username = username;
        user.email    = email;
    }

    // 如果改的是自己，同步更新區塊一顯示
    if (accountEditingId === CURRENT_USER_ID) {
        document.getElementById('account-username').value = username;
        document.getElementById('account-email').value    = email;
    }

    accountCloseEditModal();
    accountRenderUsersTable();
}

// ── 停用帳號 ──
function accountDisableUser(id) {
    if (id === CURRENT_USER_ID) return;
    const user = accountUsers.find(u => u.user_id === id);
    if (!user) return;
    if (!confirm(`確定要停用帳號「${user.username}」？`)) return;

    // TODO: DELETE /api/account/:id  (soft delete)
    user.is_deleted = 1;
    accountRenderUsersTable();
}

// ── 新增帳號 ──
function accountCreateUser() {
    const username  = document.getElementById('new-account-username').value.trim();
    const email     = document.getElementById('new-account-email').value.trim();
    const pw        = document.getElementById('new-account-pw').value;
    const confirmPw = document.getElementById('new-account-confirm-pw').value;
    const msg       = document.getElementById('new-account-msg');

    if (!username || !email || !pw || !confirmPw) {
        accountShowMsg(msg, '請填寫所有欄位', 'error');
        return;
    }
    if (pw !== confirmPw) {
        accountShowMsg(msg, '密碼與確認密碼不一致', 'error');
        return;
    }
    if (pw.length < 8) {
        accountShowMsg(msg, '密碼至少需要 8 個字元', 'error');
        return;
    }

    // TODO: POST /api/account/create  { username, email, password: pw }
    const newId = Math.max(...accountUsers.map(u => u.user_id)) + 1;
    accountUsers.push({
        user_id:    newId,
        username,
        email,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        is_deleted: 0,
    });

    document.getElementById('new-account-username').value   = '';
    document.getElementById('new-account-email').value      = '';
    document.getElementById('new-account-pw').value         = '';
    document.getElementById('new-account-confirm-pw').value = '';
    accountRenderUsersTable();
    accountShowMsg(msg, `帳號「${username}」已新增`, 'success');
}

// ── 訊息顯示 ──
function accountShowMsg(el, text, type) {
    el.textContent = text;
    el.className   = `account-msg account-msg--${type}`;
    setTimeout(() => { el.textContent = ''; el.className = 'account-msg'; }, 3000);
}