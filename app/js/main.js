'use strict'

$(function () {
    let mixer = mixitup('.gallery__inner', {
        load: {
            filter: '.knives',
        },
    });
})

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
})
catalog.addEventListener('click', () => {
    mainPage.hidden = true;
    catalogPage.hidden = false;
})