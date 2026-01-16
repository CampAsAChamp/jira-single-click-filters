# Privacy Policy for Jira Mutually Exclusive Quick Filters

**Last Updated: January 16, 2026**

## Overview

This privacy policy describes how the "Jira Mutually Exclusive Quick Filters" Chrome extension handles information.

## Data Collection

**This extension does NOT collect, store, transmit, or share any personal data or user information.**

## Data Storage

The extension stores the following information locally on your device:
- Your preference for whether the mutually exclusive feature is enabled or disabled (boolean value)
- A list of custom Jira URLs you have configured (optional, only if you add them)

This data is stored using Chrome's `chrome.storage.sync` API and is synchronized across your Chrome browsers where you're signed in. This data:
- Never leaves Google's Chrome infrastructure
- Is not accessible to the extension developer
- Is not transmitted to any third-party servers
- Can be cleared by uninstalling the extension

## Permissions

The extension requires the following permissions to function:

### `storage`
Used to save your preferences locally (toggle state and optional custom URLs). This allows the extension to remember your settings across browser sessions.

### `scripting`
Used to dynamically inject the content script into Jira pages matching your custom URLs. This is only used when you configure custom Jira URLs.

### `activeTab`
Used to interact with the currently active tab when toggling settings or injecting functionality.

### `host_permissions`
Required to inject the content script on Jira pages and manipulate quick filter behavior. The extension automatically works on:
- `*://*.atlassian.net/*` - Atlassian Cloud instances

For all other Jira instances (self-hosted, Data Center, Server), you add them as custom URLs.

### `optional_host_permissions`
When you add a custom Jira URL, the extension will request permission to access that specific URL. You have full control over which URLs to grant access to. These permissions:
- Are only requested when you explicitly add a custom URL
- Can be revoked at any time by removing the URL or uninstalling the extension
- Are used solely to enable the extension's functionality on your specified Jira instance

## Third-Party Services

This extension does NOT use:
- Analytics or tracking tools
- External APIs or services
- Advertising networks
- Any form of data collection or telemetry

## Source Code

This extension is open source. You can review the complete source code at:
[https://github.com/CampAsAChamp/jira-mutually-exclusive-quick-filters](https://github.com/CampAsAChamp/jira-mutually-exclusive-quick-filters)

## Changes to This Privacy Policy

Any changes to this privacy policy will be posted on this page and reflected in the "Last Updated" date above. Continued use of the extension after changes constitutes acceptance of the updated policy.

## Data Deletion

To delete all data stored by this extension:
1. Uninstall the extension from `chrome://extensions/`
2. All stored preferences will be automatically removed

## Contact

For questions, concerns, or feedback regarding this privacy policy or the extension:
- Open an issue on GitHub: [https://github.com/CampAsAChamp/jira-mutually-exclusive-quick-filters/issues](https://github.com/CampAsAChamp/jira-mutually-exclusive-quick-filters/issues)
- Contact: [@CampAsAChamp](https://github.com/CampAsAChamp)

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- Google's Limited Use requirements for Chrome API permissions
- GDPR principles (no personal data collection)

## Your Rights

Since this extension does not collect any personal data:
- There is no data to access, modify, or delete beyond what's stored locally in your browser
- You have complete control over the extension by enabling/disabling or uninstalling it
- You can remove custom URLs at any time through the extension popup
- You can revoke permissions for specific URLs through Chrome's extension settings
- No data leaves your local device except through Chrome's built-in sync mechanism (managed by Google)

---

**Version**: 1.0.0  
**Extension Developer**: Nick Schneider ([@CampAsAChamp](https://github.com/CampAsAChamp))
