import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPrompt } from "./prompts";
import { buildProductIntelPrompt } from "./product-intel-prompt";
import { GenerationInput, GenerationOutput, ProductIntelInput, ProductIntelOutput } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateStrategy(
  input: GenerationInput
): Promise<GenerationOutput> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-flash-lite-latest",
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  const prompt = buildPrompt(input);

  let attempt = 0;
  while (attempt < 2) {
    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      // Strip markdown code fences if present (some models wrap JSON in ```json ... ```)
      const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (fenceMatch) {
        text = fenceMatch[1].trim();
      }
      const parsed = JSON.parse(text) as GenerationOutput;
      validateOutput(parsed);
      return parsed;
    } catch (error) {
      attempt++;
      if (attempt >= 2) throw error;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  throw new Error("Gagal generate setelah 2 percobaan");
}

function validateOutput(output: unknown): asserts output is GenerationOutput {
  const o = output as GenerationOutput;
  if (!o.blueprint || !o.scripts || !o.copywriting) {
    throw new Error("Output AI tidak lengkap");
  }
  if (!Array.isArray(o.scripts) || o.scripts.length === 0) {
    throw new Error("Tidak ada skrip yang dihasilkan");
  }
}

export async function generateProductIntel(
  input: ProductIntelInput,
  scrapedContext?: string
): Promise<ProductIntelOutput> {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-flash-lite-latest",
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  const prompt = buildProductIntelPrompt(input, scrapedContext);

  let attempt = 0;
  while (attempt < 2) {
    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (fenceMatch) {
        text = fenceMatch[1].trim();
      }
      const parsed = JSON.parse(text) as ProductIntelOutput;
      validateProductIntelOutput(parsed);
      return parsed;
    } catch (error) {
      attempt++;
      if (attempt >= 2) throw error;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  throw new Error("Gagal generate Product Intelligence setelah 2 percobaan");
}

function validateProductIntelOutput(output: unknown): asserts output is ProductIntelOutput {
  const o = output as ProductIntelOutput;
  const keys: (keyof ProductIntelOutput)[] = [
    "productDNA",
    "buyerPersona",
    "corePainPoint",
    "buyingTriggers",
    "keyBenefits",
    "objectionMapping",
    "bestContentAngles",
    "videoHooks",
    "ctaStrategy",
    "contentExecution",
  ];
  for (const key of keys) {
    if (!o[key] || typeof o[key] !== "string") {
      throw new Error(`Output AI tidak lengkap: missing atau invalid ${key}`);
    }
  }
}

