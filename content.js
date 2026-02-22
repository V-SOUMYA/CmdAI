let cmdaiBox = null;

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggleCmdAI") {
    if (cmdaiBox) {
      cmdaiBox.remove();
      cmdaiBox = null;
      return;
    }

    createCmdAI();
  }
});

function createCmdAI() {
  cmdaiBox = document.createElement("div");
  cmdaiBox.id = "cmdai-popup";

  cmdaiBox.innerHTML = `
    <div class="cmdai-header">CmdAI — AI on Command</div>
    <input id="cmdai-input" type="text" placeholder="Ask anything about this page..." />
    <div id="cmdai-response"></div>
  `;

  document.body.appendChild(cmdaiBox);

  const input = document.getElementById("cmdai-input");
  const responseDiv = document.getElementById("cmdai-response");

  input.focus();

  // Close on ESC
  function escListener(e) {
    if (e.key === "Escape" && cmdaiBox) {
      cmdaiBox.remove();
      cmdaiBox = null;
      document.removeEventListener("keydown", escListener);
    }
  }

  document.addEventListener("keydown", escListener);

  // Submit on Enter
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const userQuery = input.value;
      responseDiv.innerHTML = "<div style='opacity:0.7;'>CmdAI is thinking...</div>";

      let pageText = "";
      const article = document.querySelector("article");

      if (article) {
        pageText = article.innerText;
      } else {
        pageText = document.body.innerText;
      }

      pageText = pageText.slice(0, 15000);

      // ✅ SEND MESSAGE TO BACKGROUND
      chrome.runtime.sendMessage(
        {
          action: "askCmdAI",
          payload: {
            query: userQuery,
            context: pageText
          }
        },
        (response) => {
          if (response && response.answer) {
            responseDiv.innerHTML = response.answer;
          } else {
            responseDiv.innerHTML = "⚠️ Something went wrong.";
          }
        }
      );
    }
  });
}