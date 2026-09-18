/**
 * Enhanced Client-Side Resume Parsing & AI Personalization Engine
 */

export const SAMPLE_RESUMES = {
  java_dev: `ALEX R. CHEN
Senior Java & Backend Engineer
Email: alex.chen@example.com | GitHub: github.com/alexchen-dev

SUMMARY:
Results-driven Software Engineer with 5+ years of experience building high-concurrency microservices using Java 17, Spring Boot, PostgreSQL, and Kafka. Demonstrated success optimizing latency by 40% and deploying cloud infrastructure on AWS and Kubernetes.

SKILLS:
- Languages: Java 17, SQL, Python, JavaScript, TypeScript
- Frameworks & Libraries: Spring Boot, Spring Data JPA, Hibernate, JUnit 5, React
- Databases & Messaging: PostgreSQL, Redis, Apache Kafka, MongoDB
- DevOps & Cloud: Docker, Kubernetes, AWS (EC2, S3, RDS), Jenkins CI/CD, Git
- Computer Science: Data Structures & Algorithms (DSA), System Design, Concurrency

WORK EXPERIENCE:
Senior Software Engineer | FinTech Solutions Inc. (2022 - Present)
- Engineered a real-time payment processing gateway using Java Spring Boot and Kafka, handling over 15M daily transactions.
- Resolved high-concurrency race conditions by implementing Redis distributed locks and optimistic database locking, eliminating double-spend bugs.
- Reduced API response latency from 180ms to 45ms by introducing multi-level Redis caching and B-Tree database index tuning.

Software Engineer | CloudScale Systems (2019 - 2022)
- Built scalable microservices for container management using Java 11 and Docker.
- Spearheaded the migration from monolithic architecture to Kubernetes microservices, achieving 99.99% uptime.`,

  fullstack_swe: `JORDAN TAYLOR
Full-Stack Software Engineer (React & Node.js / Java)
Email: jordan.t@example.com | Portfolio: jordantaylor.dev

SUMMARY:
Full-Stack Developer with 4 years of experience delivering modern web applications. Expertise in React, TypeScript, Node.js, DSA algorithms, and SQL database optimization.

SKILLS:
- Front-End: React.js, TypeScript, Next.js, Redux, HTML5, CSS3, TailwindCSS
- Back-End: Node.js, Express, Java Spring Boot, REST APIs, GraphQL
- Databases & DSA: PostgreSQL, MySQL, Redis, Data Structures & Algorithms
- Tools & Cloud: Git, Docker, AWS, Jest, Webpack

PROJECTS:
- Real-Time Collaborative Canvas: Developed a multi-user whiteboarding web app using React, WebSocket, and Redis.
- E-Commerce Inventory Service: Designed relational database schemas in PostgreSQL with ACID transaction guarantees.`,

  data_engineer: `MORGAN LEE
Data Engineer & Data Scientist
Email: morgan.lee@example.com

SUMMARY:
Data Professional specializing in Python, SQL, Machine Learning pipelines, and PySpark data streaming.

SKILLS:
- Languages & Tools: Python, SQL, PySpark, Pandas, NumPy, Scikit-Learn, TensorFlow
- Databases: PostgreSQL, Snowflake, BigQuery, Redis
- Core Concepts: Machine Learning Algorithms, Feature Engineering, Data Pipelines`
};

export const TECH_SKILLS_DICTIONARY = [
  'java 17', 'java 11', 'java', 'spring boot', 'spring data', 'hibernate', 'junit', 'kafka', 'apache kafka',
  'python', 'javascript', 'typescript', 'c++', 'c#', 'go', 'golang', 'rust',
  'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 'flask', 'fastapi',
  'dsa', 'data structures', 'algorithms', 'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git', 'graphql', 'rest api',
  'system design', 'microservices', 'concurrency', 'multithreading', 'machine learning', 'pandas', 'numpy', 'pyspark'
];

export class ResumeParserService {
  /**
   * Sanitize raw text (strips PDF binary headers if any)
   */
  sanitizeText(raw) {
    if (!raw) return '';
    // Strip non-printable control characters except newlines/tabs
    return raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
              .replace(/%PDF-[\d\.]+/g, '')
              .replace(/stream[\s\S]*?endstream/g, ' ');
  }

  /**
   * Extract key skills, projects, and domain highlights from resume text
   */
  parseResumeText(rawInputText) {
    const text = this.sanitizeText(rawInputText);
    if (!text || text.trim().length < 20) return null;

    const lowerText = text.toLowerCase();
    
    // 1. Extract Detected Technical Skills
    const detectedSkills = [];
    TECH_SKILLS_DICTIONARY.forEach(skill => {
      if (lowerText.includes(skill)) {
        let formatted = skill.length <= 4 ? skill.toUpperCase() : skill.charAt(0).toUpperCase() + skill.slice(1);
        if (skill === 'java 17' || skill === 'java 11') formatted = 'Java';
        if (skill === 'spring boot') formatted = 'Spring Boot';
        if (skill === 'data structures' || skill === 'algorithms') formatted = 'DSA';
        if (!detectedSkills.includes(formatted)) {
          detectedSkills.push(formatted);
        }
      }
    });

    // 2. Extract Work Experience / Project Highlights
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const projectLines = lines.filter(l => 
      (l.toLowerCase().includes('project') || 
       l.toLowerCase().includes('developed') || 
       l.toLowerCase().includes('built') || 
       l.toLowerCase().includes('engineered') ||
       l.toLowerCase().includes('designed') ||
       l.toLowerCase().includes('implemented') ||
       l.toLowerCase().includes('spearheaded') ||
       l.toLowerCase().includes('reduced')) &&
       l.length > 25 && l.length < 250
    );

    // 3. Primary Focus / Role Detection
    let primaryFocus = 'Software Engineering';
    if (lowerText.includes('java') || lowerText.includes('spring')) primaryFocus = 'Senior Java & Backend Engineer';
    else if (lowerText.includes('react') || lowerText.includes('full-stack')) primaryFocus = 'Full-Stack Web Engineer';
    else if (lowerText.includes('data structures') || lowerText.includes('dsa') || lowerText.includes('algorithms')) primaryFocus = 'Algorithms & Software Engineer';
    else if (lowerText.includes('python') || lowerText.includes('machine learning') || lowerText.includes('pyspark')) primaryFocus = 'Data Engineer & AI Specialist';

    return {
      rawText: text,
      detectedSkills: detectedSkills.length > 0 ? detectedSkills : ['Java', 'SQL', 'DSA', 'REST APIs', 'Git'],
      projectHighlights: projectLines.length > 0 ? projectLines.slice(0, 5) : [
        'Engineered real-time backend microservices with high concurrency guarantees.',
        'Optimized SQL database query indexes, reducing latency significantly.',
        'Implemented automated CI/CD pipelines and unit testing suites.'
      ],
      primaryFocus,
      wordCount: text.split(/\s+/).length
    };
  }

  /**
   * Generate dynamic personalized interview questions based on parsed resume
   */
  generateTailoredQuestions(parsedResume) {
    if (!parsedResume || !parsedResume.detectedSkills) return [];

    const skills = parsedResume.detectedSkills;
    const projects = parsedResume.projectHighlights;
    const questions = [];

    // Question 1: Experience & Resume Project Walkthrough
    const firstProj = projects[0] || 'Engineered high-concurrency microservices';
    questions.push({
      id: 'res_q1',
      title: 'Resume Project Architecture Deep-Dive',
      question: `On your resume, you highlighted: "${firstProj}". Can you walk me through your architectural decisions, trade-offs, and technical contributions on that project?`,
      starGuide: {
        situation: 'Context of this specific resume project.',
        task: 'Your specific technical ownership and performance goals.',
        action: 'Design patterns, tech stack used, and concurrency/database optimizations.',
        result: 'Measurable latency reduction or throughput gains.'
      },
      keyKeywords: skills.slice(0, 5),
      modelAnswer: `In that project, I took full ownership of designing the backend architecture using ${skills.slice(0, 3).join(', ')}. My goal was optimizing system throughput while ensuring data consistency. I introduced caching layers and database indexing, which resulted in a 40% reduction in endpoint latency and seamless scaling.`
    });

    // Question 2: Tech-Specific Deep Dive (Java / DSA / Cloud / SQL)
    const isJava = skills.some(s => s.toLowerCase().includes('java'));
    if (isJava) {
      questions.push({
        id: 'res_q2_java',
        title: 'Java Concurrency & Memory Management',
        question: 'Your resume features Java expertise. How do you handle thread safety, garbage collection pauses, and race conditions in high-throughput Java Spring applications?',
        starGuide: {
          situation: 'High concurrency write traffic in Java.',
          task: 'Ensuring thread safety and minimal GC overhead.',
          action: 'Using synchronized, ConcurrentHashMap, ReentrantLocks, Atomic variables, ExecutorService, and G1 GC tuning.',
          result: 'Zero deadlocks and stable JVM heap utilization.'
        },
        keyKeywords: ['thread safety', 'concurrency', 'synchronized', 'jvm', 'garbage collection', 'executor service', 'spring boot'],
        modelAnswer: 'In Java, I ensure thread safety by leveraging ConcurrentHashMap for thread-safe lock-free reads, AtomicInteger for thread-safe counters, and explicit ReentrantLocks for fine-grained control. I manage background workers via ExecutorService thread pools to prevent memory exhaustion.'
      });
    } else {
      questions.push({
        id: 'res_q2_dsa',
        title: 'Data Structures & Optimization',
        question: `Based on your resume experience with ${skills[0] || 'software development'}, how do you evaluate Big-O time and space complexity when optimizing data processing pipelines?`,
        starGuide: {
          situation: 'Bottleneck in data processing algorithm.',
          task: 'Reducing execution complexity.',
          action: 'Using HashMaps, Trees, or Heaps to trade memory for speed.',
          result: 'Optimal O(N) or O(N log N) runtime.'
        },
        keyKeywords: ['time complexity', 'space complexity', 'big o', 'hashmap', 'heap', 'optimization'],
        modelAnswer: 'I start by analyzing algorithmic bounds. Trading linear auxiliary space for speed—such as utilizing HashMaps for O(1) lookups instead of nested loops—drops complexity from O(N^2) to O(N).'
      });
    }

    // Question 3: Behavioral Leadership & Trade-offs
    questions.push({
      id: 'res_q3_behavioral',
      title: 'Technical Conflict & Project Deadlines',
      question: `Describe a situation from your work history where project requirements changed suddenly or your team had conflicting technical opinions. How did you guide the engineering outcome?`,
      starGuide: {
        situation: 'Changing constraints or team architectural disagreement.',
        task: 'Aligning team technical direction while meeting release target.',
        action: 'Data-driven benchmarks, trade-off analysis, transparent communication.',
        result: 'On-time delivery with team consensus.'
      },
      keyKeywords: ['trade-offs', 'benchmarks', 'consensus', 'communication', 'milestone', 'ownership'],
      modelAnswer: 'When team members disagreed between relational and NoSQL options, I built a quick benchmark prototype to measure write latencies under load. The data clearly demonstrated relational compliance was necessary. I presented the findings collaboratively, securing team buy-in and launching on schedule.'
    });

    return questions;
  }
}

export const resumeParserInstance = new ResumeParserService();
