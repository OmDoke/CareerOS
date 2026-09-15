export interface EvaluationContext {
  targetRole: string;
  studyGoal: string;
  roadmapModule: string;
  currentTopic: string;
  currentWeakTopics: string[];
  currentStrongTopics: string[];
  resumeSummary: string;
  resumeSkills: string;
  questionType: string;
  difficulty: string;
  question: string;
  userAnswer: string;
  timeTaken?: number;
  previousAttempts: Array<{ question: string; score: number | null; status: string }>;
}
export const getEvaluationPrompt = (context: EvaluationContext) => {
  return `
You are a Senior Software Engineer, Technical Interviewer, and Career Coach.
Evaluate the user's answer to the following practice question.

USER CONTEXT:
- Target Role: ${context.targetRole}
- Goal: ${context.studyGoal}
- Roadmap Module: ${context.roadmapModule}
- Current Topic: ${context.currentTopic}
- Current Weak Topics: ${context.currentWeakTopics.join(", ")}
- Current Strong Topics: ${context.currentStrongTopics.join(", ")}

RESUME CONTEXT:
- Summary: ${context.resumeSummary}
- Skills: ${context.resumeSkills}

QUESTION DETAILS:
- Question Type: ${context.questionType}
- Difficulty: ${context.difficulty}
- Question: ${context.question}
- User Answer: ${context.userAnswer}
- Time Taken: ${context.timeTaken ? context.timeTaken + "s" : "N/A"}

PREVIOUS 5 ATTEMPTS:
${context.previousAttempts.map((a: any) => `- Question: ${a.question}, Score: ${a.score}, Status: ${a.status}`).join("\n")}

INSTRUCTIONS:
Evaluate the answer rigorously. Return ONLY a valid JSON object matching the exact schema provided below. Do not wrap it in markdown. Do not provide any explanation outside the JSON.

SCHEMA:
{
  "overallScore": number (0-100),
  "technicalScore": number (0-100),
  "problemSolvingScore": number (0-100),
  "communicationScore": number (0-100),
  "timeComplexityScore": number (0-100),
  "spaceComplexityScore": number (0-100),
  "confidenceScore": number (0-100),
  "strengths": [string],
  "mistakes": [string],
  "missingConcepts": [string],
  "feedback": string,
  "correctAnswer": string,
  "optimizedAnswer": string,
  "improvementPlan": [string],
  "resources": [string],
  "followUpQuestions": [string],
  "difficultyRecommendation": "EASY" | "MEDIUM" | "HARD",
  "topicMasteryDelta": number (between -10 and +10),
  
  // If question type is CODE, include:
  "correctCode"?: string,
  "optimizedCode"?: string,
  "complexityAnalysis"?: string,
  "dryRun"?: string,
  "alternativeSolution"?: string,
  "edgeCases"?: [string],
  "productionTips"?: [string],

  // If question type is THEORY, include:
  "idealAnswer"?: string,
  "interviewAnswer"?: string,
  "realWorldExample"?: string,
  "commonMistakes"?: [string],
  "relatedConcepts"?: [string]
}
`;
};
