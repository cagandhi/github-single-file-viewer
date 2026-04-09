// Directly navigate to the PR page (refresh or open in new tab)
chrome.webNavigation.onCompleted.addListener((details) => {
  if (!details.url.includes('/pull/')) {
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ['src/mainScript.js']
  });
});

// SPA navigation (clicking around GitHub)
chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  if (!details.url.includes('/pull/')) return;

  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ['src/mainScript.js']
  });
});