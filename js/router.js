// router.js — Hash 路由

const routes = {
    'dashboard': () => renderDashboardPage(),
    'projects': () => renderProjectsPage(),
    'assets': () => renderAssetsPage(),
    'api-products': () => renderApiProductsPage(),
    'ideas': () => renderIdeasPage(),
    'meetings': () => renderMeetingsPage(),
    'requests': () => renderRequestsPage(),
    'clients': () => renderClientsPage(),
    'members': () => renderMembersPage(),
    'tags': () => renderTagsPage(),
    'logs': () => renderLogsPage(),
    'account': () => renderAccountPage()
};

function renderPlaceholder(title, subtitle) {
    document.getElementById('main-content').innerHTML = `
        <div class="page-header">
            <h1 class="page-title">${title}</h1>
            <p class="page-subtitle">${subtitle}</p>
        </div>
        <div class="page-placeholder">
            <p>頁面建置中</p>
        </div>
    `;
}

function setActiveLink(hash) {
    document.querySelectorAll('.sidebar-nav__link').forEach(link => {
        link.classList.remove('is-active');
        if (link.getAttribute('href') === '#' + hash) {
            link.classList.add('is-active');
        }
    });
}

function navigate() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const render = routes[hash];

    setActiveLink(hash);

    if (render) {
        render();
    } else {
        document.getElementById('main-content').innerHTML = `
            <div class="page-header">
                <h1 class="page-title">404</h1>
                <p class="page-subtitle">找不到此頁面</p>
            </div>
        `;
    }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);