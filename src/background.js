function getScriptsForUrl(url) {
  if (url.includes("/pull/")) return ["src/common.js", "src/prScript.js"];
  if (url.includes("/commit/")) return ["src/common.js", "src/commitScript.js"];
  return null;
}

// Direct navigation (hard refresh or new tab)
chrome.webNavigation.onCompleted.addListener((details) => {
  const scripts = getScriptsForUrl(details.url);
  if (!scripts) return;
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: scripts,
  });
});

// SPA navigation (clicking around GitHub)
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  const scripts = getScriptsForUrl(details.url);
  if (!scripts) return;
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: scripts,
  });
});
