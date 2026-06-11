if (!sessionStorage.getItem('isLoggedIn')) {
    window.location.href = './login.html';
}

let allAssets = [];
let currentFilter = 'ALL';

function renderCards(assets) {
    const grid = document.querySelector('.asset-grid');

    if (assets.length === 0) {
        grid.innerHTML = '<p>無符合目標的素材，請嘗試其他關鍵字。</p>';
        return;
    }

    grid.innerHTML = '';
    assets.forEach(asset => {
        const card = document.createElement('article');
        card.className = 'asset-card';
        card.innerHTML = `
            <img src="${asset.preview_url}" alt="${asset.title}">
            <h3>${asset.title}</h3>
            <div class="actions">
                <button class="preview-btn">PREVIEW</button>
                <button class="detail-btn">詳細內容</button>
            </div>
        `;
        card.querySelector('.detail-btn').addEventListener('click', () => showDetail(asset.id));
        grid.appendChild(card);
    });
}

async function loadAssets() {
    const grid = document.querySelector('.asset-grid');
    grid.innerHTML = '<p>載入中...</p>';

    try {
        const response = await fetch('./data/data.json');
        const assets = await response.json();
        allAssets = assets;
        renderCards(allAssets);
    } catch (error) {
        console.error("無法載入素材：", error);
        grid.innerHTML = '<p>載入失敗，請重新整理。</p>';
    }
}

function showDetail(id) {
    const asset = allAssets.find(a => a.id === id);
    if (!asset) return;

    const imgElement = document.getElementById('modal-image');
    imgElement.src = asset.preview_url;
    imgElement.alt = asset.title;

    document.getElementById('modal-title').innerText = asset.title;
    document.getElementById('modal-author').innerText = `分享者：${asset.author}`;
    document.getElementById('modal-desc').innerText = asset.description;
    document.getElementById('modal-code').innerText = asset.code_snippet;

    const modal = document.getElementById('detail-modal');
    modal.classList.add('is-active');
}

function closeModal() {
    const modal = document.getElementById('detail-modal');
    modal.classList.remove('is-active');
}

function debounce(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function setFilter(category) {
    currentFilter = category;
    filterAndRender();
}

function filterAndRender() {
    const keyword = document.getElementById('search-bar').value.toLowerCase();

    const filtered = allAssets.filter(asset => {
        const matchCategory = (currentFilter === 'ALL' || asset.category === currentFilter);
        const matchSearch = (
            asset.title.toLowerCase().includes(keyword) ||
            (asset.tags ?? []).some(tag => tag.toLowerCase().includes(keyword)) ||
            asset.author.toLowerCase().includes(keyword) ||
            asset.description.toLowerCase().includes(keyword)
        );
        return matchCategory && matchSearch;
    });

    renderCards(filtered);
}

function logout() {
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = './index.html';
}

const debouncedSearch = debounce(filterAndRender, 400);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('search-bar').addEventListener('input', debouncedSearch);

    document.getElementById('detail-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('detail-modal')) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    loadAssets();
});