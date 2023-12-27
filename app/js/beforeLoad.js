'use strict'

const mainPage = document.querySelector('#main-page');
const catalogPage = document.querySelector('#catalog-page');
const searchPage = document.querySelector('#search-page');
// переключение страниц
const mainBtn = document.querySelectorAll('[data-router="main-link"]');
const catalogBtn = document.querySelectorAll('[data-router="catalog-link"]');

document.addEventListener("DOMContentLoaded", checkActivePage);

function checkActivePage() {
  let activePage = sessionStorage.getItem('activePage');
  if (activePage === null || activePage === 'mainPage') {
    mainPage.hidden = false;
    catalogPage.hidden = true;
    mainBtn.forEach(item => item.style.borderBottom = '2px solid #f4f3f0');
   
    catalogBtn.forEach(item => item.style.borderBottom = 'none');

    // mainPage.style.display = "block";
    // catalogPage.style.display = "none";
    searchPage.hidden = true;
  } else if (activePage === 'catalogPage') {
    mainPage.hidden = true;
    catalogPage.hidden = false;
    mainBtn.forEach(item => item.style.borderBottom = 'none');
    catalogBtn.forEach(item => item.style.borderBottom = '2px solid #f4f3f0');
    // mainPage.style.display = "none";
    // catalogPage.style.display = "block";
    searchPage.hidden = true;
  } else if (activePage === 'searchPage') {
    mainPage.hidden = true;
    catalogPage.hidden = true;
    searchPage.hidden = false;
    mainBtn.forEach(item => item.style.borderBottom = 'none');
    catalogBtn.forEach(item => item.style.borderBottom = 'none');
  }
}













  
