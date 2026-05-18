function isGitHubDiffUrl(url) {
  return url.includes('/pull/') || url.includes('/commit/');
}

// Directly navigate to the PR/commit page (refresh or open in new tab)
chrome.webNavigation.onCompleted.addListener((details) => {
  if (!isGitHubDiffUrl(details.url)) return;

  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ['src/mainScript.js']
  });
});

// SPA navigation (clicking around GitHub)
chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  if (!isGitHubDiffUrl(details.url)) return;

  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ['src/mainScript.js']
  });
});