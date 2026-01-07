/**
 * \\Author: Thibault Napoléon "Imothep"
 * \\Company: ISEN Ouest
 * \\Email: thibault.napoleon@isen-ouest.yncrea.fr
 * \\Created Date: 16-Oct-2024 - 12:33:39
 * \\Last Modified: 05-Jan-2026 - 15:08:58
 */

'use strict';

// Constants.
const PROJECT = 'ANR-24-CE56-5502';
const HAL_API_URL = 'https://api.archives-ouvertes.fr/search/' +
  '?q=anrProjectReference_s:"' + PROJECT + '"&fl=halId_s,docid,docType_s,' +
  'authFullName_s,title_s,citationRef_s,label_s,label_bibtex,seeAlso_s,' +
  'producedDateY_i&sort=producedDate_s desc&rows=1000';
const DATA = [
  {'file': 'json/home.json'},
  {'file': 'json/project.json'},
  {'file': 'json/team_experts.json'},
  {'file': 'json/publications_disseminations.json'},
  {'file': 'json/publications_disseminations.json', 'callback': loadHALData},
  {'file': 'json/events.json'},
  {'file': 'json/contact.json'}
]
  
// Load the data.
for (let d of DATA) {
  if (d.callback)
    loadData(d.file, d.callback)
  else
    loadData(d.file)
}

// Collapse menu on click (mobile).
handleMenuCollapse();

// Set the color scheme.
setColorScheme();

// Display project section.
handleMenuClick();
showSection('#home');

//------------------------------------------------------------------------------
//--- loadData -----------------------------------------------------------------
//------------------------------------------------------------------------------
// Load data from a JSON file.
// @param file: the file to load.
// @param callback: the callback to call when the data is loaded.
function loadData(file, callback=processData) {
  fetch(file)
    .then(response => response.json())
    .then(data => callback(data));
}

//------------------------------------------------------------------------------
//--- loadHALData --------------------------------------------------------------
//------------------------------------------------------------------------------
// Load data from HAL.
function loadHALData(data) {
  fetch(HAL_API_URL)
    .then(response => response.json())
    .then(publications => processHALData(publications, data));
}

//------------------------------------------------------------------------------
//--- processHALData -----------------------------------------------------------
//------------------------------------------------------------------------------
// Process the publications loaded from HAL.
// Process the data loaded from the JSON file.
// @param data: the data to process.
function processHALData(publications, data) {
  let types = {
    'ART': [0, 'journals'],
    'COMM': [1, 'conferences'], 'POSTER': [1, 'conferences']
  }

  // Process the publications.
  for (let publication of publications.response.docs)
  {
    console.log(publication)
    let current_data = data[types[publication.docType_s][0]].data[
      types[publication.docType_s][1]].data;
    let authors = publication.authFullName_s.join(', ');
    current_data.id.push(publication.docid);
    current_data.authors.push(authors);
    current_data.title.push(publication.title_s);
    current_data.reference.push(publication.citationRef_s);
    current_data.hal.push(publication.halId_s);
    current_data.bibtex.push(publication.label_bibtex);
    current_data.code.push(publication.seeAlso_s);
    if (publication.seeAlso_s == undefined)
      current_data.codevisible.push('d-none');
    else
      current_data.codevisible.push('d-inline');
  }
  processData(data);
}

//------------------------------------------------------------------------------
//--- processData --------------------------------------------------------------
//------------------------------------------------------------------------------
// Process the data loaded from the JSON file.
// @param data: the data to process.
function processData(data) {
  // Process the global template.
  for (let part of data) {
    let html = part.template;

    // Process each key in the template.
    for (let key in part.data) {
      if (typeof part.data[key] === 'object') {
        let localData = part.data[key];
        let firstKey = Object.keys(localData.data)[0];
        let localHtml = '';
        for (let i = 0; i < localData.data[firstKey].length; i++) {
          localHtml += localData.template;
          for (let k in localData.data)
            localHtml = replaceHtml(localHtml, k, localData.data[k][i]);
        }
        html = replaceHtml(html, key, localHtml);
      }
      else
        html = replaceHtml(html, key, part.data[key]);
    }
    document.getElementById(part.section).innerHTML = html;
    if (part.data.number != undefined)
      updateVisibility(part.section + '-list', 0);
  }

}

//------------------------------------------------------------------------------
//--- replaceHtml --------------------------------------------------------------
//------------------------------------------------------------------------------
// Replace a key by a value in an HTML string.
// @param html: the HTML string.
// @param key: the key to replace.
// @param value: the value to insert.
function replaceHtml(html, key, value) {
  return html.replace('{' + key + '}', value);
}

//------------------------------------------------------------------------------
//--- updateVisibility ---------------------------------------------------------
//------------------------------------------------------------------------------
// Update the visibility of the items in a list.
// @param id: the id of the list.
// @param value: the value to add to the number of items to display.
function updateVisibility(id, value) {
  let element = document.getElementById(id);
  let items = element.getElementsByTagName('li');
  let number = parseInt(element.getAttribute('number')) + value;

  // Update the number of items to display.
  if (number < MINIMUM_ITEMS)
    number = MINIMUM_ITEMS;
  if (number > items.length)
    number = items.length;
  element.setAttribute('number', number);

  // Update the visibility of the items.
  for (let i = 0; i < items.length; i++) {
    if (i < number)
      items[i].classList.remove('d-none');
    else
      items[i].classList.add('d-none');
  }
}

//------------------------------------------------------------------------------
//--- handleMenuCollapse -------------------------------------------------------
//------------------------------------------------------------------------------
// Collapse the menu on click.
function handleMenuCollapse() {
  for (let item of document.getElementById('menu').getElementsByTagName('a')) {
    item.addEventListener('click', function () {
      document.getElementById('menu').classList.remove('show');
    });
  }
}

//------------------------------------------------------------------------------
//--- setColorScheme -----------------------------------------------------------
//------------------------------------------------------------------------------
// Set the color scheme.
// @param mode: the color scheme ('light' or 'dark'). If it is undefined, the
// media preference is used.
function setColorScheme(mode) {
  // Check media preference.
  if (mode == undefined) {
    if (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
      mode = 'dark';
    else
      mode = 'light';
  }

  // Set the color scheme.
  document.getElementsByTagName('body')[0].style.colorScheme = mode;

  // Set color scheme icon.
  if (mode == 'light') {
    document.getElementById('color-scheme').innerHTML =
      '| <i class="bi bi-moon-fill color-scheme"></i>';
    document.getElementById('navbar').classList.remove('navbar-dark');
    document.getElementById('navbar').classList.add('navbar-light');
  }
  else {
    document.getElementById('color-scheme').innerHTML =
      '| <i class="bi bi-sun-fill color-scheme"></i>';
    document.getElementById('navbar').classList.remove('navbar-light');
    document.getElementById('navbar').classList.add('navbar-dark');
  }
}

//------------------------------------------------------------------------------
//--- switchColorScheme --------------------------------------------------------
//------------------------------------------------------------------------------
// Switch the color scheme.
function switchColorScheme() {
  setColorScheme(document.getElementsByTagName('body'
    )[0].style.colorScheme == 'dark' ? 'light' : 'dark');
}

//------------------------------------------------------------------------------
//--- showSection --------------------------------------------------------------
//------------------------------------------------------------------------------
// Show section identified by target_id.
// @param target_id: the id of the target to show.
function showSection(target_id) {
  // Hide each section.
  document.querySelectorAll('section').forEach(section => {
    section.classList.add('d-none');
    // Inactive all menu except the target menu.
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === target_id)
        link.classList.add('active');
    });
  });
  // Show the target section.
  document.querySelectorAll(target_id)[0].classList.remove('d-none');
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
}

//------------------------------------------------------------------------------
//--- handleMenuClick ----------------------------------------------------------
//------------------------------------------------------------------------------
// Handle menu click to show only current section.
function handleMenuClick() {
    document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId) {
        showSection(targetId);
        history.pushState(null, null, targetId);
      }
    });
  });
  
  // History back.
  window.addEventListener('popstate', function () {
    const targetId = window.location.hash;
    showSection(targetId);
  });
}
