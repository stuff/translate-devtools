const tabId = chrome.devtools.inspectedWindow.tabId;
const backgroundPageConnection = chrome.runtime.connect({
  name: 'devtools-translations'
});

backgroundPageConnection.postMessage({
  name: 'init',
  tabId
});

function updateCount(element, count) {
  element.innerHTML = count > 0 ? ` (${count})` : '';
}

const tableKeysContainerElement = document.getElementById('keys');
const tableAllKeysContainerElement = document.getElementById(
  'all_translations'
);
const keyCountElement = document.getElementById('key-count');
const allTranslationsCountElement = document.getElementById(
  'all-translations-count'
);

const tabs = document.getElementById('tabs');
const inputFilterElement = document.getElementById('input_filter');
const tableKeys = new TableKey(tableKeysContainerElement);
const tableAllKeys = new TableKey(tableAllKeysContainerElement);

tableKeys.onUpdate(data => {
  updateCount(keyCountElement, Object.keys(data).length);
});

tableAllKeys.onUpdate(data => {
  updateCount(allTranslationsCountElement, Object.keys(data).length);
});

inputFilterElement.addEventListener('keyup', function(event) {
  [tableKeys, tableAllKeys].forEach(table => {
    table.setFilterValue(event.target.value);
    table.render();
  });
});

backgroundPageConnection.onMessage.addListener(function({ action, payload }) {
  switch (action) {
    case 'UPDATE_KEYS':
      tableKeys.updateData(payload.keys);
      break;

    case 'UPDATE_ALL_KEYS':
      tableAllKeys.updateData(flattenObject(payload.allTranslations));
      break;
  }
});

const buttons = [...tabs.getElementsByTagName('button')];
buttons.forEach(button => {
  button.addEventListener('click', function(event) {
    const { target } = event;
    const { name } = target.closest('button').dataset;

    if (target.matches('.pure-button-active')) {
      return;
    }

    // unselect all button
    buttons.forEach(button => {
      button.classList.remove('pure-button-active');
    });

    // hide all tabs
    document.querySelectorAll('.tab-content').forEach(element => {
      element.classList.add('hidden');
    });

    // select button
    button.classList.add('pure-button-active');

    // show the correct tab
    document.getElementById(name).classList.remove('hidden');
  });
});

chrome.tabs.sendMessage(tabId, {
  action: 'REQUEST_KEYS'
});

chrome.tabs.sendMessage(tabId, {
  action: 'REQUEST_ALL_TRANSLATIONS'
});
