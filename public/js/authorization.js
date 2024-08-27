import { fetchData } from './general.js';

export const NAV_CHANGE_INTERVAL = 5 * 60 * 1000; // 5min

export function handleLogout(authUserInfo){
  if (authUserInfo && Date.now() > authUserInfo.expirationDate) {
    alert('Authorization time is up');
    logout();
  }
}

export function checkAuthorization(authUserInfo) {
  if (authUserInfo && Date.now() < authUserInfo.expirationDate) {
    view.changeNavItems();
  }
}

export function addModalListeners() {
  const modal = document.querySelector('.modal');
  const modalForm = document.querySelector('.modal__form');
  const modalElements = {
    loginBtn: document.querySelector('.login'),
    registerBtn: document.querySelector('.register'),
    closeButton: document.querySelector('.modal__close'),
    cancelButton: document.querySelector('.modal__form-cancel'),
  };

  modalElements.loginBtn.addEventListener('click', (e) =>
    view.showModal(e, 'Login', 'target-login'),
  );
  modalElements.registerBtn.addEventListener('click', (e) =>
    view.showModal(e, 'Register', 'target-register'),
  );
  modalElements.closeButton.addEventListener('click', view.hideModal);
  modalElements.cancelButton.addEventListener('click', view.hideModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) view.hideModal();
  });

  modalForm.addEventListener('submit', (e) => handleFormSubmit(e, modalForm));
}

async function handleFormSubmit(event, modalForm) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const action = modalForm.classList.contains('target-login')
    ? 'login'
    : 'register';

  const isAuthenticated = await authenticateUser(username, password, action);

  if (isAuthenticated) {
    view.hideModal();
  }
}

async function authenticateUser(username, password, action) {
  const response = await fetchData(`/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  const result = await response.json();
  const token = result.data.access_token;

  if (token) {
    storeToken(username, token);
    view.changeNavItems();
    return true;
  }
  return false;
}

function storeToken(username, token) {
  const authUserInfo = {
    username,
    token,
    expirationDate: Date.now() + 60 * 60 * 1000 // 1 hour
  };
  localStorage.setItem('user', JSON.stringify(authUserInfo));
}

export function addLogoutListener() {
  document.querySelector('.logout').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  })
}

function logout() {
  localStorage.removeItem('user');
  window.location.href = '/';
}

