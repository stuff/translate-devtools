window.__TRANSLATION_DEVTOOLS__ = {};
window.__TRANSLATION_DEVTOOLS__.addKey = function(key, content) {
  window.postMessage(
    {
      source: '__TRANSLATION_DEVTOOLS__',
      action: 'ADD_KEY',
      data: { key, content }
    },
    '*'
  );
};
