# Testing Guide

## Overview
This guide helps you test the Jira Mutually Exclusive Quick Filters extension.

## Before Testing
1. Load the extension in Chrome (`chrome://extensions/` > Developer mode > Load unpacked)
2. Navigate to a Jira board with quick filters

## Supported Jira Instances

The extension works automatically on:
- **Atlassian Cloud**: `*.atlassian.net` (e.g., `yourcompany.atlassian.net`)
- **Self-hosted with /jira path**: `*.com/jira/*` (e.g., `company.com/jira`)
- **Jira subdomains**: `jira.*` (e.g., `jira.company.com`)

## Test Scenarios

### Scenario 1: Fresh Installation
**Steps:**
1. Install the extension (load unpacked)

**Expected behavior:**
- Extension installs without errors
- Default setting: mutuallyExclusive = true
- Extension icon appears in toolbar

### Scenario 2: Basic Functionality - Toggle Enabled
**Steps:**
1. Navigate to a Jira board with quick filters
2. Verify extension popup shows toggle as ON
3. Click one quick filter to activate it
4. Click a different quick filter

**Expected behavior:**
- First filter activates
- When second filter is clicked, first filter automatically deselects
- Only one filter remains active at a time

### Scenario 3: Toggle Disabled
**Steps:**
1. Open extension popup
2. Toggle "Quick Filters Mutually Exclusive" to OFF
3. Click multiple quick filters on the Jira board

**Expected behavior:**
- Extension badge shows "OFF"
- Multiple filters can be active simultaneously (normal Jira behavior)
- Toast notification shows "Normal filter behavior restored"

### Scenario 4: Re-enable Toggle
**Steps:**
1. With toggle OFF, re-enable it
2. Click different filters

**Expected behavior:**
- Badge clears (no "OFF" text)
- Mutually exclusive behavior returns
- Toast notification shows "Exclusive filters enabled"

### Scenario 5: Persistence Across Sessions
**Steps:**
1. Set toggle to a specific state (ON or OFF)
2. Close and reopen Chrome
3. Check extension popup

**Expected behavior:**
- Toggle state persists across browser restarts
- Settings are synced via chrome.storage.sync

### Scenario 6: Multiple Jira Tabs
**Steps:**
1. Open multiple Jira tabs
2. Change toggle state in popup
3. Test filters in different tabs

**Expected behavior:**
- All tabs receive the toggle change
- Behavior is consistent across all Jira tabs

### Scenario 7: Board Navigation
**Steps:**
1. Start on Backlog tab
2. Test filters
3. Switch to Active Sprint tab
4. Test filters
5. Switch back to Backlog tab

**Expected behavior:**
- Filters work on Backlog tab
- Filters work on Active Sprint tab
- No loss of functionality when switching tabs
- MutationObserver detects new containers

### Scenario 8: Rapid Clicking
**Steps:**
1. Click 4-5 different filters rapidly

**Expected behavior:**
- Extension handles rapid clicks gracefully
- Only the last clicked filter remains active
- No console errors
- No race conditions

### Scenario 9: Extension Update
**Steps:**
1. Install extension v1.0.0
2. Update version in manifest.json
3. Reload extension from chrome://extensions/
4. Refresh Jira tabs

**Expected behavior:**
- Content script re-injects into existing Jira tabs
- Settings persist through update
- No errors in console

## Testing on Different Jira Instances

### Atlassian Cloud (*.atlassian.net)
1. Navigate to any `*.atlassian.net` Jira board
2. Quick filters should work automatically

### Self-Hosted with /jira Path
1. Navigate to a Jira instance at `company.com/jira`
2. Quick filters should work automatically

### Jira Subdomain
1. Navigate to a Jira instance at `jira.company.com`
2. Quick filters should work automatically

## Debugging

### Chrome DevTools
- **Content Script**: F12 on Jira page, check Console tab for logs (when DEBUG=true)
- **Popup**: Right-click extension icon > Inspect
- **Background Worker**: chrome://extensions/ > Inspect views: service worker

### Common Issues

**Filters not being deselected:**
- Check console for errors
- Verify feature is enabled in popup
- Check if Jira page has quick filters with expected selectors
- Verify content script is injected (check DEBUG logs)

**Extension not working on Jira instance:**
- Verify URL matches one of the supported patterns
- Check if content script is being injected
- Look for permission errors in background worker console

## Manual Testing Checklist

### Basic Functionality
- [ ] Extension installs without errors
- [ ] Popup opens and displays toggle
- [ ] Toggle defaults to ON
- [ ] Clicking filters deselects others when enabled
- [ ] Multiple filters can be active when disabled
- [ ] Badge shows "OFF" when disabled

### Persistence & Sync
- [ ] Settings persist across browser restarts
- [ ] Toggle state syncs across multiple Jira tabs
- [ ] Storage changes reflect immediately

### Edge Cases
- [ ] Rapid clicking handled correctly
- [ ] Browser back/forward buttons don't break functionality
- [ ] Switching between Backlog and Sprint tabs works
- [ ] No console errors in any scenario

### Multi-Board Support
- [ ] Works on Backlog tab (js-plan-quickfilters)
- [ ] Works on Active Sprint tab (js-work-quickfilters)
- [ ] Works when switching between tabs multiple times

### Performance
- [ ] No noticeable lag when clicking filters
- [ ] MutationObserver doesn't cause performance issues
- [ ] Extension doesn't impact page load time

## Success Criteria

The extension passes testing if:
1. All basic functionality works as expected
2. No console errors appear during normal usage
3. Settings persist correctly
4. Works on all supported Jira URL patterns
5. Handles edge cases gracefully (rapid clicking, tab switching)
6. Toggle state syncs across tabs
7. Badge updates correctly based on toggle state
