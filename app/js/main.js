'use strict'




const mainBtn = document.querySelector('#main-link');
const catalogBtn = document.querySelector('#catalog-link');
const galleryBtn = document.querySelector('#gallery-link');







$(document).ready(function () {
  $('.slider').slick({
    arrows: false,
    dots: true,
    speed: 500,
    cssEase: 'linear'
  });
})
$(window).on('load', function () {
  let images = document.querySelectorAll('.src_1');
  images.forEach(item => {
    if (item.naturalWidth / item.naturalHeight < 1) {
      item.closest('.catalog__item').classList.add('catalog__item_small');
    } else {
      item.closest('.catalog__item').classList.add('catalog__item_big');
    }
  })
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


mainBtn.addEventListener('click', () => {
  mainPage.hidden = false;
  catalogPage.hidden = true;
  sessionStorage.setItem('activePage', 'mainPage');
});
catalogBtn.addEventListener('click', () => {
  mainPage.hidden = true;
  catalogPage.hidden = false;
  sessionStorage.setItem('activePage', 'catalogPage');
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
  catalogItem.insertAdjacentHTML('beforeend', `<div class="catalog__item-desc"><div class="catalog__item-title">${item.title}</div><div class="catalog__item-subtitle">${item.subtitle}</div><button class="catalog__item-btn">Заказать</button></div>`);
});





// Сортировка на главной странице и в каталоге

// переменные для главной страницы
const buttons = document.querySelectorAll('[data-filter]');
const divsSort = document.querySelectorAll(".sort");
let btnActive = document.querySelector('.gallery__btn_active');
let catalogItemsAll = document.querySelectorAll('.catalog__item');
let targetBtn;

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
      console.log(event, 'event before');
      console.log(event.currentTarget, 'currentTarget');
      if (targetBtn !== event.target) {
        products.forEach((elem, index) => {
          let catalogItem = document.querySelector(`#catalog__item-${index}`);
          if (elem.filter.indexOf(item.dataset.filter) != -1) {
            catalogItem.style.display = 'flex';
          } else {
            catalogItem.style.display = 'none';
          }
        })
        buttons.forEach((i, num) => {
          if (i.getAttribute('class').includes('catalog')) {
            if (i !== item) {
              i.classList.remove('catalog__btn_active');
              if (i.children[0]) {
                i.children[0].remove();
              }
            } else {
              item.classList.add('catalog__btn_active');
              if (!item.children[0]) {
                item.insertAdjacentHTML('beforeend', `<span class="catalog__btn-lines"><span class="catalog__btn-line catalog__btn-line_position-1"></span><span class="catalog__btn-line catalog__btn-line_position-2"></span></span>`)
              }
            }
            targetBtn = event.target;
          }
        })

      } else {
        catalogItemsAll.forEach(element => {
          element.style.display = 'flex';
        })
        item.classList.remove('catalog__btn_active');
        item.children[0].remove();
        targetBtn = null;
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



















