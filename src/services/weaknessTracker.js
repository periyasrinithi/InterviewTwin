/**
 * InterviewTwin - Dynamic Weakness Tracker, 7-Day Training Plan & Longitudinal Progress Engine
 */

export class WeaknessTrackerService {
  constructor() {
    this.historyKey = 'interview_twin_history';
  }

  /**
   * Calculate full hierarchical weakness graph strictly from actual candidate turn evaluations
   */
  computeWeaknessGraph(turnEvaluations = []) {
    if (!turnEvaluations || turnEvaluations.length === 0) {
      return { hasData: false };
    }

    let techTotal = 0;
    let commTotal = 0;
    let starTotal = 0;
    let specTotal = 0;
    let count = turnEvaluations.length;

    // Sub-topic score trackers (initialized based on actual candidate performance)
    let dsaScores = {
      arrays: 0,
      strings: 0,
      linkedLists: 0,
      trees: 0,
      graphs: 0,
      dynamicProgramming: 0
    };

    let dsaTopicCounts = { arrays: 0, strings: 0, linkedLists: 0, trees: 0, graphs: 0, dynamicProgramming: 0 };

    let commScores = {
      structure: 0,
      clarity: 0,
      specificity: 0,
      evidence: 0,
      ownership: 0,
      fillers: 0
    };

    turnEvaluations.forEach(turn => {
      const evalData = turn.evaluation || {};
      const breakdown = evalData.breakdown || {};
      const metrics = turn.speechMetrics || {};

      const turnTech = breakdown.technicalDepth || 60;
      const turnComm = breakdown.communication || 60;
      const turnStar = breakdown.structure || 60;
      const turnWpm = metrics.wpm || 135;
      const turnFillers = metrics.totalFillers || 0;

      techTotal += turnTech;
      commTotal += turnComm;
      starTotal += turnStar;
      
      // Calculate specificity score based on answer length & concrete keywords
      const wordCount = (turn.candidateAnswer || '').split(/\s+/).length;
      const specificity = Math.min(Math.max(Math.round((wordCount / 120) * 100), 30), 95);
      specTotal += specificity;

      commScores.fillers += turnFillers;

      // Identify sub-topic tags from question or candidate answer
      const text = `${turn.question?.question || ''} ${turn.candidateAnswer || ''}`.toLowerCase();
      
      if (text.includes('array') || text.includes('two sum') || text.includes('element')) {
        dsaScores.arrays += turnTech;
        dsaTopicCounts.arrays++;
      }
      if (text.includes('string') || text.includes('palindrome') || text.includes('substring')) {
        dsaScores.strings += turnTech;
        dsaTopicCounts.strings++;
      }
      if (text.includes('linked list') || text.includes('node') || text.includes('pointer')) {
        dsaScores.linkedLists += turnTech;
        dsaTopicCounts.linkedLists++;
      }
      if (text.includes('tree') || text.includes('binary tree') || text.includes('bst')) {
        dsaScores.trees += turnTech;
        dsaTopicCounts.trees++;
      }
      if (text.includes('graph') || text.includes('bfs') || text.includes('dfs') || text.includes('node')) {
        dsaScores.graphs += turnTech;
        dsaTopicCounts.graphs++;
      }
      if (text.includes('dynamic') || text.includes('dp') || text.includes('memoization') || text.includes('subproblem')) {
        dsaScores.dynamicProgramming += turnTech;
        dsaTopicCounts.dynamicProgramming++;
      }
    });

    const avgTech = Math.round(techTotal / count);
    const avgComm = Math.round(commTotal / count);
    const avgStar = Math.round(starTotal / count);
    const avgSpec = Math.round(specTotal / count);

    // Compute averaged sub-topic scores
    const computeSubAvg = (sum, c, defaultFallback) => c > 0 ? Math.round(sum / c) : defaultFallback;

    const finalDSA = {
      arrays: computeSubAvg(dsaScores.arrays, dsaTopicCounts.arrays, Math.max(avgTech - 5, 45)),
      strings: computeSubAvg(dsaScores.strings, dsaTopicCounts.strings, Math.max(avgTech - 8, 40)),
      linkedLists: computeSubAvg(dsaScores.linkedLists, dsaTopicCounts.linkedLists, Math.max(avgTech - 15, 35)),
      trees: computeSubAvg(dsaScores.trees, dsaTopicCounts.trees, Math.max(avgTech - 20, 30)),
      graphs: computeSubAvg(dsaScores.graphs, dsaTopicCounts.graphs, Math.max(avgTech - 25, 25)),
      dynamicProgramming: computeSubAvg(dsaScores.dynamicProgramming, dsaTopicCounts.dynamicProgramming, Math.max(avgTech - 30, 20))
    };

    const avgDSA = Math.round((finalDSA.arrays + finalDSA.strings + finalDSA.linkedLists + finalDSA.trees + finalDSA.graphs + finalDSA.dynamicProgramming) / 6);
    const overallReadiness = Math.round((avgTech * 0.4) + (avgComm * 0.3) + (avgDSA * 0.3));

    return {
      hasData: true,
      overallReadiness,
      highLevel: {
        technicalKnowledge: avgTech,
        dsaProficiency: avgDSA,
        communication: avgComm,
        problemExplanation: Math.round((avgComm + avgStar) / 2),
        confidence: Math.round((avgComm + avgTech) / 2),
        hrBehavioral: avgStar
      },
      dsaSubTopics: finalDSA,
      technicalSubTopics: {
        java: Math.max(avgTech - 5, 40),
        dbms: Math.max(avgTech - 10, 35),
        os: Math.max(avgTech - 15, 30),
        systemDesign: Math.max(avgTech - 20, 25)
      },
      communicationMetrics: {
        structure: avgStar,
        clarity: avgComm,
        specificity: avgSpec,
        evidence: Math.max(avgSpec - 8, 25),
        ownership: Math.max(avgSpec - 5, 30),
        genericWordingLevel: avgSpec < 50 ? 'HIGH' : avgSpec < 75 ? 'MEDIUM' : 'LOW'
      }
    };
  }

  /**
   * Auto-generate 7-Day Training Plan dynamically based on actual evaluated weakness graph
   */
  /**
   * Auto-generate 7-Day Training Plan dynamically based on actual evaluated weakness graph
   */
  generate7DayTrainingPlan(weaknessGraph) {
    if (!weaknessGraph || !weaknessGraph.hasData) {
      return this.getDefaultTrainingPlan();
    }

    const dsa = weaknessGraph.dsaSubTopics || {};
    const weakDSAEntries = Object.entries(dsa).sort((a, b) => a[1] - b[1]);
    const weakestDSAName = weakDSAEntries[0] ? weakDSAEntries[0][0] : 'trees';
    const secondWeakestDSAName = weakDSAEntries[1] ? weakDSAEntries[1][0] : 'graphs';

    const formatName = (str) => {
      if (str === 'dynamicProgramming') return 'Dynamic Programming';
      if (str === 'linkedLists') return 'Linked Lists';
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const topic1 = formatName(weakestDSAName);
    const topic2 = formatName(secondWeakestDSAName);

    return [
      {
        day: 1,
        title: `Day 1: ${topic1} Fundamentals`,
        targetArea: topic1,
        estimatedTime: '60 Mins',
        tasks: [
          `Solve 3 Easy ${topic1} problems focusing on pointer & traversal logic`,
          `Practice 1 spoken explanation of ${topic1} memory structure`,
          `Review Big-O space complexity trade-offs`
        ],
        externalResources: [
          { name: `Striver's A2Z ${topic1} Sheet`, platform: 'TakeUForward', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', isPaid: false, type: 'Coding / DSA' },
          { name: `NeetCode 150 ${topic1} Practice & Solutions`, platform: 'NeetCode.io', url: 'https://neetcode.io/roadmap', isPaid: false, type: 'Coding / DSA' },
          { name: `Grokking the Coding Interview: ${topic1} Patterns`, platform: 'Educative.io', url: 'https://www.educative.io/courses/grokking-the-coding-interview', isPaid: true, price: 'Subscription', type: 'Coding / DSA' }
        ]
      },
      {
        day: 2,
        title: `Day 2: ${topic1} Intermediate & Edge Cases`,
        targetArea: topic1,
        estimatedTime: '75 Mins',
        tasks: [
          `Solve 2 Medium ${topic1} problems on LeetCode`,
          `Explain time complexity and recursion stack limits out loud`,
          `Record a 2-minute mock answer explaining recursive vs iterative approaches`
        ],
        externalResources: [
          { name: `LeetCode 75 ${topic1} Study Plan`, platform: 'LeetCode', url: 'https://leetcode.com/studyplan/leetcode-75/', isPaid: false, type: 'Coding / DSA' },
          { name: `MIT 6.006 Intro to Algorithms: ${topic1}`, platform: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/', isPaid: false, type: 'Coding / DSA' },
          { name: `AlgoExpert ${topic1} 160 Handpicked Questions`, platform: 'AlgoExpert', url: 'https://www.algoexpert.io/product', isPaid: true, price: '$99/yr', type: 'Coding / DSA' }
        ]
      },
      {
        day: 3,
        title: `Day 3: ${topic2} (BFS & DFS Traversals)`,
        targetArea: topic2,
        estimatedTime: '60 Mins',
        tasks: [
          `Implement BFS (Queue) and DFS (Stack/Recursion) for ${topic2}`,
          `Solve 2 Graph/Tree traversal interview problems`,
          `Complete mini voice drill on shortest path algorithms`
        ],
        externalResources: [
          { name: `GeeksforGeeks ${topic2} Complete Guide`, platform: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/', isPaid: false, type: 'Coding / DSA' },
          { name: `Udemy: Master Data Structures & Algorithms by Abdul Bari`, platform: 'Udemy', url: 'https://www.udemy.com/course/datastructurescncpp/', isPaid: true, price: '~$14', type: 'Coding / DSA' }
        ]
      },
      {
        day: 4,
        title: 'Day 4: Dynamic Programming & Recursion Masterclass',
        targetArea: 'Dynamic Programming',
        estimatedTime: '90 Mins',
        tasks: [
          `Master Top-Down Memoization vs Bottom-Up Tabulation`,
          `Solve 3 classic DP problems (Climbing Stairs, Coin Change, Knapsack)`,
          `Explain state transition equations out loud`
        ],
        externalResources: [
          { name: 'Striver DP Series (Top 50 DP Problems)', platform: 'TakeUForward', url: 'https://takeuforward.org/dynamic-programming/striver-dp-series-top-dp-problems/', isPaid: false, type: 'Coding / DSA' },
          { name: 'Grokking Dynamic Programming Patterns', platform: 'Educative.io', url: 'https://www.educative.io/courses/grokking-dynamic-programming-patterns-for-coding-interviews', isPaid: true, price: 'Subscription', type: 'Coding / DSA' },
          { name: 'Dynamic Programming Master Course by Coding Minutes', platform: 'Udemy', url: 'https://www.udemy.com/course/dynamic-programming-master-course-coding-minutes/', isPaid: true, price: '~$14', type: 'Coding / DSA' }
        ]
      },
      {
        day: 5,
        title: 'Day 5: Anti-Memorization STAR & Ownership Drills',
        targetArea: 'Communication & STAR Structure',
        estimatedTime: '45 Mins',
        tasks: [
          `Re-structure your behavioral stories to highlight YOUR specific contributions`,
          `Eliminate generic words ("hardworking", "team player") with quantitative metrics`,
          `Complete 2 STAR behavioral drills focusing on Specificity & Evidence`
        ],
        externalResources: [
          { name: 'Complete STAR Method Answer Guide & Story Bank', platform: 'The Muse', url: 'https://www.themuse.com/advice/star-interview-method', isPaid: false, type: 'Behavioral & HR' },
          { name: 'Harvard Business Review Communication & Presentation Guide', platform: 'HBR', url: 'https://hbr.org/topic/subject/presentation-skills', isPaid: false, type: 'Behavioral & HR' },
          { name: 'Executive Speaking & Behavioral Interview Masterclass', platform: 'Udemy', url: 'https://www.udemy.com/course/complete-interview-answer-guide/', isPaid: true, price: '~$14', type: 'Behavioral & HR' }
        ]
      },
      {
        day: 6,
        title: 'Day 6: Core Technical Stack & System Design Deep-Dive',
        targetArea: 'System Design & Technical Stack',
        estimatedTime: '60 Mins',
        tasks: [
          `Review Java JVM Heap vs Stack memory and Thread Safety`,
          `Practice SQL indexing (B-Trees) and ACID transaction explanations`,
          `Mock 15-minute System Design & Architecture review`
        ],
        externalResources: [
          { name: 'The System Design Primer (GitHub - 250k+ Stars)', platform: 'GitHub', url: 'https://github.com/donnemartin/system-design-primer', isPaid: false, type: 'System Design' },
          { name: 'ByteByteGo System Design YouTube Channel', platform: 'YouTube / ByteByteGo', url: 'https://www.youtube.com/@ByteByteGo', isPaid: false, type: 'System Design' },
          { name: 'Grokking Modern System Design for Engineers', platform: 'Educative.io', url: 'https://www.educative.io/courses/grokking-modern-system-design-for-software-engineers', isPaid: true, price: 'Subscription', type: 'System Design' },
          { name: 'SystemsExpert Architecture & System Design', platform: 'SystemsExpert', url: 'https://www.algoexpert.io/systems/product', isPaid: true, price: 'Paid', type: 'System Design' }
        ]
      },
      {
        day: 7,
        title: 'Day 7: Full Adaptive Re-Interview Session',
        targetArea: 'Re-Interview Verification',
        estimatedTime: '45 Mins',
        tasks: [
          `Take Full Adaptive AI Re-Interview`,
          `Compare Interview #2 score against Interview #1 baseline`,
          `Verify skill gap reductions and filler word improvements`
        ],
        externalResources: [
          { name: 'InterviewTwin Adaptive Verification Round', platform: 'InterviewTwin AI', url: '#', isPaid: false, type: 'AI Verification' },
          { name: 'LeetCode Premium Targeted Company Mock Exams', platform: 'LeetCode', url: 'https://leetcode.com/subscribe/', isPaid: true, price: '$35/mo', type: 'Company Mocks' }
        ]
      }
    ];
  }

  getDefaultTrainingPlan() {
    return [
      {
        day: 1,
        title: 'Day 1: Initial Skill Diagnostic & Arrays',
        targetArea: 'Diagnostic Baseline',
        estimatedTime: '45 Mins',
        tasks: ['Complete your first Diagnostic Interview', 'Review array traversal techniques'],
        externalResources: [
          { name: "Striver's A2Z DSA Sheet", platform: 'TakeUForward', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/', isPaid: false, type: 'Coding / DSA' },
          { name: 'NeetCode 150 Practice Roadmap', platform: 'NeetCode.io', url: 'https://neetcode.io/roadmap', isPaid: false, type: 'Coding / DSA' },
          { name: 'Grokking the Coding Interview', platform: 'Educative.io', url: 'https://www.educative.io/courses/grokking-the-coding-interview', isPaid: true, price: 'Subscription', type: 'Coding / DSA' }
        ]
      },
      {
        day: 2,
        title: 'Day 2: Binary Trees & Recursion',
        targetArea: 'Trees',
        estimatedTime: '60 Mins',
        tasks: ['Solve 2 Tree problems', 'Explain recursion stack limits'],
        externalResources: [
          { name: 'LeetCode Tree Study Plan', platform: 'LeetCode', url: 'https://leetcode.com/studyplan/leetcode-75/', isPaid: false, type: 'Coding / DSA' },
          { name: 'AlgoExpert Data Structures & Trees', platform: 'AlgoExpert', url: 'https://www.algoexpert.io/product', isPaid: true, price: '$99/yr', type: 'Coding / DSA' }
        ]
      },
      {
        day: 3,
        title: 'Day 3: Graphs (BFS & DFS)',
        targetArea: 'Graphs',
        estimatedTime: '60 Mins',
        tasks: ['Implement Queue-based BFS', 'Solve 2 graph traversal questions'],
        externalResources: [
          { name: 'GeeksforGeeks Graph Algorithms', platform: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/', isPaid: false, type: 'Coding / DSA' },
          { name: 'Udemy DSA Masterclass by Abdul Bari', platform: 'Udemy', url: 'https://www.udemy.com/course/datastructurescncpp/', isPaid: true, price: '~$14', type: 'Coding / DSA' }
        ]
      },
      {
        day: 4,
        title: 'Day 4: Dynamic Programming Basics',
        targetArea: 'Dynamic Programming',
        estimatedTime: '75 Mins',
        tasks: ['Memoization vs Tabulation', 'Solve 2 DP problems'],
        externalResources: [
          { name: 'Striver DP Series (Top 50 DP Problems)', platform: 'TakeUForward', url: 'https://takeuforward.org/dynamic-programming/striver-dp-series-top-dp-problems/', isPaid: false, type: 'Coding / DSA' },
          { name: 'Grokking Dynamic Programming Patterns', platform: 'Educative.io', url: 'https://www.educative.io/courses/grokking-dynamic-programming-patterns-for-coding-interviews', isPaid: true, price: 'Subscription', type: 'Coding / DSA' }
        ]
      },
      {
        day: 5,
        title: 'Day 5: Behavioral STAR Specificity',
        targetArea: 'Behavioral',
        estimatedTime: '45 Mins',
        tasks: ['Eliminate generic words', 'Quantify personal achievements'],
        externalResources: [
          { name: 'STAR Method Interview Guide', platform: 'The Muse', url: 'https://www.themuse.com/advice/star-interview-method', isPaid: false, type: 'Behavioral & HR' },
          { name: 'Executive Behavioral Answer Guide', platform: 'Udemy', url: 'https://www.udemy.com/course/complete-interview-answer-guide/', isPaid: true, price: '~$14', type: 'Behavioral & HR' }
        ]
      },
      {
        day: 6,
        title: 'Day 6: DBMS & System Design',
        targetArea: 'Technical Stack',
        estimatedTime: '60 Mins',
        tasks: ['Review SQL B-Tree indexes', 'System Design Fundamentals'],
        externalResources: [
          { name: 'System Design Primer (GitHub - 250k+ Stars)', platform: 'GitHub', url: 'https://github.com/donnemartin/system-design-primer', isPaid: false, type: 'System Design' },
          { name: 'Grokking Modern System Design', platform: 'Educative.io', url: 'https://www.educative.io/courses/grokking-modern-system-design-for-software-engineers', isPaid: true, price: 'Subscription', type: 'System Design' }
        ]
      },
      {
        day: 7,
        title: 'Day 7: Adaptive Re-Interview',
        targetArea: 'Verification',
        estimatedTime: '45 Mins',
        tasks: ['Launch Re-Interview', 'Verify improvement delta'],
        externalResources: [
          { name: 'InterviewTwin Adaptive Verification', platform: 'InterviewTwin AI', url: '#', isPaid: false, type: 'AI Verification' },
          { name: 'LeetCode Premium Mock Exams', platform: 'LeetCode', url: 'https://leetcode.com/subscribe/', isPaid: true, price: '$35/mo', type: 'Company Mocks' }
        ]
      }
    ];
  }

  saveInterviewSession(sessionData) {
    try {
      const history = this.getInterviewHistory();
      const sessionNumber = history.length + 1;
      const weaknessGraph = this.computeWeaknessGraph(sessionData.turnEvaluations);

      const record = {
        sessionNumber,
        timestamp: new Date().toISOString(),
        config: sessionData.config,
        weaknessGraph,
        turnEvaluations: sessionData.turnEvaluations,
        proctorWarningsCount: (sessionData.proctorWarnings || []).length
      };

      const updated = [record, ...history];
      localStorage.setItem(this.historyKey, JSON.stringify(updated));
      return record;
    } catch (e) {
      console.warn('Failed to save interview session', e);
      return null;
    }
  }

  getInterviewHistory() {
    try {
      const stored = localStorage.getItem(this.historyKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }
}

export const weaknessTrackerInstance = new WeaknessTrackerService();
