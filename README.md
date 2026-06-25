# Ollama Chatbot

A local AI chatbot and sentiment analysis tool powered by **Ollama** (llama3.2 model). Everything runs on your machine — no cloud APIs, no API keys, fully private.

## How It Works

### Chatbot (index.html + script.js)

1. The user types a message in the input field and clicks "Send".
2. JavaScript intercepts the form submission (prevents page reload).
3. The user's prompt is sent as a **POST request** to Ollama's local REST API (`http://localhost:11434/api/generate`).
4. Ollama runs the llama3.2 language model locally and returns the generated response as JSON.
5. The response text is extracted from the JSON and displayed on the page.

### Sentiment Analysis (sentiment-analysis.html + sentiment.js)

1. On page load, the script automatically analyzes a hardcoded list of 11 movie reviews.
2. Each review is sent to Ollama with a **prompt-engineered** instruction that forces the AI to return a structured JSON object with a sentiment score on a 0–4 scale (0 = very negative, 2 = neutral, 4 = very positive).
3. Reviews are processed **sequentially** (one at a time) to avoid overwhelming the local Ollama instance.
4. All individual scores are collected, summed, and averaged to compute an overall sentiment.
5. Progress and results are logged to the browser console (open DevTools to see them).

### Styling (style.css)

- Dark theme with monospace font for a terminal aesthetic.
- Shared across both pages.
- Uses Flexbox to center content with a max-width of 720px for readability.

## Prerequisites

- **Ollama** installed and running locally: [ollama.com](https://ollama.com)
- The **llama3.2** model pulled: `ollama pull llama3.2`

## How to Run

1. Start Ollama in a terminal:
   ```
   ollama serve
   ```
2. In a separate terminal, serve the project files with Python's built-in HTTP server:
   ```
   python3 -m http.server 8000
   ```
3. Open your browser and go to:
   - Chatbot: `http://localhost:8000`
   - Sentiment Analysis: `http://localhost:8000/sentiment-analysis.html`

## Project Structure

```
Ollama-Chatbot/
├── index.html               # Main chatbot page (UI)
├── script.js                # Chatbot logic (sends prompts to Ollama, displays responses)
├── sentiment-analysis.html  # Sentiment analysis page (UI)
├── sentiment.js             # Sentiment analysis logic (prompt engineering + batch processing)
├── style.css                # Shared dark-theme stylesheet
└── README.md                # This file
```
