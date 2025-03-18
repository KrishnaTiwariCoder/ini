// Content script runs in the context of web pages
document.addEventListener('DOMContentLoaded', () => {
  // Send current URL to background script for analysis
  chrome.runtime.sendMessage({
    type: 'ANALYZE_URL',
    url: window.location.href
  });
});