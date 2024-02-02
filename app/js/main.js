'use strict'

// фон загрузки страницы
const divBackground = document.querySelector('.background');
// фон при загрузке карточек
let divLoad = document.querySelector('.loading');
let svgIconKnife = `
    <svg class="loading__svg">
        <use href="./images/sprite.svg#knife-icon"></use>
    </svg>`,
  svgIconMini = `
    <svg class="loading__svg">
        <use href="./images/sprite.svg#mini-icon"></use>
    </svg>`,
  svgIconKitchen = `
    <svg class="loading__svg">
        <use href="./images/sprite.svg#kitchen-icon"></use>
    </svg>`,
  svgIconOther = `
    <svg class="loading__svg">
        <use href="./images/sprite.svg#other-icon"></use>
    </svg>`;
let arrSvgIconLoading = [svgIconKnife, svgIconMini, svgIconKitchen, svgIconOther];

let checkClassForBody = false;// провекрка наличия класса scroll-lock на body
let clickAddCards = false; //проверка нажатия кнопки "Показать еще"
let objSize; //размеры текущего объекта с продуктом
let lengthImagesBeforeDisplay = 0; //длина массива с картинками
// Карточки с пагинацией в каталоге
let currentPage = 1,
  currentPageSearch = 1,
  cards = 14,
  start, end;
const catalogItems = document.querySelector('#cardsInCatalog');
const paginationListElemCatalog = document.querySelector('[data-filter="catalog-pagination-list"]');
const paginationBtnAddCardsCatalog = document.querySelector('[data-filter="catalog-pagination-btn"]');
let currentPaginationCatalog = document.getElementsByClassName('catalog-items');
let nameCatalog = 'catalog-items';
let activeSearchPage = false;
// Карточки с пагинацией в поиске
const searchCards = document.querySelector('#foundCards');
const paginationListElemSearch = document.querySelector('[data-filter="search-pagination-list"]');
const paginationBtnAddCardsSearch = document.querySelector('[data-filter="search-pagination-btn"]');
let currentPaginationSearch = document.getElementsByClassName('search-items');
let nameSearch = 'search-items';
// разные массивы карточек на странице
let arrCardsPerPage = getArrCardsPerPage(products, cards, currentPage);
let arrCardsFilterPerPage;
let arrFoundCardsPerPage;
let arrFoundCards;
// переменные сортировки для главной страницы
const buttons = document.querySelectorAll('[data-filter]');
const divsSort = document.querySelectorAll(".sort");
let btnActive = document.querySelector('.gallery__btn_active');
// переменные сортировки для каталога
let targetBtn,
  btnClose,
  arrFilteredCards = [],
  checkingForFilter = false, // проверка включения кнопок сортировки
  currentPageWithFilter = 1;
// массивы путей к картинкам
let arrSrcAvif,
  arrSrcWebp,
  arrSrcJpg;
// массив всех картинок в каталоге
let imagesCards;
// страница поиска
let searchInfo = document.querySelector('.search__info');
let searchTextFilter = document.querySelector('.search__filter-text');
let searchBtnFilter = document.querySelector('.search__filter');
// загрузка карточек завершилась
let canUpdate = false;
// Форма в модалке
const form = document.form;
const buttonSubmit = document.querySelector('.form__submit-btn');
let arrElementsForm = Array.from(form.elements).filter(item => !!item.name);
// модальное окно формы обратной связи
const modalWindowForm = document.querySelector('.modal-form');
const modalAlertForm = document.querySelector('.modal-form__alert');
const modalWrpForm = document.querySelector('.form');
const modalCloseForm = document.querySelector('.form__btn');
const modalCurrentProductForm = document.querySelector('.form__current-product');

modalWindowForm.addEventListener("click", closeOnBackDropClickOrBtn);
modalCloseForm.addEventListener('click', () => {
  modalWindowForm.click();
})
showButtonToClose(modalWrpForm, modalAlertForm);

// кнопка обратной связи
const btnFeedback = document.querySelectorAll('.btn-feedback');
btnFeedback.forEach(el => {
  el.addEventListener('click', () => {
    document.body.classList.add("scroll-lock");
    checkClassForBody = true;
    modalWindowForm.showModal();
  })
})
// модальное окно с текстом сообщения
const modalWindowMessage = document.querySelector('.modal-message');
const modalBtnMessage = document.querySelector('.modal-message__btn');
// модальное окошко (главная + каталог)
const modalWindow = document.querySelector('.modal');
const modalAlert = document.querySelector('.modal__alert');
const modalBtnClose = document.querySelector('.modal__close');
const modalWrp = document.querySelector('.modal__wrapper');
const modalTitle = document.querySelector('.modal__title');
const modalBtn = document.querySelector('.modal__btn');
let modalSlider = document.querySelector('.modal__slider');

modalWindow.addEventListener("click", closeOnBackDropClickOrBtn);
showButtonToClose(modalWrp, modalAlert);
modalBtnClose.addEventListener('click', () => {
  modalWindow.click();
}
);
// модальное окно страницы about
const modalWindowAbout = document.querySelector('.modal-image');
const modalAlertAbout = document.querySelector('.modal-image__alert');
const modalWrpAbout = document.querySelector('.modal-image__wrapper');
let aboutImg = document.querySelectorAll('.about__img');
let currentImgAbout;
aboutImg.forEach(item => {
  item.addEventListener('click', () => {
    item.classList.remove('about__img_hover');
    currentImgAbout = item;
    modalWrpAbout.insertAdjacentHTML('beforeend', `${item.parentNode.outerHTML}`);
    document.body.classList.add("scroll-lock");
    modalWindowAbout.showModal();
  })
})

modalWindowAbout.addEventListener("click", closeOnBackDropClickOrBtn);
showButtonToClose(modalWrpAbout, modalAlertAbout);
// кнопки Заказать в карточках каталога
let buttonsToRequest;
// кнопка заказать в модалке
let btnToRequestModal = document.querySelector('.modal__btn');
btnToRequestModal.addEventListener('click', (event) => {
  let idCurrentObject = event.target.dataset.numberCurrentObject;
  let currentObj = searchCurrentObject(idCurrentObject);
  insertCurrentObject(currentObj, modalCurrentProductForm);
  modalWindowForm.showModal();
})
// слайдер на странице about
const aboutPhoto = document.querySelector('.about__photo');
if (window.innerWidth <= 1150) {
  aboutPhoto.classList.add('about-slider');

  $('.about-slider').slick({
    dots: true,
    speed: 500,
    cssEase: 'linear',
    variableWidth: true,
    centerMode: true,
    initialSlide: 0,
  });
}
window.addEventListener('resize', () => {
  if (window.innerWidth <= 1150) {
    if (!aboutPhoto.classList.contains('about-slider')) {
      aboutPhoto.classList.add('about-slider');

      $('.about-slider').slick({
        dots: true,
        speed: 500,
        cssEase: 'linear',
        variableWidth: true,
        centerMode: true,
        initialSlide: 0,
      });
    }
  } else {
    $('.about-slider').slick('unslick');
    aboutPhoto.classList.remove('about-slider');
  }
})
// бургер
const burger = document.querySelector('#check-menu');
const burgerNav = document.querySelector('.burger__nav');
burgerNav.addEventListener('click', () => {
  burger.checked = false;
})
// переход в страницу поиска по кнопкам
const searchBtnAll = document.querySelectorAll('[data-name="search-button"]');
searchBtnAll.forEach(item => {
  item.addEventListener('click', () => {
    switchPage(searchPage, mainPage, catalogPage, aboutPage, deliveryPage);
    underlineBtn(null, mainBtn, catalogBtn, aboutBtn, deliveryBtn);
  })
})



// -------------------------------------------------------------------------------------

// массив размеров картинок
let arrSizes = [];

let promise = new Promise((resolve, reject) => {
  let arrayElem;
  products.forEach((elem, index) => {

    arrayElem = [];
    arrayElem.push(elem.id);
    arrSizes.push(arrayElem);

    let img = new Image();
    img.addEventListener('load', () => {
      let object = {};
      if (img.naturalWidth / img.naturalHeight < 1) {
        object.width = 205;
        object.height = 307.5;
        object.size = 'small';
      } else {
        object.width = 307;
        object.height = 205;
        object.size = 'big';
      }
      arrSizes[index].push(object);
    })
    img.src = elem.src_1;

    const interval = setInterval(() => {
      if (arrSizes.length === products.length) {
        clearInterval(interval);

        resolve(arrSizes);
      }
    }, 1000)
  })

})

promise.then((response) => {
  console.log('массив на странице в начале', arrCardsPerPage);
  displayCards(arrCardsPerPage, catalogItems, response);

  showModalWindow();
  displayPagination(products, cards, catalogItems, nameCatalog);
  setDisplayBtnAddCards();

  if (activeSearchPage) {
    paginationListElemSearch.innerHTML = "";
    paginationBtnAddCardsSearch.style.display = "none";
  }
})

// событие клика на картинках на главной странице
const imagesMainPage = document.querySelectorAll('.gallery__img, .gallery__img_big, .benefits__img');
imagesMainPage.forEach(item => {
  item.addEventListener('click', (event) => {
    event.preventDefault();

    for (let index = 0; index < products.length; index++) {
      const element = products[index];
      if (item.dataset.idobj === element.id) {
        let numImg;
        for (let key in element) {
          if (key.startsWith('src')) {
            if (element[key].replace(/[^0-9]/g, '').slice(-2) === item.src.replace(/[^0-9]/g, '').slice(-2)) {
              numImg = +key.replace(/[^0-9]/g, '') - 1;
            }
          }
        }
        showModalWindowOnMainPage(element, numImg);
        break;
      }
    }
  })
})
// -------------------------------------------------------------------------------------

const inputSearch = document.querySelectorAll('.search-input');
let searchBoolean = false;
inputSearch.forEach(el => {
  el.addEventListener('change', (e) => {
    switchPage(searchPage, mainPage, catalogPage, aboutPage, deliveryPage);
    sessionStorage.setItem('activePage', 'searchPage');
    underlineBtn(null, mainBtn, catalogBtn, aboutBtn, deliveryBtn);
    clickAddCards = false;
    divLoad.insertAdjacentHTML('beforeend', arrSvgIconLoading[Math.floor(Math.random() * arrSvgIconLoading.length)]);
    divLoad.style.display = "block";

    let value = e.target.value.trimStart().toLowerCase();
    searchTextFilter.textContent = `${value}`;
    searchBtnFilter.style.display = "flex";

    let searchBtnDel = document.querySelector('.search__btn-svg');
    searchBtnDel.addEventListener('click', () => {
      searchBtnFilter.style.display = "none";
      searchCards.innerHTML = "";
      searchCards.style.display = "none";
      searchInfo.textContent = "Введите свой запрос";
      paginationListElemSearch.innerHTML = "";
      paginationBtnAddCardsSearch.style.display = "none";
    })
    arrFoundCards = [];
    products.forEach(item => {

      for (let key in item) {
        if (!key.startsWith('src')) {
          if (item[key].toLowerCase().includes(value)) {
            arrFoundCards.push(item);
            break;
          }
        }
      }
    })
    if (arrFoundCards.length === 0) {
      divLoad.style.display = "none";
      divLoad.innerHTML = "";
      searchInfo.textContent = "К сожалению, по вашему запросу ничего не найдено.";
      searchCards.innerHTML = "";
      searchCards.style.display = "none";
      paginationListElemSearch.innerHTML = "";
      paginationBtnAddCardsSearch.style.display = "none";
    } else {
      searchBoolean = true;
      catalogItems.innerHTML = "";
      searchCards.innerHTML = "";
      searchCards.style.display = "grid";
      searchInfo.textContent = "";
      currentPageSearch = 1;
      arrFoundCardsPerPage = getArrCardsPerPage(arrFoundCards, cards, currentPageSearch);

      displayCards(arrFoundCardsPerPage, searchCards);
      showModalWindow();

      let currentItemLi = document.querySelector('.pagination__item_active');
      if (currentItemLi) {
        currentItemLi.classList.remove('pagination__item_active');
      }

      displayPagination(arrFoundCards, cards, searchCards, nameSearch);
      setDisplayBtnAddCards();

      if (arrFoundCards.length <= cards) {
        paginationListElemSearch.innerHTML = "";
      }
    }
    e.target.value = "";
  })
})


// -------------------------

// клик для кнопки "Показать еще" в каталоге
paginationBtnAddCardsCatalog.addEventListener('click', () => {
  clickAddCards = true;
  divLoad.insertAdjacentHTML('beforeend', arrSvgIconLoading[Math.floor(Math.random() * arrSvgIconLoading.length)]);
  divLoad.style.display = "block";
  let prevItemLi = document.querySelector('.pagination__item_active');
  prevItemLi.classList.remove('pagination__item_active');
  prevItemLi.nextElementSibling.classList.add('pagination__item_active');
  let currentItemLi = document.querySelector('.pagination__item_active');

  setDisplayBtnAddCards();

  currentPageAlternative = +currentItemLi.textContent;

  if (checkingForFilter) {
    let arrayCardsFilterPerPage = getArrCardsPerPage(arrFilteredCards, cards, currentPageAlternative);
    displayCards(arrayCardsFilterPerPage, catalogItems);
    showModalWindow();
  } else {
    currentPage = +currentItemLi.textContent;
    arrCardsPerPage = getArrCardsPerPage(products, cards, currentPage);
    let arrayCardsPerPage = getArrCardsPerPage(products, cards, currentPageAlternative);

    displayCards(arrayCardsPerPage, catalogItems);
    showModalWindow();
  }
})
// клик для кнопки "Показать еще" в поиске
paginationBtnAddCardsSearch.addEventListener('click', () => {
  clickAddCards = true;
  divLoad.insertAdjacentHTML('beforeend', arrSvgIconLoading[Math.floor(Math.random() * arrSvgIconLoading.length)]);
  divLoad.style.display = "block";
  let prevItemLi = document.querySelector('.pagination__item_active');
  prevItemLi.classList.remove('pagination__item_active');
  prevItemLi.nextElementSibling.classList.add('pagination__item_active');
  let currentItemLi = document.querySelector('.pagination__item_active');

  setDisplayBtnAddCards();

  currentPageAlternative = +currentItemLi.textContent;

  let arrayFoundCardsPerPage = getArrCardsPerPage(arrFoundCards, cards, currentPageAlternative);

  displayCards(arrayFoundCardsPerPage, searchCards);
  showModalWindow();
})

// аккордеон на главной странице
const details = document.querySelectorAll("details");

details.forEach((targetDetail) => {
  targetDetail.addEventListener("click", () => {
    details.forEach((detail) => {
      if (detail !== targetDetail) {
        detail.removeAttribute("open");
      }
    });
  });
});

// переключение между тегами main
mainBtn.forEach(item => {
  item.addEventListener('click', () => {
    deleteSearchCards();
    switchPage(mainPage, catalogPage, searchPage, aboutPage, deliveryPage);
    sessionStorage.setItem('activePage', 'mainPage');
    underlineBtn(mainBtn, catalogBtn, aboutBtn, deliveryBtn);
    clickAddCards = false;
  });
})
catalogBtn.forEach(elem => {
  elem.addEventListener('click', () => {

    deleteSearchCards();
    switchPage(catalogPage, mainPage, searchPage, aboutPage, deliveryPage);
    sessionStorage.setItem('activePage', 'catalogPage');
    underlineBtn(catalogBtn, mainBtn, aboutBtn, deliveryBtn);
    clickAddCards = false;

    if (searchBoolean) {
      activeSearchPage = false;

      if (checkingForFilter) {
        checkingForFilter = false;
        catalogItems.innerHTML = "";
        currentPageWithFilter = 1;

        let btnActive = document.querySelector('.catalog__btn_active');
        btnActive.classList.remove('catalog__btn_active');
        btnActive.children[0].remove();
        targetBtn = null;
        btnClose = null;
      }
      currentPage = 1;
      arrCardsPerPage = getArrCardsPerPage(products, cards, currentPage);

      displayCards(arrCardsPerPage, catalogItems);
      showModalWindow();

      let currentItemLi = document.querySelector('.pagination__item_active');
      if (currentItemLi) {
        currentItemLi.classList.remove('pagination__item_active');
      }

      displayPagination(products, cards, catalogItems, nameCatalog);
      setDisplayBtnAddCards();

      searchBoolean = false;
    }

    const interval = setInterval(() => {
      clearInterval(interval);
      if (canUpdate) {
        $('.slider').slick('refresh');
      }
    }, 100)
  });
})
aboutBtn.forEach(elem => {
  elem.addEventListener('click', () => {
    deleteSearchCards();
    switchPage(aboutPage, mainPage, catalogPage, searchPage, deliveryPage);
    sessionStorage.setItem('activePage', 'aboutPage');
    underlineBtn(aboutBtn, mainBtn, catalogBtn, deliveryBtn);
  })
})
deliveryBtn.forEach(elem => {
  elem.addEventListener('click', () => {
    deleteSearchCards();
    switchPage(deliveryPage, mainPage, catalogPage, searchPage, aboutPage);
    sessionStorage.setItem('activePage', 'deliveryPage');
    underlineBtn(deliveryBtn, mainBtn, catalogBtn, aboutBtn);
  })
})
// Сортировка на главной странице и в каталоге
buttons.forEach(item => {
  if (item.getAttribute('class').includes('gallery')) {
    divsSort.forEach(elem => {
      setDisplayEl(elem, btnActive);

      item.addEventListener('click', () => {
        buttons.forEach(i => {
          if (i !== item) {
            i.classList.remove('gallery__btn_active');
          } else {
            item.classList.add('gallery__btn_active');
          }
        })
        setDisplayEl(elem, item);
      })
    })
  } else if (item.getAttribute('class').includes('catalog')) {

    item.addEventListener('click', (event) => {
      clickAddCards = false;
      divLoad.insertAdjacentHTML('beforeend', arrSvgIconLoading[Math.floor(Math.random() * arrSvgIconLoading.length)]);
      divLoad.style.display = "block";
      arrFilteredCards = [];

      if ((targetBtn !== event.target) && (btnClose !== event.target)) {
        checkingForFilter = true;
        let catalogItemsPerPage = document.querySelectorAll('.catalog__item');
        catalogItemsPerPage.forEach(el => el.remove());

        products.forEach(el => {
          if (el.filter.indexOf(item.dataset.filter) != -1) {
            arrFilteredCards.push(el);
          }
        })
        if (arrFilteredCards.length <= cards) {
          Array.from(currentPaginationCatalog).forEach(item => item.remove());

          displayCards(arrFilteredCards, catalogItems);
          showModalWindow();
          paginationBtnAddCardsCatalog.style.display = 'none';
        } else {
          arrCardsFilterPerPage = getArrCardsPerPage(arrFilteredCards, cards, currentPageWithFilter);

          displayCards(arrCardsFilterPerPage, catalogItems);
          showModalWindow();
          displayPagination(arrFilteredCards, cards, catalogItems, nameCatalog);
          paginationBtnAddCardsCatalog.style.display = 'block';
        }

        buttons.forEach((i) => {
          if (i.getAttribute('class').includes('catalog')) {
            if (i !== item) {
              i.classList.remove('catalog__btn_active');
              if (i.children[0]) {
                i.children[0].remove();
              }
            } else {
              item.classList.add('catalog__btn_active');
              if (!item.children[0]) {
                item.insertAdjacentHTML('beforeend', `<span class="buttons__btn-icon"><svg class="buttons__btn-svg"><use href="./images/sprite.svg#close-icon"></use></svg></span>`);
                btnClose = document.querySelector('.buttons__btn-svg');
                btnClose.addEventListener('click', () => { })
              }
            }
          }
        })
        targetBtn = event.target;

      } else {
        checkingForFilter = false;
        catalogItems.innerHTML = "";
        currentPageWithFilter = 1;

        displayCards(arrCardsPerPage, catalogItems);
        showModalWindow();
        item.classList.remove('catalog__btn_active');
        item.children[0].remove();
        targetBtn = null;
        btnClose = null;

        displayPagination(products, cards, catalogItems, nameCatalog);
        setDisplayBtnAddCards();
      }
    })
  }
})
// поиск текущего объекта по id
function searchCurrentObject(id) {
  for (let index = 0; index < products.length; index++) {
    const element = products[index];
    if (element.id === id) {
      return element;
    }
  }
}
// вставить картинку в заявку
function insertCurrentObject(object, div) {
  getPathsToImg(object);
  div.insertAdjacentHTML('afterbegin', `
              <picture>
                   <source srcset=${arrSrcAvif[0]} type="image/avif">
                    <source srcset=${arrSrcWebp[0]} type="image/webp">
                    <img src="${arrSrcJpg[0]}" alt="" width="100">
              </picture>
              <p>${object.title}</p>
      `)
}
// показывать/скрывать кнопку Закрыть в модалке
function showButtonToClose(divModal, button) {
  divModal.addEventListener('mouseenter', () => {
    button.style.display = 'none';
  })
  divModal.addEventListener('mouseleave', () => {
    button.style.display = 'block';
  })
}
// удалить карточки со страницы поиска, если они были
function deleteSearchCards() {
  if (sessionStorage.getItem('activePage') === 'searchPage' && arrFoundCards !== undefined) {
    let catalogItemsPerPage = document.querySelectorAll('.catalog__item');
    catalogItemsPerPage.forEach(el => el.remove());
  }
}
// событие клика для слайдера, открытие модального окна
function showModalWindow() {
  if (clickAddCards) {
    lengthImagesBeforeDisplay = imagesCards.length;
  } else {
    lengthImagesBeforeDisplay = 0;
  }
  imagesCards = document.querySelectorAll('.catalog__item-img');
  let arrayImages = Array.from(imagesCards);

  if (lengthImagesBeforeDisplay !== 0) {
    arrayImages.splice(0, lengthImagesBeforeDisplay);
  }

  arrayImages.forEach(function (i) {
    i.addEventListener('click', () => {
      let indexCurrentObj;
      let idObj = i.dataset.object.slice(5);
      let numImg = i.dataset.numimg.replace(/[^0-9]/g, '');

      for (let index = 0; index < products.length; index++) {
        const element = products[index];
        if (element.id === idObj) {
          indexCurrentObj = index;
          break;
        }
      }
      getPathsToImg(products[indexCurrentObj]);

      for (let i = 0; i < arrSrcAvif.length; i++) {

        modalSlider.insertAdjacentHTML('beforeend', `
            <div class="modal__item">
                <picture>
                    <source srcset=${arrSrcAvif[i]} type="image/avif">
                    <source srcset=${arrSrcWebp[i]} type="image/webp">
                    <img src=${arrSrcJpg[i]} alt="Нож">
                </picture>
            </div>`);
      }
      if (!modalSlider.classList.contains('slick-initialized')) {
        $('.modal__slider').slick({
          dots: true,
          speed: 500,
          cssEase: 'linear',
          adaptiveHeight: true,
          initialSlide: +numImg,
          adaptiveWidth: true,
        });
      }
      let arrTexts = [];
      for (let key in products[indexCurrentObj]) {
        if (key.startsWith('description') && products[indexCurrentObj][key] !== '') {
          arrTexts.push(products[indexCurrentObj][key]);
        }
      }
      for (let i = 0; i < arrTexts.length; i++) {
        modalBtn.insertAdjacentHTML('beforebegin', `<p class="modal__text">${arrTexts[i]}</p>`);
      }
      modalBtn.dataset.numberCurrentObject = `${products[indexCurrentObj].id}`;
      modalTitle.textContent = `${products[indexCurrentObj].title}`;
      document.body.classList.add("scroll-lock");
      modalWindow.showModal();
      $('.modal__slider').slick('refresh');
    });
  })
}

function showModalWindowOnMainPage(object, number) {
  getPathsToImg(object);

  for (let i = 0; i < arrSrcAvif.length; i++) {
    modalSlider.insertAdjacentHTML('beforeend', `
        <div class="modal__item">
            <picture>
                <source srcset=${arrSrcAvif[i]} type="image/avif">
                <source srcset=${arrSrcWebp[i]} type="image/webp">
                <img src=${arrSrcJpg[i]} alt="Нож">
            </picture>
        </div>`);
  }
  $('.modal__slider').slick({
    dots: true,
    speed: 500,
    cssEase: 'linear',
    adaptiveHeight: true,
    initialSlide: number,
    adaptiveWidth: true,
  });
  let arrTexts = [];
  for (let key in object) {
    if (key.startsWith('description') && object[key] !== '') {
      arrTexts.push(object[key]);
    }
  }
  for (let i = 0; i < arrTexts.length; i++) {
    modalBtn.insertAdjacentHTML('beforebegin', `<p class="modal__text">${arrTexts[i]}</p>`);
  }
  modalBtn.dataset.numberCurrentObject = `${object.id}`;
  modalTitle.textContent = `${object.title}`;
  document.body.classList.add("scroll-lock");
  modalWindow.showModal();
  $('.modal__slider').slick('refresh');
}

function getArrCardsPerPage(arr, cardsPerPage, page) {
  page--;
  start = cardsPerPage * page;
  end = start + cardsPerPage;
  return arr.slice(start, end);
}

function getSizeImage(arrSizeFull, objSizeOneCard) {
  console.log('зашли в функцию getSizeImage');
  for (let j = 0; j < arrSizeFull.length; j++) {
    console.log('проверяем arrSizeFull[j][0]', arrSizeFull[j][0]);
    let element = arrSizeFull[j][0].indexOf(objSizeOneCard.id);
    console.log(element, 'element');
    if (element != -1) {
      objSize = arrSizeFull[j][1];
      console.log('objSize сразу после присвоения значения', objSize);
      break;
    }
  }
  console.log('objSize перед концом функции', objSize);
  return objSize;
}

function loadCards(arr, divOnPage, arrayImgSize = arrSizes) {
  $('.slider').slick('unslick');
  canUpdate = false;
  let arrCopy = arrayImgSize.slice();
  console.log('массив на странице в функции load', arr);
  return new Promise((resolve, reject) => {
    console.log('массив на странице в promise load', arr);
    arr.forEach(item => {
      console.log('передаем в функцию arrCopy', arrCopy);
      console.log('передаем в функцию item', item);
      let result = getSizeImage(arrCopy, item);
      console.log('получили result', result);
      let catalogItem = document.createElement('div');
      console.log('получили catalogItem', catalogItem);
      if (result) {
        if (result.size === 'small') {
          catalogItem.className = 'catalog__item catalog__item_small';
        } else {
          catalogItem.className = 'catalog__item catalog__item_big';
        }
      } else {
        reject();
      }


      catalogItem.id = `catalog__item-${item.id}`;
      divOnPage.append(catalogItem);

      catalogItem.insertAdjacentHTML('beforeend', `<div class="slider slider-${item.id}"></div>`);
      let slider = document.querySelector(`.slider-${item.id}`);

      getPathsToImg(item);

      slider.insertAdjacentHTML('beforeend', `
                <div class="slider__item slider__item-${item.id}">
                    <picture>
                        <source srcset=${arrSrcAvif[0]} type="image/avif">
                        <source srcset=${arrSrcWebp[0]} type="image/webp">
                        <img class="catalog__item-img src_1" data-object="elem-${item.id}" data-numimg="number-image-0" src="${arrSrcJpg[0]}" alt="${item.alt}" width="${result.width}" height="${result.height}">
                    </picture>
                </div>
              `);
      for (let i = 1; i < arrSrcAvif.length; i++) {
        slider.insertAdjacentHTML('beforeend', `
                <div class="slider__item slider__item-${item.id}">
                    <picture>
                        <source srcset=${arrSrcAvif[i]} type="image/avif">
                        <source srcset=${arrSrcWebp[i]} type="image/webp">
                        <img class="catalog__item-img src_${i + 1}" data-object="elem-${item.id}" data-numimg="number-image-${i}" data-lazy="${arrSrcJpg[i]}" alt="" width="${result.width}" height="${result.height}">
                    </picture>
                </div>
              `);
      }
      catalogItem.insertAdjacentHTML('beforeend', `
                <div class="catalog__item-desc">
                    <div class="catalog__item-text">
                        <h3 class="catalog__item-title">${item.title}</h3>
                        <div class="catalog__item-subtitle">${item.subtitle}</div>
                    </div>
                    <button class="catalog__item-btn" data-current-id="${item.id}">Заказать</button>
                </div>
              `);
    })
    resolve();
  })
}

function displayCards(arrayPerPage, divToInsert, arraySizes) {
  console.log('массив на странице в функции display', arrayPerPage);
  loadCards(arrayPerPage, divToInsert, arraySizes).then(() => {
    $('.slider').slick({
      arrows: false,
      dots: true,
      speed: 500,
      cssEase: 'linear',
    });
    $('.slider').slick('refresh');
    canUpdate = true;
    let catalogItemAll = document.querySelectorAll('.catalog__item');
    catalogItemAll.forEach(item => {
      item.style.display = "flex";
    })
    divBackground.style.display = "none";
    divLoad.style.display = "none";
    divLoad.innerHTML = "";

    let lengthBeforeClickAddCards;
    if (clickAddCards) {
      lengthBeforeClickAddCards = buttonsToRequest.length;
    } else {
      lengthBeforeClickAddCards = 0;
    }

    buttonsToRequest = document.querySelectorAll('.catalog__item-btn');
    let arrayButtonsToRequest = Array.from(buttonsToRequest);
    if (lengthBeforeClickAddCards !== 0) {
      arrayButtonsToRequest.splice(0, lengthBeforeClickAddCards);
    }
    arrayButtonsToRequest.forEach(el => {
      el.addEventListener('click', () => {
        console.log(el.dataset.currentId, 'текущее ID');
        let idCurrentObject = el.dataset.currentId;
        let currentObj = searchCurrentObject(idCurrentObject);
        insertCurrentObject(currentObj, modalCurrentProductForm);
        document.body.classList.add("scroll-lock");
        checkClassForBody = true;
        modalWindowForm.showModal();
      })
    })

  }).catch(() => {
    console.log('произошла ошибка загрузки');
    window.location.reload();
  })
}

function displayPagination(arr, cardsPerPage, divOnPage, name) {

  const pagesCount = Math.ceil(arr.length / cardsPerPage);
  let liElem;
  if (sessionStorage.getItem('activePage') === 'searchPage') {
    activeSearchPage = true;
  }
  if (!activeSearchPage) {
    Array.from(currentPaginationCatalog).forEach(item => item.remove());
  } else {
    Array.from(currentPaginationSearch).forEach(item => item.remove());
  }

  for (let i = 0; i < pagesCount; i++) {
    if (checkingForFilter && !searchBoolean) {
      liElem = displayPaginationBtnWithFilter(i + 1, arr, divOnPage, name);
    } else {
      liElem = displayPaginationBtn(i + 1, arr, divOnPage, name);
    }
    if (!activeSearchPage) {
      paginationListElemCatalog.appendChild(liElem);
    } else {
      paginationListElemSearch.appendChild(liElem);
    }
  }
}

function displayPaginationBtn(page, array, div, title) {
  let liElem = document.createElement("li");
  liElem.classList.add('pagination__item');
  liElem.classList.add(`${title}`);
  liElem.innerText = page;
  if (!activeSearchPage) {
    if (currentPage == page) {
      liElem.classList.add('pagination__item_active');
    }
  } else {
    if (currentPageSearch == page) {
      liElem.classList.add('pagination__item_active');
    }
  }

  liElem.addEventListener('click', () => {
    clickAddCards = false;
    divLoad.insertAdjacentHTML('beforeend', arrSvgIconLoading[Math.floor(Math.random() * arrSvgIconLoading.length)]);
    divLoad.style.display = "block";
    if (!activeSearchPage) {
      currentPage = page;
      arrCardsPerPage = getArrCardsPerPage(array, cards, currentPage);
    } else {
      currentPageSearch = page;
      arrCardsPerPage = getArrCardsPerPage(array, cards, currentPageSearch);
    }

    div.innerHTML = "";

    displayCards(arrCardsPerPage, div);
    showModalWindow();

    let currentItemLi = document.querySelector('.pagination__item_active');
    currentItemLi.classList.remove('pagination__item_active');
    liElem.classList.add('pagination__item_active');

    setDisplayBtnAddCards();

    window.scrollTo(0, 0);
  })
  return liElem;
}

function displayPaginationBtnWithFilter(page, array, div) {
  let liElem = document.createElement("li");
  liElem.classList.add('pagination__item');
  liElem.classList.add('catalog-items');
  liElem.innerText = page;

  if (currentPageWithFilter == page) {
    liElem.classList.add('pagination__item_active');
  }

  liElem.addEventListener('click', () => {
    clickAddCards = false;
    divLoad.insertAdjacentHTML('beforeend', arrSvgIconLoading[Math.floor(Math.random() * arrSvgIconLoading.length)]);
    divLoad.style.display = "block";
    currentPageWithFilter = page;
    arrCardsFilterPerPage = getArrCardsPerPage(array, cards, currentPageWithFilter);
    div.innerHTML = "";

    displayCards(arrCardsFilterPerPage, div);
    showModalWindow();

    let currentItemLi = document.querySelector('.pagination__item_active');
    currentItemLi.classList.remove('pagination__item_active');
    liElem.classList.add('pagination__item_active');

    setDisplayBtnAddCards();

    window.scrollTo(0, 0);
  })

  return liElem;
}

// вкл/выкл кнопки "Показать еще"
function setDisplayBtnAddCards() {
  if (!activeSearchPage) {
    if (document.querySelector('.pagination__item_active').nextElementSibling !== null) {
      paginationBtnAddCardsCatalog.style.display = 'block';
    } else {
      paginationBtnAddCardsCatalog.style.display = 'none';
    }
  } else {
    if (document.querySelector('.pagination__item_active').nextElementSibling !== null) {
      paginationBtnAddCardsSearch.style.display = 'block';
    } else {
      paginationBtnAddCardsSearch.style.display = 'none';
    }
  }
}
// получить пути к картинкам в разных форматах
function getPathsToImg(obj) {
  arrSrcAvif = [];
  arrSrcWebp = [];
  arrSrcJpg = [];
  for (let key in obj) {
    if (key.includes('src_')) {
      arrSrcAvif.push(obj[key]);
    }
  }
  arrSrcAvif.forEach(item => {
    arrSrcWebp.push(item.replace('avif', 'webp'));
    arrSrcJpg.push(item.replace('avif', 'jpg'));
  })
}

function setDisplayEl(div, button) {
  if (div.getAttribute('class').endsWith(button.getAttribute('data-filter'))) {
    div.style.display = 'grid';
  } else {
    div.style.display = 'none';
  }
}

// закрытие модального окна при клике на подложку и на кнопку Закрыть
function closeOnBackDropClickOrBtn({ currentTarget, target }) {
  const isClickedOnBackDrop = target === currentTarget;
  let isClickedOnButton;
  switch (target.className) {
    case 'modal':
    case 'modal__alert btn__close':
      isClickedOnButton = target === modalAlert;
      if (isClickedOnBackDrop || isClickedOnButton) {
        $('.modal__slider').slick('unslick');
        modalTitle.textContent = '';
        let modalTextAll = document.querySelectorAll('.modal__text');
        modalTextAll.forEach(item => {
          item.remove();
        })
        modalSlider.innerHTML = '';
        document.body.classList.remove("scroll-lock");
        modalWindow.close();

      }
      break;
    case 'modal-image':
    case 'modal-image__alert btn__close':
      currentImgAbout.classList.add('about__img_hover');
      isClickedOnButton = target === modalAlertAbout;
      if (isClickedOnBackDrop || isClickedOnButton) {
        modalWrpAbout.innerHTML = "";
        document.body.classList.remove("scroll-lock");
        modalWindowAbout.close();
      }
      break;
    case 'modal-form':
    case 'modal-form__alert btn__close':
      isClickedOnButton = target === modalAlertForm;
      if (isClickedOnBackDrop || isClickedOnButton) {
        if (checkClassForBody) {
          document.body.classList.remove("scroll-lock");
          checkClassForBody = false;
        }
        modalCurrentProductForm.innerHTML = "";
        cleaningInputs(arrElementsForm);

        modalWindowForm.close();
        arrElementsForm.forEach((input) => {
          const textErr = document.querySelector(`[data-group=${input.name}]`);
          paintByDefault(textErr, input);
          textErr.textContent = 'обязательно для заполнения';
        })
      }
      break;
  }
}

// установить css класс для правильного отображения размера карточек
function setClass(img) {
  if (img.naturalWidth / img.naturalHeight < 1) {
    img.closest('.catalog__item').classList.add('catalog__item_small');
  } else {
    img.closest('.catalog__item').classList.add('catalog__item_big');
  }
}





// -------------------------------------------------------------
// -------------------------------------------------------------

// Валидация формы обратной связи






buttonSubmit.addEventListener('click', () => {
  event.preventDefault();
  console.log('клик произошел');

  console.log(arrElementsForm, 'arrElementsForm');
  let booleanCheckValidate = true;
  arrElementsForm.forEach((input) => {

    const textErr = document.querySelector(`[data-group=${input.name}]`);

    switch (input.name) {

      case 'nameUser':

        if (input.value.trim() === '') {
          paintRed(textErr, input);
          booleanCheckValidate = booleanCheckValidate && false;
        } else if (!validateName(input.value.trim())) {
          paintRed(textErr, input);
          textErr.textContent = 'имя введено некорректно';
          booleanCheckValidate = booleanCheckValidate && false;
        } else {
          paintByDefault(textErr, input);
          textErr.textContent = 'обязательно для заполнения';
          booleanCheckValidate = booleanCheckValidate && true;
        }
        break;
      case 'email':

        if (input.value.trim() === '') {
          paintRed(textErr, input);
          booleanCheckValidate = booleanCheckValidate && false;
        } else if (!validateEmail(input.value)) {
          paintRed(textErr, input);
          textErr.textContent = 'email введен некорректно';
          booleanCheckValidate = booleanCheckValidate && false;
        } else {
          paintByDefault(textErr, input);
          textErr.textContent = 'обязательно для заполнения';
          booleanCheckValidate = booleanCheckValidate && true;
        }
        break;
      case 'message':

        if (input.value.trim() === '') {
          paintRed(textErr, input);
          booleanCheckValidate = booleanCheckValidate && false;
        } else if (!validateName(input.value.trim())) {
          paintRed(textErr, input);
          textErr.textContent = 'сообщение введено некорректно';
          booleanCheckValidate = booleanCheckValidate && false;
        } else {
          paintByDefault(textErr, input);
          textErr.textContent = 'обязательно для заполнения';
          booleanCheckValidate = booleanCheckValidate && true;
        }
        break;

    }

    if (booleanCheckValidate) {
      modalWindowMessage.style.display = "flex";
      modalWindowMessage.showModal();

    }

  });
})
modalBtnMessage.addEventListener('click', () => {
  modalWindowMessage.style.display = "none";
  modalWindowMessage.close();
})


function paintRed(text, frame) {
  text.style.color = 'red';
  frame.style.border = '3px solid red';
}

function paintByDefault(text, frame) {
  text.style.color = '#000';
  frame.style.border = 'none';
}

function validateName(name) {
  const re = /[а-яА-ЯЁё]/;
  return re.test(name);
}
// Проверка email'a:
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function cleaningInputs(arr) {
  arr.forEach((item) => {
    item.value = '';
  });
}

