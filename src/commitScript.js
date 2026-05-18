createDiffViewer({
  matchUrl: url => url.includes('/commit/'),

  getFiles() {
    // Each file diff is a div[role="region"] wrapping a Diff-module header + table.
    const headers = document.querySelectorAll('div[class*="Diff-module__diffHeaderWrapper"]');
    if (!headers.length) return [];
    const seen = new Set();
    const regions = [];
    headers.forEach(h => {
      const region = h.closest('[role="region"]');
      if (region && !seen.has(region)) {
        seen.add(region);
        regions.push(region);
      }
    });
    return regions;
  },

  getToggleContainer() {
    // Primary: append into the "X files changed" stats bar in the commit header.
    // This is a flex row so the toggle lands at the right end, mirroring the PR tab bar.
    const statsBar = document.querySelector('div[class*="CommitHeader-module__commitFilesChangedContainer"]');
    if (statsBar) {
      if (!statsBar.dataset.ghStickyApplied) {
        statsBar.style.position = 'sticky';
        statsBar.style.top = '0';
        statsBar.style.zIndex = '100';
        statsBar.style.backgroundColor = 'var(--bgColor-default, #ffffff)';
        statsBar.style.padding = '8px 0';
        statsBar.dataset.ghStickyApplied = 'true';
      }
      return statsBar;
    }

    // Fallback: inject a sticky toolbar before the first diff region.
    let toolbar = document.getElementById('gh-single-file-toolbar');
    if (toolbar) return toolbar;

    const firstRegion = document.querySelector('[role="region"][aria-labelledby]');
    if (!firstRegion || !firstRegion.parentElement) return null;

    toolbar = document.createElement('div');
    toolbar.id = 'gh-single-file-toolbar';
    toolbar.style.cssText = 'display:flex;align-items:center;padding:8px 4px;margin-bottom:8px;position:sticky;top:0;z-index:100;background-color:var(--bgColor-default,#ffffff);';
    firstRegion.parentElement.insertBefore(toolbar, firstRegion);
    return toolbar;
  }
});
