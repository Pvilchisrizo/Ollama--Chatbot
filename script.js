const form = document.getElementById("chat-input-form");
const responseBox = document.getElementById("chatbox-response");
const promptBox = document.getElementById("prompt");

form.onsubmit = async (event) => {
  event.preventDefault();

  const prompt = promptBox.value;
  promptBox.value = "";
  responseBox.innerText = "...";

  const response = await fetch(`http://localhost:11434/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: `${prompt}`,
      stream: false,
    }),
  });

  const data = await response.json();
  responseBox.innerText = data.response;
};
