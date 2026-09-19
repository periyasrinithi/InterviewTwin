/**
 * AI Interview Evaluation & Feedback Engine with Course Knowledge Alignment
 */

import { FILLER_WORDS } from './speechRecognition';
import { courseKnowledgeInstance } from './courseKnowledge';

export class InterviewEngine {
  /**
   * Evaluates a single answer turn against multi-approach references, course standards, and speech metrics.
   * Acknowledges that technical & behavioral questions have MULTIPLE VALID CORRECT ANSWERS.
   */
  evaluateAnswer(question, candidateText, speechMetrics = {}) {
    const text = candidateText ? candidateText.trim() : '';
    const wordCount = text ? text.split(/\s+/).length : 0;
    const lowerText = text.toLowerCase();
    
    // 1. Course Curriculum Knowledge Alignment Check
    const courseEvaluation = courseKnowledgeInstance.checkAnswerAgainstCourse(text, question);

    // 2. Multi-Approach Reference Evaluation (Acknowledging Multiple Correct Paradigms)
    const keywords = question.keyKeywords || [];
    let matchedKeywords = [];
    keywords.forEach(kw => {
      if (lowerText.includes(kw.toLowerCase())) {
        matchedKeywords.push(kw);
      }
    });

    // Detect Alternative Solution Paradigms
    const detectedParadigms = [];
    if (lowerText.includes('hash') || lowerText.includes('map') || lowerText.includes('dict') || lowerText.includes('o(1)')) {
      detectedParadigms.push({ approach: 'Hash Map / Dictionary Approach', complexity: 'O(N) Time, O(N) Space', rating: 'Optimal Time' });
    }
    if (lowerText.includes('sort') || lowerText.includes('two pointer') || lowerText.includes('binary search')) {
      detectedParadigms.push({ approach: 'Sorting / Two-Pointer Approach', complexity: 'O(N log N) Time, O(1) Space', rating: 'Optimal Memory' });
    }
    if (lowerText.includes('cache') || lowerText.includes('redis') || lowerText.includes('memcached') || lowerText.includes('cdn')) {
      detectedParadigms.push({ approach: 'Distributed Cache Layering', complexity: 'High Throughput Architecture', rating: 'Scalable System' });
    }
    if (lowerText.includes('data') || lowerText.includes('benchmark') || lowerText.includes('prototype') || lowerText.includes('collaborate')) {
      detectedParadigms.push({ approach: 'Data-Driven & Collaborative Resolution', complexity: 'STAR Framework', rating: 'High Ownership' });
    }

    const primaryApproach = detectedParadigms[0] || {
      approach: wordCount > 40 ? 'Structured Technical Answer' : 'Direct Conceptual Response',
      complexity: 'Standard Paradigm',
      rating: 'Valid Approach'
    };

    // 3. Trade-off & Complexity Awareness Check
    const mentionsTradeoffs = lowerText.includes('trade-off') || lowerText.includes('tradeoff') || 
                              lowerText.includes('complexity') || lowerText.includes('space') || 
                              lowerText.includes('time') || lowerText.includes('versus') || 
                              lowerText.includes('vs') || lowerText.includes('latency');

    // 4. STAR Format Adherence Detection
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

    // 5. Speech Delivery & Pace
    const totalFillers = speechMetrics.totalFillers || 0;
    const wpm = speechMetrics.wpm || 135;
    
    let paceScore = 90;
    if (wpm >= 120 && wpm <= 165) paceScore = 98;
    else if (wpm < 90) paceScore = 65;
    else if (wpm > 180) paceScore = 70;

    const fillerPenalty = Math.min(totalFillers * 3, 30);
    const commScore = Math.max(Math.min(paceScore - fillerPenalty + (wordCount > 50 ? 10 : 0), 100), 45);

    // Tech Depth: Full credit for ANY recognized correct paradigm + trade-off awareness
    const keywordRatio = keywords.length > 0 ? (matchedKeywords.length / keywords.length) : 0.75;
    let techScore = Math.round(
      (keywordRatio * 35) + 
      (courseEvaluation.alignmentScore * 0.35) + 
      (mentionsTradeoffs ? 15 : 5) +
      (wordCount > 70 ? 15 : wordCount * 0.2)
    );
    techScore = Math.min(Math.max(techScore, 45), 100);

    // Structure & Confidence
    let structureScore = Math.round((starSectionsCount / 4) * 100);
    if (wordCount < 30) structureScore = Math.min(structureScore, 45);

    let confidenceScore = Math.round((commScore * 0.4) + (structureScore * 0.3) + (techScore * 0.3));
    const overallScore = Math.round((commScore * 0.25) + (techScore * 0.35) + (structureScore * 0.25) + (confidenceScore * 0.15));

    // Feedback Points & Alternative Approaches
    const strengths = [];
    const improvements = [];

    strengths.push(`Recognized Approach: Evaluated via "${primaryApproach.approach}" (${primaryApproach.rating}).`);

    if (mentionsTradeoffs) {
      strengths.push('Excellent trade-off awareness: articulated time, space, or architectural trade-offs.');
    } else {
      improvements.push('Consider explaining trade-offs (e.g. Time vs Space complexity or System Scalability vs Latency).');
    }

    if (courseEvaluation.matchedCourseKeywords.length > 0) {
      strengths.push(`Course Curriculum Alignment (${courseEvaluation.courseCode}): mentioned "${courseEvaluation.matchedCourseKeywords.slice(0, 4).join(', ')}".`);
    }

    if (totalFillers > 3) {
      improvements.push(`Noticed ${totalFillers} filler words. Silent pauses sound more confident.`);
    }

    return {
      overallScore,
      breakdown: {
        communication: commScore,
        technicalDepth: techScore,
        structure: structureScore,
        confidence: confidenceScore
      },
      primaryApproach,
      courseEvaluation,
      matchedKeywords,
      starCoverage,
      mentionsTradeoffs,
      strengths,
      improvements,
      wordCount,
      wpm,
      totalFillers,
      sampleAnswer: question.modelAnswer,
      alternativeValidApproaches: [
        { approach: 'Optimal Time Approach (Hash Map / Indexing)', detail: 'O(N) Time complexity using auxiliary hash space.' },
        { approach: 'Optimal Memory Approach (Sorting & Pointers)', detail: 'O(N log N) Time complexity with O(1) in-place memory.' },
        { approach: 'Distributed System Approach (Caching & CDN)', detail: 'Decoupled caching layer with idempotency controls.' }
      ]
    };
  }

  getFollowUp(question, evaluation) {
    if (!evaluation.mentionsTradeoffs) {
      return `Good explanation. What trade-offs or space/time complexities did you consider for that approach?`;
    }
    if (question.followUps && question.followUps.length > 0) {
      return question.followUps[Math.floor(Math.random() * question.followUps.length)];
    }
    return `Can you walk me through an alternative valid approach to solve this same problem?`;
  }
}

export const interviewEngineInstance = new InterviewEngine();
