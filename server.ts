import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { findFallbackPoem } from './src/data/fallbackPoems';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') });
});

// AI Poetry Recommendation API
app.post('/api/recommend-poem', async (req, res) => {
  const { keyword } = req.body;
  const userKeyword = (typeof keyword === 'string' && keyword.trim()) ? keyword.trim() : '月亮';

  const client = getGeminiClient();

  if (!client) {
    // Return authentic classical poetry fallback directly
    return res.json({
      success: true,
      poem: findFallbackPoem(userKeyword),
      isAiGenerated: false,
      note: 'Offline curated classical collection'
    });
  }

  try {
    const prompt = `你是盛唐詩仙「李白」的知音解讀官兼古典文學專家。
使用者此刻的心情、所見景物或思緒關鍵字為：「${userKeyword}」。

請為使用者推薦一首最契合其心境的【李白真實創作詩詞】。
要求：
1. 必須是李白真實傳世的經典詩詞作品（絕不可自行杜撰偽造詩句）。
2. 全部使用優美流暢的繁體中文（正體中文）。
3. 嚴格輸出以下 JSON 結構：
   - title: 詩名（例如：《月下獨酌四首·其一》、《宣州謝朓樓餞別校書叔雲》）
   - dynasty: 朝代（固定為「唐」）
   - author: 作者（固定為「李白」）
   - genre: 體裁（例如：五言絕句、七言古詩、樂府詩、七言律詩等）
   - verses: 詩句陣列，每一行或一句為一個字串，帶標點符號（例如 ["花間一壺酒，獨酌無相親。", "舉杯邀明月，對影成三人。"]）
   - famousVerse: 最膾炙人口、最能給人共鳴與啟發的一句或對聯（例如："天生我材必有用，千金散盡還復來。"）
   - vernacular: 深入淺出、文辭雅緻的白話文解釋，完整翻譯整首詩的字面與深層意境。
   - reason: 詳細且富有溫度的推薦原因，結合李白的曠達心境，說明為何此詩能慰藉、共鳴或指引使用者此刻的心情「${userKeyword}」。
   - background: 詩詞創作背景或李白當時的人生遭遇，讓讀者更能體會詩人的性情。
   - moodTag: 四字以內的古典意境標籤（例如：孤高曠達、月夜思鄉、快意乘風、借酒銷愁）。`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: '你是一位精通唐詩、特別是李白作品的文學巨匠。你精確掌握李白的豪邁、浪漫、孤獨與深情，並以繁體中文回答，文風優雅典雅，富有古典詩詞神韻。',
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            dynasty: { type: Type.STRING },
            author: { type: Type.STRING },
            genre: { type: Type.STRING },
            verses: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            famousVerse: { type: Type.STRING },
            vernacular: { type: Type.STRING },
            reason: { type: Type.STRING },
            background: { type: Type.STRING },
            moodTag: { type: Type.STRING }
          },
          required: ['title', 'dynasty', 'author', 'genre', 'verses', 'famousVerse', 'vernacular', 'reason', 'moodTag']
        }
      }
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error('Empty response from Gemini model');
    }

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      poem: {
        id: `ai-${Date.now()}`,
        ...parsedData,
        queryKeyword: userKeyword,
        timestamp: Date.now()
      },
      isAiGenerated: true
    });
  } catch (error) {
    console.error('Gemini recommendation error:', error);
    // Return curated fallback poem gracefully so user always gets a matching poem
    return res.json({
      success: true,
      poem: findFallbackPoem(userKeyword),
      isAiGenerated: false,
      error: error instanceof Error ? error.message : 'AI service temporarily unavailable',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`李白詩詞小助手服務已在 http://0.0.0.0:${PORT} 啟動`);
  });
}

startServer();
