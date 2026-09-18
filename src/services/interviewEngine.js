/**
 * AI Interview Evaluation & Feedback Engine with Course Knowledge Alignment
 */

import { FILLER_WORDS } from './speechRecognition';
import { courseKnowledgeInstance } from './courseKnowledge';

export class InterviewEngine {
  /**
   * Evaluates a single answer turn against target question details, speech metrics, and active course syllabus.
   */
  evaluateAnswer(question, candidateText, speechMetrics = {}) {
    const text = candidateText ? candidateText.trim() : '';
    const wordCount = text ? text.split(/\s+/).length : 0;
    
    // 1. Course Curriculum Knowledge Alignment Check
    const courseEvaluation = courseKnowledgeInstance.checkAnswerAgainstCourse(text, question);

    // 2. Technical & Keyword Coverage
    const lowerText = text.toLowerCase();
    const keywords = question.keyKeywords || [];
    let matchedKeywords = [];
    keywords.forEach(kw => {
      if (lowerText.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      }
    });
    
    const keywordCoverageRatio = keywords.length > 0 ? (matchedKeywords.length / keywords.length) : 0.7;

    // 3. STAR Format Adherence Detection
    const starMarkers = {
      situation: ['when', 'at my', 'company', 'project', 'client', 'background', 'team', 'faced', 'needed', 'course', 'class'],
      task: ['goal', 'task', 'objective', 'responsible', 'required', 'challenge', 'assigned', 'problem'],
      action: ['i built', 'i implemented', 'i decided', 'i created', 'i analyzed', 'i led', 'i communicated', 'i established', 'i resolved', 'my role'],
      result: ['result', 'outcome', 'increased', 'decreased', 'improved', 'reduced', 'achieved', 'launched', 'saved', 'percent', '%', 'ms']
    };

    let starCoverage = {
      situation: starMarkers.situation.some(m => lowerText.includes(m)),
      task: starMarkers.task.some(m => lowerText.includes(m)),
      action: starMarkers.action.some(m => lowerText.includes(m)),
      result: starMarkers.result.some(m => lowerText.includes(m)),
    };

    const starSectionsCount = Object.values(starCoverage).filter(Boolean).length;

    // 4. Speech Delivery & Filler Penalty
    const totalFillers = speechMetrics.totalFillers || 0;
    const wpm = speechMetrics.wpm || 135;
    
    // WPM Score calculation: optimal range 125 - 165 WPM
    let paceScore = 90;
    if (wpm < 90) paceScore = 65;
    else if (wpm > 180) paceScore = 70;
    else if (wpm >= 120 && wpm <= 165) paceScore = 98;

    const fillerPenalty = Math.min(totalFillers * 3, 30);
    const commScore = Math.max(Math.min(paceScore - fillerPenalty + (wordCount > 50 ? 10 : 0), 100), 45);

    // Tech Depth & Course Alignment Blend
    let techScore = Math.round(
      (keywordCoverageRatio * 40) + 
      (courseEvaluation.alignmentScore * 0.4) + 
      (wordCount > 80 ? 20 : wordCount * 0.2)
    );
    techScore = Math.min(Math.max(techScore, 40), 100);

    // Structure Score
    let structureScore = Math.round((starSectionsCount / 4) * 100);
    if (wordCount < 30) structureScore = Math.min(structureScore, 45);

    // Executive Confidence
    let confidenceScore = Math.round((commScore * 0.5) + (structureScore * 0.3) + (techScore * 0.2));

    // Overall Score
    const overallScore = Math.round((commScore * 0.25) + (techScore * 0.35) + (structureScore * 0.25) + (confidenceScore * 0.15));

    // Feedback Points Generation
    const strengths = [];
    const improvements = [];
    const missingConcepts = keywords.filter(kw => !matchedKeywords.includes(kw));

    if (courseEvaluation.matchedCourseKeywords.length > 0) {
      strengths.push(`Strong alignment with ${courseEvaluation.courseCode} course syllabus: mentioned "${courseEvaluation.matchedCourseKeywords.slice(0, 4).join(', ')}".`);
    } else {
      improvements.push(`Incorporate more core concepts from ${courseEvaluation.courseName} (e.g. ${courseEvaluation.keyCourseConcepts[0]}).`);
    }

    if (matchedKeywords.length > 0) {
      strengths.push(`Great technical depth: articulated "${matchedKeywords.join(', ')}".`);
    }

    if (starCoverage.result) {
      strengths.push('Effective quantification of results and outcomes in your response.');
    } else {
      improvements.push('Include explicit quantitative results (e.g. "% improvement", "latency reduced", "efficiency gained").');
    }

    if (totalFillers > 3) {
      improvements.push(`Noticed ${totalFillers} filler words. Pausing silently is stronger than using filler words.`);
    }

    return {
      overallScore,
      breakdown: {
        communication: commScore,
        technicalDepth: techScore,
        structure: structureScore,
        confidence: confidenceScore
      },
      courseEvaluation,
      matchedKeywords,
      missingConcepts,
      starCoverage,
      strengths,
      improvements,
      wordCount,
      wpm,
      totalFillers,
      sampleAnswer: question.modelAnswer
    };
  }

  getFollowUp(question, evaluation) {
    if (evaluation.missingConcepts && evaluation.missingConcepts.length > 0) {
      return `That covers the initial scenario well. Could you elaborate specifically on how you handled ${evaluation.missingConcepts[0]} in that situation?`;
    }
    if (!evaluation.starCoverage.result) {
      return `That is helpful context. What were the specific measurable metrics or outcomes from that action?`;
    }
    if (question.followUps && question.followUps.length > 0) {
      return question.followUps[Math.floor(Math.random() * question.followUps.length)];
    }
    return `Can you walk me through what trade-offs you considered before finalizing that decision?`;
  }
}

export const interviewEngineInstance = new InterviewEngine();
