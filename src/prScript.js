createDiffViewer({
  matchUrl: url => url.includes('/pull/'),

  getFiles() {
    return Array.from(document.querySelectorAll('div[class*="diffEntry"]'));
  },

  getToggleContainer() {
    // The PR tab bar (Conversation / Commits / Checks / Files changed) is sticky by GitHub's own CSS.
    // Returns null while the tab bar is still loading; addToggle() retries every 500 ms on null.
    return document.querySelector('div[role="tablist"]');
  }
});
