# GitHub Single File Viewer

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

## Quick Start

### 1️⃣ Load the Extension
1. Open Chrome/Edge: `chrome://extensions/` or `edge://extensions/`  
2. Enable **Developer mode**  
3. Click **Load unpacked** and select this extension folder  

### 2️⃣ Open a PR
- Navigate to the **Files changed** tab of any PR  
- The single-file toggle will automatically appear in the PR toolbar  

### 3️⃣ Toggle View
- **Click the toggle** to switch ON/OFF between single-file and full-file view  
- Preference is stored automatically in **localStorage**  

---

## Visual Preview

### Toggle Location in PR Toolbar
![Toggle Location](assets/docs/toggle-placement-bar.png)
> Example placement of the single-file toggle in the PR tab bar.

### Example: Single File Mode ON
![Single File Mode](path/to/single-file-view.png)
> Shows only one file visible while reviewing a PR.

### Example: Single File Mode OFF
![Full File Mode](path/to/full-file-view.png)
> Shows all files when single-file mode is off.

### Optional: Animated Toggle
`![Toggle Animation](path/to/toggle-animation.gif)`
> You can include a small GIF showing the toggle switching between single-file and full view.  

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

---

## License
MIT License