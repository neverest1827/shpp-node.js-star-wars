import {
  addLogoutListener,
  handleLogout,
  NAV_CHANGE_INTERVAL,
  checkAuthorization,
} from './authorization.js';
import { fetchData, handleError, throwHTTPError } from './general.js';

const entities = [
  'people',
  'planets',
  'films',
  'species',
  'vehicles',
  'starships',
];
let selectedFiles = [];
const user = JSON.parse(localStorage.getItem('user'));

document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
  checkAuthorization(user);
  setInterval(() => handleLogout(user), NAV_CHANGE_INTERVAL);

  const interfaceContainer = document.querySelector('.admin__inner');
  interfaceContainer.innerHTML = await fetchAdminInterfaceMarkup();

  view.renderControlForm(entities);
  addListeners();
}

async function fetchAdminInterfaceMarkup() {
  const response = await fetchData('/api/v1/admin', {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
  const markup = await response.text();
  return markup ?? '';
}

function addListeners() {
  document
    .querySelector('.admin__form-info')
    .addEventListener('submit', handleInfoFormSubmit);
  document
    .querySelector('.admin__form-first')
    .addEventListener('submit', handleControlFormSubmit);
  document.querySelectorAll('.tabs__item-link').forEach((tab) => {
    tab.addEventListener('click', handleTabClick);
  });
  addLogoutListener();
}

async function handleTabClick(e) {
  e.preventDefault();
  const tabs = document.querySelectorAll('.tabs__item-link');
  view.changeTab(e.target, tabs);
  view.renderControlForm(entities);

  if (e.target.getAttribute('data-action') !== 'create') {
    addSelectListeners();
    await createNameSelect();
  }
}

function addSelectListeners() {
  document
    .getElementById('select-entity')
    .addEventListener('change', createNameSelect);
}

async function createNameSelect() {
  const targetEntity = getTargetEntity();
  const entityNames = await getEntityNames(targetEntity);
  if (entityNames?.length) {
    view.renderSelectNames(entityNames);
  }
}

function getTargetEntity() {
  return document.getElementById('select-entity').value.toLowerCase();
}

async function getEntityNames(entity) {
  const response = await fetchData(`api/v1/${entity}/names`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
  const result = await response.json();
  return result.data ?? [];
}

async function handleControlFormSubmit(e) {
  e.preventDefault();
  const action = getAction();
  await handleFormAction(action);
}

async function handleFormAction(action) {
  const targetEntity = getTargetEntity();

  let selectedId;
  switch (action) {
    case 'delete':
      selectedId = getSelectValue();
      const result = await deleteEntity(targetEntity, selectedId);
      if (result.success) {
        alert('Success');
        window.location.reload();
      }
      break;
    case 'create':
      await createEntity(targetEntity);
      break;
    case 'update':
      selectedId = getSelectValue();
      await updateEntity(targetEntity, selectedId);
      break;
    default:
      console.error('Incorrect action');
  }
}

function getSelectValue() {
  return document.getElementById('select-name').value.toLowerCase();
}

async function deleteEntity(entity, id) {
  const response = await fetchData(`api/v1/${entity}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
  const result = await response.json();
  return result.data ?? {};
}

async function createEntity(entity) {
  const template = document.getElementById('create-form-template').innerHTML;
  const formSchema = await getFormSchema(entity);
  window.dataToCreateForm = await getDataToCreateForm(formSchema);

  view.renderInfoForm(template, entity);

  setupNameCheck(entity);
  selectedFiles = []; // reset
  addImageListener();
}

async function getFormSchema(entity) {
  const response = await fetchData(`/api/v1/${entity}/schema`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
  const result = await response.json();
  return result.data ?? {};
}

async function getDataToCreateForm(formSchema) {
  const data = { schema: formSchema };

  for (const key in data.schema) {
    const entity = data.schema[key];
    if (entity) {
      data[entity] = await getEntityNames(entity);
    }
  }

  return data;
}

function setupNameCheck(entity) {
  const element =
    document.getElementById('name') ?? document.getElementById('title');
  element.onblur = () => checkName(element, entity);
}

function addImageListener() {
  const imageInput = document.getElementById('image-input');
  imageInput.onchange = () => {
    const files = Array.from(imageInput.files);
    files.forEach((file) => {
      selectedFiles.push({
        file: file,
        isNew: true,
      });
    });
    showImagePreviews();
  };
}

function showImagePreviews() {
  const preview = document.getElementById('preview');
  clearPreview(preview);

  selectedFiles.forEach((image) => {
    readFile(image.file, preview);
  });
}

function clearPreview(preview) {
  preview.innerHTML = '';
}

function readFile(file, preview) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const imageContainer = createImageContainer();
    const img = createImageElement(e.target.result);
    const deleteBtn = createDeleteButton(file.name, imageContainer);

    imageContainer.appendChild(img);
    imageContainer.appendChild(deleteBtn);
    preview.appendChild(imageContainer);
  };

  reader.readAsDataURL(file);
}

function createImageContainer() {
  const imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';
  return imageContainer;
}

function createImageElement(src) {
  const img = document.createElement('img');
  img.src = src;
  return img;
}

function createDeleteButton(fileName, imageContainer) {
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.onclick = () => {
    selectedFiles = selectedFiles.filter(
      (image) => image.file.name !== fileName,
    );
    imageContainer.remove();
  };
  return deleteBtn;
}

async function updateEntity(entity, id) {
  const formSchema = await getFormSchema(entity);
  window.dataToCreateForm = await getDataToCreateForm(formSchema);

  const template = document.getElementById('create-form-template').innerHTML;
  const dataFormValues = await getDataToFillFormValues(entity, id);

  view.renderInfoForm(template, entity);
  fillForm(dataFormValues);

  await getImages(dataFormValues.images);

  showImagePreviews();
  addImageListener();
}

async function getDataToFillFormValues(entity, id) {
  const response = await fetchData(`/api/v1/${entity}/${id}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
  const result = await response.json();
  return result.data ?? {};
}

function fillForm(dataFormValues) {
  const schema = window.dataToCreateForm.schema;
  Object.keys(schema).forEach((key) => {
    const data = dataFormValues[key];
    const selectClass = `select_${key}`;

    if (schema[key]) {
      handleFillSelect(key, data, selectClass);
    } else {
      view.fillInput(key, data);
    }
  });
}

function handleFillSelect(key, data, selectClass) {
  if (Array.isArray(data) && data.length > 0) {
    let id = getId(data[0]);
    view.setOptionSelected(selectClass, id);
    for (let i = 1; i < data.length; i++) {
      id = getId(data[i]);
      view.renderSelect(key, id);
    }
  }
}

function getId(data) {
  const id = Array.isArray(data) ? data[0].id : data.id;
  return String(id);
}

async function getImages(images) {
  selectedFiles = [];
  for (const image of images) {
    const imageFile = await getImageFile(image.filename);
    selectedFiles.push({
      file: imageFile,
      isNew: false,
    });
  }
}

async function getImageFile(fileName) {
  const response = await fetchData(`/api/v1/images/${fileName}`);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
}

function handleInfoFormSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  saveImages(formData).then(async () => {
    const action = getAction();
    const entity = getTargetEntity();
    const requestData = buildRequestData(formData);
    const isSuccess = await sendRequest(requestData);

    if (isSuccess) {
      alert(`${entity} was ${action} successful`);
      window.location.reload();
    } else {
      alert(`${entity} was ${action} failed`);
      if (selectedFiles.length) await deleteNewImages();
    }
  });
}

async function saveImages(formData) {
  for (const image of selectedFiles) {
    if (image.isNew) {
      const data = await saveImage(formData, image.file);
      image.fileName = data.name;
      formData.append('images', data.name);
    } else {
      formData.append('images', image.file.name);
    }
  }
}

async function saveImage(formData, file) {
  const uploadData = new FormData();
  uploadData.append('file', file);
  const response = await fetchData('api/v1/images', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    body: uploadData,
  });
  const result = await response.json();
  return result.data ?? {};
}

function buildRequestData(formData) {
  const allEntities = [...entities, 'images'];
  const data = {};
  formData.forEach((value, key) => {
    if (allEntities.includes(key)) {
      if (!data[key]) {
        data[key] = [];
      }
      if (value !== 'none' && !(value instanceof File)) {
        data[key].push(value);
      }
    } else {
      data[key] = value;
    }
  });

  document.querySelectorAll('.admin__form-list').forEach((list) => {
    const key = list.id.replace('list__', '');
    data[key] = [];
    list.querySelectorAll('select').forEach((select) => {
      if (select.value !== 'none') {
        data[key].push(select.value);
      }
    });
  });

  return data;
}

async function sendRequest(requestData) {
  const action = getAction();
  const entity = getTargetEntity();

  let url;
  let method;
  if (action === 'create') {
    url = `/api/v1/${entity}`;
    method = 'POST';
  } else {
    const id = getSelectValue();
    url = `/api/v1/${entity}/${id}`;
    method = 'PATCH';
  }

  return await processRequest(url, method, requestData);
}

async function processRequest(url, method, requestData) {
  const response = await fetchData(url, {
    method: method,
    headers: {
      Authorization: `Bearer ${user.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  const result = await response.json();
  return result.data.success;
}

function getAction() {
  return document
    .querySelector('.tabs__item-link--active')
    .getAttribute('data-action')
    .toLowerCase();
}

async function deleteNewImages() {
  for (const image of selectedFiles) {
    if (image.isNew) {
      await fetchData(`api/v1/images/${image.fileName}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    }
  }
}

async function checkName(element, entity) {
  const data = await getEntityNames(entity);
  const isExist = data.find(
    (item) =>
      (item.name ?? item.title).toLowerCase().replaceAll(' ', '') ===
      element.value.toLowerCase().replaceAll(' ', ''),
  );
  if (isExist) alert(`${element.value} already exist!`);
}
