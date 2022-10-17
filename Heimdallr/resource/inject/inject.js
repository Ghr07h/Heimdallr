const script = document.createElement('script');
script.src = chrome.runtime.getURL("/resource/inject/content.js");
document.documentElement.appendChild(script);
