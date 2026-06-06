import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { 
  FileText, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Award, 
  Activity, 
  TrendingUp, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  FolderOpen,
  ArrowRight,
  User,
  Check,
  CheckCircle2
} from "lucide-react";
import { AnalysisResponse } from "./types";

// High fidelity preset samples for demonstration & immediate testing
const PRESET_SAMPLES = [
  {
    id: "math",
    name: "중2 수학 - 일차부등식과 연립방정식",
    subject: "수학",
    title: "중학교 2학년 1학기 중간고사 대비 평가",
    score: 85,
    totalQuestions: 6,
    correctCount: 5,
    incorrectCount: 1,
    overallSummary: "전반적으로 일차부등식의 성질과 대입법을 활용한 연립방정식의 풀이에 높은 이해도를 보이고 있습니다. 계산 과정이 정돈되어 있고 수식 전개가 깔끔합니다. 다만 소수가 포함된 연립방정식의 계수 정수화 과정에서 이항 부호를 잘못 처리하는 실수가 있었습니다. 전반적으로 우수한 성취도이므로 실수를 방지하는 훈련에 집중한다면 만점을 기대할 수 있는 훌륭한 실력입니다.",
    strengths: [
      "부등식의 성질을 완벽하게 이해하고 일차부등식의 해를 수직선 위에 올바르게 나타냄",
      "해각이 복잡한 연립방정식에서 대입법을 적절히 활용하여 빠르고 정확하게 해를 찾아냄",
      "문장제 기술 문제에서 미지수를 알맞게 설정하고 방정식을 세우는 모델링 능력이 탁월함"
    ],
    weaknesses: [
      "계수가 소수 또는 분수 형태로 주어질 때 전체 항에 양수를 곱하며 부호를 누락하는 연산 실수 주의",
      "부등식의 양변에 음수를 곱하거나 나눌 때 부동호 방향을 순간적으로 착각하는 습관 존재"
    ],
    studyPlan: [
      "매일 아침 10분씩 복잡한 계수(소수/분수 혼합형) 연립방정식 연산 연습 5문항씩 풀기",
      "부등식 단원 학습 시 '음수로 나누기' 단계가 포함된 문항에 형광펜 투입하여 시각적 오류 예방 조치",
      "자신만의 '인공지능 오답 노트'를 작성하여 실수 패턴(주로 이항 단계의 부호 실수)을 누적 기록하고 분석하기"
    ],
    questions: [
      {
        number: "1",
        content: "다음 중 일차부등식인 것을 모두 고르고, 그 해를 수직선 위에 바르게 나타내시오.",
        studentAnswer: "ㄱ, ㄹ (바르게 그림)",
        correctAnswer: "ㄱ, ㄹ",
        status: "correct" as const,
        explanation: "주어진 식들 중에서 최고차항이 1차인 부등식을 올바르게 감별하였습니다. 부동호의 방향에 맞추어 검은 동그라미(포함)와 흰 동그라미(미포함)를 명확히 구분하여 해의 영역을 표시했습니다."
      },
      {
        number: "2",
        content: "연립방정식 2x + y = 7, 3x - 2y = 7 의 해를 대입법을 이용하여 구하시오.",
        studentAnswer: "x = 3, y = 1",
        correctAnswer: "x = 3, y = 1",
        status: "correct" as const,
        explanation: "첫 번째 식에서 y = 7 - 2x로 변형한 뒤 두 번째 식에 대입하는 계산 과정을 군더더기 없이 깔끔히 완수했습니다. 3x - 2(7 - 2x) = 7 식의 분배법칙을 철저히 수행했습니다."
      },
      {
        number: "3",
        content: "소수가 포함된 연립방정식 0.3x - 0.2y = 0.8, x + 0.5y = 1 의 해를 구하시오.",
        studentAnswer: "x = 2, y = -1",
        correctAnswer: "x = 2, y = -1",
        status: "correct" as const,
        explanation: "첫 번재 양변에 10을 곱하고 두 번째 양변에 2 혹은 10을 고르게 분배하여 계수를 정수(3x-2y=8, 2x+y=2)로 전환 후 잘 대입 해결했습니다."
      },
      {
        number: "4",
        content: "거리, 속력, 시간 문장제 문제: 집에서 도서관까지 4km 거리를 가는데 처음엔 시속 3km로 걷다가 도중에 시속 6km로 달려서 1시간 만에 도착했다. 걸어간 거리를 구하시오.",
        studentAnswer: "2 km",
        correctAnswer: "2 km",
        status: "correct" as const,
        explanation: "걸어간 거리를 x km, 달린 거리를 (4-x) km로 합산 4km 관계식을 정밀 설계하였고, 거/속/시 분수 시간 방정식 x/3 + (4-x)/6 = 1 식을 유연하게 해결했습니다."
      },
      {
        number: "5",
        content: "연립방정식 0.2x + 0.5y = 1.1, 1/3x + 1/4y = 1 의 해를 입증하시오.",
        studentAnswer: "x = 2, y = 1.2 (오답)",
        correctAnswer: "x = 3, y = 1",
        status: "incorrect" as const,
        explanation: "첫 식에 10을 곱해 2x + 5y = 11을 얻는 과정은 좋았으나, 둘째 식 분모 최소공배수인 12를 곱할 때 상수항 1에 곱하지 않고 3x + 4y = 1 로 처리하여 최초 계수 전개 오류가 발생했습니다. 양변 전체 항에 동일 계수를 곱해야 함을 철저히 상기하세요."
      },
      {
        number: "6",
        content: "다음 일차부등식 3(x - 1) < 5x + 7 을 만족하는 최소의 정수 x를 구하시오.",
        studentAnswer: "-4",
        correctAnswer: "-4",
        status: "correct" as const,
        explanation: "3x - 3 < 5x + 7 에서 이항을 통해 -2x < 10 을 도출했고, 양변을 음수인 -2로 나누는 과정에서 부등호 방향을 x > -5로 반전 적용하여 가장 작은 정수로 -4를 맞받아 정답 처리했습니다. 훌륭한 개념 연계입니다."
      }
    ]
  },
  {
    id: "english",
    name: "고3 영어 - 핵심 빈칸 추론 & 구문 독해",
    subject: "영어",
    title: "대학수학능력시험 모의평가 외국어영역",
    score: 60,
    totalQuestions: 5,
    correctCount: 3,
    incorrectCount: 2,
    overallSummary: "글의 전반적인 요지 파악과 간단한 문맥적 어휘 추론 능력은 양호한 상태입니다. 하지만 추상적 논리가 결부된 빈칸 추론 문제와 고난도 역접 접속사가 중첩된 복잡한 핵심 구문 독해에서 키워드의 인과관계를 반대로 해석하는 경향이 짙습니다. 독해 시 주절과 성분 관계의 절 끊어읽기 습관을 체화한다면 안정적인 상위 등급 진입이 가능합니다.",
    strengths: [
      "쉬운 난이도의 대의 파악 및 글의 일관성 확인 흐름 문항에서 주제를 놓치지 않는 집중력",
      "필수 영어 수능 단어 및 빈출 문법(동시상황 분사구문 등)의 탄탄한 기본기 보유"
    ],
    weaknesses: [
      "관계대명사 이중 수식 절이나 긴 수식어가 주어를 뒤흔들 때 주어-동사 수식 대상 혼동",
      "이중 부정이 적용된 빈칸 선택지에서 부정을 간과하고 반대 감정의 단어를 선택함"
    ],
    studyPlan: [
      "하루 3문항씩 복잡한 다중 관계사절 구문 구조 분석(구문 분석 노트 작성 및 펜 분석) 진행",
      "빈칸 문장을 먼저 읽고 필자가 주장하는 뉘앙스 정답 단서 미리 우리말로 추론한 뒤 선지 비교 학습",
      "문장 간 관계를 지시해주는 연결어(Otherwise, However, Nonetheless) 기능 카드 암기"
    ],
    questions: [
      {
        number: "1",
        content: "다음 글의 밑줄 친 부분 중 문맥상 낱말의 쓰임이 적절하지 않은 것은?",
        studentAnswer: "3번 (바르게 맞춤)",
        correctAnswer: "3번",
        status: "correct" as const,
        explanation: "글 전체의 논조가 신재생 에너지의 '한계성'을 지적하고 있음에도 단독으로 호의적인 단어가 사용된 3번 'boundless'를 매끄럽게 포착했습니다."
      },
      {
        number: "2",
        content: "다음 빈칸에 들어갈 말로 가장 적절한 것을 고르시오. [과학적 환원주의의 한계와 유기적 통합]",
        studentAnswer: "1번 (오답 - 주제와 정반대 개념)",
        correctAnswer: "4번",
        status: "incorrect" as const,
        explanation: "전형적인 고난도 빈칸 문항입니다. 본문은 개별 구성요소의 단순 합만으로는 생명 개체를 설명할 수 없다는 내용(유기주의)인 반면, 1번 선지는 '요소의 환원성'을 지지하는 내용입니다. 빈칸 바로 앞에 명시된 부정어 'cannot be understood by'를 결합시키지 못하고 주제어의 단어만 보고 성급히 마킹한 것으로 판단됩니다."
      },
      {
        number: "3",
        content: "글의 흐름으로 보아, 주어진 문장이 들어가기에 가장 알맞은 곳을 고르시오.",
        studentAnswer: "4번 (바르게 맞춤)",
        correctAnswer: "4번",
        status: "correct" as const,
        explanation: "주어진 문장의 연결 단서인 'Instead'와 앞 문장의 부정 진술 'not merely an illusion'의 자연스러운 인과 흐름을 명석하게 공략하여 아주 긍정적인 추론을 유도해 냈습니다."
      },
      {
        number: "4",
        content: "다음 글의 주제로 가장 적절한 것을 고르시오. [정보화 시대의 개인정보 침해 및 자기결정권 저해]",
        studentAnswer: "2번 (바르게 맞춤)",
        correctAnswer: "2번",
        status: "correct" as const,
        explanation: "반복 지시되는 'privacy encroachment'와 'digital footprint'를 결합하여 정보 통제력 상실 우려에 대한 정답 2번 핵심 선지를 영민하게 골라냈습니다."
      },
      {
        number: "5",
        content: "다음 글의 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은?",
        studentAnswer: "1번 (오답)",
        correctAnswer: "2번",
        status: "incorrect" as const,
        explanation: "(A)에는 순접인 'For instance'가 알맞게 포진되었으나, (B)에서 예외 사항의 대조를 가리키는 역접 부사 'However' 대신 단순 나열인 'In addition'을 골라 실수했습니다. 대조를 기점으로 글의 화제 성격이 반비례하는 흐름을 면밀히 살피는 버릇이 필요합니다."
      }
    ]
  }
];

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("인공지능 가동 테스트 중...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  
  // Custom states for interactive view
  const [expandedQuestion, setExpandedQuestion] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<"summary" | "weaknesses" | "plan">("summary");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto step messages animation during analysis
  const triggerLoadingAnimation = () => {
    const steps = [
      "시험지 이미지를 정적 행렬 데이터로 인코딩하는 중...",
      "수식 알고리즘 및 국영수 지문 파싱 완료 중...",
      "학생이 손글씨로 적은 마킹 및 필기 분석 중...",
      "각 문항별 맞춤형 정오답 대조 시험 채점 단계 가동 중...",
      "틀린 문항 분석 및 오답 극복 행동 가강 전략 산출 중...",
      "종합 학습 클리닉 피드백 보고서 완성을 기다리는 중..."
    ];
    let index = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      index++;
      if (index < steps.length) {
        setLoadingStep(steps[index]);
      } else {
        clearInterval(interval);
      }
    }, 2800);
    return interval;
  };

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handler for file drop and select
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setErrorMsg("이미지 파일(.png, .jpg, .jpeg)만 업로드할 수 있습니다.");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setErrorMsg("이미지 파일만 지원됩니다.");
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Run Real AI Analysis call
  const startAnalysis = async () => {
    if (!previewUrl) return;
    setIsLoading(true);
    setErrorMsg(null);
    const animInterval = triggerLoadingAnimation();

    try {
      // Find base64 representation of image
      let base64Image = "";
      if (selectedFile) {
        base64Image = await fileToBase64(selectedFile);
      } else {
        // If it's a mock preview URL that isn't a File, we convert it or it's a fallback
        base64Image = previewUrl;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Image,
          mimeType: selectedFile?.type || "image/jpeg"
        }),
      });

      clearInterval(animInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `서버 응답 오류 (코드: ${response.status})`);
      }

      const data = await response.json();
      setResult(data);
      
      // Auto-expand newly annotated incorrect answers for study
      const initialExpand: { [key: string]: boolean } = {};
      data.questions.forEach((q: any) => {
        if (q.status === "incorrect") {
          initialExpand[q.number] = true;
        }
      });
      setExpandedQuestion(initialExpand);

    } catch (err: any) {
      clearInterval(animInterval);
      console.error(err);
      setErrorMsg(err.message || "시험지 해석 서버에 접속할 수 없습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load a sample preset directly for high-fidelity demonstration
  const loadPreset = (presetId: string) => {
    const found = PRESET_SAMPLES.find(p => p.id === presetId);
    if (found) {
      setErrorMsg(null);
      // Construct a simulated preview or use a styled SVG representation
      setPreviewUrl("preset:" + presetId);
      setSelectedFile(null);
      setResult(found as any);
      
      const initialExpand: { [key: string]: boolean } = {};
      found.questions.forEach((q) => {
        if (q.status === "incorrect") {
          initialExpand[q.number] = true;
        }
      });
      setExpandedQuestion(initialExpand);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setErrorMsg(null);
    setExpandedQuestion({});
  };

  const toggleQuestionExpanded = (num: string) => {
    setExpandedQuestion(prev => ({
      ...prev,
      [num]: !prev[num]
    }));
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] text-[#1a2744] flex flex-col justify-between selection:bg-[#f97316] selection:text-white" id="test-paper-analyzer-root">
      {/* Upper Navigation/Header Bar */}
      <header className="border-b border-[#1a2744]/10 bg-white/60 backdrop-blur-md sticky top-0 z-40 transition-all duration-300" id="main-header">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3" id="brand-logo">
            <div className="w-10 h-10 rounded-xl bg-[#1a2744] flex items-center justify-center shadow-md">
              <FileText className="w-5.5 h-5.5 text-[#f5f0eb]" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-[#1a2744]">시험지 분석기</span>
              <span className="ml-2 text-xs font-semibold bg-[#f97316]/10 text-[#f97316] px-2 py-0.5 rounded-full inline-block">Vision AI</span>
            </div>
          </div>
          {result && (
            <button 
              id="retry-nav-btn"
              onClick={handleReset}
              className="flex items-center space-x-2 text-sm font-medium hover:text-[#f97316] transition-colors bg-[#1a2744]/5 px-3 py-1.5 rounded-lg border border-[#1a2744]/10"
            >
              <RotateCcw className="w-4 h-4" />
              <span>새 시험지 올리기</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 md:py-12" id="main-content-layout">
        
        {/* Step 1: Initial Upload Form Screen */}
        {!result && !isLoading && (
          <div className="max-w-2xl mx-auto space-y-10" id="upload-stage-section">
            
            {/* Title introduction */}
            <div className="text-center space-y-3" id="intro-headings">
              <h1 className="text-4xl md:text-5xl font-black text-[#1a2744] tracking-tight leading-tight">
                시험지 분석기
              </h1>
              <p className="text-base md:text-lg text-[#1a2744]/70 font-medium">
                시험지 사진을 업로드하면 AI가 자동으로 채점하고 원인 분석과 오답 대책을 제시합니다.
              </p>
            </div>

            {/* Drag & Drop uploader card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#1a2744]/10 space-y-6" id="uploader-box">
              <div 
                id="dropzone-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-3 border-dashed rounded-2xl p-10 cursor-pointer transition-all flex flex-col items-center justify-center text-center group ${
                  previewUrl 
                    ? "border-[#f97316] bg-[#f97316]/3" 
                    : "border-[#1a2744]/20 hover:border-[#f97316]/50 bg-[#1a2744]/2 hover:bg-[#1a2744]/3"
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                  id="exam-file-input"
                />

                {previewUrl ? (
                  <div className="relative max-w-xs w-full overflow-hidden rounded-xl shadow-md border border-[#1a2744]/15 aspect-3/4 bg-stone-100" id="file-preview-card">
                    {previewUrl.startsWith("preset:") ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#1a2744]/5 to-[#f97316]/5 text-[#1a2744]">
                        <FileText className="w-12 h-12 mb-2 text-[#f97316]" />
                        <p className="font-bold text-sm">체험용 시험지</p>
                        <p className="text-xs text-[#1a2744]/60 text-center mt-1">Preset Template Loaded</p>
                      </div>
                    ) : (
                      <img 
                        src={previewUrl} 
                        alt="시험지 미리보기" 
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-sm font-semibold">
                      다른 사진으로 변경하려면 클릭
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-4 flex flex-col items-center" id="empty-state-icons">
                    <div className="w-16 h-16 rounded-full bg-[#f97316]/10 text-[#f97316] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-bold text-lg text-[#1a2744]">시험지 사진을 여기에 놓거나 클릭하세요</p>
                      <p className="text-sm text-[#1a2744]/60">JPEG, PNG, WEBP 등 지원 • 최대 15MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3" id="analysis-trigger-block">
                {previewUrl && (
                  <button
                    id="trigger-analysis-btn"
                    onClick={startAnalysis}
                    className="w-full h-14 bg-[#f97316] text-white hover:bg-[#ea580c] active:translate-y-0.5 rounded-2xl font-bold text-lg shadow-lg shadow-[#f97316]/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span>분석 시작</span>
                  </button>
                )}

                {errorMsg && (
                  <div className="bg-red-50 text-red-900 border border-red-200 p-4 rounded-xl flex items-start space-x-3 shadow-sm animate-fade-in" id="error-alert">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-sm font-semibold">{errorMsg}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Demo Segment with high quality preset cards */}
            <div className="space-y-4" id="preset-demonstrators">
              <h3 className="text-center font-bold text-sm tracking-wider uppercase text-[#1a2744]/50">
                시험 삼아 바로 확인해보는 AI 채점 샘플
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="preset-grid">
                {PRESET_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => loadPreset(sample.id)}
                    className="bg-white hover:bg-[#1a2744]/3 border border-[#1a2744]/8 hover:border-[#f97316]/40 p-5 rounded-2xl text-left transition-all hover:shadow-md cursor-pointer flex items-center justify-between group"
                    id={`preset-btn-${sample.id}`}
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold bg-[#1a2744]/5 text-[#1a2744] px-2.5 py-1 rounded-full">
                        {sample.subject}
                      </span>
                      <h4 className="font-bold text-[#1a2744] group-hover:text-[#f97316] transition-colors pt-1">
                        {sample.name}
                      </h4>
                      <p className="text-xs text-[#1a2744]/60">전체 문항 {sample.totalQuestions}개 • 오답률 {Math.round((sample.incorrectCount / sample.totalQuestions) * 100)}%</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#f97316]/5 text-[#f97316] flex items-center justify-center group-hover:bg-[#f97316]/10 shrink-0 select-none">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Step 2: Loading State Overlay */}
        {isLoading && (
          <div className="max-w-md mx-auto py-16 text-center space-y-8 animate-pulse" id="loading-fallback-panel">
            <div className="relative inline-block" id="rotating-icon-host">
              <div className="w-24 h-24 rounded-full border-4 border-[#f97316]/10 border-t-[#f97316] animate-spin"></div>
              <Sparkles className="w-10 h-10 text-[#f97316] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-[#1a2744]">시험지를 정밀 채점하는 중</h3>
              <p className="text-[#1a2744]/60 text-sm font-bold min-h-12 flex items-center justify-center px-4 bg-white/50 py-3 rounded-xl border border-[#1a2744]/5">
                {loadingStep}
              </p>
            </div>
            <p className="text-xs text-[#1a2744]/40">잠시만 기다려 주세요. 30초 내외가 소요됩니다.</p>
          </div>
        )}

        {/* Step 3: High-Fidelity Diagnostic report outcome dashboard */}
        {result && !isLoading && (
          <div className="space-y-8 animate-fade-in" id="evaluation-outcome-view">
            
            {/* Subject and exam paper info card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#1a2744]/10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6" id="summary-billboard">
              {/* Highlight ribbon decor */}
              <div className="absolute top-0 left-0 w-2 h-full bg-[#f97316]" />
              
              <div className="space-y-2 md:pl-3" id="exam-metadata-text">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white bg-[#1a2744] px-3 py-1 rounded-full uppercase tracking-wider">
                    {result.subject}
                  </span>
                  <span className="text-xs font-bold text-[#f97316] bg-[#f97316]/10 px-3 py-1 rounded-full">
                    AI 리포트 발급 완료
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-[#1a2744]">
                  {result.title || "시험지 분석 리포트"}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-[#1a2744]/70 font-semibold pt-1">
                  <span>총 문항: {result.totalQuestions || result.questions.length}개</span>
                  <span>정답 수: <strong className="text-emerald-600">{result.correctCount}</strong></span>
                  <span>오답 수: <strong className="text-[#f97316]">{result.incorrectCount}</strong></span>
                </div>
              </div>

              {/* Outstanding Badge Score Ring */}
              <div className="flex flex-col items-center bg-[#f5f0eb]/70 border border-[#1a2744]/10 p-5 rounded-2xl justify-center shrink-0 w-full md:w-auto" id="score-meter-widget">
                <p className="text-xs font-bold text-[#1a2744]/60 tracking-widest uppercase mb-1">환산 점수</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-5xl font-black text-[#f97316] tracking-tight">{result.score ?? Math.round((result.correctCount / (result.totalQuestions || result.questions.length)) * 100)}</span>
                  <span className="text-lg font-bold text-[#1a2744]/50">/ 100점</span>
                </div>
              </div>
            </div>

            {/* Comprehensive AI Clinic Diagnoses Segment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="diagnostics-grid-layout">
              
              {/* Left Column: Comprehensive analysis (Overall tab layout) */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-[#1a2744]/15 shadow-md flex flex-col justify-between" id="comprehensive-tab-container">
                <div className="space-y-6">
                  {/* Tabs */}
                  <div className="flex border-b border-[#1a2744]/5 pb-3 space-x-2" id="detail-category-tabs">
                    <button
                      id="tab-summary-btn"
                      onClick={() => setActiveTab("summary")}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        activeTab === "summary"
                          ? "bg-[#1a2744] text-white shadow-sm"
                          : "text-[#1a2744]/60 hover:text-[#1a2744] hover:bg-[#1a2744]/5"
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>총평 및 종합 진단</span>
                    </button>
                    <button
                      id="tab-weaknesses-btn"
                      onClick={() => setActiveTab("weaknesses")}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        activeTab === "weaknesses"
                          ? "bg-[#1a2744] text-white shadow-sm"
                          : "text-[#1a2744]/60 hover:text-[#1a2744] hover:bg-[#1a2744]/5"
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>장약점 프로필</span>
                    </button>
                    <button
                      id="tab-plan-btn"
                      onClick={() => setActiveTab("plan")}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        activeTab === "plan"
                          ? "bg-[#1a2744] text-white shadow-sm"
                          : "text-[#1a2744]/60 hover:text-[#1a2744] hover:bg-[#1a2744]/5"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>학습 클리닉 대책</span>
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="min-h-56 py-2" id="tab-content-panel">
                    {activeTab === "summary" && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center space-x-2 text-md font-bold text-[#1a2744]">
                          <Activity className="w-5 h-5 text-[#f97316]" />
                          <span>AI 추천 격려 피드백</span>
                        </div>
                        <p className="text-[#1a2744]/80 leading-relaxed text-sm md:text-base font-medium bg-[#f5f0eb]/30 p-5 rounded-2xl border border-[#1a2744]/5">
                          {result.overallSummary}
                        </p>
                      </div>
                    )}

                    {activeTab === "weaknesses" && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="space-y-3">
                          <h4 className="text-sm font-black text-emerald-700 tracking-wider flex items-center space-x-1.5 uppercase">
                            <span className="w-1.5 h-3 bg-emerald-500 rounded-full inline-block" />
                            <span>보유 중인 핵심 강점 (Strengths)</span>
                          </h4>
                          <ul className="grid grid-cols-1 gap-2">
                            {result.strengths.map((str, idx) => (
                              <li key={idx} className="flex items-start space-x-2.5 text-sm bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="font-semibold text-emerald-950">{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-black text-amber-800 tracking-wider flex items-center space-x-1.5 uppercase">
                            <span className="w-1.5 h-3 bg-[#f97316] rounded-full inline-block" />
                            <span>추가 보완이 시급한 약점 (Weaknesses)</span>
                          </h4>
                          <ul className="grid grid-cols-1 gap-2">
                            {result.weaknesses.map((weak, idx) => (
                              <li key={idx} className="flex items-start space-x-2.5 text-sm bg-orange-50/40 p-3 rounded-xl border border-orange-100">
                                <AlertCircle className="w-4 h-4 text-[#f97316] shrink-0 mt-0.5" />
                                <span className="font-semibold text-orange-950">{weak}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === "plan" && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center space-x-2 text-md font-bold text-[#1a2744] mb-3">
                          <Sparkles className="w-5 h-5 text-[#f97316]" />
                          <span>성적 향상을 위한 단기 액션 플랜</span>
                        </div>
                        <div className="space-y-3">
                          {result.studyPlan.map((plan, idx) => (
                            <div key={idx} className="flex items-start space-x-3.5 bg-sky-50/30 p-4 rounded-xl border border-sky-100/50">
                              <span className="w-6 h-6 rounded-lg bg-[#1a2744] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="font-semibold text-[#1a2744] text-sm">{plan}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1a2744]/5 flex items-center justify-between text-xs text-[#1a2744]/50 font-semibold" id="audit-signature">
                  <span>실시간 개방형 질문 분석 • Gemini 3.5 Engine</span>
                  <span>분석일시: 금일</span>
                </div>
              </div>

              {/* Right Column: Mini score status visual ring or pie layout */}
              <div className="bg-[#1a2744] text-[#f5f0eb] rounded-3xl p-6 md:p-8 shadow-md flex flex-col justify-between space-y-6" id="score-proportion-card">
                <div className="space-y-4" id="visual-guage-block">
                  <h3 className="text-lg font-black text-white flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-[#f97316]" />
                    <span>정답률 지표</span>
                  </h3>
                  
                  {/* Svg visual ring */}
                  <div className="flex justify-center py-4" id="circular-gauge">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full transform -rotate-90">
                        {/* Under track */}
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="68" 
                          className="stroke-white/10" 
                          strokeWidth="12" 
                          fill="none" 
                        />
                        {/* Progress */}
                        <circle 
                          cx="80" 
                          cy="80" 
                          r="68" 
                          className="stroke-[#f97316]" 
                          strokeWidth="12" 
                          fill="none" 
                          strokeDasharray={2 * Math.PI * 68}
                          strokeDashoffset={2 * Math.PI * 68 * (1 - (result.correctCount / (result.totalQuestions || result.questions.length)))}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Percent typography centered */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white tracking-tighter">
                          {Math.round((result.correctCount / (result.totalQuestions || result.questions.length)) * 100)}%
                        </span>
                        <span className="text-[10px] font-black text-[#f5f0eb]/50 tracking-wider">정답 비율</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5" id="metric-grid-mini">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70 font-semibold">맞춘 문항 수</span>
                    <span className="font-extrabold text-emerald-400">{result.correctCount} / {result.totalQuestions || result.questions.length}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full rounded-full" 
                      style={{ width: `${(result.correctCount / (result.totalQuestions || result.questions.length)) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="text-white/70 font-semibold">틀린 문항 수</span>
                    <span className="font-extrabold text-[#f97316]">{result.incorrectCount} / {result.totalQuestions || result.questions.length}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#f97316] h-full rounded-full" 
                      style={{ width: `${(result.incorrectCount / (result.totalQuestions || result.questions.length)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-white/50 text-center font-medium">
                  문제를 틀려보는 것만큼 확실한 성장의 원천은 없습니다. 오무노동 오답분석을 통해 탄탄히 다져나가세요!
                </div>
              </div>

            </div>

            {/* Individual detailed question analysis */}
            <div className="space-y-4" id="individual-problems-container">
              <h3 className="text-xl font-black text-[#1a2744] flex items-center space-x-2">
                <BookOpen className="w-5.5 h-5.5 text-[#f97316]" />
                <span>문항별 채점 & 해설 분석 리포트</span>
              </h3>

              <div className="grid grid-cols-1 gap-4" id="questions-list-view">
                {result.questions.map((q) => {
                  const isCorrect = q.status === "correct";
                  const isExpanded = !!expandedQuestion[q.number];
                  
                  return (
                    <div 
                      key={q.number}
                      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isExpanded 
                          ? "ring-2 ring-[#1a2744]/10 shadow-md" 
                          : "hover:border-[#1a2744]/20 hover:shadow-sm"
                      } ${isCorrect ? "border-[#1a2744]/8" : "border-[#f97316]/20 bg-orange-50/5"}`}
                      id={`question-box-${q.number}`}
                    >
                      {/* Top accordion preview row */}
                      <div 
                        onClick={() => toggleQuestionExpanded(q.number)}
                        className="p-5 flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center space-x-4">
                          {/* Circle Badge indicating correct/incorrect */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isCorrect 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-orange-50 text-[#f97316] border border-orange-100"
                          }`} id={`status-icon-${q.number}`}>
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-[#1a2744]">문제 {q.number}번</span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isCorrect 
                                  ? "bg-emerald-100 text-emerald-800" 
                                  : "bg-orange-100 text-orange-850"
                              }`}>
                                {isCorrect ? "맞춤" : "오답"}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-[#1a2744]/80 mt-1 line-clamp-1 max-w-xl">
                              {q.content}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-[#1a2744]/50">
                          <span className="text-xs font-bold hidden sm:inline">상세 풀이</span>
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Expanded detail box */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-dashed border-[#1a2744]/5 animate-slide-down space-y-4" id={`extended-detail-${q.number}`}>
                          {/* Answers summary column */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id={`answer-contrast-${q.number}`}>
                            <div className="bg-[#f5f0eb]/50 p-3 rounded-xl border border-[#1a2744]/5 text-sm">
                              <span className="text-[#1a2744]/50 font-bold block mb-1 text-xs">작성한 답변</span>
                              <p className="font-extrabold text-[#1a2744] truncate">{q.studentAnswer || "(미기입)"}</p>
                            </div>
                            <div className="bg-[#1a2744]/3 p-3 rounded-xl border border-[#1a2744]/5 text-sm">
                              <span className="text-[#1a2744]/50 font-bold block mb-1 text-xs">정답 기준</span>
                              <p className="font-extrabold text-[#f97316] truncate">{q.correctAnswer}</p>
                            </div>
                          </div>

                          {/* Analysis and solution */}
                          <div className="space-y-1.5" id={`explanation-box-${q.number}`}>
                            <span className="text-[#1a2744]/50 font-bold block text-xs">AI 입체 클리닉 및 복습 핵심</span>
                            <div className="bg-[#1a2744]/2 p-4 rounded-xl border border-[#1a2744]/5 text-sm font-medium leading-relaxed text-[#1a2744]/90 space-y-2">
                              <p className="whitespace-pre-line">{q.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom operational tools */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6" id="bottom-controls">
              <button 
                id="redo-operation-btn"
                onClick={handleReset}
                className="w-full sm:w-auto h-12 bg-[#1a2744] hover:bg-[#11192e] text-white flex items-center justify-center space-x-2 px-6 rounded-xl font-bold transition-all shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>다른 시험지 채점하기</span>
              </button>
              <p className="text-xs text-[#1a2744]/50 font-semibold">
                * 오분석이나 누락이 발견될 경우 시험지 사진을 다시 올바르게 촬영해 업로드해 보세요.
              </p>
            </div>

          </div>
        )}

      </main>

      {/* Styled Footer */}
      <footer className="border-t border-[#1a2744]/10 bg-white/60 py-6 text-center" id="service-footer">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold text-[#1a2744]/50">
          <p>© 2026 시험지 분석기. All rights reserved.</p>
          <div className="flex space-x-4">
            <span>Powered by Gemini 3.5 Flash</span>
            <span className="text-[#f97316]">AI Smart Grader</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
