let cmdaiBox = null;

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggleCmdAI") {
    if (cmdaiBox) {
      cmdaiBox.remove();
      cmdaiBox = null;
      return;
    }

    cmdaiBox = document.createElement("div");
    cmdaiBox.id = "cmdai-popup";
    cmdaiBox.innerHTML = `
      <div class="cmdai-header">CmdAI</div>
      <input type="text" placeholder="Ask something about this page..." />
      <div class="cmdai-response"></div>
    `;

    document.body.appendChild(cmdaiBox);
  }
});