# GitHub Single File Viewer
<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Supported-brightgreen?logo=googlechrome" />
  <img src="https://img.shields.io/badge/Edge-Supported-brightgreen?logo=microsoft-edge" />
  <img src="https://img.shields.io/badge/Firefox-Supported-brightgreen?logo=firefoxbrowser" />
</p>
<p align="center">
  <img src="assets/icons/github-split-view-icon.png" alt="GitHub Single File Viewer Icon" width="350" height="350" />
</p>

- [Description](#description)
- [Features](#features)
- [Supported Browsers](#supported-browsers)
- [Quick Start](#quick-start)
  * [1. Load the Extension](#1-load-the-extension)
  * [2. Open a PR or Commit](#2-open-a-pr-or-commit)
  * [3. Toggle View](#3-toggle-view)
- [Visual Preview](#visual-preview)
  * [Theme Support](#theme-support)
    + [Light mode](#light-mode)
    + [Dark mode](#dark-mode)
  * [Pull Request Pages](#pull-request-pages)
    + [Toggle Location in PR Toolbar](#toggle-location-in-pr-toolbar)
    + [Single File Mode ON](#single-file-mode-on)
    + [Single File Mode OFF](#single-file-mode-off)
    + [Animated Toggle](#animated-toggle)
  * [Commit Pages](#commit-pages)
    + [Toggle Location in Commit Header](#toggle-location-in-commit-header)
    + [Single File Mode ON](#single-file-mode-on-1)
    + [Single File Mode OFF](#single-file-mode-off-1)
    + [Animated Toggle](#animated-toggle-1)
- [Usage Notes](#usage-notes)
- [Known Limitations](#known-limitations)
- [Development](#development)
- [Contributing](#contributing)

## Description
The **GitHub Single File Viewer** is a Chrome/Edge extension that enhances GitHub **Pull Request "Files changed"** and **Commit diff** pages by showing **only one file at a time**.

It provides a clean, lightweight toggle for switching between **single-file** and **full-file view**, letting you focus on the files that matter most while reviewing PRs or inspecting commits.

---

## Features
- **Single-file toggle:** Focus on one file at a time.
- **Hash-aware navigation:** Automatically scrolls to the file in the URL hash.
- **Theme-aware:** Compatible with GitHub Light and Dark modes.
- **Persistent state:** Remembers your ON/OFF preference across PRs.
- **Robust SPA handling:** Survives GitHub’s multi-pass re-rendering.
- **Lightweight:** Minimal impact on page performance.

---
## Supported Browsers

🟢 Chrome 🟢 Edge 🟢 Firefox

## Quick Start

### 1. Download extension folder
- Download the GitHub repo as a ZIP file or clone the repo using git.

### 2. Load the Extension
#### For Chrome/Edge or any Chromium browser
- Open `chrome://extensions/` or `edge://extensions/` or however extensions are loaded in your browser.
- Enable **Developer mode**, if needed.
- Click **Load unpacked** and select this extension folder.

#### For Firefox
- Open `about:debugging#/runtime/this-firefox`.
- Click on **Load Temporary Add-on**.
- Select `manifest.json` file from the extension folder.

### 3. Open a PR or Commit
- Navigate to the **Files changed** tab of any PR, or any **commit diff** page (`/commit/...`).
- The single-file toggle will automatically appear in the toolbar.

### 4. Toggle View
- **Click the toggle** to switch ON/OFF between single-file and full-file view.
- Preference is stored automatically in **localStorage**.

---

## Visual Preview

### Theme Support
The toggle is theme-aware and adapts to GitHub's light and dark modes on both PR and commit pages.

#### Light mode
![Light mode toggle](assets/docs/light-mode-toggle.png)

#### Dark mode
![Dark mode toggle](assets/docs/dark-mode-toggle.png)

---

### Pull Request Pages

#### Toggle Location in PR Toolbar
![Toggle Location](assets/docs/pr/toggle-placement-bar.png)

#### Single File Mode ON
![Single File Mode ON](assets/docs/pr/single-file-view-on.gif)

#### Single File Mode OFF
![Single File Mode OFF](assets/docs/pr/single-file-view-off.gif)

#### Animated Toggle
![Single file extension toggle demo](assets/docs/pr/single-file-extension-toggle.gif)

---

### Commit Pages

#### Toggle Location in Commit Header
![Toggle Location](assets/docs/commit/toggle-placement-bar.png)

#### Single File Mode ON
![Single File Mode ON](assets/docs/commit/single-file-on-commit.gif)

#### Single File Mode OFF
![Single File Mode OFF](assets/docs/commit/single-file-off-commit.gif)

#### Animated Toggle
![Animated Toggle](assets/docs/commit/animated-toggle.gif)

---

## Usage Notes
- The toggle appears automatically on **PR pages** (`/pull/`) and **commit diff pages** (`/commit/`).
- On commit pages, the toggle is embedded in the "X files changed" stats bar at the top of the diff.
- Works for both **full page loads** and **SPA navigation** between PRs and commits.
- Does **not modify GitHub files** — only controls browser visibility.

---

## Known limitations
- It does not work correctly when logged out of Github account. There is no plan to support unauthenticated mode for now.
- **Large commits** (e.g. 100+ files changed) are not supported on commit pages. GitHub hides most diff content by default on such commits, so the extension cannot detect the file regions and single-file mode will not activate.
- If single-file mode appears not to be working, try refreshing the page and waiting for all diff elements to fully load, or toggle the toggle off and back on — this is usually enough to recover.
- When Chrome extension is loaded, there is a warning: `'background.scripts' requires manifest version of 2 or lower.`.
  - This is expected since Chrome uses manifest v3 style where Firefox is still v2 style manifest-based.
  - This is just a warning and does not break any functionality for the extension in Chrome.

---

## Development
- **File structure:**
  - `src/background.js` – Detects PR/commit pages and injects the appropriate scripts
  - `src/common.js` – Shared toggle logic and single-file view handling (`createDiffViewer` factory)
  - `src/prScript.js` – PR-page adapter (injected on `/pull/` URLs)
  - `src/commitScript.js` – Commit-page adapter (injected on `/commit/` URLs)
- **Testing changes:**
  1. Edit the relevant script(s)
  2. Reload the extension in Chrome/Edge
  3. Open or refresh a PR or commit page to see updates

---

## Contributing
- Contributions and bug reports are welcome.
- Submit a PR or open an issue describing your feature request or bug.
