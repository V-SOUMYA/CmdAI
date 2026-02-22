console.log("Background loaded");
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "askCmdAI") {
    fetch("http://127.0.0.1:8000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request.payload)
    })
      .then((res) => res.json())
      .then((data) => sendResponse({ answer: data.answer }))
      .catch((err) => {
        console.error(err);
        sendResponse({ answer: null });
      });

    return true;
  }
});

chrome.commands.onCommand.addListener((command) => {
  console.log("Shortcut pressed:", command);

  if (command === "open-cmdai") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleCmdAI" });
    });
  }
});