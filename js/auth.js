// auth.js — 登入狀態管理

const AUTH_KEY = 'admin_token';

function getToken() {
    return localStorage.getItem(AUTH_KEY);
}

function setToken(token) {
    localStorage.setItem(AUTH_KEY, token);
}

function removeToken() {
    localStorage.removeItem(AUTH_KEY);
}

function isLoggedIn() {
    return !!getToken();
}

function logout() {
    removeToken();
    window.location.href = './login.html';
}

// 進入後台任何頁面前先檢查 token
(function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = './login.html';
    }
})();