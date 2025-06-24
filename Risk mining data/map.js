// User data storage (in a real app, this would be server-side)
let users = [];
try {
  const storedUsers = localStorage.getItem('miningMapUsers');
  users = storedUsers ? JSON.parse(storedUsers) : [];
} catch (e) {
  console.error('Error loading user data:', e);
  users = [];
}

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotForm = document.getElementById('forgotForm');
const loginSection = document.getElementById('login-form');
const registerSection = document.getElementById('register-form');
const forgotSection = document.getElementById('forgot-form');

// Form toggles
document.getElementById('show-register').addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.style.display = 'none';
  registerSection.style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', (e) => {
  e.preventDefault();
  registerSection.style.display = 'none';
  loginSection.style.display = 'block';
});

document.getElementById('show-login-from-forgot').addEventListener('click', (e) => {
  e.preventDefault();
  forgotSection.style.display = 'none';
  loginSection.style.display = 'block';
});

document.getElementById('forgot-password-link').addEventListener('click', (e) => {
  e.preventDefault();
  loginSection.style.display = 'none';
  forgotSection.style.display = 'block';
});

// Check for remembered user
if (localStorage.getItem('rememberedUser')) {
  const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
  document.getElementById('login-username').value = rememberedUser.username;
  document.getElementById('login-password').value = rememberedUser.password;
  document.getElementById('remember-me').checked = true;
}

// Login function
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
    
    // Store logged in user
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirect to main page
    window.location.href = 'main.html';
  } else {
    showMessage('Invalid username or password', loginForm);
  }
});

// Register function
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm').value;

  if (password !== confirmPassword) {
    showMessage('Passwords do not match', registerForm);
    return;
  }

  if (users.some(u => u.username === username)) {
    showMessage('Username already exists', registerForm);
    return;
  }

  if (users.some(u => u.email === email)) {
    showMessage('Email already registered', registerForm);
    return;
  }

  const newUser = {
    username,
    email,
    password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('miningMapUsers', JSON.stringify(users));
  
  showMessage('Registration successful! Please login.', registerForm);
  registerSection.style.display = 'none';
  loginSection.style.display = 'block';
  registerForm.reset();
});

// Password reset function
forgotForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('forgot-email').value;
  
  const user = users.find(u => u.email === email);
  
  if (user) {
    // In a real app, you would send an email with a reset link
    showMessage(`Password reset link sent to ${email} (simulated)`, forgotForm);
    setTimeout(() => {
      forgotSection.style.display = 'none';
      loginSection.style.display = 'block';
      forgotForm.reset();
    }, 3000);
  } else {
    showMessage('No account found with that email', forgotForm);
  }
});

// Show message function
function showMessage(message, form) {
  let messageDiv = form.querySelector('.message');
  if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    form.insertBefore(messageDiv, form.querySelector('.btn').nextSibling);
  }
  messageDiv.textContent = message;
  setTimeout(() => {
    messageDiv.textContent = '';
  }, 5000);
}