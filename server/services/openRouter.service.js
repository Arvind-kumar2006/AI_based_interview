import axios from "axios";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = process.env.OPENROUTER_API_KEY;
const TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;
const RETRY_DELAYS = [1000, 3000];

// Models in priority order — free models at the end as fallback
// Check available free models: https://openrouter.ai/models?max_price=0
const MODELS = [
  "openai/gpt-4o-mini",                       // Paid — best quality
  "google/gemini-2.0-flash-001",              // Paid — fast fallback
  "google/gemma-3-4b-it:free",               // Free
  "mistralai/mistral-7b-instruct:free",      // Free
  "qwen/qwen-2.5-7b-instruct:free",          // Free
  "deepseek/deepseek-r1:free",               // Free
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
        if (modelIndex > 0) {
          console.info(`OpenRouter: succeeded with fallback model ${model}`);
        }
        return content;
      } catch (error) {
        lastError = error;
        const status = error.response?.status;

        // Auth failure — no point retrying any model
        if (status === 401 || status === 403) {
          throw new Error(
            `OpenRouter authentication failed. Check your API key. (${error.response?.data?.error?.message || error.message})`
          );
        }

        // Model not found / unavailable / no credits for this model — skip to next model immediately
        if (status === 404 || status === 402) {
          console.warn(`OpenRouter: model ${model} unavailable (${status}) — trying next model...`);
          break; // exits inner retry loop → moves to next model
        }

        // Rate limit or server error — retry with delay
        const isRateLimit = status === 429;
        const isServerError = status >= 500;
        const isNetworkError = !status;

        if ((isRateLimit || isServerError || isNetworkError) && attempt < MAX_RETRIES - 1) {
          const delay = RETRY_DELAYS[attempt] || 3000;
          console.warn(
            `OpenRouter: attempt ${attempt + 1} failed for ${model} (status: ${status || "network"}). Retrying in ${delay}ms...`
          );
          await sleep(delay);
        } else {
          // Unknown error or last attempt — skip to next model
          console.warn(`OpenRouter: giving up on ${model} after attempt ${attempt + 1} (status: ${status}).`);
          break;
        }
      }
    }
  }

  console.error("OpenRouter: all models exhausted. Last error:", lastError?.response?.data || lastError?.message);
  throw new Error(
    `AI service temporarily unavailable. Please try again in a moment.`
  );
};