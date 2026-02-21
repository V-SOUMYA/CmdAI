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
      <input id="cmdai-input" type="text" placeholder="Ask something about this page..." />
      <div id="cmdai-response"></div>
    `;

    document.body.appendChild(cmdaiBox);

    const input = document.getElementById("cmdai-input");
    const responseDiv = document.getElementById("cmdai-response");

    input.focus();

    input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        const userQuery = input.value;
        responseDiv.innerText = "Thinking...";

        // Capture page text
        const pageText = document.body.innerText.slice(0, 10000);

        // Send to backend
        const result = await fetch("http://localhost:8000/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: userQuery,
            context: pageText
          })
        });

        const data = await result.json();
        responseDiv.innerText = data.answer;
      }
    });
  }
});