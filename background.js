chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendMessage") {
      // 在这里处理API请求
      sendMessageToClaude(request.message)
        .then(response => sendResponse({success: true, response: response}))
        .catch(error => sendResponse({success: false, error: error.toString()}));
      return true; // 保持消息通道开放
    }
  });
  
  async function sendMessageToClaude(message) {
    // 这里需要实现与Claude网页交互的逻辑
    // 由于无法直接访问网页DOM,我们需要通过content script来完成
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {action: "sendToClaude", message: message});
    return response;
  }