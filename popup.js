document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('send');
    const messageInput = document.getElementById('message');
    const responseDiv = document.getElementById('response');
  
    sendButton.addEventListener('click', function() {
      const message = messageInput.value;
      chrome.runtime.sendMessage({action: "sendMessage", message: message}, function(response) {
        if (response.success) {
          responseDiv.textContent = response.response;
        } else {
          responseDiv.textContent = "Error: " + response.error;
        }
      });
    });
  });