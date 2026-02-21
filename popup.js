// Popup script for Jira Exclusive Quick Filters extension

// Constants
const DEFAULT_SETTINGS = {
  mutuallyExclusive: true
};

document.addEventListener('DOMContentLoaded', async () => {
  // DOM element references
  const elements = {
    toggle: document.getElementById('mutuallyExclusiveToggle'),
    toast: document.getElementById('toast')
  };

  // Toast timeout tracker
  let toastTimeout = null;

  // Load the current state from storage
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  elements.toggle.checked = settings.mutuallyExclusive;

  // Trigger re-initialization on the current tab so filters work even if board loaded late
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      await chrome.tabs.sendMessage(tab.id, { action: 'runInit' });
    }
  } catch (_) {
    // Ignore if not a Jira tab or content script not ready
  }

  // Helper: Show status message as toast
  function showStatus(message, type = 'success') {
    // Clear any existing timeout to prevent timing conflicts
    if (toastTimeout) {
      clearTimeout(toastTimeout);
      toastTimeout = null;
    }

    // Remove show class to restart animation if toast is already visible
    const wasShown = elements.toast.classList.contains('show');
    if (wasShown) {
      elements.toast.classList.remove('show');
    }

    // Update content and type
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;

    // Use requestAnimationFrame to ensure the removal has taken effect
    // before adding 'show' back, allowing the animation to restart
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        elements.toast.classList.add('show');

        // Schedule hide with proper cleanup
        toastTimeout = setTimeout(() => {
          elements.toast.classList.remove('show');
          toastTimeout = null;
        }, 2000);
      });
    });
  }

  // Helper: Notify all tabs about toggle change
  async function notifyAllTabs(isEnabled) {
    try {
      const tabs = await chrome.tabs.query({});

      // Send messages in parallel, ignore failures
      await Promise.allSettled(
        tabs.map(tab =>
          chrome.tabs.sendMessage(tab.id, {
            action: 'toggleChanged',
            enabled: isEnabled
          })
        )
      );
    } catch (error) {
      console.warn('[Popup] Could not notify tabs:', error);
    }
  }

  // Event: Listen for toggle changes
  elements.toggle.addEventListener('change', async () => {
    const isEnabled = elements.toggle.checked;

    // Save to storage
    await chrome.storage.sync.set({ mutuallyExclusive: isEnabled });

    // Show status message
    const message = isEnabled
      ? '✓ Exclusive filters enabled'
      : '↺ Normal filter behavior restored';
    const type = isEnabled ? 'success' : 'warning';
    showStatus(message, type);

    // Notify all tabs about the change
    await notifyAllTabs(isEnabled);
  });

  // Apply to this page: re-run init on current tab (e.g. after board has loaded)
  const applyBtn = document.getElementById('applyToPageBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          await chrome.tabs.sendMessage(tab.id, { action: 'runInit' });
          showStatus('Applied to this page', 'success');
        }
      } catch (error) {
        showStatus('Not a Jira page or page not ready', 'warning');
      }
    });
  }
});
