# GitHub Single File Viewer
<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Supported-brightgreen?logo=googlechrome" />
  <img src="https://img.shields.io/badge/Edge-Supported-brightgreen?logo=microsoftedge" />
  <img src="https://img.shields.io/badge/Firefox-Not%20Supported-lightgrey?logo=firefoxbrowser" />
</p>
<p align="center">
  <img src="assets/icons/github-split-view-icon.png" alt="GitHub Single File Viewer Icon" width="350" height="350" />
</p>

- [Description](#description)
- [Features](#features)
- [Supported Browsers](#supported-browsers)
- [Quick Start](#quick-start)
  * [1. Load the Extension](#1-load-the-extension)
  * [2. Open a PR](#2-open-a-pr)
  * [3. Toggle View](#3-toggle-view)
- [Visual Preview](#visual-preview)
  * [Toggle Location in PR Toolbar](#toggle-location-in-pr-toolbar)
    + [Light mode](#light-mode)
    + [Dark mode](#dark-mode)
  * [Single File Mode ON](#single-file-mode-on)
  * [Single File Mode OFF](#single-file-mode-off)
  * [Animated Toggle](#animated-toggle)
- [Usage Notes](#usage-notes)
- [Development](#development)
- [Contributing](#contributing)

## Description
The **GitHub Single File Viewer** is a Chrome/Edge extension that enhances GitHub Pull Request “Files changed” pages by showing **only one file at a time**.

It provides a clean, lightweight toggle for switching between **single-file** and **full-file view**, letting you focus on the files that matter most while reviewing PRs.

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

- 🟢 Chrome — Supported  
- 🟢 Edge — Supported  
- 🔴 Firefox — Not supported  
---

## Quick Start

### 1. Load the Extension
- Open Chrome/Edge: `chrome://extensions/` or `edge://extensions/`.
- Enable **Developer mode**.
- Click **Load unpacked** and select this extension folder.

### 2. Open a PR
- Navigate to the **Files changed** tab of any PR
- The single-file toggle will automatically appear in the PR toolbar.

### 3. Toggle View
- **Click the toggle** to switch ON/OFF between single-file and full-file view.
- Preference is stored automatically in **localStorage**.

---

## Visual Preview

### Toggle Location in PR Toolbar
![Toggle Location](assets/docs/toggle-placement-bar.png)

#### Light mode
![Light mode toggle](assets/docs/light-mode-toggle.png)

#### Dark mode
![Dark mode toggle](assets/docs/dark-mode-toggle.png)

### Single File Mode ON
![Single File Mode OFF](assets/docs/single-file-view-on.gif)

### Single File Mode OFF
![Single File Mode OFF](assets/docs/single-file-view-off.gif)

### Animated Toggle
![Single file extension toggle demo](assets/docs/single-file-extension-toggle.gif)

---

## Usage Notes
- The toggle appears automatically for PR pages under `/pull/`.
- Works for both **full page loads** and **SPA navigation** between PRs.
- Does **not modify GitHub files** — only controls browser visibility.

---

## Development
- **File structure:**
  - `background.js` – Detects PR pages and injects `mainScript.js`
  - `mainScript.js` – Contains toggle logic and single-file view handling
- **Testing changes:**
  1. Edit `mainScript.js`
  2. Reload the extension in Chrome/Edge
  3. Open or refresh a PR to see updates

---

## Contributing
- Contributions and bug reports are welcome.
- Submit a PR or open an issue describing your feature request or bug.
