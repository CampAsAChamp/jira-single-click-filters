# Testing Guide for First-Time Installation Flow

## Overview
This guide helps you test the new first-time installation experience.

## Before Testing
1. If you've already installed the extension, remove it from Chrome/Edge
2. Clear extension data to simulate a fresh install

## Test Scenarios

### Scenario 1: Fresh Installation
**Expected behavior:**
1. Install the extension (load unpacked or from package)
2. A welcome page should automatically open in a new tab
3. Welcome page should display:
   - Extension icon and welcome message
   - Explanation of what the extension does
   - "Jira Cloud Users - You're All Set!" section
   - "Self-Hosted Jira Users" section with URL input
   - "Skip for Now" and "Get Started" buttons

### Scenario 2: Adding Custom URL on Welcome Page
**Steps:**
1. On the welcome page, enter a custom Jira URL (e.g., `https://jira.yourcompany.com`)
2. Click "Add URL"

**Expected behavior:**
- Browser should prompt for permissions to access the URL
- After granting permission, success message should appear
- URL should be saved to storage

### Scenario 3: Skipping Welcome Page
**Steps:**
1. On the welcome page, click "Skip for Now"

**Expected behavior:**
- Tab should close
- Extension should still work on Jira Cloud

### Scenario 4: Popup Info Banner
**Steps:**
1. Complete welcome flow without adding a custom URL
2. Open the extension popup

**Expected behavior:**
- Info banner should appear at the top: "Works automatically on Jira Cloud. Using self-hosted Jira? Add your URL below."

### Scenario 5: Adding URL from Popup
**Steps:**
1. Open extension popup
2. Add a custom URL in the "Custom Jira URLs" section

**Expected behavior:**
- Info banner should disappear after adding URL
- URL should appear in the configured URLs list

### Scenario 6: Removing All URLs
**Steps:**
1. In the popup, remove all custom URLs

**Expected behavior:**
- Info banner should reappear
- Extension should still work on Jira Cloud

### Scenario 7: Extension Update (Not First Install)
**Steps:**
1. Install extension
2. Update the version number in manifest.json
3. Reload the extension

**Expected behavior:**
- Welcome page should NOT open on update
- Only opens on fresh install

## Testing on Different Jira Instances

### Jira Cloud (*.atlassian.net)
1. Navigate to any `*.atlassian.net` Jira board
2. Quick filters should work automatically (no setup needed)

### Self-Hosted Jira
1. Add your self-hosted URL via welcome page or popup
2. Navigate to your Jira instance
3. Quick filters should work with mutually exclusive behavior

## Checklist
- [ ] Welcome page opens on first install
- [ ] Welcome page has professional, friendly design
- [ ] Can add custom URL on welcome page
- [ ] Can skip welcome page setup
- [ ] Info banner appears in popup when no custom URLs
- [ ] Info banner disappears after adding URL
- [ ] Info banner reappears after removing all URLs
- [ ] Extension works on Jira Cloud without setup
- [ ] Extension works on custom URL after adding it
- [ ] No console errors in any step
- [ ] Permissions are requested properly
- [ ] Storage is updated correctly

## Known Behaviors
- Welcome page only opens on `reason === 'install'`, not on updates
- Info banner only shows if `welcomeShown === true` and `customJiraUrls.length === 0`
- Jira Cloud support is automatic via manifest.json content_scripts
- Custom URLs require optional_host_permissions and user approval
