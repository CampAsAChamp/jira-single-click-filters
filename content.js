// Jira Mutually Exclusive Quick Filters - Content Script
// Makes quick filters mutually exclusive by auto-deselecting others when one is clicked

// ============================================================================
// GUARD AGAINST DOUBLE INJECTION
// ============================================================================
if (window.jiraExclusiveFiltersInjected) {
  console.log('Jira Exclusive Filters: Already injected, skipping');
} else {
  window.jiraExclusiveFiltersInjected = true;

// ============================================================================
// CONSTANTS
// ============================================================================
const DEBUG = false; // Set to true for verbose logging

const CONFIG = {
  // Legacy Jira (e.g. *.atlassian.net) – Server/Data Center DOM
  SELECTORS_LEGACY: {
    WORK_CONTAINER: 'dl#js-work-quickfilters',
    PLAN_CONTAINER: 'dl#js-plan-quickfilters',
    FILTER_BUTTON: '.js-quickfilter-button',
    ACTIVE_FILTER: '.js-quickfilter-button.ghx-active',
    FILTER_ID_ATTR: 'data-filter-id'
  },
  // Jira Cloud (e.g. jira.cloud.intuit.com) – fieldset with label[for^="checkbox-id-"]
  SELECTORS_CLOUD: {
    WORK_CONTAINER: 'fieldset:has(label[for^="checkbox-id-"])',
    PLAN_CONTAINER: 'fieldset:has(label[for^="checkbox-id-"])',
    FILTER_BUTTON: 'label[for^="checkbox-id-"]',
    ACTIVE_FILTER: null, // Active filters resolved via checked checkboxes in code
    FILTER_ID_ATTR: 'for'
  },
  TIMING: {
    CLICK_DELAY: 100,           // Delay before processing click
    INIT_DELAY: 1000,           // Initial load delay
    MUTATION_DEBOUNCE: 250      // Debounce for mutation observer
  },
  STORAGE_KEY: 'mutuallyExclusive',
  DEFAULT_ENABLED: true
};

const LOG_PREFIX = 'Jira Mutually Exclusive Quick Filters:';

// Return selector set for current host (Jira Cloud vs legacy)
function getSelectors() {
  const isCloud = /jira\.cloud\.intuit\.com/i.test(window.location.hostname);
  return isCloud ? CONFIG.SELECTORS_CLOUD : CONFIG.SELECTORS_LEGACY;
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================
const state = {
  isProcessingClick: false,
  initializedContainers: new Set(),
  isEnabled: CONFIG.DEFAULT_ENABLED
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Simple debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Logging helper
const log = {
  info: (...args) => DEBUG && console.log(LOG_PREFIX, ...args),
  warn: (...args) => console.warn(LOG_PREFIX, ...args),
  error: (...args) => console.error(LOG_PREFIX, ...args)
};

// ============================================================================
// STORAGE MANAGEMENT
// ============================================================================

// Load and cache the enabled state
async function loadEnabledState() {
  try {
    if (!chrome?.storage?.sync) {
      log.warn('chrome.storage not available, using default (enabled)');
      return CONFIG.DEFAULT_ENABLED;
    }

    const result = await chrome.storage.sync.get({
      [CONFIG.STORAGE_KEY]: CONFIG.DEFAULT_ENABLED
    });
    state.isEnabled = result[CONFIG.STORAGE_KEY];
    log.info(`Feature enabled: ${state.isEnabled}`);
    return state.isEnabled;
  } catch (error) {
    log.error('Error reading storage:', error);
    return CONFIG.DEFAULT_ENABLED;
  }
}

// Listen for storage changes to update cached state
if (chrome?.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes[CONFIG.STORAGE_KEY]) {
      state.isEnabled = changes[CONFIG.STORAGE_KEY].newValue;
      log.info(`Feature toggled: ${state.isEnabled}`);
    }
  });
}

// ============================================================================
// FILTER MANAGEMENT
// ============================================================================

// Get filter info helper
function getFilterInfo(button) {
  const selectors = getSelectors();
  const idAttr = selectors.FILTER_ID_ATTR || 'data-filter-id';
  let id = button.getAttribute(idAttr);
  if (id == null) id = button.textContent.trim();
  return {
    id: id != null ? String(id) : button.textContent.trim(),
    name: button.textContent.trim()
  };
}

// Deselect all active filters except the clicked one
function deactivateOtherFilters(clickedFilterId) {
  const selectors = getSelectors();
  let activeFilters;
  if (selectors.ACTIVE_FILTER) {
    activeFilters = document.querySelectorAll(selectors.ACTIVE_FILTER);
  } else {
    // Jira Cloud: labels toggle checkboxes; active = checked checkbox, get corresponding label
    const checkedInputs = document.querySelectorAll('input[id^="checkbox-id-"]:checked');
    activeFilters = Array.from(checkedInputs)
      .map(input => document.querySelector(`label[for="${input.id}"]`))
      .filter(Boolean);
  }
  log.info(`Found ${activeFilters.length} active filters`);

  let deselectedCount = 0;
  activeFilters.forEach(activeFilter => {
    const { id, name } = getFilterInfo(activeFilter);

    if (id !== clickedFilterId) {
      log.info(`Deselecting "${name}" (ID: ${id})`);
      activeFilter.click();
      deselectedCount++;
    }
  });

  log.info(`Deselected ${deselectedCount} filters`);
  return deselectedCount;
}

// Handler function for filter button clicks
async function handleFilterClick(button) {
  // Prevent recursive clicking
  if (state.isProcessingClick) {
    log.info('Already processing a click, skipping');
    return;
  }

  // Check if feature is enabled
  if (!state.isEnabled) {
    log.info('Feature disabled, allowing normal behavior');
    return;
  }

  state.isProcessingClick = true;

  // Small delay to let the current click register first
  setTimeout(() => {
    try {
      const { id, name } = getFilterInfo(button);
      log.info(`Processing click on "${name}" (ID: ${id})`);

      deactivateOtherFilters(id);
    } catch (error) {
      log.error('Error handling filter click:', error);
    } finally {
      state.isProcessingClick = false;
    }
  }, CONFIG.TIMING.CLICK_DELAY);
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize a single container with event delegation
function initializeContainer(filterContainer) {
  const containerId = filterContainer.id || filterContainer.getAttribute('data-testid') || 'quick-filters';

  // Check if already initialized
  if (state.initializedContainers.has(filterContainer)) {
    log.info(`Container ${containerId} already initialized, skipping`);
    return false;
  }

  log.info(`Initializing container ${containerId}`);

  // Check for filter buttons
  const selectors = getSelectors();
  const filterButtons = filterContainer.querySelectorAll(selectors.FILTER_BUTTON);
  log.info(`Found ${filterButtons.length} filter buttons in ${containerId}`);

  if (filterButtons.length === 0) {
    log.info(`No filter buttons found in ${containerId}`);
    return false;
  }

  // Use event delegation with capture phase
  filterContainer.addEventListener('click', async (e) => {
    const button = e.target.closest(selectors.FILTER_BUTTON);
    if (button) {
      log.info(`Filter button clicked via delegation in ${containerId}`);
      await handleFilterClick(button);
    }
  }, true);

  state.initializedContainers.add(filterContainer);
  log.info(`Container ${containerId} initialized successfully`);
  return true;
}

// Initialize all available quick filter containers
function initializeExtension() {
  log.info('Initializing extension');

  let initializedCount = 0;
  const selectors = getSelectors();

  // Try both container types (Sprint board and Backlog)
  const containers = [
    document.querySelector(selectors.WORK_CONTAINER),
    document.querySelector(selectors.PLAN_CONTAINER)
  ];

  containers.forEach(container => {
    if (container && initializeContainer(container)) {
      initializedCount++;
    }
  });

  if (initializedCount === 0) {
    log.info('No containers found or all already initialized');
    return false;
  }

  log.info(`Initialized ${initializedCount} container(s)`);
  return true;
}

// ============================================================================
// OBSERVERS & STARTUP
// ============================================================================

// Debounced initialization for mutation observer
const debouncedInit = debounce(
  initializeExtension,
  CONFIG.TIMING.MUTATION_DEBOUNCE
);

// Use MutationObserver to handle dynamic content
const observer = new MutationObserver(() => {
  debouncedInit();
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initialize on load
(async function startup() {
  log.info('Content script loaded');

  // Load enabled state from storage
  await loadEnabledState();

  // Try immediate initialization if DOM is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    log.info('Document already loaded, attempting immediate initialization');
    setTimeout(initializeExtension, CONFIG.TIMING.INIT_DELAY);
  }
})();

// Listen for messages from background and popup
if (chrome?.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.action === 'ping') {
      sendResponse(true);
      return true;
    }
    if (message?.action === 'runInit') {
      initializeExtension();
      sendResponse(true);
      return true;
    }
    return false;
  });
}

} // End of injection guard
