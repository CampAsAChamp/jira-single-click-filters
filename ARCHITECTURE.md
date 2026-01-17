# Architecture Documentation

## Overview

This is a Chrome Manifest V3 extension that makes Jira quick filters mutually exclusive. When a user clicks one quick filter, all other active filters are automatically deselected.

## Component Architecture

The extension consists of 4 main JavaScript components:

### 1. background.js - Background Service Worker

The background service worker runs persistently and handles:

#### Initial Setup
- Sets default settings on first install (`mutuallyExclusive: true`)
- Injects content script into all existing Jira tabs on install/update

```javascript
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await chrome.storage.sync.set({ 
      mutuallyExclusive: true
    });
  }
  
  if (details.reason === 'install' || details.reason === 'update') {
    await injectContentScriptIntoAllTabs();
  }
});
```

#### Dynamic Script Injection
- Monitors all tab updates via `chrome.tabs.onUpdated`
- When a Jira page loads, checks if content script is active
- Injects content script if not already present
- Works with Jira URL patterns defined in manifest (Atlassian Cloud, /jira paths, jira.* subdomains)

#### Badge Management
- Updates extension badge based on enabled/disabled state
- Shows "OFF" badge when feature is disabled
- Clears badge when feature is enabled

#### Storage Monitoring
- Listens for changes to settings
- Updates badge when toggle state changes

### 2. content.js - Core Functionality

This script runs on Jira pages and implements the mutually exclusive filter behavior.

#### Architecture Highlights

**Event Delegation Pattern**
- Uses a single click listener on the filter container (not individual buttons)
- More efficient and handles dynamically added filters
- Uses capture phase (`addEventListener(..., true)`) to intercept clicks before Jira's handlers

**Container Initialization**
```javascript
function initializeContainer(filterContainer) {
  // Check if already initialized to avoid duplicate listeners
  if (state.initializedContainers.has(filterContainer)) {
    return false;
  }
  
  // Use event delegation with capture phase
  filterContainer.addEventListener('click', async (e) => {
    const button = e.target.closest(CONFIG.SELECTORS.FILTER_BUTTON);
    if (button) {
      await handleFilterClick(button);
    }
  }, true);
  
  state.initializedContainers.add(filterContainer);
}
```

**Click Handling Flow**
1. User clicks a filter button
2. Event listener intercepts in capture phase
3. Checks if feature is enabled
4. Sets `isProcessingClick` flag to prevent recursive clicks
5. Waits 100ms to let the user's click register
6. Finds all active filters (class: `ghx-active`)
7. Clicks all active filters except the one the user clicked
8. Result: Only one filter remains active

**Deactivation Logic**
```javascript
function deactivateOtherFilters(clickedFilterId) {
  const activeFilters = document.querySelectorAll(CONFIG.SELECTORS.ACTIVE_FILTER);
  
  activeFilters.forEach(activeFilter => {
    const { id } = getFilterInfo(activeFilter);
    if (id !== clickedFilterId) {
      activeFilter.click();  // Programmatically deselect
    }
  });
}
```

**MutationObserver for Dynamic Content**
- Jira loads content dynamically, so a MutationObserver watches for DOM changes
- Uses debouncing (250ms) to avoid excessive re-initialization
- Automatically initializes new filter containers as they appear

**State Management**
```javascript
const state = {
  isProcessingClick: false,        // Prevents recursive clicking
  initializedContainers: new Set(), // Tracks which containers have listeners
  isEnabled: true                   // Cached enabled state from storage
};
```

**Configuration**
```javascript
const CONFIG = {
  SELECTORS: {
    WORK_CONTAINER: 'dl#js-work-quickfilters',    // Sprint board filters
    PLAN_CONTAINER: 'dl#js-plan-quickfilters',    // Backlog filters
    FILTER_BUTTON: '.js-quickfilter-button',
    ACTIVE_FILTER: '.js-quickfilter-button.ghx-active'
  },
  TIMING: {
    CLICK_DELAY: 100,           // Delay before processing click
    INIT_DELAY: 1000,           // Initial load delay
    MUTATION_DEBOUNCE: 250      // Debounce for mutation observer
  }
};
```

### 3. popup.js - Extension Popup UI

Provides the user interface for controlling the extension via the browser action popup.

#### Features

**Toggle Feature On/Off**
- Checkbox to enable/disable mutually exclusive behavior
- Saves state to `chrome.storage.sync`
- Notifies all open Jira tabs of the change
- Shows toast messages for user feedback

## Data Flow

```
User clicks filter button on Jira page
         ↓
content.js intercepts click (capture phase)
         ↓
Checks if feature is enabled (from chrome.storage)
         ↓
Waits 100ms for click to register
         ↓
Finds all active filters (class: ghx-active)
         ↓
Clicks all active filters EXCEPT the one user clicked
         ↓
Result: Only one filter remains active
```

## Storage Model

The extension uses `chrome.storage.sync` (syncs across devices) with the following schema:

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `mutuallyExclusive` | boolean | `true` | Whether the mutually exclusive feature is enabled |

Storage is accessed asynchronously:
```javascript
// Read
const settings = await chrome.storage.sync.get({ mutuallyExclusive: true });

// Write
await chrome.storage.sync.set({ mutuallyExclusive: false });

// Listen for changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.mutuallyExclusive) {
    const newValue = changes.mutuallyExclusive.newValue;
    // React to change
  }
});
```

## Key Design Patterns

### 1. Event Delegation
Instead of adding a click listener to each filter button (which would be inefficient and wouldn't handle dynamically added buttons), we add a single listener to the container:

```javascript
filterContainer.addEventListener('click', async (e) => {
  const button = e.target.closest(CONFIG.SELECTORS.FILTER_BUTTON);
  if (button) {
    await handleFilterClick(button);
  }
}, true);
```

### 2. Capture Phase Event Listening
By passing `true` as the third parameter, the listener runs in the **capture phase** instead of the bubble phase. This means our code intercepts the click *before* Jira's event handlers run, allowing us to modify behavior.

### 3. Debouncing
The MutationObserver is wrapped in a debounce function to prevent excessive re-initialization when Jira makes rapid DOM changes:

```javascript
const debouncedInit = debounce(
  initializeExtension,
  CONFIG.TIMING.MUTATION_DEBOUNCE
);
```

### 4. State Management
The extension maintains internal state to prevent issues:
- `isProcessingClick`: Prevents recursive clicking (clicking a filter triggers more clicks)
- `initializedContainers`: Tracks which containers have listeners to avoid duplicates
- `isEnabled`: Caches the enabled state to avoid repeated storage reads

### 5. Dynamic Content Script Injection
Manifest V3 doesn't allow programmatic content script registration, so the background worker actively injects scripts:
- On install/update: injects into all existing Jira tabs
- On tab update: injects when a new Jira page loads
- Works with URL patterns defined in manifest

### 6. Ping-Pong Pattern for Script Detection
To check if a content script is already active in a tab:

```javascript
async function isContentScriptActive(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { action: 'ping' });
    return true;
  } catch {
    return false;
  }
}
```

If the message fails, the content script isn't active, so we inject it.

## Jira DOM Structure

The extension targets specific Jira DOM elements:

### Filter Containers
- **Sprint Board**: `dl#js-work-quickfilters`
- **Backlog**: `dl#js-plan-quickfilters`

### Filter Buttons
- **Selector**: `.js-quickfilter-button`
- **Active State**: `.ghx-active` class added when selected
- **Data Attribute**: `data-filter-id` contains unique filter identifier

Example structure:
```html
<dl id="js-work-quickfilters">
  <dt>Quick Filters</dt>
  <dd>
    <button class="js-quickfilter-button ghx-active" data-filter-id="1">
      Only My Issues
    </button>
    <button class="js-quickfilter-button" data-filter-id="2">
      Recently Updated
    </button>
  </dd>
</dl>
```

## Error Handling

The extension includes comprehensive error handling:

### Content Script
- Gracefully handles missing Chrome APIs
- Falls back to defaults if storage is unavailable
- Catches and logs errors during click handling
- Prevents crashes with try-catch blocks

### Background Worker
- Handles permission errors when injecting scripts
- Warns about injection failures without blocking

### Popup
- Shows user-friendly error messages
- Handles errors gracefully

## Performance Considerations

### Efficient Event Handling
- Event delegation reduces memory footprint
- Single listener per container instead of per button
- Capture phase prevents event propagation overhead

### Debouncing
- MutationObserver uses 250ms debounce
- Prevents excessive re-initialization during rapid DOM changes
- Reduces CPU usage on dynamic pages

### Selective Script Injection
- Only injects into matching URLs
- Checks if script is already active before injecting
- Prevents duplicate script injection

### Storage Optimization
- Caches enabled state in content script
- Only reads from storage on initialization
- Uses storage change listeners for updates
- Syncs across devices with `chrome.storage.sync`

## Chrome Extension Permissions

### Required Permissions
- `storage`: For saving settings
- `scripting`: For dynamic content script injection
- `activeTab`: For accessing active tab information

### Host Permissions
- `*://*.atlassian.net/*`: Atlassian Cloud instances
- `*://*/jira/*`: Self-hosted Jira with /jira path
- `*://jira.*/*`: Jira subdomains

## Testing Considerations

The extension is designed to be testable:

1. **State Isolation**: Each container tracks its initialization state
2. **Feature Toggle**: Can be enabled/disabled without reload
3. **Logging**: Comprehensive console logging for debugging
4. **Storage Defaults**: Sensible defaults if storage is unavailable
5. **Multiple Containers**: Handles both Sprint and Backlog views

See `TESTING_GUIDE.md` for detailed testing procedures.

## Future Enhancement Ideas

1. **Configuration Options**
   - Allow certain filters to be exempt from mutual exclusivity
   - Configure timing delays
   - Choose between "strict" and "lenient" modes

2. **Advanced Features**
   - Filter groups/presets
   - Keyboard shortcuts
   - Analytics/usage tracking

3. **Technical Improvements**
   - Export/import settings
   - Sync indicator in UI
   - Support for additional Jira URL patterns

## References

- [Chrome Extension Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Chrome Scripting API](https://developer.chrome.com/docs/extensions/reference/scripting/)
- [MDN: Event Capture and Bubbling](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture)
