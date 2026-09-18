/**
 * Course Knowledge Base & Curriculum Syllabus Manager
 */

export const DEFAULT_COURSES = [
  {
    id: 'cs101_dsa',
    name: 'CS101: Data Structures & Algorithms',
    code: 'CS-101',
    instructor: 'Prof. Computer Science',
    syllabusKeywords: ['array', 'linked list', 'stack', 'queue', 'hash table', 'hashmap', 'binary tree', 'bfs', 'dfs', 'heap', 'big-o', 'time complexity', 'space complexity', 'recursion', 'sorting', 'binary search'],
    keyConcepts: [
      'Time vs Space Complexity Trade-offs (O(1), O(N), O(N log N))',
      'Hash Map O(1) average lookup vs O(N) array searching',
      'Breadth-First Search (Queue) vs Depth-First Search (Stack/Recursion)',
      'Min/Max Heap Priority Queue structures'
    ],
    sampleSyllabusText: `CS101 Course Syllabus: Focuses on core data structures including HashMaps, Arrays, Binary Trees, and Graphs. Evaluates asymptotic time and space complexity (Big-O analysis). Students must demonstrate trading memory for execution speed and utilizing appropriate traversal strategies (BFS vs DFS).`
  },
  {
    id: 'java201_oop',
    name: 'JAVA201: Advanced Java & Object-Oriented Software',
    code: 'JAVA-201',
    instructor: 'Prof. Software Engineering',
    syllabusKeywords: ['java', 'jvm', 'heap', 'stack', 'garbage collection', 'concurrency', 'multithreading', 'synchronized', 'reentrantlock', 'concurrenthashmap', 'spring boot', 'interfaces', 'polymorphism', 'encapsulation', 'exception handling'],
    keyConcepts: [
      'JVM Memory Management (Stack frames vs Heap object allocation)',
      'Thread Safety & Synchronization (synchronized, ReentrantLock, ConcurrentHashMap)',
      'Object-Oriented Pillars (Encapsulation, Polymorphism, Abstraction, Inheritance)',
      'Garbage Collection algorithms (Mark and Sweep, G1 GC)'
    ],
    sampleSyllabusText: `JAVA201 Course Syllabus: Advanced Java 17 programming, Object-Oriented Principles, JVM Memory Architecture (Heap vs Stack), Thread Safety in multi-threaded execution environments, synchronized monitors, ReentrantLocks, and Spring Boot microservice design.`
  },
  {
    id: 'sys301_arch',
    name: 'SYS301: Distributed Systems & Cloud Architecture',
    code: 'SYS-301',
    instructor: 'Prof. Cloud Computing',
    syllabusKeywords: ['microservices', 'load balancing', 'caching', 'redis', 'cache-aside', 'cap theorem', 'sharding', 'replication', 'message queue', 'kafka', 'idempotency', 'circuit breaker'],
    keyConcepts: [
      'Cache Strategies (Cache-Aside, Write-Through, Cache Invalidation)',
      'Distributed Messaging & Event-Driven Architecture (Kafka/RabbitMQ)',
      'CAP Theorem (Consistency, Availability, Partition Tolerance trade-offs)',
      'Database Sharding & Read Replicas'
    ],
    sampleSyllabusText: `SYS301 Course Syllabus: High-scale distributed systems, microservices design patterns, caching layers (Redis), database sharding, Kafka message queues, circuit breakers, and CAP theorem trade-offs under high volume traffic.`
  }
];

export class CourseKnowledgeService {
  constructor() {
    this.activeCourseId = 'cs101_dsa';
    this.customSyllabusText = '';
  }

  getActiveCourse() {
    return DEFAULT_COURSES.find(c => c.id === this.activeCourseId) || DEFAULT_COURSES[0];
  }

  setActiveCourse(courseId) {
    this.activeCourseId = courseId;
  }

  setCustomSyllabus(text) {
    this.customSyllabusText = text ? text.trim() : '';
  }

  /**
   * Evaluate candidate answer against course syllabus knowledge base
   */
  checkAnswerAgainstCourse(answerText, questionObj) {
    const text = answerText ? answerText.toLowerCase() : '';
    const course = this.getActiveCourse();
    
    // Combine standard course keywords with any custom syllabus words
    const courseKeywords = [...course.syllabusKeywords];
    if (this.customSyllabusText) {
      const words = this.customSyllabusText.toLowerCase().match(/\b[\w']+\b/g) || [];
      words.forEach(w => {
        if (w.length > 3 && !courseKeywords.includes(w)) {
          courseKeywords.push(w);
        }
      });
    }

    const matchedCourseKeywords = [];
    const missingCourseKeywords = [];

    courseKeywords.forEach(kw => {
      if (text.includes(kw.toLowerCase())) {
        matchedCourseKeywords.push(kw);
      } else {
        missingCourseKeywords.push(kw);
      }
    });

    const alignmentScore = courseKeywords.length > 0
      ? Math.round((matchedCourseKeywords.length / courseKeywords.length) * 100)
      : 80;

    return {
      courseName: course.name,
      courseCode: course.code,
      alignmentScore: Math.min(Math.max(alignmentScore * 2.5, 45), 100), // Scaled 0-100 course coverage
      matchedCourseKeywords,
      missingCourseKeywords: missingCourseKeywords.slice(0, 5),
      keyCourseConcepts: course.keyConcepts
    };
  }
}

export const courseKnowledgeInstance = new CourseKnowledgeService();
