// User data storage
let users = JSON.parse(localStorage.getItem('miningMapUsers')) || [];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotForm = document.getElementById('forgotForm');
const logoutBtn = document.getElementById('logout-btn');

// Check if user is logged in
if (window.location.pathname.includes('main.html') && !localStorage.getItem('currentUser')) {
  window.location.href = 'index.html';
}

// Login function
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'main.html';
    } else {
      alert('Invalid username or password');
    }
  });
}

// Logout function
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  });
}

// Check for remembered user
if (document.getElementById('login-username') && localStorage.getItem('rememberedUser')) {
  const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
  document.getElementById('login-username').value = rememberedUser.username;
  document.getElementById('login-password').value = rememberedUser.password;
  document.getElementById('remember-me').checked = true;
}
