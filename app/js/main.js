'use strict'


$(function () {
  let mixer = mixitup('.gallery__inner', {
    load: {
      filter: '.knives',
    },
  });
})
$(document).ready(function () {
  $('.slider').slick({
    arrows: false,
    dots: true,
    speed: 500,
    cssEase: 'linear'
  });
})
$(window).on('load', function () {
  setTimeout(() => {
    $('.slider').slick('refresh')
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

const main = document.querySelector('#main');
const catalog = document.querySelector('#catalog');
const mainPage = document.querySelector('#main-page');
const catalogPage = document.querySelector('#catalog-page');
main.addEventListener('click', () => {
  mainPage.hidden = false;
  catalogPage.hidden = true;
});
catalog.addEventListener('click', () => {
  mainPage.hidden = true;
  catalogPage.hidden = false;
  $('.slider').slick('refresh');
});

// Карточки
const catalogItems = document.querySelector('.catalog__items');



products.forEach((item, index) => {
  let catalogItem = document.createElement('div');
  catalogItem.className = 'catalog__item';
  //  здесь было ID к каталог-айтему
  catalogItems.append(catalogItem);
  catalogItem.insertAdjacentHTML('beforeend', `<a class="slider slider-${index}"></a>`);
  let slider = document.querySelector(`.slider-${index}`);
  let arrSrcAvif = [],
    arrSrcWebp = [],
    arrSrcJpg = [];
  for (let key in item) {
    if (key.includes('src_')) {
      arrSrcAvif.push(item[key]);
    }
  }
  arrSrcAvif.forEach(item => {
    arrSrcWebp.push(item.replace('avif', 'webp'));
    arrSrcJpg.push(item.replace('avif', 'jpg'));
  })
  slider.insertAdjacentHTML('beforeend', `<div class="slider__item"><picture><source srcset=${arrSrcAvif[0]} type="image/avif"><source srcset=${arrSrcWebp[0]} type="image/webp"><img class="catalog__item-img src_1" src=${arrSrcJpg[0]} alt="Нож"></picture></div>`);
  for (let i = 1; i < arrSrcAvif.length; i++) {
    slider.insertAdjacentHTML('beforeend', `<div class="slider__item"><picture><source srcset=${arrSrcAvif[i]} type="image/avif"><source srcset=${arrSrcWebp[i]} type="image/webp"><img class="catalog__item-img src_${i + 1}" data-lazy=${arrSrcJpg[i]} alt="Нож"></picture></div>`);
  }
  catalogItem.insertAdjacentHTML('beforeend', `<div class="catalog__item-title">${item.title}</div><div class="catalog__item-subtitle">${item.subtitle}</div><button class="catalog__item-btn">Заказать</button>`);
});

let images = document.querySelectorAll('.src_1');

let promise = new Promise((resolve, reject) => {
  let i = 0;
  const interval = setInterval(() => {
    images = document.querySelectorAll('.src_1');

    images.forEach(item => {
      if (!item.closest('.slick-cloned')) {
        i++;
      }
    })
    if (i === products.length) {
      clearInterval(interval);
      resolve(images);
    }
  }, 1000)
})
promise.then((response) => {
  console.log(response, 'response');
  response.forEach(item => {
    console.log(item.naturalWidth, 'item.naturalWidth');
    console.log(item.naturalHeight, 'item.naturalHeight');
    console.log(item.naturalWidth / item.naturalHeight, 'item.naturalWidth / item.naturalHeight');
    if (item.naturalWidth / item.naturalHeight < 1) {
      item.closest('.catalog__item').classList.add('catalog__item-small');
    } else {
      item.closest('.catalog__item').classList.add('catalog__item-big');
    }
  })
})




















