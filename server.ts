import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser configuration for base64 file payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY가 환경 변수로 설정되어 있지 않습니다. 설정 메뉴에서 입력해 주세요.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for analyzing a test paper image
app.post("/api/analyze", async (req, res) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ error: "이미지 데이터가 누락되었습니다." });
    }

    // Handle data URL prefix
    let base64Data = image;
    let detectedMimeType = mimeType || "image/jpeg";
    if (image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        detectedMimeType = match[1];
        base64Data = match[2];
      }
    }

    const ai = getGeminiClient();
    const prompt = 
      "업로드된 시험지 이미지를 면밀히 확인하고 다음 내용을 작성해 주세요:\n" +
      "1. 시험지가 다루고 있는 과목(subject) 및 개별 해설에서 알맞은 시험지 제목(title)을 작성해 주세요.\n" +
      "2. 각 문제(문항 번호, 내용 요약, 학생 제출 답안, 올바른 정답)를 인식하여 정답 여부(status: 'correct' 혹은 'incorrect')를 판별해 주세요.\n" +
      "3. 각 문제별로 풀이 방법 및 오답 원인을 명쾌하고 상세하게 한국어로 작성해 주세요 (explanation).\n" +
      "4. 전체 문항 요약(전체수, 맞은수, 틀린수 및 100점 만점으로 계산한 환산 점수) 및 친절하고 다정한 격려의 한마디 총평(overallSummary)을 담아 주세요.\n" +
      "5. 학생에게 맞춰진 강점 요약(strengths), 약점 요약(weaknesses), 그리고 향후 구체적인 오답 학습 전략(studyPlan) 리스트를 작성해 주세요.\n" +
      "모른 내용 및 해설은 반드시 친절하고 정성 가득한 한국어 경어체로 응답해야 합니다.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: detectedMimeType,
          },
        },
        {
          text: prompt,
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: {
              type: Type.STRING,
              description: "시험지 과목명 (예: 수학, 영어, 과학 등)",
            },
            title: {
              type: Type.STRING,
              description: "시험지 단원명 또는 모의고사명",
            },
            totalQuestions: {
              type: Type.INTEGER,
              description: "발견된 전체 문항 수",
            },
            correctCount: {
              type: Type.INTEGER,
              description: "채점 결과 정답인 문항 수",
            },
            incorrectCount: {
              type: Type.INTEGER,
              description: "채점 결과 오답인 문항 수",
            },
            score: {
              type: Type.INTEGER,
              description: "환산 점수 (예: 맞은 문항수 비례 100점 기준 점수)",
            },
            overallSummary: {
              type: Type.STRING,
              description: "종합 결과 요약 및 정성 어린 분석 총평 및 따뜻한 조언",
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "학생이 잘 이해하고 있는 주제나 장점",
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "학생이 자주 놓치는 단원, 문제점 요약",
            },
            studyPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "앞으로 성향 극복을 위한 행동 전략 및 학습 팁",
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: {
                    type: Type.STRING,
                    description: "문항 번호 (예: '1', '2-1' 등)",
                  },
                  content: {
                    type: Type.STRING,
                    description: "질문 내용 핵심 요약",
                  },
                  studentAnswer: {
                    type: Type.STRING,
                    description: "학생이 제출했거나 기입한 답안 내용",
                  },
                  correctAnswer: {
                    type: Type.STRING,
                    description: "해당 문항의 실제 성립된 정답",
                  },
                  status: {
                    type: Type.STRING,
                    description: "정답 구분 ('correct' | 'incorrect')",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "해당 문제 핵심 풀이법, 오답 원인 분석 및 주요 개념 상세 해설",
                  },
                },
                required: ["number", "content", "studentAnswer", "correctAnswer", "status", "explanation"],
              },
            },
          },
          required: [
            "subject",
            "title",
            "totalQuestions",
            "correctCount",
            "incorrectCount",
            "score",
            "overallSummary",
            "strengths",
            "weaknesses",
            "studyPlan",
            "questions",
          ],
        } as any,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("분석을 처리하는 중 오류가 생겼습니다. 이미지 인식이 불완전할 수 있습니다.");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("컨텐츠 분석 실패:", error);
    res.status(500).json({
      error: error.message || "시험지 분석 도중 예상치 못한 오류가 일어났습니다.",
    });
  }
});

// Configure Vite middleware or file serving according to requirements
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched on port ${PORT}`);
  });
}

start();
