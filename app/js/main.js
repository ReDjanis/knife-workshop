'use strict'
// переключение страниц
const mainBtn = document.querySelector('#main-link');
const catalogBtn = document.querySelector('#catalog-link');
const galleryBtn = document.querySelector('#gallery-link');

// бэграунд в разработке
const divBackground = document.querySelector('.background');

// модальное окошко
const modalWindow = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal__title');
const modalBtn = document.querySelector('.modal__btn');
let modalSlider = document.querySelector('.modal__slider');
modalWindow.addEventListener("click", closeOnBackDropClickOrBtn);
// --------------
// Карточки с пагинацией
let currentPage = 1,
  cards = 21,
  start, end;
const catalogItems = document.querySelector('.catalog__items');
const paginationListElem = document.querySelector('.pagination__list');
let currentPagination = document.getElementsByClassName('pagination__item');
let arrCardsPerPage = getArrCardsPerPage(products, cards, currentPage);

// переменные сортировки для главной страницы
const buttons = document.querySelectorAll('[data-filter]');
const divsSort = document.querySelectorAll(".sort");
let btnActive = document.querySelector('.gallery__btn_active');
// переменные сортировки для каталога
let targetBtn,
  btnClose,
  arrFilteredCards = [],
  checkingForFilter = false, // проверка включения кнопки сортировки
  currentPageWithFilter = 1;
// массивы путей к картинкам
let arrSrcAvif,
  arrSrcWebp,
  arrSrcJpg;
// массив первых картинок в слайдерах и массив всех картинок в каталоге
let images,
  imagesCards;

document.addEventListener("load", function () {
  images = document.querySelectorAll('.src_1');
  imagesCards = document.querySelectorAll('.catalog__item-img');
  showModalWindow(imagesCards, arrCardsPerPage);
  images.forEach(item => setClass(item));

  setTimeout(() => {
    $('.slider').slick('refresh');
  }, 2000)

});

// -------------------------
displayCards(arrCardsPerPage);
displayPagination(products, cards);

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
mainBtn.addEventListener('click', () => {
  mainPage.hidden = false;
  catalogPage.hidden = true;
  sessionStorage.setItem('activePage', 'mainPage');
});
catalogBtn.addEventListener('click', () => {
  console.log('сразу после нажатия');

  divBackground.hidden = false;
  mainPage.hidden = true;
  catalogPage.hidden = false;

  sessionStorage.setItem('activePage', 'catalogPage');

  const intVerification = setInterval(() => {
    if (!(images === null)) {
      clearInterval(intVerification);
      console.log('clear intVerification');
      divBackground.hidden = true;
    }
  }, 1000)

  $('.slider').slick('refresh');
});

galleryBtn.addEventListener('click', () => {
  mainPage.hidden = true;
  catalogPage.hidden = false;
  sessionStorage.setItem('activePage', 'catalogPage');
  $('.slider').slick('refresh');
})

// событие клика для слайдера, открытие модального окна
function showModalWindow(arrayImages, arrayPerPage) {
  Array.from(arrayImages).forEach(function (i) {
    i.addEventListener('click', () => {
      let numProd = i.dataset.object.replace(/[^0-9]/g, '');
      let numImg = i.dataset.numimg.replace(/[^0-9]/g, '');
      console.log(numProd, 'numProd');
      console.log(numImg, 'numImg');

      getPathsToImg(arrayPerPage[numProd]);

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
        initialSlide: +numImg,
        adaptiveWidth: true,
      });
      let arrTexts = [];
      for (let key in arrayPerPage[numProd]) {
        if (key.startsWith('description') && arrayPerPage[numProd][key] !== '') {
          arrTexts.push(arrayPerPage[numProd][key]);
        }
      }
      for (let i = 0; i < arrTexts.length; i++) {
        modalBtn.insertAdjacentHTML('beforebegin', `<p class="modal__text">${arrTexts[i]}</p>`);
      }
      modalTitle.textContent = `${arrayPerPage[numProd].title}`;
      document.body.classList.add("scroll-lock");
      modalWindow.showModal();
      $('.modal__slider').slick('refresh');
    });
  })
}

function getArrCardsPerPage(arr, cardsPerPage, page) {
  page--;
  start = cardsPerPage * page;
  end = start + cardsPerPage;
  return arr.slice(start, end);
}

function displayCards(arr) {
  arr.forEach((item, index) => {
    let catalogItem = document.createElement('div');
    catalogItem.className = 'catalog__item';
    catalogItem.id = `catalog__item-${item.id}`;
    //  здесь было ID к каталог-айтему
    catalogItems.append(catalogItem);

    catalogItem.insertAdjacentHTML('beforeend', `<div class="slider slider-${item.id}"></div>`);
    let slider = document.querySelector(`.slider-${item.id}`);
    getPathsToImg(item);
    slider.insertAdjacentHTML('beforeend', `
            <div class="slider__item">
                <picture>
                    <source srcset=${arrSrcAvif[0]} type="image/avif">
                    <source srcset=${arrSrcWebp[0]} type="image/webp">
                    <img class="catalog__item-img src_1" data-object=elem-${index} data-numimg=number-image-0 src=${arrSrcJpg[0]} alt="Нож">
                </picture>
            </div>
    `);
    for (let i = 1; i < arrSrcAvif.length; i++) {
      slider.insertAdjacentHTML('beforeend', `
            <div class="slider__item">
                <picture>
                    <source srcset=${arrSrcAvif[i]} type="image/avif">
                    <source srcset=${arrSrcWebp[i]} type="image/webp">
                    <img class="catalog__item-img src_${i + 1}" data-object=elem-${index} data-numimg=number-image-${i} data-lazy=${arrSrcJpg[i]} alt="Нож">
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
  });

  $('.slider').slick({
    arrows: false,
    dots: true,
    speed: 500,
    cssEase: 'linear',
  });

  let promise = new Promise((resolve, reject) => {
    let i = 0;
    const interval = setInterval(() => {
      images = document.querySelectorAll('.src_1');

      images.forEach(item => {
        if (!item.closest('.slick-cloned')) {
          i++;
        }
      })

      if (i === arr.length) {
        clearInterval(interval);
        resolve(images);
      }
    }, 1000)
  })
  promise.then((response) => {
    console.log(response, 'response');
    response.forEach(item => setClass(item));
    $('.slider').slick('refresh');
  })
}

function displayPagination(arr, cardsPerPage) {

  const pagesCount = Math.ceil(arr.length / cardsPerPage);
  let liElem;

  Array.from(currentPagination).forEach(item => item.remove());

  for (let i = 0; i < pagesCount; i++) {
    if (checkingForFilter) {
      liElem = displayPaginationBtnWithFilter(i + 1, arr);
    } else {
      liElem = displayPaginationBtn(i + 1, arr);
    }
    paginationListElem.appendChild(liElem);
  }
}

function displayPaginationBtn(page, array) {
  let liElem = document.createElement("li");
  liElem.classList.add('pagination__item');
  liElem.innerText = page;

  if (currentPage == page) {
    liElem.classList.add('pagination__item_active');
  }

  liElem.addEventListener('click', () => {

    currentPage = page;

    arrCardsPerPage = getArrCardsPerPage(array, cards, currentPage);
    catalogItems.innerHTML = "";
    displayCards(arrCardsPerPage);
    imagesCards = document.querySelectorAll('.catalog__item-img');
    console.log(imagesCards, 'imagesCards');
    showModalWindow(imagesCards, arrCardsPerPage);
    let currentItemLi = document.querySelector('.pagination__item_active');
    currentItemLi.classList.remove('pagination__item_active');

    liElem.classList.add('pagination__item_active');
  })

  return liElem;
}

function displayPaginationBtnWithFilter(page, array) {
  let liElem = document.createElement("li");
  liElem.classList.add('pagination__item');
  liElem.innerText = page;
  console.log(liElem, 'liElem');
  if (currentPageWithFilter == page) {
    liElem.classList.add('pagination__item_active');
  }

  liElem.addEventListener('click', () => {
    currentPageWithFilter = page;
    arrCardsPerPageWithFilter = getArrCardsPerPage(array, cards, currentPageWithFilter);
    catalogItems.innerHTML = "";
    displayCards(arrCardsPerPageWithFilter);

    imagesCards = document.querySelectorAll('.catalog__item-img');
    showModalWindow(imagesCards, arrCardsPerPageWithFilter);
    let currentItemLi = document.querySelector('.pagination__item_active');
    currentItemLi.classList.remove('pagination__item_active');

    liElem.classList.add('pagination__item_active');
  })

  return liElem;
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
        $('.slider').slick('unslick');
        if (arrFilteredCards.length <= cards) {
          Array.from(currentPagination).forEach(item => item.remove());
          displayCards(arrFilteredCards);
          imagesCards = document.querySelectorAll('.catalog__item-img');
          showModalWindow(imagesCards, arrFilteredCards);
        } else {

          let arrCardsFilterPerPage;
          arrCardsFilterPerPage = getArrCardsPerPage(arrFilteredCards, cards, currentPageWithFilter);

          displayCards(arrCardsFilterPerPage);
          displayPagination(arrFilteredCards, cards);
          imagesCards = document.querySelectorAll('.catalog__item-img');
          showModalWindow(imagesCards, arrCardsFilterPerPage);
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
                item.insertAdjacentHTML('beforeend', `<span class="catalog__btn-icon"><svg class="catalog__btn-svg"><use href="./images/sprite.svg#close-icon"></use></svg></span>`);
                btnClose = document.querySelector('.catalog__btn-svg');
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
        console.log(arrCardsPerPage, 'arrCardsPerPage');
        $('.slider').slick('unslick');
        displayCards(arrCardsPerPage);

        imagesCards = document.querySelectorAll('.catalog__item-img');
        showModalWindow(imagesCards, arrCardsPerPage);

        item.classList.remove('catalog__btn_active');
        item.children[0].remove();
        targetBtn = null;
        btnClose = null;

        displayPagination(products, cards);
        $('.slider').slick('refresh');
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
  const isClickedOnButton = target === modalBtn;

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















