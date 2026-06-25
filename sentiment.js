const form = document.getElementById("chat-input-form");
const responseBox = document.getElementById("chatbot-response");
const promptBox = document.getElementById("prompt");

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

getSentiment = async (review) => {
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

  const data = await response.json();
  const parsed = JSON.parse(data.response);
  return parsed;
};

const getOverallSentimentFromReviewList = async (list) => {
  const allSentiments = [];
  for (let i = 0; i < list.length; i++) {
    console.log(`Running analysis ${i}...`);
    console.log(list[i]);
    const result = await getSentiment(list[i]);
    allSentiments.push(result.sentiment);
    console.log(allSentiments);
  }
  let total = 0;
  allSentiments.forEach((num) => (total += num));
  const average = total / list.length;
  console.log(`The average sentiment is ${average}`);
  return average;
};

getOverallSentimentFromReviewList(movieReviews);
