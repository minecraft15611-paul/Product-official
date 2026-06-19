document.querySelector('.login-card').addEventListener('submit', (e) => {
    e.preventDefault();

    const account = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (account === 'user' && password === '123456') {
        localStorage.setItem('admin_token', 'true');
        window.location.href = './dashboard.html';
    } else {
        alert('帳號或密碼錯誤');
    }
});