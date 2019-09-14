const s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
(document.head || document.documentElement).appendChild(s);
s.onload = function() {
  s.parentNode.removeChild(s);
};

const keys = {};
let allTranslations = {};

// messages coming from the page through script.js
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

  switch (message.action) {
    case 'ADD_KEY': {
      const { key, content } = message.payload;

      keys[key] = content;

      sendKeys();

      break;
    }

    case 'ADD_ALL_TRANSLATIONS': {
      const { allKeys } = message.payload;

      allTranslations = allKeys;

      sendAllTranslations();

      break;
    }
  }
});

// messages coming from Panel
chrome.runtime.onMessage.addListener(function(message) {
  switch (message.action) {
    case 'REQUEST_KEYS': {
      sendKeys();
      break;
    }

    case 'REQUEST_ALL_TRANSLATIONS': {
      sendAllTranslations();
      break;
    }
  }
});

function sendKeys() {
  chrome.runtime.sendMessage({
    action: 'UPDATE_KEYS',
    payload: { keys }
  });
}

function sendAllTranslations() {
  chrome.runtime.sendMessage({
    action: 'UPDATE_ALL_KEYS',
    payload: { allTranslations }
  });
}
