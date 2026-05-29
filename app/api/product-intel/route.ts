import { NextRequest, NextResponse } from "next/server";
import { generateProductIntel } from "@/lib/gemini";
import { saveProductIntel } from "@/lib/firestore-admin";
import { ProductIntelInput } from "@/lib/types";
import { adminAuth } from "@/lib/firebase-admin";
import * as cheerio from "cheerio";

function validateInput(body: unknown): ProductIntelInput {
  const b = body as ProductIntelInput;
  if (!b.title?.trim()) throw new Error("Nama produk wajib diisi");
  if (!b.description?.trim()) throw new Error("Deskripsi produk wajib diisi");
  if (!b.category) throw new Error("Kategori wajib dipilih");
  return b;
}

async function scrapeProductUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      console.warn(`Scraping failed: Fetch returned status ${res.status}`);
      return "";
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Strip script and style tags
    $("script, style, noscript, iframe, svg").remove();

    // Extract title
    const pageTitle = $("title").text().trim();

    // Extract main text content
    let bodyText = "";
    $("h1, h2, h3, p, li, span, div").each((_, el) => {
      const txt = $(el).text().trim();
      // Only keep sentences with some length and avoid duplication
      if (txt.length > 25 && txt.length < 500) {
        bodyText += txt + " ";
      }
    });

    // Clean up whitespace
    bodyText = bodyText.replace(/\s+/g, " ").trim();

    const combined = `Page Title: ${pageTitle}\nExtracted Content: ${bodyText}`.substring(0, 3000);
    return combined;
  } catch (error) {
    console.error("Error in scrapeProductUrl:", error);
    return "";
  }
}

function isSafeUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase();
    
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "[::1]" ||
      host.startsWith("192.168.") ||
      host.startsWith("10.") ||
      host.startsWith("172.16.") ||
      host.startsWith("172.17.") ||
      host.startsWith("172.18.") ||
      host.startsWith("172.19.") ||
      host.startsWith("172.20.") ||
      host.startsWith("172.21.") ||
      host.startsWith("172.22.") ||
      host.startsWith("172.23.") ||
      host.startsWith("172.24.") ||
      host.startsWith("172.25.") ||
      host.startsWith("172.26.") ||
      host.startsWith("172.27.") ||
      host.startsWith("172.28.") ||
      host.startsWith("172.29.") ||
      host.startsWith("172.30.") ||
      host.startsWith("172.31.") ||
      host.startsWith("169.254.")
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    let uid = "anonymous";
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      uid = decoded.uid;
    } catch (err) {
      console.error("Auth verification failed", err);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const input = validateInput(body);

    let scrapedContext = "";
    if (input.productLink && input.productLink.startsWith("http") && isSafeUrl(input.productLink)) {
      scrapedContext = await scrapeProductUrl(input.productLink);
    }

    const output = await generateProductIntel(input, scrapedContext);

    const docId = await saveProductIntel(uid, input, output);

    return NextResponse.json({ id: docId, output }, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan";
    console.error("[/api/product-intel] Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
