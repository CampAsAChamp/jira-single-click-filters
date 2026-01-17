# Chrome Web Store Publishing Plan

## 📋 Pre-Publishing Checklist

### 1. Code & Functionality
- [x] Extension fully functional and tested
- [x] Bug fixes completed (multi-tab support)
- [x] No console errors or warnings
- [ ] Code is clean and well-commented
- [ ] Remove all debug/console.log statements (optional, but recommended for production)
- [ ] Test on multiple Jira boards

### 2. Branding & Assets

#### Icons (Required)
- [x] 16x16px icon (toolbar)
- [x] 48x48px icon (extensions page)
- [x] 128x128px icon (Chrome Web Store)

**Additional recommended icons:**
- [ ] 32x32px icon
- [ ] 64x64px icon
- [ ] 96x96px icon

#### Screenshots (Required - at least 1, max 5)
Create screenshots showing:
1. **Before/After**: Jira board with multiple filters selected vs. mutually exclusive
2. **Extension Popup**: The toggle switch UI
3. **In Action**: Animated GIF or video showing filter switching
4. **Both Tabs**: Show it working on Backlog and Active Sprint
5. **Badge Indicator**: Show the OFF badge when disabled

**Requirements:**
- Minimum size: 1280x800px or 640x400px
- Format: PNG or JPEG
- File size: Max 5MB each

#### Promotional Images (Optional but recommended)
- [ ] Small tile: 440x280px
- [ ] Marquee: 1400x560px (featured placement)

### 3. Listing Information

#### Required Fields

**Extension Name:**
```
Jira Mutually Exclusive Quick Filters
```

**Short Description (132 characters max):**
```
Make Jira quick filters mutually exclusive - clicking one filter automatically deselects all others.
```

**Detailed Description (up to 16,000 characters):**
```markdown
# Make Your Jira Quick Filters Mutually Exclusive

Tired of manually deselecting Jira quick filters before selecting a new one? This extension automatically makes your Jira quick filters mutually exclusive - when you click one filter, all others are automatically deselected.

## ✨ Key Features

• **Automatic Deselection**: Click any quick filter and all others deselect instantly
• **Universal Jira Support**: Works on most Jira instances - Cloud, Data Center, and Server
• **Auto-Detection**: Automatically works on common Jira URL patterns
• **Toggle On/Off**: Enable or disable the feature anytime via the extension popup
• **Works Everywhere**: Supports both Backlog and Active Sprint tabs
• **Persistent Settings**: Your preferences are saved across browser sessions
• **Visual Feedback**: Badge indicator shows when the feature is disabled
• **Lightweight**: Minimal performance impact on your Jira experience

## 🌐 Supported Jira Instances

**Automatically works on:**
- ✅ Atlassian Cloud (`*.atlassian.net`)
- ✅ Self-hosted Jira with /jira path (`company.com/jira`)
- ✅ Jira subdomains (`jira.company.com`)

Whether you're using Jira Cloud, Data Center, or Server with standard URL patterns - this extension has you covered!

## 🎯 Perfect For

- Teams using Jira for sprint planning
- Anyone who switches between filters frequently
- Users who want cleaner, more predictable filter behavior
- Agile teams managing backlogs and active sprints
- Organizations using Jira Cloud, Data Center, or Server

## 🚀 How to Use

1. Install the extension
2. Navigate to your Jira board (Backlog or Active Sprint)
3. The extension automatically works on supported Jira instances!
4. Click the extension icon to toggle the feature on/off
5. That's it - no configuration needed!

## 🔒 Privacy & Security

- **No Data Collection**: This extension does not collect, store, or transmit any user data
- **Minimal Permissions**: Only requests access to common Jira URL patterns
- **Local Storage Only**: Settings are stored locally in your browser
- **Open Source**: View the code on GitHub

## 💡 Technical Details

This extension uses event delegation and DOM monitoring to detect filter clicks and automatically deselect others. It works seamlessly with Jira's dynamic interface and handles tab switching between Backlog and Active Sprint views. Pattern matching ensures support for most Jira installations without requiring additional configuration.

## 🐛 Support & Feedback

Found a bug or have a feature request? Please report issues on our GitHub repository or leave a review!

## 📝 Version History

**Version 1.0.0**
- Mutually exclusive quick filter functionality
- Toggle on/off via extension popup
- Support for both Backlog and Active Sprint tabs
- Works on Atlassian Cloud, self-hosted Jira with /jira path, and jira.* subdomains
- Automatic pattern matching for common Jira URL structures
- Robust handling of dynamic DOM changes

---

**Compatible with:** Jira Cloud, Jira Data Center, Jira Server
```

**Category:**
- Select: `Productivity`

**Language:**
- Select: `English (United States)`

#### Optional but Recommended

**Website URL:**
```
https://github.com/CampAsAChamp/jira-mutually-exclusive-quick-filters
```

**Support URL:**
```
https://github.com/CampAsAChamp/jira-mutually-exclusive-quick-filters/issues
```

### 4. Privacy & Compliance

#### Privacy Policy
Since your extension uses `storage` permission, Chrome Web Store requires a privacy policy. Here's a sample:

```markdown
# Privacy Policy for Jira Mutually Exclusive Quick Filters

**Last Updated: January 16, 2026**

## Data Collection
This extension does NOT collect, store, transmit, or share any personal data or user information.

## Data Storage
The extension stores only one piece of information locally on your device:
- Your preference for whether the mutually exclusive feature is enabled or disabled

This preference is stored using Chrome's local storage API and never leaves your device.

## Permissions
The extension requires the following permissions:
- **storage**: To save your preferences locally (toggle state)
- **scripting**: To inject functionality into Jira pages
- **activeTab**: To interact with the current tab
- **host permissions**: To function on common Jira URL patterns (*.atlassian.net, */jira/*, jira.*)

## Third-Party Services
This extension does not use any third-party services, analytics, or tracking tools.

## Changes to Privacy Policy
Any changes to this privacy policy will be posted on this page.

## Contact
For questions about this privacy policy, please open an issue on GitHub:
https://github.com/CampAsAChamp/jira-mutually-exclusive-quick-filters/issues
```

**Action Required:**
- [ ] Host this privacy policy somewhere publicly accessible (GitHub Pages, your website, etc.)
- [ ] Add the privacy policy URL to the Chrome Web Store listing

### 5. Pricing & Distribution

**Pricing:**
- [ ] Free (recommended for initial release)
- [ ] Paid (requires setting up payments)

**Visibility:**
- [ ] Public (anyone can find and install)
- [ ] Unlisted (only people with direct link can install)
- [ ] Private (only specific users/groups)

**Regions:**
- [ ] All regions (recommended)
- [ ] Specific regions only

## 🚀 Publishing Steps

### Step 1: Create Developer Account
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay one-time $5 registration fee
4. Fill out developer information

### Step 2: Prepare Package
1. Remove or comment out debug console.log statements (optional)
2. Test thoroughly one more time
3. Create ZIP file of extension folder:
   ```bash
   cd /Users/nschneider/Documents/personal_repos
   zip -r jira-mutually-exclusive-quick-filters.zip jira-mutually-exclusive-quick-filters/ \
     -x "*.git*" -x "*node_modules*" -x "*.DS_Store" -x "*CHROME_WEB_STORE*"
   ```

### Step 3: Create Screenshots
1. Navigate to Jira board
2. Take high-quality screenshots (1280x800px minimum)
3. Highlight the extension in action
4. Optional: Use screen recording software for a demo video

### Step 4: Upload to Chrome Web Store
1. Go to Developer Dashboard
2. Click "New Item"
3. Upload your ZIP file
4. Fill in all store listing information:
   - Name
   - Short description
   - Detailed description
   - Screenshots (at least 1)
   - Category
   - Language
   - Privacy policy URL
5. Fill in privacy practices
6. Submit for review

### Step 5: Review Process
- **Timeline**: Usually 1-3 business days (can be longer)
- **Possible Outcomes**:
  - ✅ Approved: Extension goes live
  - ⚠️ Rejected: Review feedback and resubmit
- **Common Rejection Reasons**:
  - Missing privacy policy
  - Insufficient screenshots
  - Permission justification needed
  - Manifest issues

### Step 6: Post-Publishing
1. Test the live extension
2. Share link with team/users
3. Monitor reviews and feedback
4. Plan for updates/improvements

## 📦 Package Optimization (Optional)

### Remove Debug Logging
Before publishing, consider removing or disabling console.log statements:

```javascript
// Option 1: Comment them out
// console.log('Debug message');

// Option 2: Create a debug flag
const DEBUG = false;
if (DEBUG) console.log('Debug message');
```

### Minify Code (Optional)
For production, you can minify JavaScript files to reduce size:
- Use tools like `terser` or `uglify-js`
- Keep readable version in GitHub, minified in Web Store package

## 🔄 Update Process

When you need to publish an update:
1. Update version in `manifest.json`
2. Update changelog in README
3. Test changes thoroughly
4. Create new ZIP file
5. Go to Developer Dashboard
6. Click on your extension
7. Upload new ZIP under "Package"
8. Submit for review

## 📊 Post-Launch Analytics

Chrome Web Store provides:
- Number of weekly users
- Number of installs/uninstalls
- User ratings and reviews
- Impressions and clicks

## 💰 Cost Breakdown

- **One-time developer registration**: $5
- **Hosting privacy policy**: Free (use GitHub Pages or similar)
- **Total**: $5

## 🎯 Success Metrics

Track these after launch:
- [ ] Number of installations
- [ ] User ratings (aim for 4+ stars)
- [ ] User reviews and feedback
- [ ] Bug reports and issues
- [ ] Feature requests

## ⚠️ Important Notes

### Universal Audience
This extension now works on ANY Jira instance, significantly expanding your potential audience:
- Organizations using Atlassian Cloud
- Companies with self-hosted Jira Data Center
- Teams using Jira Server
- Anyone with access to any Jira instance

**Consider:**
- This opens up a much larger user base
- Expect wider adoption across different organizations
- Monitor feedback from diverse Jira configurations
- Test on multiple Jira versions if possible

### Distribution Strategy
**Recommended: Public**
- Maximum visibility and impact
- Helps the entire Jira community
- Potential for significant user growth

### Public vs Unlisted
Since this extension now works on ANY Jira instance:
- **Public**: Recommended - helps the broader Jira community
- **Unlisted**: Use if you prefer limited distribution
- **Target Audience**: All Jira users (Cloud, Data Center, Server)

## 📝 Checklist Summary

**Before Submitting:**
- [ ] Pay $5 developer fee
- [ ] Create & host privacy policy
- [ ] Create 1-5 high-quality screenshots (1280x800px min)
- [ ] Write compelling store description
- [ ] Test extension thoroughly
- [ ] Create ZIP package
- [ ] Remove debug code (optional)

**Submission:**
- [ ] Upload ZIP to Developer Dashboard
- [ ] Fill in all required fields
- [ ] Add screenshots
- [ ] Set category & language
- [ ] Submit for review

**Post-Launch:**
- [ ] Monitor reviews
- [ ] Respond to user feedback
- [ ] Plan updates based on feedback

---

**Estimated Time to Publish**: 2-4 hours of prep work + 1-3 days review time

**Next Steps**: Start with creating screenshots and privacy policy!
