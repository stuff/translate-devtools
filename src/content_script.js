const s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
(document.head || document.documentElement).appendChild(s);
s.onload = function() {
  s.parentNode.removeChild(s);
};

const keys = {};

window.addEventListener('message', function(event) {
  // Only accept messages from the same frame
  if (event.source !== window) {
    return;
  }

  const message = event.data;

  // Only accept messages that we know are ours
  if (
    typeof message !== 'object' ||
    message === null ||
    message.source !== '__TRANSLATION_DEVTOOLS__'
  ) {
    return;
  }

  const { content, key, lang } = message.data;

  if (!keys[lang]) {
    keys[lang] = {};
  }

  keys[lang][key] = content;

  chrome.runtime.sendMessage({ action: 'KEY_LIST_REQUEST', payload: { keys } });
});

chrome.runtime.onMessage.addListener(function({ action }) {
  // send to background script
  if (action === 'KEY_LIST_REQUEST') {
    chrome.runtime.sendMessage({ action, payload: { keys } });
  }
});
