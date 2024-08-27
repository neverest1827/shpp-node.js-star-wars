const view = {
  renderCatalogItems: (data, entity) => {
    const template = document.getElementById('catalog-template').innerHTML;
    document.querySelector('.catalog__list').innerHTML += ejs.render(template, {
      data,
      entity
    });
  },

  clearCatalog: () => {
    document.querySelector('.catalog__list').innerHTML = '';
  },

  removeActiveTabs: (tabs) => {
    tabs.forEach((tab) => tab.classList.remove('tabs__item-link--active'));
  },

  changeTab: (element, tabs) => {
    view.removeActiveTabs(tabs);
    element.classList.add('tabs__item-link--active');
  },

  changeNavItems: () => {
    const navItems = document.querySelectorAll('.header__nav-item');
    navItems.forEach((item) => {
      item.classList.toggle('header__nav-item--visible');
    });
  },

  renderInfoCard: (templateName, data) => {
    const template = document.getElementById(templateName).innerHTML;
    document
      .querySelector('.content')
      .innerHTML = ejs.render( template, { data } );
  },

  renderControlForm: (entities) => {
    view.removeActiveForm();
    const action = document
      .querySelector('.tabs__item-link--active')
      .getAttribute('data-action');
    const template = document.getElementById('control-form-template').innerHTML;
    document.querySelector('.admin__form-first').innerHTML = ejs.render(
      template,
      { action, entities },
    );
    document
      .querySelector('.admin__form')
      .classList.add('admin__form--visible');
  },

  renderInfoForm: (template, entity) => {
    document
      .querySelector(".admin__form-info")
      .innerHTML = ejs.render(template, { data: window.dataToCreateForm, entity });
    document
      .querySelector('.admin__form-info')
      .classList.add('admin__form--visible');
  },

  removeActiveForm: () => {
    document.querySelectorAll('.admin__form').forEach((form) => {
      form.classList.remove('admin__form--visible');
    });
  },

  renderSelectNames: (data) => {
    const template = document.getElementById('select-name-template').innerHTML;
    document.getElementById('select-name').innerHTML = ejs.render(template, {
      data
    });
  },

  renderSelect: (key, id) => {
    const entity = dataToCreateForm.schema[key];
    const data = dataToCreateForm[entity];
    const template = document.getElementById('create-select').innerHTML;

    const selects = document.querySelectorAll(`.select_${key}`);
    const selectedValues = Array.from(selects).map((select) => select.value);

    document.getElementById(`list__${key}`).innerHTML += ejs.render(template, {
      data: data,
      selectClass: `select_${key}`,
      id: id || null
    });

    const newSelects = document.querySelectorAll(`.select_${key}`);
    selectedValues.forEach((value, index) => {
      if (newSelects[index]) {
        newSelects[index].value = value;
      }
    });
  },

  removeSelect: (element) => {
    element.remove();
  },

  setOptionSelected: (selectClass, id) => {
    const selectElement = document.querySelector(`.${selectClass}`);
    const options = Array.from(selectElement.children);
    const targetOption = options.find((option) => option.value === id);
    if (targetOption) {
      targetOption.setAttribute('selected', '');
    }
  },

  fillInput: (elementId, value) => {
    document.getElementById(elementId).value = value;
  },

  showLoadMore: () => {
    document.getElementById('load-more').style.display = 'block';
  },

  hideLoadMore: () => {
    document.getElementById('load-more').style.display = 'none';
  },

  showModal: (e, titleText, formClass) => {
    e.preventDefault();
    const modal = document.querySelector('.modal');
    const modalForm = document.querySelector('.modal__form');
    const title = document.querySelector('.modal__title');

    modal.classList.add('modal--visible');
    modalForm.className = `modal__form ${formClass}`;
    title.innerHTML = titleText;
  },

  hideModal: () => {
    const modal = document.querySelector('.modal');
    modal.classList.remove('modal--visible');
  },

  showLoader: () => {
    document.querySelector('.loader').style.display = 'flex';
  },

  hideLoader: () => {
    document.querySelector('.loader').style.display = 'none';
  },
};
