import { aiRouter } from "../ai/provider-router";
import { parseInterviewResponse } from "../ai/parser";
import { AiMessage, AiInterviewResponse } from "../ai/types";
import { loadPrompt, interpolatePrompt } from "../prompts/prompt-loader";
import { prisma } from "../db/prisma";

type OutputLanguage = "id" | "en";

/**
 * Generates a deterministic fallback question when AI generation fails
 */
function generateFallbackQuestion(answerCount: number, outputLanguage: OutputLanguage): AiInterviewResponse {
  const fallbackQuestions = outputLanguage === "id"
    ? [
        {
          stage: "Target Pengguna",
          question: "Siapa pengguna utama produk ini?",
          reason: "Informasi ini dibutuhkan untuk menentukan alur utama dan prioritas MVP.",
          completenessScore: 15,
          options: [
            { label: "Pengguna akhir / pelanggan", value: "option_a" },
            { label: "Tim internal / admin", value: "option_b" },
            { label: "Keduanya", value: "option_c" },
          ],
        },
        {
          stage: "Masalah Utama",
          question: "Masalah utama apa yang paling harus diselesaikan produk ini?",
          reason: "Masalah utama menentukan fokus solusi dan batasan MVP.",
          completenessScore: 25,
          options: [
            { label: "Proses masih manual dan lambat", value: "option_a" },
            { label: "Data sulit dipantau atau dikelola", value: "option_b" },
            { label: "Kolaborasi tim belum terstruktur", value: "option_c" },
          ],
        },
        {
          stage: "Ruang Lingkup MVP",
          question: "Kemampuan apa yang wajib masuk versi MVP pertama?",
          reason: "Ruang lingkup MVP membantu memprioritaskan fitur yang paling penting.",
          completenessScore: 40,
          options: [
            { label: "Fitur inti untuk input dan kelola data", value: "option_a" },
            { label: "Fitur inti plus pencarian dan filter", value: "option_b" },
            { label: "Fitur lengkap dengan integrasi dasar", value: "option_c" },
          ],
        },
        {
          stage: "Role Pengguna",
          question: "Role pengguna apa saja yang membutuhkan akses berbeda?",
          reason: "Role pengguna membantu menentukan izin akses dan alur kerja.",
          completenessScore: 55,
          options: [
            { label: "Satu jenis pengguna saja", value: "option_a" },
            { label: "Admin dan pengguna biasa", value: "option_b" },
            { label: "Beberapa role dengan izin berbeda", value: "option_c" },
          ],
        },
        {
          stage: "Data Produk",
          question: "Data apa saja yang perlu disimpan oleh produk ini?",
          reason: "Data utama dibutuhkan untuk merancang database dan relasi fitur.",
          completenessScore: 70,
          options: [
            { label: "Data sederhana tanpa banyak relasi", value: "option_a" },
            { label: "Beberapa data yang saling berhubungan", value: "option_b" },
            { label: "Data kompleks dengan histori atau status", value: "option_c" },
          ],
        },
        {
          stage: "Risiko dan Batasan",
          question: "Batasan terbesar apa yang perlu diperhatikan di versi pertama?",
          reason: "Batasan awal membantu mengurangi risiko implementasi.",
          completenessScore: 82,
          options: [
            { label: "Performa dan skalabilitas", value: "option_a" },
            { label: "Keamanan dan akses data", value: "option_b" },
            { label: "Integrasi dengan sistem lain", value: "option_c" },
          ],
        },
      ]
    : [
        {
          stage: "Discovery",
          question: "Who are the primary users or target audience for this product?",
          reason: "Understanding your target users helps define the product scope and features that will matter most.",
          completenessScore: 15,
          options: [
            { label: "General consumers/end users", value: "option_a" },
            { label: "Business professionals/enterprises", value: "option_b" },
            { label: "Technical users/developers", value: "option_c" },
          ],
        },
        {
          stage: "Problem Definition",
          question: "What is the core problem or pain point this product solves?",
          reason: "Clearly defining the problem ensures the product addresses real user needs.",
          completenessScore: 25,
          options: [
            { label: "Efficiency/time-saving problem", value: "option_a" },
            { label: "Communication/collaboration challenge", value: "option_b" },
            { label: "Data management/organization issue", value: "option_c" },
          ],
        },
        {
          stage: "MVP Scope",
          question: "What are the must-have features for the minimum viable product?",
          reason: "Defining MVP scope helps prioritize development and get to market faster.",
          completenessScore: 40,
          options: [
            { label: "Core CRUD operations only", value: "option_a" },
            { label: "Basic features + search/filter", value: "option_b" },
            { label: "Full feature set with integrations", value: "option_c" },
          ],
        },
        {
          stage: "User Roles",
          question: "What different user roles or permission levels will the system need?",
          reason: "Understanding user roles helps design appropriate access controls and workflows.",
          completenessScore: 55,
          options: [
            { label: "Single user type, no roles", value: "option_a" },
            { label: "Admin and regular users", value: "option_b" },
            { label: "Multiple roles with granular permissions", value: "option_c" },
          ],
        },
        {
          stage: "Data Model",
          question: "What are the key data entities or objects the system will manage?",
          reason: "Identifying core entities helps structure the database and define relationships.",
          completenessScore: 70,
          options: [
            { label: "Simple flat data structure", value: "option_a" },
            { label: "Relational entities with associations", value: "option_b" },
            { label: "Complex hierarchical/nested data", value: "option_c" },
          ],
        },
        {
          stage: "Constraints & Risks",
          question: "What are the main technical challenges, constraints, or risks for this project?",
          reason: "Identifying risks early allows for better planning and mitigation strategies.",
          completenessScore: 82,
          options: [
            { label: "Performance/scalability concerns", value: "option_a" },
            { label: "Security/compliance requirements", value: "option_b" },
            { label: "Integration/third-party dependencies", value: "option_c" },
          ],
        },
      ];

  // If we have 6 or more answers, signal ready to generate
  if (answerCount >= 6) {
    return {
      status: "ready_to_generate",
      currentStage: outputLanguage === "id" ? "Siap Generate" : "Complete",
      question: outputLanguage === "id"
        ? "Konteks sudah cukup. Mau generate PRD sekarang?"
        : "Thank you for providing the information. We now have enough details to generate your PRD.",
      reason: outputLanguage === "id"
        ? "Semua aspek penting sudah cukup tercakup."
        : "All essential aspects have been covered.",
      options: [],
      allowCustom: false,
      completenessScore: 90,
      metadata: {
        provider: "fallback",
        model: "deterministic",
      },
    };
  }

  // Otherwise return the appropriate fallback question
  const fallback = fallbackQuestions[answerCount] || fallbackQuestions[fallbackQuestions.length - 1];

  return {
    status: "asking",
    currentStage: fallback.stage,
    question: fallback.question,
    reason: fallback.reason,
    options: [
      ...fallback.options,
      { label: outputLanguage === "id" ? "Custom" : "Custom answer", value: "custom" },
    ],
    allowCustom: true,
    completenessScore: fallback.completenessScore,
    metadata: {
      provider: "fallback",
      model: "deterministic",
    },
  };
}

export class InterviewService {
  /**
   * Processes a user session and generates the next interview question
   */
  async generateNextQuestion(
    sessionId: string,
    providedHistory?: { role: "user" | "assistant"; content: string }[],
  ): Promise<AiInterviewResponse> {
    try {
      // Fetch project details and previous answers
      const project = await prisma.project.findUnique({
        where: { sessionId },
        include: {
          interviewAnswers: {
            orderBy: { sequenceNumber: "asc" },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found for session");
      }

      const outputLanguage = (project.outputLanguage === "en" ? "en" : "id") as OutputLanguage;
      const outputLanguageLabel = outputLanguage === "id" ? "Bahasa Indonesia" : "English";

      // 1. Construct History
      let history: AiMessage[] = providedHistory as AiMessage[] || [];

      if (!providedHistory || providedHistory.length === 0) {
        history = [{ role: "user", content: project.rawIdea }];

        for (const answer of project.interviewAnswers) {
          history.push({ role: "assistant", content: answer.question });
          history.push({ role: "user", content: answer.answer });
        }
      }

      // 2. Load system prompt
      const systemPromptTemplate = await loadPrompt("interview-system-prompt.md");

      const questionCount = project.interviewAnswers.length;
      const currentCompletenessScore = Math.min(100, questionCount * 10);

      const previousAnswersJson = JSON.stringify(
        project.interviewAnswers.map((a) => ({
          question: a.question,
          answer: a.answer,
        })),
        null,
        2,
      );

      const systemPrompt = interpolatePrompt(systemPromptTemplate, {
        RAW_IDEA: project.rawIdea,
        PREVIOUS_ANSWERS_JSON: previousAnswersJson,
        QUESTION_COUNT: questionCount.toString(),
        CURRENT_COMPLETENESS_SCORE: currentCompletenessScore.toString(),
        OUTPUT_LANGUAGE: outputLanguageLabel,
      });

      // 3. Prepare messages for AI
      const messages: AiMessage[] = [
        { role: "system", content: systemPrompt },
        ...history,
      ];

      // 4. Try AI generation, fallback to deterministic questions if it fails
      try {
        const response = await aiRouter.generate({
          task: "interview",
          messages,
        });

        // 5. Parse and validate response
        const parsedResponse = await parseInterviewResponse(response.content, history);

        return {
          ...parsedResponse,
          metadata: {
            provider: response.providerUsed,
            model: response.modelUsed,
            tokensUsed: response.tokensUsed,
          },
        };
      } catch (aiError) {
        // AI generation failed, use deterministic fallback
        console.warn("AI generation failed, using fallback question:", aiError);

        const fallbackResponse = generateFallbackQuestion(questionCount, outputLanguage);

        if (process.env.NODE_ENV === "development") {
          console.log(`[InterviewService] Using fallback question #${questionCount}, completeness: ${fallbackResponse.completenessScore}%`);
        }

        return fallbackResponse;
      }
    } catch (error) {
      // Database or other critical error
      console.error("Critical error in generateNextQuestion:", error);
      throw new Error("Failed to generate interview question");
    }
  }
}

export const interviewService = new InterviewService();