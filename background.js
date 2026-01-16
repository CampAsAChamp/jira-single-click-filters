// Background service worker for Jira Mutually Exclusive Quick Filters extension

console.log('Jira Mutually Exclusive Quick Filters: Background service worker started');

// Initialize default settings when extension is installed
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Jira Mutually Exclusive Quick Filters: Extension installed/updated', details.reason);
  
  if (details.reason === 'install') {
    // Set default values on first install
    chrome.storage.sync.set({ 
      mutuallyExclusive: true,
      customJiraUrls: []
    }, () => {
      console.log('Jira Mutually Exclusive Quick Filters: Default settings initialized');
    });
  }
  
  // On install or update, inject content script into existing Jira tabs
  if (details.reason === 'install' || details.reason === 'update') {
    injectContentScriptIntoExistingTabs();
  }
});

// Function to inject content script into tabs matching custom URLs
async function injectContentScriptIntoCustomUrls() {
  try {
    const result = await chrome.storage.sync.get({ customJiraUrls: [] });
    const customUrls = result.customJiraUrls;
    
    if (customUrls.length === 0) {
      console.log('No custom URLs configured');
      return;
    }
    
    console.log('Injecting content script for custom URLs:', customUrls);
    
    for (const urlPattern of customUrls) {
      try {
        // Query tabs matching this pattern
        const tabs = await chrome.tabs.query({ url: urlPattern });
        
        for (const tab of tabs) {
          try {
            // Check if content script is already injected by trying to send a message
            await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
            console.log(`Content script already active in tab ${tab.id}`);
          } catch (error) {
            // Content script not active, inject it
            console.log(`Injecting content script into tab ${tab.id} (${tab.url})`);
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            });
          }
        }
      } catch (error) {
        console.warn(`Error processing URL pattern ${urlPattern}:`, error);
      }
    }
  } catch (error) {
    console.error('Error injecting content scripts:', error);
  }
}

// Function to inject content script into all existing Jira tabs
async function injectContentScriptIntoExistingTabs() {
  try {
    // Built-in patterns (only Atlassian Cloud auto-supported)
    const builtInPatterns = [
      '*://*.atlassian.net/*'
    ];
    
    // Get custom URLs
    const result = await chrome.storage.sync.get({ customJiraUrls: [] });
    const allPatterns = [...builtInPatterns, ...result.customJiraUrls];
    
    console.log('Checking existing tabs for patterns:', allPatterns);
    
    for (const pattern of allPatterns) {
      try {
        const tabs = await chrome.tabs.query({ url: pattern });
        
        for (const tab of tabs) {
          try {
            // Try to send a ping to check if content script is already loaded
            await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
            console.log(`Content script already active in tab ${tab.id}`);
          } catch (error) {
            // Content script not loaded, inject it
            console.log(`Injecting content script into existing tab ${tab.id} (${tab.url})`);
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            });
          }
        }
      } catch (error) {
        console.warn(`Error processing pattern ${pattern}:`, error);
      }
    }
  } catch (error) {
    console.error('Error injecting into existing tabs:', error);
  }
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync') {
    // Handle mutuallyExclusive toggle changes
    if (changes.mutuallyExclusive) {
      const oldValue = changes.mutuallyExclusive.oldValue;
      const newValue = changes.mutuallyExclusive.newValue;
      console.log(`Jira Exclusive Quick Filters: Setting changed from ${oldValue} to ${newValue}`);
      
      // Update badge
      if (newValue) {
        chrome.action.setBadgeText({ text: '' });
        chrome.action.setBadgeBackgroundColor({ color: '#667eea' });
      } else {
        chrome.action.setBadgeText({ text: 'OFF' });
        chrome.action.setBadgeBackgroundColor({ color: '#999999' });
      }
    }
    
    // Handle custom URL changes
    if (changes.customJiraUrls) {
      const oldUrls = changes.customJiraUrls.oldValue || [];
      const newUrls = changes.customJiraUrls.newValue || [];
      
      console.log('Custom URLs changed from', oldUrls, 'to', newUrls);
      
      // Inject content script into tabs with new URLs
      injectContentScriptIntoCustomUrls();
    }
  }
});

// Set initial badge state
chrome.storage.sync.get({ mutuallyExclusive: true }, (result) => {
  if (!result.mutuallyExclusive) {
    chrome.action.setBadgeText({ text: 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: '#999999' });
  }
});

// Listen for tab updates to inject content script if needed
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only proceed when the page has finished loading
  if (changeInfo.status === 'complete' && tab.url) {
    const result = await chrome.storage.sync.get({ customJiraUrls: [] });
    const customUrls = result.customJiraUrls;
    
    // Check if the tab URL matches any custom URL pattern
    for (const urlPattern of customUrls) {
      // Convert pattern to regex for matching
      const regex = new RegExp('^' + urlPattern.replace(/\*/g, '.*').replace(/\//g, '\\/') + '$');
      
      if (regex.test(tab.url)) {
        try {
          // Check if content script is already active
          await chrome.tabs.sendMessage(tabId, { action: 'ping' });
        } catch (error) {
          // Content script not active, inject it
          console.log(`Auto-injecting content script into new tab ${tabId} (${tab.url})`);
          try {
            await chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ['content.js']
            });
          } catch (injectError) {
            console.warn('Failed to inject content script:', injectError);
          }
        }
        break;
      }
    }
  }
});
