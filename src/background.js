chrome.webNavigation.onCompleted.addListener((details) => {
  // load the script when navigation to the page is completed. The mainScript() below still waits for files to be available but this allows the toggle to be injected when PR page opens for ease of use.
  if (!details.url.includes('/pull/')) {
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ['src/mainScript.js']
  });
});
