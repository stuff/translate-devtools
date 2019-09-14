# Translate devtools

Chrome extension to manage translation keys of your website

## Getting Started

The extension expose its public api to your code through the `window.__TRANSLATION_DEVTOOLS__` object.

Currently, you can only call `window.__TRANSLATION_DEVTOOLS__.addKey(key, translatedText)`. Call this function each time your front end code you're look up service to retrieve the translated text from your key. For example:

```javascript
// your actual service
i18nService.translate = function(key, vars) {
  // retrieve the corresponding translation text using the key
  const translatedText = getTextFromKey(key);

  // add this to notify the extension you are adding a key:

  // it's important to test if the API was injected
  if (window.__TRANSLATION_DEVTOOLS__) {
    // call the addKey function
    window.__TRANSLATION_DEVTOOLS__.addKey(key, translatedText);
  }

  // return to your front end code
};
```


<img src="https://stuff-static.s3.eu-west-3.amazonaws.com/images/translate-devtools/screenshot2.png" />
