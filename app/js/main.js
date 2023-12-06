'use strict'

const pageHeight = document.documentElement.clientHeight;
console.log(pageHeight, 'pageHeight');


const mainBtn = document.querySelector('#main-link');
const catalogBtn = document.querySelector('#catalog-link');
const galleryBtn = document.querySelector('#gallery-link');

const divBackground = document.querySelector('.background');

// модальное окошко

const modalWindow = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal__title');

const modalBtn = document.querySelector('.modal__btn');
let modalSlider = document.querySelector('.modal__slider');
modalWindow.addEventListener("click", closeOnBackDropClickOrBtn);

// 
let arrSrcAvif,
  arrSrcWebp,
  arrSrcJpg;


$(document).ready(function () {
  $('.slider').slick({
    arrows: false,
    dots: true,
    speed: 500,
    cssEase: 'linear',
  });

})
let images,
  imagesCards;
$(window).on('load', function () {
  images = document.querySelectorAll('.src_1');
  imagesCards = document.querySelectorAll('.catalog__item-img');
  images.forEach(item => {
    if (item.naturalWidth / item.naturalHeight < 1) {
      item.closest('.catalog__item').classList.add('catalog__item_small');
    } else {
      item.closest('.catalog__item').classList.add('catalog__item_big');
    }
  })
  imagesCards.forEach(i => {
    i.addEventListener('click', () => {
      let numProd = i.dataset.object.replace(/[^0-9]/g, '');
      let numImg = i.dataset.numimg.replace(/[^0-9]/g, '');

      getPaths(products[numProd]);

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
      });
      let arrTexts = [];
      for (let key in products[numProd]) {
        if (key.startsWith('description') && products[numProd][key] !== '') {
          arrTexts.push(products[numProd][key]);
        }
      }
      for (let i = 0; i < arrTexts.length; i++) {
        modalBtn.insertAdjacentHTML('beforebegin', `<p class="modal__text">${arrTexts[i]}</p>`);
      }
      modalTitle.textContent = `${products[numProd].title}`;
      document.body.classList.add("scroll-lock");
      modalWindow.showModal();
    })
  })
  setTimeout(() => {
    $('.slider').slick('refresh');
  }, 2000)

});

//\\//\\//\\//\\ End jQuery Calls //\\//\\//\\//\\



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



// Карточки
const catalogItems = document.querySelector('.catalog__items');



products.forEach((item, index) => {
  let catalogItem = document.createElement('div');
  catalogItem.className = 'catalog__item';
  catalogItem.id = `catalog__item-${index}`;
  //  здесь было ID к каталог-айтему
  catalogItems.append(catalogItem);
  catalogItem.insertAdjacentHTML('beforeend', `<div class="slider slider-${index}"></div>`);
  let slider = document.querySelector(`.slider-${index}`);
  getPaths(item);
  slider.insertAdjacentHTML('beforeend', `<div class="slider__item"><picture><source srcset=${arrSrcAvif[0]} type="image/avif"><source srcset=${arrSrcWebp[0]} type="image/webp"><img class="catalog__item-img src_1" data-object=elem-${index} data-numimg=number-image-0 src=${arrSrcJpg[0]} alt="Нож"></picture></div>`);
  for (let i = 1; i < arrSrcAvif.length; i++) {
    slider.insertAdjacentHTML('beforeend', `<div class="slider__item"><picture><source srcset=${arrSrcAvif[i]} type="image/avif"><source srcset=${arrSrcWebp[i]} type="image/webp"><img class="catalog__item-img src_${i + 1}" data-object=elem-${index} data-numimg=number-image-${i} data-lazy=${arrSrcJpg[i]} alt="Нож"></picture></div>`);
  }
  catalogItem.insertAdjacentHTML('beforeend', `<div class="catalog__item-desc"><h3 class="catalog__item-title">${item.title}</h3><div class="catalog__item-subtitle">${item.subtitle}</div><button class="catalog__item-btn">Заказать</button></div>`);
  // событие клика для слайдера, открытие модального окна





});
// получить пути к картинкам в разных форматах
function getPaths(obj) {
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

// переменные для главной страницы
const buttons = document.querySelectorAll('[data-filter]');
const divsSort = document.querySelectorAll(".sort");
let btnActive = document.querySelector('.gallery__btn_active');
let catalogItemsAll = document.querySelectorAll('.catalog__item');
let targetBtn;
let btnClose;

buttons.forEach(item => {
  if (item.getAttribute('class').includes('gallery')) {
    divsSort.forEach(elem => {
      getDivStatus(elem, btnActive);

      item.addEventListener('click', () => {
        buttons.forEach(i => {
          if (i !== item) {
            i.classList.remove('gallery__btn_active');
          } else {
            item.classList.add('gallery__btn_active');
          }
        })
        getDivStatus(elem, item);
      })
    })
  } else if (item.getAttribute('class').includes('catalog')) {
    item.addEventListener('click', (event) => {

      if ((targetBtn !== event.target) && (btnClose !== event.target)) {
        products.forEach((elem, index) => {
          let catalogItem = document.querySelector(`#catalog__item-${index}`);
          if (elem.filter.indexOf(item.dataset.filter) != -1) {
            catalogItem.style.display = 'flex';
          } else {
            catalogItem.style.display = 'none';
          }
        })
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
        catalogItemsAll.forEach(element => {
          element.style.display = 'flex';
        })
        item.classList.remove('catalog__btn_active');
        item.children[0].remove();
        targetBtn = null;
        btnClose = null;
      }
    })
  }
})






function getDivStatus(div, button) {
  if (div.getAttribute('class').endsWith(button.getAttribute('data-filter'))) {
    div.style.display = 'grid';
  } else {
    div.style.display = 'none';
  }
}
// Конец сортировки




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

















