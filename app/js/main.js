'use strict'
let clickAddCards = false; //проверка нажатия кнопки "Показать еще"
let objSize; //размеры текущего объекта с продуктом
let lengthImagesBeforeDisplay = 0; //длина массива с картинками
// фон загрузки страницы
const divBackground = document.querySelector('.background');
// 
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
// модальное окошко
const modalWindow = document.querySelector('.modal');
const modalAlert = document.querySelector('.modal__alert');
const modalWrp = document.querySelector('.modal__wrapper');
const modalTitle = document.querySelector('.modal__title');
const modalBtn = document.querySelector('.modal__btn');
let modalSlider = document.querySelector('.modal__slider');

modalWindow.addEventListener("click", closeOnBackDropClickOrBtn);
modalWrp.addEventListener('mouseenter', () => {
  modalAlert.style.display = 'none';
})
modalWrp.addEventListener('mouseleave', () => {
  modalAlert.style.display = 'block';
})
// Карточки с пагинацией в каталоге
let currentPage = 1,
  currentPageSearch = 1,
  cards = 15,
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
// раные массивы карточек на странице
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
// let loadFinished = false,
let canUpdate = false;
// -------------------------------------------------------------------------------------
// NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW 
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
    mainPage.hidden = true;
    catalogPage.hidden = true;
    searchPage.hidden = false;
    sessionStorage.setItem('activePage', 'searchPage');
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
    if (sessionStorage.getItem('activePage') === 'searchPage') {
      let catalogItemsPerPage = document.querySelectorAll('.catalog__item');
      catalogItemsPerPage.forEach(el => el.remove());
    }
    mainPage.hidden = false;
    catalogPage.hidden = true;
    // mainPage.style.display = "block";
    // catalogPage.style.display = "none";
    searchPage.hidden = true;
    sessionStorage.setItem('activePage', 'mainPage');
    mainBtn.forEach(item => item.style.borderBottom = '2px solid #f4f3f0');
    catalogBtn.forEach(item => item.style.borderBottom = 'none');
    clickAddCards = false;
  });
})
catalogBtn.forEach(elem => {
  elem.addEventListener('click', () => {

    if (sessionStorage.getItem('activePage') === 'searchPage') {
      let catalogItemsPerPage = document.querySelectorAll('.catalog__item');
      catalogItemsPerPage.forEach(el => el.remove());
    }

    mainPage.hidden = true;
    catalogPage.hidden = false;
    // mainPage.style.display = "none";
    // catalogPage.style.display = "block";
    searchPage.hidden = true;
    sessionStorage.setItem('activePage', 'catalogPage');

    mainBtn.forEach(item => item.style.borderBottom = 'none');
    catalogBtn.forEach(item => item.style.borderBottom = '2px solid #f4f3f0');
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
  for (let j = 0; j < arrSizeFull.length; j++) {
    let element = arrSizeFull[j][0].indexOf(objSizeOneCard.id);
    if (element != -1) {
      objSize = arrSizeFull[j][1];
      break;
    }
  }
  return objSize;
}

function loadCards(arr, divOnPage, arrayImgSize = arrSizes) {
  $('.slider').slick('unslick');
  canUpdate = false;
  let arrCopy = arrayImgSize.slice();

  return new Promise((resolve, reject) => {
    arr.forEach(item => {
      let result = getSizeImage(arrCopy, item);

      let catalogItem = document.createElement('div');

      if (result.size === 'small') {
        catalogItem.className = 'catalog__item catalog__item_small';
      } else {
        catalogItem.className = 'catalog__item catalog__item_big';
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
                    <button class="catalog__item-btn">Заказать</button>
                </div>
              `);
    })

    resolve();
  })
}

function displayCards(arrayPerPage, divToInsert, arraySizes) {

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

function setDisplayEl(div, button) {
  if (div.getAttribute('class').endsWith(button.getAttribute('data-filter'))) {
    div.style.display = 'grid';
  } else {
    div.style.display = 'none';
  }
}

// закрытие модального окна при клике на подложку и на кнопку
function closeOnBackDropClickOrBtn({ currentTarget, target }) {
  const isClickedOnBackDrop = target === currentTarget;
  const isClickedOnButton = target === modalAlert;

  if (isClickedOnBackDrop || isClickedOnButton) {
    $('.modal__slider').slick('unslick');
    modalTitle.textContent = '';
    let modalTextAll = document.querySelectorAll('.modal__text');
    modalTextAll.forEach(item => {
      item.remove();
    })
    modalSlider.innerHTML = '';
    modalWindow.close();
    document.body.classList.remove("scroll-lock");
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











