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

  // ESC key to close
  function escListener(e) {
    if (e.key === "Escape" && cmdaiBox) {
      cmdaiBox.remove();
      cmdaiBox = null;
      document.removeEventListener("keydown", escListener);
    }
  }

  document.addEventListener("keydown", escListener);

  // Enter key to submit
  input.addEventListener("keydown", async (e) => {
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

      try {
        const result = await fetch("http://127.0.0.1:8000/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: userQuery,
            context: pageText
          })
        });

        if (!result.ok) {
          throw new Error("Server error");
        }

        const data = await result.json();
        responseDiv.innerHTML = data.answer;

      } catch (err) {
        responseDiv.innerHTML = "⚠️ Something went wrong.";
      }
    }
  });
}