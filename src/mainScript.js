function mainScript() {
  (function () {
    let current = 0;
    let localStorageKey = 'gh-single-file-toggle-enabled';
    // ✅ top-level for SPA detection
    let lastUrl = location.href;

    function getFiles() {
      // PR pages
      const prFiles = Array.from(document.querySelectorAll('div[class*="diffEntry"]'));
      if (prFiles.length) return prFiles;

      // Commit pages: each file diff is a div[role="region"] wrapping a Diff-module header
      const diffHeaders = document.querySelectorAll('div[class*="Diff-module__diffHeaderWrapper"]');
      if (diffHeaders.length) {
        const seen = new Set();
        const regions = [];
        diffHeaders.forEach(h => {
          const region = h.closest('[role="region"]');
          if (region && !seen.has(region)) {
            seen.add(region);
            regions.push(region);
          }
        });
        if (regions.length) return regions;
      }

      return [];
    }

    function showAll() { getFiles().forEach(f => f.style.display = 'block'); }

    function isEnabled() {
      return localStorage.getItem(localStorageKey) === 'true';
    }

    function syncView() {
      if (isEnabled()) {
        applyFromHash();
      } else {
        showAll();
      }
    }

    function showFile(index) {
      const files = getFiles();
      if (!files.length) return;
      if (index < 0) index = 0;
      if (index >= files.length) index = files.length - 1;
      files.forEach((f, i) => f.style.display = i === index ? 'block' : 'none');
      files[index].scrollIntoView({ block: 'start' });
      current = index;
    }

    function findIndexFromHash() {
      const hash = window.location.hash;
      if (!hash) return -1;
      const anchor = hash.slice(1);
      const files = getFiles();
      // Ask each file whether it owns this anchor — works for both
      // PR pages (outer div has id) and commit pages (inner table has data-diff-anchor)
      return files.findIndex(f =>
        f.id === anchor ||
        !!f.querySelector('[data-diff-anchor="' + anchor + '"]')
      );
    }

    function applyFromHash() {
      if (!isEnabled()) return;
      const idx = findIndexFromHash();
      if (idx !== -1) { showFile(idx); } else { showFile(current); }
    }

    function isDarkMode() {
      const mode = document.documentElement.getAttribute('data-color-mode');

      return mode === 'dark' ||
        (mode === 'auto' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    function isGitHubDiffPage() {
      return location.href.includes('/pull/') || location.href.includes('/commit/');
    }

    // Returns the container to append/insert the toggle into.
    // PR pages: the existing tablist (sticky by GitHub's own CSS).
    // Commit pages: the "X files changed" stats bar, made sticky.
    // Fallback: a sticky toolbar injected before the first diff entry.
    function getOrCreateToggleContainer() {
      // PR pages
      const tablist = document.querySelector('div[role="tablist"]');
      if (tablist) return tablist;

      // Commit pages — "X files changed" stats bar
      const statsBar = document.querySelector('div[class*="CommitHeader-module__commitFilesChangedContainer"]');
      if (statsBar) {
        // Pin it once so the toggle stays accessible while scrolling through diffs
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

      // Fallback: sticky toolbar injected before the first diff entry
      const existing = document.getElementById('gh-single-file-toolbar');
      if (existing) return existing;

      const firstDiff = document.querySelector('div[class*="diffEntry"]');
      if (!firstDiff || !firstDiff.parentElement) return null;

      const toolbar = document.createElement('div');
      toolbar.id = 'gh-single-file-toolbar';
      toolbar.style.cssText = 'display:flex;align-items:center;padding:8px 4px;margin-bottom:8px;position:sticky;top:0;z-index:100;background-color:var(--bgColor-default,#ffffff);';
      firstDiff.parentElement.insertBefore(toolbar, firstDiff);
      return toolbar;
    }

    function pollToggle() {
      setInterval(() => {
        if (!isGitHubDiffPage()) return;
        const container = getOrCreateToggleContainer();
        if (!container) return;              // container not ready yet
        if (!document.getElementById('gh-single-file-toggle')) {
          addToggle();                        // safe because addToggle() is idempotent
        }
      }, 300); // check every 300ms, cheap enough
    }

    function runWhenFilesReady(callback, retries = 20) {
      const files = getFiles();
      if (files.length) {
        callback();
      } else if (retries > 0) {
        setTimeout(() => runWhenFilesReady(callback, retries - 1), 50);
      }
    }

    function addToggle() {
      // safety check to prevent multiple toggles in case of multiple triggers
      if (document.getElementById('gh-single-file-toggle')) return;
      const container = getOrCreateToggleContainer();
      if (!container) return setTimeout(addToggle, 500);

      const isDark = isDarkMode();

      const wrapper = document.createElement('div');
      wrapper.id = 'gh-single-file-toggle';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.gap = '6px';
      wrapper.style.marginLeft = '12px';

      const label = document.createElement('span');
      label.textContent = 'Single file:';
      label.style.fontSize = '14px';
      label.style.color = isDark ? '#ffffff' : '#000000';

      const btn = document.createElement('button');
      btn.style.width = '32px';
      btn.style.height = '18px';
      btn.style.borderRadius = '999px';
      btn.style.border = '1px solid ' + (isDark ? '#ffffff' : '#000000');
      btn.style.background = '#eaeef2';
      btn.style.position = 'relative';
      btn.style.cursor = 'pointer';

      const knob = document.createElement('span');
      knob.style.position = 'absolute';
      knob.style.top = '1px';
      knob.style.left = '1px';
      knob.style.width = '14px';
      knob.style.height = '14px';
      knob.style.borderRadius = '50%';
      knob.style.background = '#ffffff';
      knob.style.transition = 'all 0.2s ease';

      btn.appendChild(knob);

      function render() {
        if (isEnabled()) {
          btn.style.background = '#2da44e';
          knob.style.left = '17px';
        } else {
          btn.style.background = '#eaeef2';
          knob.style.left = '1px';
        }
      }

      // btn.disabled = getFiles().length === 1; // disable toggle if only one file
      console.log('Toggle button enabled:', !btn.disabled);
      btn.onclick = function () {
        let newButtonState = !isEnabled();
        localStorage.setItem(localStorageKey, newButtonState);
        render();
        syncView();
      };

      // Ensure the toggle reflects the correct state on initialization
      render();
      wrapper.appendChild(label);
      wrapper.appendChild(btn);
      container.appendChild(wrapper);
    }

    function waitForFilesAndInit() {
      const files = getFiles();
      if (!files.length) {
        setTimeout(waitForFilesAndInit, 500);
        return;
      }

      // When toggle is already enabled and files appear, apply the hash logic to show the correct file
      syncView();

      window.addEventListener('hashchange', applyFromHash);

      const _push = history.pushState;
      history.pushState = function () {
        _push.apply(this, arguments);
        runWhenFilesReady(syncView);
      };

      const _replace = history.replaceState;
      history.replaceState = function () {
        _replace.apply(this, arguments);
        runWhenFilesReady(syncView);
      };
    }

    function checkUrlChange() {
      if (location.href !== lastUrl) {
        const oldPath = lastUrl.split('#')[0];
        const newPath = location.href.split('#')[0];
        lastUrl = location.href;
        // Only re-init on actual page navigation, not hash-only changes.
        // Hash-only changes (sidebar file clicks) are handled by the hashchange listener.
        if (isGitHubDiffPage() && oldPath !== newPath) {
          addToggle();
          waitForFilesAndInit();
        }
      }
      requestAnimationFrame(checkUrlChange);
    }

    function init() {
      // ✅ Always add toggle immediately
      addToggle();
      // Start monitoring SPA URL changes
      checkUrlChange();
      waitForFilesAndInit();

      // ✅ Listen for system theme changes to update toggle appearance
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', () => {
        const existingToggle = document.getElementById('gh-single-file-toggle');
        if (existingToggle) existingToggle.remove();

        addToggle();   // rebuild UI with correct theme
        syncView();    // ensure consistency
      });
    }

    pollToggle(); // start polling immediately
    init();
  })();
}

mainScript();