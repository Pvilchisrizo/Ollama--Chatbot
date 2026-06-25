/*
 * CHATBOT MAIN SCRIPT
 *
 * How it works:
 * 1. The user types a message into the input field and clicks "Send" (or presses Enter).
 * 2. The form's submit event is intercepted so the page doesn't reload.
 * 3. The user's prompt is sent as a POST request to the Ollama REST API
 *    running locally on port 11434.
 * 4. Ollama processes the prompt using the llama3.2 model and returns a JSON
 *    response containing the generated text.
 * 5. The generated text is displayed in the response box on the page.
 *
 * IMPORTANT: Ollama must be running locally (`ollama serve`) before using this app.
 *
 * NOTE: There is a bug — the ID below is "chatbox-response" (with "box"),
 * but the HTML element's ID is "chatbot-response" (with "bot").
 * This causes responseBox to be null, so responses won't display.
 * To fix, change one of them so they match.
 */

// Grab references to the three DOM elements we need:
const form = document.getElementById("chat-input-form"); // The <form> wrapper — we listen for its "submit" event
const responseBox = document.getElementById("chatbox-response"); // The <div> where we display Ollama's answer (BUG: ID mismatch with HTML)
const promptBox = document.getElementById("prompt"); // The <input> where the user types their question

// Attach an async submit handler to the form.
// "async" is needed because we use "await" for the fetch call to Ollama.
form.onsubmit = async (event) => {
  // Prevent the browser's default form submission behavior,
  // which would cause a full page reload and lose the chat context.
  event.preventDefault();

  // Save the user's input and immediately clear the text field
  // so the user knows their message was accepted.
  const prompt = promptBox.value;
  promptBox.value = "";

  // Show a loading indicator ("...") while waiting for Ollama's response.
  responseBox.innerText = "...";

  // Send the prompt to Ollama's /api/generate endpoint.
  // - method: POST because we're sending data (the prompt) to the server.
  // - model: "llama3.2" specifies which LLM Ollama should use.
  // - stream: false tells Ollama to return the complete response in one JSON
  //   object instead of streaming it token-by-token (simpler to handle).
  const response = await fetch(`http://localhost:11434/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: `${prompt}`,
      stream: false,
    }),
  });

  // Parse the JSON response from Ollama.
  // The response object looks like: { "response": "the generated text", ... }
  const data = await response.json();

  // Display the AI-generated text inside the response box.
  responseBox.innerText = data.response;
};
