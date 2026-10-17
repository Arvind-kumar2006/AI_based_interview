import axios from "axios";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = process.env.OPENROUTER_API_KEY;
const TIMEOUT_MS = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000];

const MODELS = [
  "openai/gpt-4o-mini",
  "google/gemini-2.0-flash-001",
  "meta-llama/llama-3.1-8b-instruct:free",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callOpenRouter = async (messages, model) => {
  const response = await axios.post(
    OPENROUTER_URL,
    { model, messages },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: TIMEOUT_MS,
    }
  );

  const content = response?.data?.choices?.[0]?.message?.content;

  if (!content || !content.trim()) {
    throw new Error("AI returned empty response.");
  }

  return content;
};

export const askAi = async (messages) => {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages array is empty.");
  }

  if (!API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  let lastError = null;

  for (let modelIndex = 0; modelIndex < MODELS.length; modelIndex++) {
    const model = MODELS[modelIndex];

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const content = await callOpenRouter(messages, model);
        return content;
      } catch (error) {
        lastError = error;

        const status = error.response?.status;
        const isAuthError = status === 401 || status === 403;
        const isRateLimit = status === 429;
        const isServerError = status >= 500;

        if (isAuthError) {
          throw new Error(
            `OpenRouter authentication failed. Check your API key. (${error.response?.data?.error?.message || error.message})`
          );
        }

        const isLastModel = modelIndex === MODELS.length - 1;
        const isLastAttempt = attempt === MAX_RETRIES - 1;

        if (isLastModel && isLastAttempt) {
          break;
        }

        if (isRateLimit || isServerError || !status) {
          const delay = RETRY_DELAYS[attempt] || 4000;
          console.warn(
            `OpenRouter attempt ${attempt + 1} failed for ${model} (status: ${status || "network"}). Retrying in ${delay}ms...`
          );
          await sleep(delay);
        } else {
          break;
        }
      }
    }
  }

  console.error("OpenRouter Error:", lastError?.response?.data || lastError?.message);
  throw new Error(
    `OpenRouter API failed after ${MAX_RETRIES * MODELS.length} attempts. Last error: ${lastError?.message || "Unknown error"}`
  );
};