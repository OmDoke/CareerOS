import { EvaluationResult } from "../types/evaluation.types";

export const mapEvaluationToDb = (evaluation: EvaluationResult, model: string, tokensUsed: number) => {
  return {
    overallScore: evaluation.overallScore,
    technicalScore: evaluation.technicalScore,
    problemSolvingScore: evaluation.problemSolvingScore,
    communicationScore: evaluation.communicationScore,
    timeComplexityScore: evaluation.timeComplexityScore,
    spaceComplexityScore: evaluation.spaceComplexityScore,
    confidenceScore: evaluation.confidenceScore,
    
    strengths: JSON.stringify(evaluation.strengths || []),
    mistakes: JSON.stringify(evaluation.mistakes || []),
    missingConcepts: JSON.stringify(evaluation.missingConcepts || []),
    
    feedback: evaluation.feedback,
    correctAnswer: evaluation.correctAnswer || evaluation.correctCode || evaluation.idealAnswer || "",
    optimizedAnswer: evaluation.optimizedAnswer || evaluation.optimizedCode || "",
    
    resources: JSON.stringify(evaluation.resources || []),
    followUpQuestions: JSON.stringify(evaluation.followUpQuestions || []),
    
    evaluationJson: JSON.stringify(evaluation),
    evaluationModel: model,
    tokensUsed: tokensUsed,
    evaluatedAt: new Date(),
    
    score: evaluation.overallScore, // Backward compatibility for legacy score field
    aiFeedback: evaluation.feedback, // Backward compatibility
  };
};
