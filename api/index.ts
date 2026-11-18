import express, { Request, Response } from "express";
import https from "https";
import { PDFExtract } from "pdf.js-extract";

const pdfExtract = new PDFExtract();

interface SearchParams {
  board: string;
  level: string;
  subject?: string;
  topic: string;
  contentType?: string;
}

interface SearchResult {
  url: string;
  buffer?: Buffer;
  year?: string;
  lastModified?: string;
  timestamp: number;
}

const pdfCache = new Map<string, SearchResult>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

function getCacheKey(params: SearchParams): string {
  return [
    params.board.trim().toLowerCase(),
    params.level.trim().toLowerCase(),
    (params.subject || "").trim().toLowerCase(),
    params.topic.trim().toLowerCase(),
    (params.contentType || "Revision Notes").trim().toLowerCase(),
  ].join("|");
}

function fetchHttpsHtml(url: string, timeoutMs = 4500): Promise<string> {
  return new Promise((resolve) => {
    try {
      const req = https.get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
          },
          timeout: timeoutMs,
        },
        (res) => {
          if (
            res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            res.resume();
            const redirectUrl = res.headers.location.startsWith("http")
              ? res.headers.location
              : new URL(res.headers.location, url).toString();
            fetchHttpsHtml(redirectUrl, timeoutMs).then(resolve);
            return;
          }
          let data = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => resolve(data));
        }
      );
      req.on("error", () => resolve(""));
      req.on("timeout", () => {
        req.destroy();
        resolve("");
      });
    } catch {
      resolve("");
    }
  });
}

interface Candidate {
  url: string;
  context: string;
}

function addCandidateWith2026Upgrade(
  rawUrl: string,
  context: string,
  seen: Set<string>,
  results: Candidate[]
) {
  // Whenever a legacy "subtopic-<id>.pdf" URL appears, automatically inject its 2026 "<id>.pdf" counterpart first!
  const subtopicMatch = rawUrl.match(
    /^(https:\/\/cdn\.savemyexams\.(?:com|co\.uk)\/pdfs\/)subtopic-([a-zA-Z0-9_-]+\.pdf)$/i
  );
  if (subtopicMatch) {
    const upgraded2026Url = `${subtopicMatch[1]}${subtopicMatch[2]}`;
    if (!seen.has(upgraded2026Url)) {
      seen.add(upgraded2026Url);
      results.push({ url: upgraded2026Url, context });
    }
  }

  if (!seen.has(rawUrl)) {
    seen.add(rawUrl);
    results.push({ url: rawUrl, context });
  }
}

function parseCandidatesFromHtml(html: string): Candidate[] {
  if (!html) return [];
  const clean = html.replace(/\\/g, "").replace(/&amp;/g, "&");
  const results: Candidate[] = [];
  const seen = new Set<string>();

  // 1. Extract Yahoo RU=... encoded redirect targets along with their surrounding title/snippet
  const ruRegex =
    /RU=(https%3a%2f%2fcdn\.savemyexams\.(?:com|co\.uk)[^/]+?\.pdf)\/RK=/gi;
  let match: RegExpExecArray | null;
  while ((match = ruRegex.exec(clean)) !== null) {
    try {
      let decoded = decodeURIComponent(match[1]);
      if (decoded.includes("%")) {
        try {
          decoded = decodeURIComponent(decoded);
        } catch {
          // keep single decoded
        }
      }
      const context = clean
        .substring(match.index, match.index + 2500)
        .replace(/<[^>]+>/g, " ")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ");
      addCandidateWith2026Upgrade(decoded, context, seen, results);
    } catch {
      // ignore malformed URL
    }
  }

  // 2. Fallback: extract any direct or percent-encoded cdn.savemyexams.com PDF URLs
  const normalizedHtml = clean
    .replace(/%3A/gi, ":")
    .replace(/%2F/gi, "/");
  const directRegex =
    /https:\/\/cdn\.savemyexams\.(?:com|co\.uk)[a-zA-Z0-9_/%.\-~]+\.pdf/gi;
  let directMatch: RegExpExecArray | null;
  while ((directMatch = directRegex.exec(normalizedHtml)) !== null) {
    try {
      let decoded = directMatch[0];
      if (decoded.includes("%")) {
        try {
          decoded = decodeURIComponent(decoded);
        } catch {
          // keep as-is
        }
      }
      const start = Math.max(0, directMatch.index - 300);
      const end = Math.min(normalizedHtml.length, directMatch.index + 1500);
      const context = normalizedHtml
        .substring(start, end)
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ");
      addCandidateWith2026Upgrade(decoded, context, seen, results);
    } catch {
      // ignore
    }
  }

  return results;
}

async function searchCandidates(query: string): Promise<Candidate[]> {
  const yahooHosts = [
    "search.yahoo.com",
    "uk.search.yahoo.com",
    "ca.search.yahoo.com",
  ];

  for (const host of yahooHosts) {
    const url = `https://${host}/search?p=${encodeURIComponent(query)}`;
    const html = await fetchHttpsHtml(url, 4500);
    const candidates = parseCandidatesFromHtml(html);
    if (candidates.length > 0) {
      return candidates;
    }
  }

  // Fallback to Bing & Startpage if Yahoo returns no matches
  const fallbackUrls = [
    `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
    `https://www.startpage.com/sp/search?query=${encodeURIComponent(query)}`,
  ];
  for (const fbUrl of fallbackUrls) {
    const html = await fetchHttpsHtml(fbUrl, 4500);
    const candidates = parseCandidatesFromHtml(html);
    if (candidates.length > 0) {
      return candidates;
    }
  }

  return [];
}

function cleanSubjectName(rawSubject: string): string {
  if (!rawSubject || rawSubject === "--Select--") return "";
  return rawSubject
    .replace(/\b(?:Edexcel|Cambridge|CIE|AQA|OCR|Eduqas|IGCSE|GCSE|A\s*Level)\b/gi, " ")
    .replace(/\b[0-9]{4}\b/g, " ")
    .replace(/\b[49][A-Z]{2}[0-9]\b/gi, " ")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanTopicName(rawTopic: string): string {
  return rawTopic
    .replace(/^\d+(\.\d+)*\s*/, "") // strip leading section numbers like "1.1 " or "6.2 "
    .replace(/\(A\s*Level(?:\s*section)?\)/gi, " ")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function findBestPdf(params: SearchParams): Promise<SearchResult | null> {
  const cacheKey = getCacheKey(params);
  const cached = pdfCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached;
  }

  const { board, level, subject = "", topic, contentType = "Revision Notes" } = params;

  let typeQuery = "revision notes";
  if (contentType === "Multiple Choice Questions") {
    typeQuery = '"Multiple Choice Questions"';
  } else if (contentType === "Theory Questions") {
    typeQuery = '"Theory Questions"';
  } else if (contentType === "Alternative to Practical Questions") {
    typeQuery = '"Alternative to Practical"';
  } else if (contentType === "Mark Schemes") {
    typeQuery = '"Mark scheme"';
  }

  const cleanLevel = level
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const boardQuery =
    board.toLowerCase() === "cambridge" ? "Cambridge CIE" : board;
  const cleanSubj = cleanSubjectName(subject);
  const cleanTopic = cleanTopicName(topic);

  // Query 1: Modern /pdfs/ path + 2026 preference
  const modern2026Query = `site:cdn.savemyexams.com/pdfs ${boardQuery} ${cleanLevel} ${cleanSubj} "${cleanTopic}" ${typeQuery} filetype:pdf`
    .replace(/\s+/g, " ")
    .trim();

  // Query 2: Standard query across cdn.savemyexams.com
  const primaryQuery = `site:cdn.savemyexams.com ${boardQuery} ${cleanLevel} ${cleanSubj} ${cleanTopic} ${typeQuery} filetype:pdf`
    .replace(/\s+/g, " ")
    .trim();

  const [modernCandidates, primaryCandidates] = await Promise.all([
    searchCandidates(modern2026Query),
    searchCandidates(primaryQuery),
  ]);

  const seenUrls = new Set<string>();
  let candidates: Candidate[] = [];
  for (const c of [...modernCandidates, ...primaryCandidates]) {
    if (!seenUrls.has(c.url)) {
      seenUrls.add(c.url);
      candidates.push(c);
    }
  }

  // If strict query with quoted contentType found nothing, try unquoted typeQuery
  if (candidates.length === 0) {
    const unquotedType = typeQuery.replace(/"/g, "");
    const secondaryQuery = `site:cdn.savemyexams.com/pdfs ${board} ${cleanLevel} ${cleanSubj} ${cleanTopic} ${unquotedType} filetype:pdf`
      .replace(/\s+/g, " ")
      .trim();
    candidates = await searchCandidates(secondaryQuery);
  }

  // Third fallback: broad topic search on cdn.savemyexams.com
  if (candidates.length === 0) {
    const broadQuery = `site:cdn.savemyexams.com ${cleanLevel} ${cleanSubj} ${cleanTopic} filetype:pdf`
      .replace(/\s+/g, " ")
      .trim();
    candidates = await searchCandidates(broadQuery);
  }

  if (candidates.length === 0) {
    return null;
  }

  const topCandidates = candidates.slice(0, 7);

  const scoredCandidates = await Promise.all(
    topCandidates.map(async (cand, idx) => {
      let score = (12 - idx) * 2; // preserve search ranking tie-breaker
      let pageText = "";
      let lastModified = "";
      let pdfBuffer: Buffer | undefined;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4200);
        const res = await fetch(cand.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          lastModified = res.headers.get("last-modified") || "";
          const arrayBuffer = await res.arrayBuffer();
          pdfBuffer = Buffer.from(arrayBuffer);
          try {
            const data = await pdfExtract.extractBuffer(pdfBuffer, {
              firstPage: 1,
              lastPage: 1,
            });
            pageText = (
              data.pages?.[0]?.content?.map((c) => c.str).join(" ") || ""
            ).toLowerCase();
          } catch {
            // Fallback if PDF font/cmap parsing fails: check raw buffer ASCII strings
            pageText = pdfBuffer.toString("latin1", 0, Math.min(pdfBuffer.length, 65536)).toLowerCase();
          }
        } else {
          score -= 200;
        }
      } catch {
        // If PDF fetch times out, still evaluate using Yahoo snippet and URL
      }

      const urlLower = cand.url.toLowerCase();
      const contextLower = cand.context.toLowerCase();
      const lastModLower = lastModified.toLowerCase();
      const combined = `${pageText} ${contextLower} ${urlLower} ${lastModLower}`;
      const normCombined = combined.replace(/[^a-z0-9]/g, "");
      const normPage = pageText.replace(/[^a-z0-9]/g, "");

      // =========================================================================
      // 0. LATEST 2026 FRESHNESS SCORING (Strictly prioritize 2026 over 2015-2024)
      //    Uses both PDF Page 1 Copyright AND CDN S3 Last-Modified HTTP header!
      // =========================================================================
      let detectedYear = "unknown";
      if (
        lastModLower.includes("2026") ||
        pageText.includes("2026") ||
        contextLower.includes("2026")
      ) {
        score += 220; // Strongest boost for 2026 PDFs
        detectedYear = "2026";
      } else if (
        lastModLower.includes("2025") ||
        pageText.includes("2025") ||
        contextLower.includes("2025")
      ) {
        score += 120; // Second priority for 2025 PDFs if 2026 not yet minted
        detectedYear = "2025";
      }

      // Heavily penalize legacy 2015-2024 / 2015-2023 / old booklet formats
      if (
        lastModLower.includes("2024") ||
        lastModLower.includes("2023") ||
        lastModLower.includes("2022") ||
        lastModLower.includes("2021") ||
        lastModLower.includes("2020") ||
        /2015\s*[−–-]\s*2024|2015\s*[−–-]\s*2023|2015\s*[−–-]\s*2022|savemyexams\.co\.uk|page\s+1\s+of\s+\d+|grade\s+boundaries|time\s+allowed/i.test(
          pageText
        ) ||
        /\b(?:2017|2018|2019|2020|2021|2022)\b/.test(combined)
      ) {
        score -= 240;
        if (detectedYear === "unknown") detectedYear = "legacy";
      }

      // Penalize legacy URL structures (/uploads/2019/, /uploads/2020/, /pdfs/subtopic-)
      if (urlLower.includes("/uploads/")) {
        score -= 240;
      }
      if (urlLower.includes("/pdfs/subtopic-")) {
        score -= 190;
      }
      if (urlLower.includes("/pdfs/") && !urlLower.includes("/pdfs/subtopic-")) {
        score += 40;
      }

      // 1. Exam Board matching
      const bLower = board.toLowerCase().replace(/[^a-z0-9]/g, "");
      const hasBoard =
        normCombined.includes(bLower) ||
        (bLower === "cambridge" && normCombined.includes("cie")) ||
        (bLower === "cie" && normCombined.includes("cambridge")) ||
        (bLower === "eduqas" && normCombined.includes("wjec"));
      if (hasBoard) {
        score += 45;
      } else {
        score -= 35;
      }

      // 2. Level matching (properly handles "GCSE (Separate)" and "GCSE (Combined)")
      const lLower = cleanLevel.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (lLower === "gcse") {
        const checkStr = pageText || combined;
        if (/\bgcse\b/i.test(checkStr) && !/\bigcse\b/i.test(checkStr)) {
          score += 45;
        } else if (normCombined.includes("gcse")) {
          score += 15;
        }
      } else if (lLower === "igcse") {
        if (normCombined.includes("igcse")) {
          score += 45;
        }
      } else if (lLower === "alevel") {
        if (
          normCombined.includes("alevel") ||
          normCombined.includes("aslevel") ||
          /\ba\s*level\b/i.test(combined)
        ) {
          score += 45;
        }
      }

      // Prefer Single/Separate award over Co-ordinated/Double/Combined unless Combined was requested
      if (!level.toLowerCase().includes("combined")) {
        if (
          combined.includes("co-ordinated") ||
          combined.includes("co- ordinated") ||
          combined.includes("double award") ||
          combined.includes("combined science") ||
          contextLower.includes("biology: co")
        ) {
          score -= 55;
        }
      } else {
        if (
          combined.includes("combined") ||
          combined.includes("co-ordinated") ||
          combined.includes("double award")
        ) {
          score += 35;
        }
      }

      // 3. Subject matching
      if (cleanSubj) {
        const subjWords = cleanSubj
          .toLowerCase()
          .split(/\s+/)
          .filter((w) => w.length > 2);
        const matchedSubj = subjWords.filter((w) => normCombined.includes(w));
        if (matchedSubj.length > 0) {
          score += 25 * (matchedSubj.length / subjWords.length);
        }
      }

      // 4. Topic matching
      const normTopic = cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, "");
      const topicWords = cleanTopic
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3);

      if (normTopic && (normPage.includes(normTopic) || normCombined.includes(normTopic))) {
        score += 75;
        if (
          !cleanTopic.toLowerCase().includes("application") &&
          combined.includes(`applications of ${cleanTopic.toLowerCase()}`)
        ) {
          score -= 35;
        }
      } else if (topicWords.length > 0) {
        const matchedWords = topicWords.filter((w) => normCombined.includes(w));
        score += (matchedWords.length / topicWords.length) * 55;
      }

      // 5. Content Type matching
      const targetText = pageText || combined;
      const textWithoutBoilerplate = targetText.replace(
        /revision notes,\s*topic questions,\s*past papers/g,
        ""
      );

      const isMS =
        textWithoutBoilerplate.includes("mark scheme") ||
        urlLower.includes("mark-scheme") ||
        urlLower.includes("answers");
      const isMCQ =
        textWithoutBoilerplate.includes("multiple choice questions") ||
        urlLower.includes("-mcq-");
      const isTheory =
        textWithoutBoilerplate.includes("theory questions") ||
        urlLower.includes("-tq-");
      const isATP =
        textWithoutBoilerplate.includes("alternative to practical") ||
        urlLower.includes("-apq-") ||
        urlLower.includes("-atp-");
      const isMock =
        textWithoutBoilerplate.includes("mock exam paper") ||
        urlLower.includes("mock-exam");
      const isQP = textWithoutBoilerplate.includes("question paper");
      const isCustomTeacherTest =
        urlLower.includes("untitled-test") ||
        urlLower.includes("homework") ||
        /year-\d+-/.test(urlLower) ||
        /week-\d+-/.test(urlLower);
      const isRN =
        textWithoutBoilerplate.includes("your notes") ||
        textWithoutBoilerplate.includes("revision notes") ||
        urlLower.endsWith("-rn.pdf") ||
        (textWithoutBoilerplate.includes("contents") &&
          !isMS &&
          !isMCQ &&
          !isTheory &&
          !isATP &&
          !isQP);

      if (urlLower.includes("preview")) {
        score -= 55;
      }
      if (isCustomTeacherTest) {
        score -= 65;
      }

      if (contentType === "Multiple Choice Questions") {
        if (isMCQ && !isMS) score += 120;
        else if (isQP && !isMS && !isTheory && !isATP) score += 40;
        else score -= 100;
      } else if (contentType === "Theory Questions") {
        if (isTheory && !isMS && !isMock) score += 120;
        else if (isQP && !isMS && !isMCQ && !isATP) score += 45;
        else score -= 100;
      } else if (contentType === "Alternative to Practical Questions") {
        if (isATP && !isMS && !isMock) score += 120;
        else if (isATP && !isMS) score += 45;
        else score -= 100;
      } else if (contentType === "Mark Schemes") {
        if (isMS) score += 120;
        else score -= 100;
      } else {
        // Revision Notes
        if (isRN && !isMS && !isMCQ && !isTheory && !isATP && !isQP) {
          score += 120;
        } else if (!isMS && !isMCQ && !isTheory && !isATP && !isQP) {
          score += 30;
        } else {
          score -= 100;
        }
      }

      return {
        url: cand.url,
        buffer: pdfBuffer,
        year: detectedYear,
        lastModified,
        score,
      };
    })
  );

  scoredCandidates.sort((a, b) => b.score - a.score);
  const winner = scoredCandidates[0];
  if (!winner) return null;

  const result: SearchResult = {
    url: winner.url,
    buffer: winner.buffer,
    year: winner.year,
    lastModified: winner.lastModified,
    timestamp: Date.now(),
  };
  pdfCache.set(cacheKey, result);
  return result;
}

export const apiApp = express();

apiApp.get("/api/search", async (req: Request, res: Response) => {
  try {
    const board = (req.query.board as string) || "";
    const level = (req.query.level as string) || "";
    const subject = (req.query.subject as string) || "";
    const topic = (req.query.topic as string) || "";
    const contentType = (req.query.contentType as string) || "Revision Notes";

    if (!board || !level || !topic) {
      return res.status(400).json({ error: "Missing required parameters (board, level, topic)" });
    }

    const result = await findBestPdf({
      board,
      level,
      subject,
      topic,
      contentType,
    });

    if (result?.url) {
      return res.json({
        url: result.url,
        year: result.year || "2026",
        lastModified: result.lastModified || "",
        board,
        level,
        subject,
        topic,
        contentType,
      });
    }

    return res.status(404).json({ error: "No PDF found in search results" });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Failed to perform search" });
  }
});

apiApp.get("/api/download", async (req: Request, res: Response) => {
  try {
    const board = (req.query.board as string) || "";
    const level = (req.query.level as string) || "";
    const subject = (req.query.subject as string) || "";
    const topic = (req.query.topic as string) || "";
    const contentType = (req.query.contentType as string) || "Revision Notes";
    const directUrl = (req.query.url as string) || "";
    const inline = req.query.inline === "1" || req.query.inline === "true";

    let targetUrl = directUrl;
    let pdfBuffer: Buffer | undefined;

    if (!targetUrl) {
      if (!board || !level || !topic) {
        return res.status(400).json({ error: "Missing parameters" });
      }
      const result = await findBestPdf({
        board,
        level,
        subject,
        topic,
        contentType,
      });
      if (!result?.url) {
        return res.status(404).json({ error: "PDF not found" });
      }
      targetUrl = result.url;
      pdfBuffer = result.buffer;
    }

    if (!pdfBuffer) {
      const pdfRes = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
      });
      if (!pdfRes.ok) {
        return res.status(502).json({ error: "Failed to fetch PDF from CDN" });
      }
      const arrayBuffer = await pdfRes.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuffer);
    }

    const safeTopic = (topic || "SaveMyExams_Document")
      .replace(/[^a-zA-Z0-9 _-]/g, "")
      .replace(/\s+/g, "_")
      .trim();
    const safeType = contentType.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `${safeTopic || "Document"}_${safeType}_2026.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `${inline ? "inline" : "attachment"}; filename="${filename}"`
    );
    res.setHeader("Content-Length", String(pdfBuffer.length));
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Download error:", error);
    return res.status(500).json({ error: "Failed to perform download" });
  }
});

apiApp.get("/api/redirect", async (req: Request, res: Response) => {
  try {
    const board = (req.query.board as string) || "";
    const level = (req.query.level as string) || "";
    const subject = (req.query.subject as string) || "";
    const topic = (req.query.topic as string) || "";
    const contentType = (req.query.contentType as string) || "Revision Notes";

    if (!board || !level || !topic) {
      return res.status(400).send("Missing required parameters");
    }

    const result = await findBestPdf({
      board,
      level,
      subject,
      topic,
      contentType,
    });

    if (result?.url) {
      return res.redirect(302, result.url);
    }

    const cleanQuery = `site:cdn.savemyexams.com/pdfs ${board} ${level} ${subject} ${topic} ${contentType} 2026 filetype:pdf`
      .replace(/\s+/g, " ")
      .trim();
    const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanQuery)}`;

    return res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="referrer" content="no-referrer">
  <title>Redirecting to Search...</title>
  <style>
    body { background: #090d16; color: #f8fafc; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
    a { color: #38bdf8; text-decoration: none; font-weight: 600; }
    a:hover { text-decoration: underline; }
    .loader { border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #38bdf8; border-radius: 50%; width: 40px; height: 40px; animation: spin 0.9s linear infinite; margin-bottom: 20px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loader"></div>
  <h2>Opening Search Results...</h2>
  <p style="margin-top: 12px; font-size: 14px; color: #94a3b8;">If you are not redirected automatically, <a href="${fallbackUrl}">click here</a>.</p>
  <script>
    window.location.replace(${JSON.stringify(fallbackUrl)});
  </script>
</body>
</html>`);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).send("Failed to perform redirect");
  }
});

export default apiApp;
