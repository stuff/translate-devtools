window.__TRANSLATION_DEVTOOLS__ = {};
window.__TRANSLATION_DEVTOOLS__.addKey = function(lang, key, content) {
  window.postMessage(
    {
      source: '__TRANSLATION_DEVTOOLS__',
      type: 'ADD_KEY',
      data: { lang, key, content }
    },
    '*'
  );
};
