'use strict'



const mainPage = document.querySelector('#main-page');
const catalogPage = document.querySelector('#catalog-page');

document.addEventListener("DOMContentLoaded", checkActivePage);

function checkActivePage() {
    let activePage = sessionStorage.getItem('activePage');
    if (activePage === null) {
        mainPage.hidden = false;
        catalogPage.hidden = true;
      } else if (activePage === 'mainPage') {
        mainPage.hidden = false;
        catalogPage.hidden = true;
      } else if (activePage === 'catalogPage') {
        mainPage.hidden = true;
        catalogPage.hidden = false;
      }
}
