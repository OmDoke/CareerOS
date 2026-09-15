export interface EvaluationContext {
  questionId: string;
  studyTaskId: string;
  studySessionId: string;
  roadmapTopicId: string;
  question: string;
  questionType: string;
  difficulty: string;
  userAnswer: string;
  timeTaken?: number;
  
  // From user/resume/roadmap data
  roadmapModule: string;
  currentTopic: string;
  targetRole: string;
  resumeSummary: string;
  resumeSkills: string;
  previousAttempts: Array<{ question: string; score: number | null; status: string }>;
  currentWeakTopics: string[];
  currentStrongTopics: string[];
  studyGoal: string;
}

export interface EvaluationResult {
  overallScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  timeComplexityScore: number;
  spaceComplexityScore: number;
  confidenceScore: number;
  
  strengths: string[];
  mistakes: string[];
  missingConcepts: string[];
  
  feedback: string;
  correctAnswer: string;
  optimizedAnswer: string;
  
  improvementPlan: string[];
  resources: string[];
  followUpQuestions: string[];
  
  difficultyRecommendation: "EASY" | "MEDIUM" | "HARD";
  topicMasteryDelta: number;
  
  // Code specific
  correctCode?: string;
  optimizedCode?: string;
  complexityAnalysis?: string;
  dryRun?: string;
  alternativeSolution?: string;
  edgeCases?: string[];
  productionTips?: string[];
  
  // Theory specific
  idealAnswer?: string;
  interviewAnswer?: string;
  realWorldExample?: string;
  commonMistakes?: string[];
  relatedConcepts?: string[];
}
