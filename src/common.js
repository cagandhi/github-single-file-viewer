// createDiffViewer(adapter) — shared logic for all GitHub diff page types.
//
// adapter must provide:
//   matchUrl(url)       → bool   — true when this adapter owns the current URL
//   getFiles()          → Array  — ordered list of per-file diff container elements
//   getToggleContainer() → Element|null — element to append the toggle into
function createDiffViewer(adapter) {
  (function () {
    let current = 0;
    const localStorageKey = 'gh-single-file-toggle-enabled';
    let lastUrl = location.href;

    function getFiles() { return adapter.getFiles(); }

    function showAll() { getFiles().forEach(f => f.style.display = 'block'); }

    function isEnabled() {
      return localStorage.getItem(localStorageKey) === 'true';
    }

    function syncView() {
      if (isEnabled()) { applyFromHash(); } else { showAll(); }
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
      // Three strategies, in order of reliability:
      // 1. PR pages: outer diffEntry div carries the id directly.
      // 2. Commit pages (expanded): inner table carries data-diff-anchor.
      // 3. Commit pages (collapsed/lazy): the file-name link in the header
      //    always has href="#diff-..." even before the table is loaded.
      return files.findIndex(f =>
        f.id === anchor ||
        !!f.querySelector('[data-diff-anchor="' + anchor + '"]') ||
        !!f.querySelector('a[href="#' + anchor + '"]')
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
        (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }

    function pollToggle() {
      setInterval(() => {
        if (!adapter.getToggleContainer()) return;
        if (!document.getElementById('gh-single-file-toggle')) addToggle();
      }, 300);
    }

    function runWhenFilesReady(callback, retries = 20) {
      const files = getFiles();
      if (files.length) { callback(); }
      else if (retries > 0) { setTimeout(() => runWhenFilesReady(callback, retries - 1), 50); }
    }

    function addToggle() {
      if (document.getElementById('gh-single-file-toggle')) return;
      const container = adapter.getToggleContainer();
      if (!container) return setTimeout(addToggle, 500);

      const isDark = isDarkMode();

      const wrapper = document.createElement('div');
      wrapper.id = 'gh-single-file-toggle';
      wrapper.style.cssText = 'display:flex;align-items:center;gap:6px;margin-left:12px;';

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
      knob.style.cssText = 'position:absolute;top:1px;left:1px;width:14px;height:14px;border-radius:50%;background:#ffffff;transition:all 0.2s ease;';
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

      btn.onclick = function () {
        localStorage.setItem(localStorageKey, !isEnabled());
        render();
        syncView();
      };

      render();
      wrapper.appendChild(label);
      wrapper.appendChild(btn);
      container.appendChild(wrapper);
    }

    function waitForFilesAndInit() {
      const files = getFiles();
      if (!files.length) { setTimeout(waitForFilesAndInit, 500); return; }

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
        // Only re-init on path changes. Hash-only changes (sidebar clicks)
        // are handled by the hashchange listener set up in waitForFilesAndInit.
        if (adapter.matchUrl(location.href) && oldPath !== newPath) {
          addToggle();
          waitForFilesAndInit();
        }
      }
      requestAnimationFrame(checkUrlChange);
    }

    function init() {
      addToggle();
      checkUrlChange();
      waitForFilesAndInit();

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const existing = document.getElementById('gh-single-file-toggle');
        if (existing) existing.remove();
        addToggle();
        syncView();
      });
    }

    pollToggle();
    init();
  })();
}
