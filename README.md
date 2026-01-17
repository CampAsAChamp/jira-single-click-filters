# Jira Mutually Exclusive Quick Filters

A Chrome extension that makes Jira quick filters mutually exclusive - clicking one filter automatically deselects all others.

## 🎯 Problem

By default, Jira allows you to combine multiple quick filters by clicking them. However, if you want filters to be mutually exclusive (only one active at a time), you have to manually deselect the currently active filter before selecting a new one. This extension automates that process.

## ✨ Features

- **Mutually Exclusive Filters**: Clicking a quick filter automatically deselects all other active filters
- **Toggle On/Off**: Enable or disable the feature via the extension popup
- **Universal Jira Support**: Works automatically on most Jira instances (Cloud, Data Center, Server)
- **Persistent Settings**: Your preferences are saved across browser sessions
- **Visual Feedback**: Badge indicator shows when the feature is disabled

## 📦 Installation

### Loading the Extension Locally

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `jira-mutually-exclusive-quick-filters` folder
5. The extension should now appear in your toolbar

### Reloading After Changes

If you make any code changes:
1. Go to `chrome://extensions/`
2. Click the **reload icon** (circular arrow) on the extension card
3. Refresh any open Jira tabs to apply the updated content script

## 🚀 Usage

### Basic Usage

1. Navigate to any Jira board (e.g., your team's sprint board)
2. Click the extension icon in your Chrome toolbar
3. Toggle **"Quick Filters Mutually Exclusive"** on or off
4. When enabled:
   - Click any quick filter → it activates
   - Click a different filter → the previous one auto-deselects
5. When disabled:
   - Filters work normally (can combine multiple filters)

### Supported Jira Instances

The extension **automatically works** on:
- ✅ **Atlassian Cloud**: `*.atlassian.net` (e.g., `yourcompany.atlassian.net`)
- ✅ **Self-hosted with /jira path**: `*.com/jira/*` (e.g., `company.com/jira`)
- ✅ **Jira subdomains**: `jira.*` (e.g., `jira.company.com`)

The extension uses pattern matching to work with most common Jira URL structures.

## 🔧 How It Works

The extension uses **event delegation** to detect when quick filters are clicked and automatically deselects other active filters before the click completes. It monitors both the Backlog and Active Sprint views, initializing listeners for each independently to handle dynamic DOM changes when switching between tabs.

**Key Components:**
- **manifest.json**: Extension configuration
- **content.js**: Main logic that runs on Jira pages
- **popup.html/js/css**: User interface for the toggle switch
- **background.js**: Service worker for state management
- **icons/**: Extension icons (16px, 48px, 128px)

**Technical Implementation:**
- Uses a `MutationObserver` to detect when filter containers appear
- Initializes both Backlog and Active Sprint containers independently
- Event delegation ensures listeners work even when Jira recreates DOM elements
- Tracks initialized containers by DOM element reference (not just ID)

**Confirmed Jira Selectors:**
- Backlog container: `dl#js-plan-quickfilters`
- Active Sprint container: `dl#js-work-quickfilters`
- Filter buttons: `.js-quickfilter-button`
- Active filters: `.js-quickfilter-button.ghx-active`
- Filter ID: `data-filter-id` attribute

## 🐛 Debugging

### Chrome DevTools

**Debug the Popup:**
- Right-click the extension icon → **Inspect**
- This opens DevTools for `popup.js`

**Debug Content Script:**
- Open a Jira page
- Press **F12** to open DevTools
- Go to the **Console** tab
- Look for messages starting with "Jira Mutually Exclusive Quick Filters:"

**Debug Background Service Worker:**
- Go to `chrome://extensions/`
- Find "Jira Mutually Exclusive Quick Filters"
- Click **"Inspect views: service worker"**
- View logs from `background.js`

### Common Issues

**Extension not working:**
1. Check that the extension is loaded in `chrome://extensions/`
2. Verify Developer mode is enabled
3. Check the Console for error messages
4. Try reloading the extension
5. Refresh the Jira page

**Filters not being deselected:**
1. Open DevTools Console on the Jira page
2. Look for "Jira Mutually Exclusive Quick Filters:" log messages
3. Verify the feature is enabled in the popup
4. Check if the filter buttons have the expected classes

## 🧪 Testing

### Manual Testing Checklist

**Basic Functionality:**
- [ ] Navigate to a Jira board
- [ ] Open extension popup - verify toggle appears
- [ ] Enable the toggle
- [ ] Click a quick filter - verify it activates
- [ ] Click a different filter - verify first one deselects
- [ ] Try clicking 3-4 filters rapidly - verify only last is active

**Toggle Functionality:**
- [ ] Disable toggle in popup
- [ ] Click multiple filters - verify they combine (normal behavior)
- [ ] Re-enable toggle - verify exclusive behavior returns

**Persistence:**
- [ ] Set toggle to enabled/disabled
- [ ] Close and reopen Chrome
- [ ] Verify toggle state persists

**Edge Cases:**
- [ ] Test with rapid clicking
- [ ] Test browser back/forward buttons
- [ ] Verify no console errors

**Multi-Tab Support:**
- [ ] Start on Backlog tab - verify filters work
- [ ] Switch to Active Sprint tab - verify filters work
- [ ] Switch back to Backlog tab - verify filters still work
- [ ] Repeat tab switching multiple times - verify no regressions

## 📝 Development

### Project Structure

```
jira-mutually-exclusive-quick-filters/
├── manifest.json          # Extension configuration
├── content.js            # Main logic for filter manipulation
├── background.js         # Service worker for state management
├── popup.html           # UI for toggle switch
├── popup.js             # Toggle logic
├── popup.css            # Styling
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md            # This file
└── .gitignore           # Git ignore patterns
```

### Tech Stack

- **Manifest Version**: 3
- **Permissions**: 
  - `storage` - for saving user preferences
  - `scripting` - for dynamic content script injection
  - `activeTab` - for interacting with the current tab
- **Host Permissions**: 
  - `*://*.atlassian.net/*` - Atlassian Cloud instances
  - `*://*/jira/*` - Self-hosted with /jira path
  - `*://jira.*/*` - Jira subdomains
- **APIs Used**: 
  - Chrome Storage API - state persistence
  - Chrome Scripting API - dynamic content script injection
  - Content Scripts - filter manipulation
  - Service Workers - background processes

## 📝 Changelog

### Version 1.0.0 (2026-01-16)
- ✨ Mutually exclusive quick filter functionality
- ✨ Toggle on/off via extension popup
- ✨ Support for both Backlog and Active Sprint tabs
- ✨ Works on Atlassian Cloud, self-hosted Jira with /jira path, and jira.* subdomains
- ✨ Automatic pattern matching for common Jira URL structures
- 🐛 Fixed: Filters now work consistently when switching between Backlog and Active Sprint tabs multiple times
- 🔧 Robust event delegation prevents issues with dynamic DOM changes

## 📄 License

This is a personal project. Use freely as needed.

## 🙋 Author

Created by Nick Schneider ([@CampAsAChamp](https://github.com/CampAsAChamp))

---

**Version**: 1.0.0
