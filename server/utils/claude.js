// Minimal Anthropic Messages API client (no SDK needed, uses Node 18+ fetch).
const API_URL = () => process.env.ANTHROPIC_API_URL || "https://api.anthropic.com/v1/messages";
const MODEL = () => process.env.ANTHROPIC_MODEL || "claude-fable-5-1";

class AiError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.status = status;
  }
}

async function askClaude({ system, prompt, maxTokens = 900 }) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new AiError("AI assistant is not configured. Add ANTHROPIC_API_KEY to server/.env and restart the server.", 503);
  }

  let resp;
  try {
    resp = await fetch(API_URL(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL(),
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(60000),
    });
  } catch (err) {
    throw new AiError("Could not reach the AI service. Check your internet connection and try again.", 504);
  }

  if (!resp.ok) {
    let detail = "";
    try {
      detail = (await resp.json())?.error?.message || "";
    } catch (_) {}
    if (resp.status === 401) throw new AiError("The Anthropic API key was rejected. Check ANTHROPIC_API_KEY in server/.env.", 502);
    if (resp.status === 404) throw new AiError(`Model "${MODEL()}" is not available for this API key. Set ANTHROPIC_MODEL in server/.env.`, 502);
    if (resp.status === 429) throw new AiError("The AI service is busy right now. Please try again in a moment.", 429);
    throw new AiError(detail || "The AI service returned an error.", 502);
  }

  const data = await resp.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  if (!text) throw new AiError("The AI returned an empty answer. Please try again.", 502);
  return text;
}

// Pull a JSON object/array out of a model answer, tolerating code fences and stray prose.
function parseJson(text) {
  const cleaned = text.replace(/```json|```/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (_) {}
  const m = cleaned.match(/[\[{][\s\S]*[\]}]/);
  if (m) {
    try {
      return JSON.parse(m[0]);
    } catch (_) {}
  }
  throw new AiError("The AI answer could not be read. Please try again.", 502);
}

module.exports = { askClaude, parseJson, AiError };
