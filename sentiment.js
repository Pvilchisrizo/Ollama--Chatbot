/*
 * SENTIMENT ANALYSIS SCRIPT
 *
 * This script uses Ollama (llama3.2 model) as an AI-powered sentiment classifier.
 * It demonstrates two things:
 *
 * 1. SINGLE REVIEW ANALYSIS (getSentiment):
 *    Sends one piece of text to Ollama with a carefully crafted prompt that forces
 *    the AI to return a structured JSON response with a sentiment score (0–4 scale).
 *
 * 2. BATCH ANALYSIS (getOverallSentimentFromReviewList):
 *    Iterates over an array of reviews, analyzes each one sequentially,
 *    collects all sentiment scores, and computes their average.
 *    This runs automatically on page load with the hardcoded movieReviews array
 *    and logs progress to the browser console.
 *
 * Sentiment scale:
 *   0 = very negative, 1 = negative, 2 = neutral, 3 = positive, 4 = very positive
 *
 * IMPORTANT: Ollama must be running locally (`ollama serve`) on port 11434.
 *
 * NOTE: The reviews intentionally include typos and slang (e.g., "didnb thnik",
 * "borring") to test how well the AI handles imperfect real-world input.
 */

// DOM element references — same IDs as in sentiment-analysis.html
const form = document.getElementById("chat-input-form");
const responseBox = document.getElementById("chatbot-response");
const promptBox = document.getElementById("prompt");

// Hardcoded sample dataset of movie reviews with varying sentiments.
// Includes intentional misspellings to test AI robustness with messy input.
const movieReviews = [
  "I loved this movie",
  "I hated this movie",
  "i thought it was juuuuust meh",
  "The ending made me cry! So emotional!",
  "I laughed a lot, but I don't think it was supposed to be funny.",
  "Best movie ever!",
  "I didnb thnik itwas vry great",
  "it was exiting!!",
  "It whas borring.",
  "I guess it was fine, but I'm sick of movies like this.",
  "I had a great time!",
];

/*
 * getSentiment(review)
 *
 * Sends a single review string to Ollama and asks the AI to classify its sentiment.
 *
 * The prompt uses "prompt engineering" techniques:
 * - It specifies the EXACT JSON format the AI should return, reducing parsing errors.
 * - It explicitly tells the AI to return ONLY JSON with no extra text (plain text
 *   before/after the JSON would break JSON.parse).
 * - It defines the 0–4 sentiment scale so the AI knows how to score.
 *
 * Returns: { review: "...", sentiment: 0-4 }
 *
 * NOTE: This function is assigned without `const`/`let`/`var`, making it an
 * implicit global variable. Adding `const` would be cleaner.
 */
getSentiment = async (review) => {
  // POST the review to Ollama's generate endpoint with stream:false
  // so we get the full response in a single JSON object.
  const response = await fetch(`http://localhost:11434/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt: `Please analyze the following movie review: ${review}. Return a JSON object with this exact format:

            {
                "review": ${review},
                "sentiment": 0
            }

            The entire response should be just the JSON object with no plaintext either before or after it.

            The sentiment should be a value between 0 and 4, with 4 being very positive, 0 being very negative, and 2 being neutral.`,
      stream: false,
    }),
  });

  // Ollama returns: { "response": "{ \"review\": \"...\", \"sentiment\": 3 }", ... }
  // First .json() parses the outer Ollama wrapper, then JSON.parse() parses the
  // AI's text output (which is itself a JSON string) into a usable object.
  const data = await response.json();
  const parsed = JSON.parse(data.response);
  return parsed;
};

/*
 * getOverallSentimentFromReviewList(list)
 *
 * Processes an array of review strings one by one (sequentially, not in parallel)
 * and computes the average sentiment score across all reviews.
 *
 * Why sequential? Each API call to Ollama takes time (LLM inference). Running them
 * in parallel could overwhelm a local Ollama instance. The sequential loop also
 * makes console logging easier to follow for debugging.
 *
 * Steps:
 * 1. Loop through each review in the list.
 * 2. Call getSentiment() for each — this hits Ollama and returns a score (0–4).
 * 3. Collect all scores in the allSentiments array.
 * 4. Sum the scores and divide by the number of reviews to get the average.
 * 5. Log the average to the console and return it.
 */
const getOverallSentimentFromReviewList = async (list) => {
  const allSentiments = []; // Collects the numeric sentiment score from each review
  for (let i = 0; i < list.length; i++) {
    console.log(`Running analysis ${i}...`);
    console.log(list[i]);
    const result = await getSentiment(list[i]); // Await ensures we finish one before starting the next
    allSentiments.push(result.sentiment);
    console.log(allSentiments); // Shows the growing array of scores in real time
  }

  // Calculate the average: sum all scores, then divide by count.
  let total = 0;
  allSentiments.forEach((num) => (total += num));
  const average = total / list.length;
  console.log(`The average sentiment is ${average}`);
  return average;
};

// Auto-run: analyze all hardcoded movie reviews as soon as the page loads.
// Results are logged to the browser console (open DevTools → Console to see them).
getOverallSentimentFromReviewList(movieReviews);
