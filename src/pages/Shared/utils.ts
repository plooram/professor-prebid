export const decylce = (obj: any) => {
  const cache = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      if (value['location']) {
        // document object found, discard key
        return;
      }
      // Store value in our set
      cache.add(value);
    }
    return value;
  });
};

export const getTabId = (): Promise<number> => {
  return new Promise((resolve) => {
    if (chrome?.devtools?.inspectedWindow?.tabId) {
      resolve(chrome.devtools.inspectedWindow.tabId);
    } else if (chrome?.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0]?.id);
      });
    }
  });
};

export const sendWindowPostMessage = (type: string, payload: object): void => {
  // Guard against service worker context where document/window are not available
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }
  
  // work-around for
  // DOMException:xyz could not be cloned.
  // in window.postMessage
  // payload = JSON.parse(JSON.stringify(payload));
  payload = JSON.parse(decylce(payload));
  window.top.postMessage(
    {
      profPrebid: true,
      type,
      payload,
    },
    '*'
  );
  // send postmessage to all iframes
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    iframe.contentWindow.postMessage(
      {
        profPrebid: true,
        type,
        payload,
      },
      '*'
    );
  });
};

export const createRangeArray = (start: number, end: number, step: number, offsetRight: number): number[] => {
  const arr1 = Array.from(Array.from(Array(Math.ceil((end + offsetRight - start) / step)).keys()), (x) => start + x * step);
  const endValueIndex = arr1.indexOf(end);
  if (endValueIndex === -1) {
    arr1.push(end);
  }
  return arr1.sort();
};

export const getMinAndMaxNumber = (timestampArray: number[]): { min: number; max: number } => {
  let min: number = 0;
  let max: number = 0;
  timestampArray.forEach((timestamp) => {
    if (timestamp < min || min === 0) {
      min = timestamp;
    }
    if (timestamp > max || max === 0) {
      max = timestamp;
    }
  });
  return { min, max };
};

export const conditionalPluralization = (input: Array<any>): string => (input?.length > 1 ? 's' : '');

export const reloadPage = async () => {
  const tabId = await getTabId();
  chrome.tabs.reload(tabId);
};

export const sendChromeTabsMessage = async (type: string, payload: object | string): Promise<void> => {
  try {
    const tabId = await getTabId();
    if (!tabId) {
      console.warn('Exchain Bid Analysis: No tab ID available for message sending');
      return;
    }
    
    chrome.tabs.sendMessage(tabId, { type, payload }, (response) => {
      if (chrome.runtime.lastError) {
        // Silently handle connection errors - this is normal behavior
        // when content script hasn't loaded yet or page is being navigated
        console.debug('Exchain Bid Analysis: Message sending failed (this is normal):', chrome.runtime.lastError.message);
      }
    });
  } catch (error) {
    console.debug('Exchain Bid Analysis: Message sending error:', error);
  }
};

export const detectIframe = (): boolean => {
  // Guard against service worker context where window is not available
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

export const generateUniqueId = () => new Date().getTime() + '-' + Math.random().toString(36).substr(2, 9);
