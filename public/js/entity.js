import {
  addLogoutListener,
  addModalListeners,
  handleLogout,
  NAV_CHANGE_INTERVAL,
  checkAuthorization,
} from './authorization.js';
import { fetchData } from './general.js';

const user = JSON.parse(localStorage.getItem('user'));

document.addEventListener('DOMContentLoaded', async () => {
  checkAuthorization(user);
  setInterval(() => handleLogout(user), NAV_CHANGE_INTERVAL);

  const params = extractParams();
  const entityInfo = await fetchEntityInfo(params);

  view.renderInfoCard('entity-card-template', entityInfo);

  addModalListeners();
  addLogoutListener();

  const swiper = new Swiper('.swiper', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});


function extractParams() {
  const pathname = window.location.pathname;
  const parts = pathname.split('/').filter((part) => part);

  if (parts.length >= 2) {
    const entity = parts[0];
    const id = parts[1];
    return { entity, id };

  } else {
    alert('The URL does not contain the required parameters')
    return null;
  }
}

async function fetchEntityInfo(params){
  const response = await fetchData(`/api/v1/${params.entity}/${params.id}`)
  const result = await response.json();
  return result.data || {};
}