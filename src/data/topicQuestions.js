export const TOPIC_CATEGORIES = [
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms (DSA)',
    icon: 'Cpu',
    description: 'Arrays, Binary Trees, Dynamic Programming, Graphs, Complexity & Big-O Analysis',
    badgeColor: 'badge-indigo'
  },
  {
    id: 'java',
    name: 'Java Core & OOP Engineering',
    icon: 'Coffee',
    description: 'JVM Internals, Multithreading, Concurrency, Spring Boot, Collections & Memory',
    badgeColor: 'badge-amber'
  },
  {
    id: 'system_design',
    name: 'System Design & Architecture',
    icon: 'Layers',
    description: 'Scalability, Load Balancers, Microservices, Message Queues & Caching',
    badgeColor: 'badge-cyan'
  },
  {
    id: 'sql',
    name: 'SQL & Database Systems',
    icon: 'Database',
    description: 'Query Optimization, Indexing, ACID Transactions, Isolation Levels & NoSQL',
    badgeColor: 'badge-emerald'
  },
  {
    id: 'web_react',
    name: 'Web Dev & React Ecosystem',
    icon: 'Globe',
    description: 'Virtual DOM, State Management, Rendering Performance, Web Security & APIs',
    badgeColor: 'badge-rose'
  },
  {
    id: 'cloud_devops',
    name: 'Cloud Infrastructure & DevOps',
    icon: 'Cloud',
    description: 'Docker, Kubernetes, AWS Services, CI/CD Pipelines & Terraform',
    badgeColor: 'badge-indigo'
  },
  {
    id: 'python_ml',
    name: 'Python & Data Science / ML',
    icon: 'Terminal',
    description: 'Data Analysis, Machine Learning Algorithms, Pandas, NumPy & Model Deployment',
    badgeColor: 'badge-cyan'
  }
];

export const TOPIC_QUESTIONS = {
  dsa: [
    {
      id: 'dsa_1',
      title: 'Time & Space Complexity Trade-offs',
      question: 'Walk me through how you optimize an O(N^2) algorithm down to O(N log N) or O(N). Give a concrete example using HashMaps or Heaps.',
      starGuide: {
        situation: 'Encountering performance bottleneck with nested loops.',
        task: 'Reducing execution complexity.',
        action: 'Using space (HashMaps, Frequency tables, Pointers) to trade memory for speed.',
        result: 'Exponential decrease in execution time.'
      },
      keyKeywords: ['time complexity', 'space complexity', 'hashmap', 'two pointers', 'heap', 'big o'],
      modelAnswer: 'To optimize an O(N^2) brute-force algorithm like 2-Sum, I trade linear auxiliary space for time. By storing seen elements in a HashMap, we achieve O(1) lookups. Iterate through the array once: for each number, check if target minus current exists in the map. This reduces total time complexity to O(N) while using O(N) space.'
    },
    {
      id: 'dsa_2',
      title: 'Binary Tree Traversal & BFS vs DFS',
      question: 'Compare Breadth-First Search (BFS) and Depth-First Search (DFS) for tree/graph traversal. When would you strictly choose BFS over DFS?',
      starGuide: {
        situation: 'Graph or tree searching requirement.',
        task: 'Finding shortest path vs exhaustive search.',
        action: 'Choosing Queue (BFS) vs Stack/Recursion (DFS).',
        result: 'Optimal memory utilization and path guarantee.'
      },
      keyKeywords: ['bfs', 'dfs', 'queue', 'stack', 'shortest path', 'recursion', 'binary tree'],
      modelAnswer: 'BFS uses a Queue data structure to explore nodes level-by-level, making it ideal for finding the shortest path in unweighted graphs or level-order tree traversals. DFS uses a Stack or recursion to go deep along a path first, making it memory-efficient for deep trees with low branching factors and cycle detection.'
    }
  ],
  java: [
    {
      id: 'java_1',
      title: 'Java Memory Management & JVM Heap vs Stack',
      question: 'Explain the difference between Heap and Stack memory in Java. How does the Garbage Collector (GC) identify and reclaim unreachable objects?',
      starGuide: {
        situation: 'JVM memory utilization and performance tuning.',
        task: 'Preventing OutOfMemoryError and GC pauses.',
        action: 'Understanding Stack frames (local variables) vs Heap (object allocation), Mark-and-Sweep GC.',
        result: 'Smooth JVM execution and memory leak prevention.'
      },
      keyKeywords: ['heap', 'stack', 'garbage collection', 'mark and sweep', 'memory leak', 'jvm', 'young generation'],
      modelAnswer: 'In Java, the Stack stores primitive local variables and method call frames per thread, automatically cleared when methods return. The Heap stores all instantiated objects. The Garbage Collector uses root-traceability algorithms to mark reachable objects from thread stacks and garbage-collect unreferenced objects in Young/Old generations using algorithms like G1 or ZGC.'
    },
    {
      id: 'java_2',
      title: 'Java Concurrency & Synchronization',
      question: 'How do synchronized blocks, ReentrantLocks, and ConcurrentHashMap differ when building thread-safe applications in Java?',
      starGuide: {
        situation: 'Multi-threaded Java application accessing shared resources.',
        task: 'Ensuring thread safety without causing thread starvation or deadlocks.',
        action: 'Choosing intrinsic locks vs explicit locks vs bucket-level lock striping.',
        result: 'High concurrency write throughput with thread safety.'
      },
      keyKeywords: ['synchronized', 'reentrantlock', 'concurrenthashmap', 'lock striping', 'thread safety', 'deadlock'],
      modelAnswer: 'The synchronized keyword provides intrinsic monitor locking on objects. ReentrantLock offers advanced capabilities like lock polling (tryLock), fairness policies, and interruptibility. ConcurrentHashMap provides fine-grained concurrency using lock striping (CAS operations and bucket locks) allowing concurrent reads without blocking other threads.'
    }
  ],
  system_design: [
    {
      id: 'sd_1',
      title: 'Caching Strategies & Cache Invalidation',
      question: 'Explain Cache-Aside vs Write-Through vs Write-Back caching strategies. How do you prevent Cache Stampede (Thundering Herd)?',
      starGuide: {
        situation: 'High volume database reads bottlenecking system performance.',
        task: 'Implementing a fast in-memory cache layer (Redis/Memcached).',
        action: 'Designing caching patterns and stampede protection.',
        result: 'Sub-10ms query latency and reduced database load.'
      },
      keyKeywords: ['cache-aside', 'redis', 'cache stampede', 'write-through', 'ttl', 'mutex lock'],
      modelAnswer: 'In Cache-Aside, the application reads from Redis first; on a cache miss, it queries the DB and updates Redis. In Write-Through, writes synchronously update cache and DB together. To prevent Cache Stampede (multiple workers querying the DB simultaneously when cache expires), I use distributed locks or probabilistic early expiration (XFetch).'
    }
  ],
  sql: [
    {
      id: 'sql_1',
      title: 'Database Indexing B-Trees vs Hash Indexes',
      question: 'How do B-Tree indexes improve database query speed? What are the write performance trade-offs of adding too many indexes?',
      starGuide: {
        situation: 'Slow SQL SELECT queries on large tables.',
        task: 'Optimizing execution plans without hurting INSERT/UPDATE speed.',
        action: 'Creating composite B-Tree indexes on WHERE and JOIN columns.',
        result: 'Fast logarithmic lookups O(log N).'
      },
      keyKeywords: ['b-tree', 'indexing', 'execution plan', 'composite index', 'write amplification', 'select'],
      modelAnswer: 'B-Tree indexes maintain a balanced tree structure storing column values and row pointers, allowing logarithmic O(log N) range and equality searches instead of full table scans. However, every INSERT, UPDATE, or DELETE requires updating index trees (write amplification), so indexes should be strategically limited to high-cardinality query columns.'
    }
  ],
  web_react: [
    {
      id: 'react_1',
      title: 'React Virtual DOM & Reconciliation',
      question: 'How does React’s Virtual DOM and Fiber Reconciliation algorithm minimize actual browser DOM manipulations?',
      starGuide: {
        situation: 'Rendering complex dynamic web UI without lag.',
        task: 'Optimizing browser repaints and reflows.',
        action: 'Virtual DOM diffing, keys in lists, batching state updates.',
        result: 'Smooth 60 FPS user interface updates.'
      },
      keyKeywords: ['virtual dom', 'reconciliation', 'fiber', 'diffing', 'batching', 'usememo', 'usecallback'],
      modelAnswer: 'React maintains a lightweight Virtual DOM tree in memory. When state changes, React constructs a new Virtual DOM tree and runs its Fiber diffing algorithm to compute the minimal set of DOM changes. It then batches real DOM updates in a single browser repaint, avoiding expensive layout reflows.'
    }
  ],
  cloud_devops: [
    {
      id: 'cloud_1',
      title: 'Docker Containerization & Kubernetes Orchestration',
      question: 'Explain how Kubernetes handles auto-scaling (HPA), health checks (liveness vs readiness probes), and zero-downtime rolling updates.',
      starGuide: {
        situation: 'Deploying containerized microservices to cloud environment.',
        task: 'Ensuring zero downtime and auto-scaling during traffic surges.',
        action: 'Configuring Kubernetes Deployments, HPA, and Probes.',
        result: '99.99% service availability.'
      },
      keyKeywords: ['kubernetes', 'hpa', 'liveness probe', 'readiness probe', 'rolling update', 'docker'],
      modelAnswer: 'Kubernetes Horizontal Pod Autoscaler (HPA) monitors CPU/Memory or custom metrics to scale pod replicas up or down. Liveness probes restart unhealthy containers, while readiness probes ensure pods receive traffic only after fully initializing. Rolling updates replace old pods incrementally, ensuring continuous service uptime.'
    }
  ],
  python_ml: [
    {
      id: 'py_1',
      title: 'Overfitting vs Underfitting in Machine Learning',
      question: 'Explain Overfitting vs Underfitting in ML. What techniques (L1/L2 Regularization, Cross-Validation, Dropout) do you use to mitigate overfitting?',
      starGuide: {
        situation: 'Model achieving high training accuracy but poor test set generalization.',
        task: 'Improving model generalization.',
        action: 'Applying Regularization, Data Augmentation, Early Stopping.',
        result: 'Optimal bias-variance trade-off.'
      },
      keyKeywords: ['overfitting', 'regularization', 'l1 l2', 'cross-validation', 'dropout', 'bias variance'],
      modelAnswer: 'Overfitting occurs when a model learns noise in training data (high variance, low bias), failing to generalize to unseen test data. Underfitting is high bias. I mitigate overfitting using L1 (Lasso) / L2 (Ridge) regularization penalties, K-Fold cross-validation, Dropout in neural networks, and early stopping on validation loss.'
    }
  ]
};
