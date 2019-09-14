const api = {};

function addKey(key, content) {
  window.postMessage(
    {
      source: '__TRANSLATION_DEVTOOLS__',
      action: 'ADD_KEY',
      payload: { key, content }
    },
    '*'
  );
}

function addAllTranslations(allKeys) {
  window.postMessage(
    {
      source: '__TRANSLATION_DEVTOOLS__',
      action: 'ADD_ALL_TRANSLATIONS',
      payload: { allKeys }
    },
    '*'
  );
}

window.__TRANSLATION_DEVTOOLS__ = { addKey, addAllTranslations };
