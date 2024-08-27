import {
  addLogoutListener,
  addModalListeners,
  handleLogout,
  NAV_CHANGE_INTERVAL,
  checkAuthorization
} from './authorization.js';
import { fetchData } from './general.js';

const LIMIT_ITEMS_IN_PAGE = 15;
const DEFAULT_PAGE_NUMBER = 1;
const user = JSON.parse(localStorage.getItem('user'));

document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
  checkAuthorization(user);
  setInterval(() => handleLogout(user), NAV_CHANGE_INTERVAL);

  const targetEntity = getTargetEntity();
  const catalogItems = await fetchCatalogItems(
    targetEntity,
    DEFAULT_PAGE_NUMBER,
    LIMIT_ITEMS_IN_PAGE,
  );

  view.renderCatalogItems(catalogItems, targetEntity);
  if (catalogItems.length === LIMIT_ITEMS_IN_PAGE) {
    view.showLoadMore();
  }
  addListeners();
}

function getTargetEntity() {
  return document
    .querySelector('.tabs__item-link--active')
    .getAttribute('data-filter');
}

async function fetchCatalogItems(entity, numPage, limit) {
  const response = await fetchData(
    `/api/v1/${entity}/items/${numPage}/${limit}`,
  );
  const result = await response.json();
  return result.data || [];
}

function addListeners() {
  document.querySelectorAll('.tabs__item-link').forEach((tab) => {
    tab.addEventListener('click', handleTabClick);
  });
  document
    .getElementById('load-more')
    .addEventListener('click', handleLoadBtnClick);

  addModalListeners();
  addLogoutListener();
}

async function handleTabClick(e) {
  e.preventDefault();
  resetPaginationCounter();

  const tabs = document.querySelectorAll('.tabs__item-link');
  view.changeTab(e.target, tabs);
  view.hideLoadMore();

  const targetEntity = e.target.getAttribute('data-filter');
  const catalogItems = await fetchCatalogItems(
    targetEntity,
    DEFAULT_PAGE_NUMBER,
    LIMIT_ITEMS_IN_PAGE,
  );

  handleCatalogRendering(catalogItems, targetEntity, { clearCatalog: true });
}

function resetPaginationCounter() {
  document
    .getElementById('load-more')
    .setAttribute('data-page', DEFAULT_PAGE_NUMBER.toString());
}

async function handleLoadBtnClick(e) {
  const loadMoreButton = e.target;
  const targetEntity = getTargetEntity();
  let numPage = parseInt(loadMoreButton.getAttribute('data-page'));
  numPage++;

  const catalogItems = await fetchCatalogItems(
    targetEntity,
    numPage,
    LIMIT_ITEMS_IN_PAGE,
  );

  handleCatalogRendering(catalogItems, targetEntity, {
    loadMoreButton,
    numPage,
  });
}

function handleCatalogRendering(
  catalogItems,
  targetEntity,
  { clearCatalog = false, loadMoreButton = null, numPage = null } = {},
) {
  if (!catalogItems) return;

  if (clearCatalog) {
    view.clearCatalog();
  }

  view.renderCatalogItems(catalogItems, targetEntity);

  if (catalogItems.length === LIMIT_ITEMS_IN_PAGE) {
    if (loadMoreButton && numPage !== null) {
      loadMoreButton.setAttribute('data-page', numPage);
    } else {
      view.showLoadMore();
    }
  } else if (loadMoreButton) {
    view.hideLoadMore();
  }
}
