

function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
  
      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
  
      const timeoutId = setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timed out waiting for element with selector: ${selector}`));
      }, timeout);
  
      // 清理函数，用于在 resolve 时清除 timeout
      const cleanup = () => {
        clearTimeout(timeoutId);
        observer.disconnect();
      };
  
      // 当 Promise 解决时，确保清理资源
      Promise.prototype.finally.call(
        new Promise((innerResolve) => {
          const existingResolve = resolve;
          resolve = (value) => {
            cleanup();
            existingResolve(value);
            innerResolve();
          };
        }),
        cleanup
      );
    });
}

function waitForElementToDisappear(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (!document.querySelector(selector)) {
        return resolve();
      }
  
      const observer = new MutationObserver(mutations => {
        if (!document.querySelector(selector)) {
          resolve();
          observer.disconnect();
        }
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
  
      const timeoutId = setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timed out waiting for element with selector to disappear: ${selector}`));
      }, timeout);
  
      const cleanup = () => {
        clearTimeout(timeoutId);
        observer.disconnect();
      };
  
      Promise.prototype.finally.call(
        new Promise((innerResolve) => {
          const existingResolve = resolve;
          resolve = () => {
            cleanup();
            existingResolve();
            innerResolve();
          };
        }),
        cleanup
      );
    });
}

async function chatWithClaude() {
  const inputField = await waitForElement('div[aria-label="Write your prompt to Claude"]');
  let editableDiv = parentDiv.querySelector('div[contenteditable]');
  editableDiv.textContent = '您想输入的内容';
  let sendButton = await waitForElement('button[aria-label="Send Message"]');
  sendButton.click()
 
  await waitForElement('button[aria-label="Stop Response"]', tiemout=10000)
  console.log("start wait for response")
  await waitForElementToDisappear('button[aria-label="Stop Response"]', timeout=300000)
  console.log("response stop")
}

async function chatWithGPT() {
  const textarea = await waitForElement('#prompt-textarea');
  console.log("input field")
    // 设置 textarea 的值
  textarea.value = '这是模拟的用户输入';

  // 创建并触发 input 事件
  let inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
  });
  textarea.dispatchEvent(inputEvent);

  // 创建并触发 change 事件
  let changeEvent = new Event('change', {
      bubbles: true,
      cancelable: true,
  });
  textarea.dispatchEvent(changeEvent);

  let sendButton = await waitForElement('button[data-testid="fruitjuice-send-button"]');
  sendButton.click()

  await waitForElement('button[data-testid="fruitjuice-stop-button"]', tiemout=10000)
  console.log("start wait for response")
  await waitForElementToDisappear('button[data-testid="fruitjuice-stop-button"]', timeout=300000)
  console.log("response stop")
}