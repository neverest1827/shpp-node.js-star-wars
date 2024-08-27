import {
  addLogoutListener,
  addModalListeners,
  handleLogout,
  NAV_CHANGE_INTERVAL,
  checkAuthorization
} from './authorization.js';
import { fetchData } from './general.js';

const user = JSON.parse(localStorage.getItem('user'));
document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
  checkAuthorization(user);
  setInterval(() => handleLogout(user), NAV_CHANGE_INTERVAL);

  const userInfo = await fetchUserInfo();
  view.renderInfoCard('profile-card-template', userInfo);

  addModalListeners();
  addLogoutListener();
}

async function fetchUserInfo() {
  const response = await fetchData(`/api/v1/user/${user.username}`, {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  });
  const result = await response.json();
  return result.data || {};
}
