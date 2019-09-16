# Translate devtools

Chrome extension to manage translation keys of your website

## Getting Started

The extension expose its public api to your code through the `window.__TRANSLATION_DEVTOOLS__` object.

There are actually 2 api functions:


### `window.__TRANSLATION_DEVTOOLS__.addKey(key, translatedText)`
Call this in your front end code service each time you are looking up for the corresponding text string using the key, and use it in the rendering of the page. For example:

```javascript
// your actual service
i18nService.translate = function(key, vars) {
  // retrieve the corresponding translation text using the key
  const translatedText = getTextFromKey(key);

  // add this to notify the extension you are adding a key used in the current page rendering:
  // it's important to test if the API was injected
  if (window.__TRANSLATION_DEVTOOLS__) {
    // call the addKey function
    window.__TRANSLATION_DEVTOOLS__.addKey(key, translatedText);
  }

  // return to your front end code
};
```

`key` is supposed to be the key used for your look up, like `application.actions.submit`, and `translatedText` is the corresponding text, like `Submit the form`.

### `window.__TRANSLATION_DEVTOOLS__.addAllTranslations(allTranslations)`
Call this function when you've loaded the whole file with all the translation. For example:

```javascript
// your actual service
i18nService.getTranslations = function(lang) {
  // fetch your file
  const translations = fetchFromJson(lang);

  // add this to notify the extension about all the keys used in your application:
  // it's important to test if the API was injected
  if (window.__TRANSLATION_DEVTOOLS__) {
    // call the addAllTranslations function
    window.__TRANSLATION_DEVTOOLS__.addAllTranslations(translations);
  }
};
```

`allTranslations` is supposed to be an object like this:
```
{
  application: {
    actions: {
      submit: 'Submit the form',
      reset: 'Reset from'
    }
  }
}
```

**OR**

```
{
  application.actions.submit: 'Submit the form',
  application.actions.reset: ''Reset from'
}
```

<img src="https://stuff-static.s3.eu-west-3.amazonaws.com/images/translate-devtools/screenshot2.png" />
