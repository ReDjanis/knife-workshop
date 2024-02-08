'use strict'

const mainPage = document.querySelector('#main-page');
const catalogPage = document.querySelector('#catalog-page');
const searchPage = document.querySelector('#search-page');
const aboutPage = document.querySelector('#about-page');
const deliveryPage = document.querySelector('#delivery-page');
// переключение страниц
const mainBtn = document.querySelectorAll('[data-router="main-link"]');
const catalogBtn = document.querySelectorAll('[data-router="catalog-link"]');
const aboutBtn = document.querySelectorAll('[data-router="about-link"]');
const deliveryBtn = document.querySelectorAll('[data-router="delivery-link"]');

document.addEventListener("DOMContentLoaded", checkActivePage);

function switchPage(activePage, ...rest) {
  activePage.hidden = false;
  for (let value of rest) {
    value.hidden = true;
  }
}

function underlineBtn(activeBtn, ...rest) {
  if (activeBtn) {
    activeBtn.forEach(item => {
      if (!item.classList.contains('header__logo-link')) {
        item.style.borderBottom = '2px solid #f4f3f0';
      }
    });
  }
  for (let value of rest) {
    value.forEach(item => item.style.borderBottom = '2px solid transparent');
  }
}

function checkActivePage() {
  let activePage = sessionStorage.getItem('activePage');
  if (activePage === null || activePage === 'mainPage') {
    switchPage(mainPage, catalogPage, searchPage, aboutPage, deliveryPage);
    underlineBtn(mainBtn, catalogBtn, aboutBtn, deliveryBtn);
  } else if (activePage === 'catalogPage') {
    switchPage(catalogPage, mainPage, searchPage, aboutPage, deliveryPage);
    underlineBtn(catalogBtn, mainBtn, aboutBtn, deliveryBtn);
  } else if (activePage === 'searchPage') {
    switchPage(searchPage, mainPage, catalogPage, aboutPage, deliveryPage);
    underlineBtn(null, mainBtn, catalogBtn, aboutBtn, deliveryBtn);
  } else if (activePage === 'aboutPage') {
    switchPage(aboutPage, mainPage, catalogPage, searchPage, deliveryPage);
    underlineBtn(aboutBtn, mainBtn, catalogBtn, deliveryBtn);
  } else if (activePage === 'deliveryPage') {
    switchPage(deliveryPage, mainPage, catalogPage, searchPage, aboutPage);
    underlineBtn(deliveryBtn, mainBtn, catalogBtn, aboutBtn);
  }
}














