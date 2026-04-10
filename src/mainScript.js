function mainScript() {
  (function () {
    let current = 0;
    let localStorageKey = 'gh-single-file-toggle-enabled';
    // ✅ top-level for SPA detection
    let lastUrl = location.href;

    function getFiles() { return Array.from(document.querySelectorAll('div[class*="diffEntry"]')); }

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
      const el = document.querySelector(hash);
      if (!el) return -1;
      const files = getFiles();
      return files.findIndex(f => f.contains(el));
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

    function pollToggle() {
      setInterval(() => {
        const container = document.querySelector('div[role="tablist"]');
        if (!container) return;              // tab bar not ready yet
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
      const container = document.querySelector('div[role="tablist"]');
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
        lastUrl = location.href;
        if (location.href.includes('/pull/')) {
          addToggle(); // PR page detected → re-apply toggle and single file view if enabled
          waitForFilesAndInit(); // ✅ ensures files are ready before applying single-file view
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