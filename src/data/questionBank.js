export const ROLES = [
  { id: 'swe', name: 'Software Engineer', icon: 'Code', description: 'Algorithms, Architecture, System Design & Behavioral' },
  { id: 'pm', name: 'Product Manager', icon: 'Layers', description: 'Product Design, Metrics, Execution & Leadership' },
  { id: 'ds', name: 'Data Scientist / ML Engineer', icon: 'Database', description: 'ML Systems, Statistics, Data Pipeline & Problem Solving' },
  { id: 'fin', name: 'Financial & Business Analyst', icon: 'TrendingUp', description: 'Financial Modeling, Valuation, Strategy & Analytics' },
  { id: 'hr', name: 'HR & Executive Leadership', icon: 'Users', description: 'Culture Fit, Conflict Resolution, Strategy & Growth' },
];

export const INTERVIEW_TYPES = [
  { id: 'behavioral', name: 'Behavioral (STAR Method)', description: 'Evaluates past actions, soft skills, & conflict management' },
  { id: 'technical', name: 'Technical & Domain Deep-Dive', description: 'Evaluates core technical skills, trade-offs & problem solving' },
  { id: 'system_design', name: 'System Design & Architecture', description: 'Evaluates scalability, trade-offs & high-level system thinking' },
  { id: 'culture_fit', name: 'HR & Cultural Alignment', description: 'Evaluates motivation, teamwork, adaptability & leadership' },
];

export const EXPERIENCE_LEVELS = [
  { id: 'entry', label: 'Junior / Entry Level (0-2 Yrs)' },
  { id: 'mid', label: 'Mid-Level (2-5 Yrs)' },
  { id: 'senior', label: 'Senior Engineer / Lead (5-8 Yrs)' },
  { id: 'staff', label: 'Staff / Executive (8+ Yrs)' },
];

export const INTERVIEWER_PERSONAS = [
  { id: 'professional', name: 'Professional & Direct', description: 'Formal, focused on facts, crisp probing questions', voicePitch: 1.0, voiceRate: 1.0 },
  { id: 'encouraging', name: 'Supportive & Encouraging', description: 'Friendly tone, provides hints when stuck, positive feedback', voicePitch: 1.1, voiceRate: 0.95 },
  { id: 'strict', name: 'Challenging & Rigorous', description: 'Pushes on edge cases, questions assumptions, high standard', voicePitch: 0.9, voiceRate: 1.05 },
];

export const QUESTION_BANK = {
  swe: {
    behavioral: [
      {
        id: 'swe_b1',
        title: 'Handling Technical Disagreement',
        question: 'Tell me about a time you had a strong technical disagreement with a teammate or tech lead. How did you resolve it?',
        starGuide: {
          situation: 'Describe a specific technical conflict (e.g. database choice, API architecture, refactoring strategy).',
          task: 'Explain your goal and why the disagreement mattered for the project outcomes.',
          action: 'Detail how you gathered data, benchmarks, or prototypes to evaluate options collaboratively without emotion.',
          result: 'State the resolution, the technical outcome, and how it improved team trust or product reliability.'
        },
        keyKeywords: ['benchmark', 'trade-offs', 'data-driven', 'collaboration', 'consensus', 'compromise', 'prototype'],
        followUps: [
          'What would you have done if the team lead still insisted on their approach despite your data?',
          'Looking back, was there anything you could have handled better in that communication?'
        ],
        modelAnswer: 'At my previous company, my senior colleague wanted to use MongoDB for our new analytics service, while I argued for PostgreSQL due to our strict ACID compliance and relational reporting needs. Instead of arguing in abstract, I spent half a day building a quick benchmark with representative production workloads. The data showed Postgres delivered 40% faster query latency for our multi-table joins. I presented the findings in a friendly review, we agreed on Postgres, and the service successfully launched handling over 10M daily requests with zero schema corruption.'
      },
      {
        id: 'swe_b2',
        title: 'Debugging Under Pressure',
        question: 'Describe a situation where a critical bug occurred in production. How did you diagnose and remediate it?',
        starGuide: {
          situation: 'Context of the incident (severity level, impact on users, alert triggered).',
          task: 'Your role during the incident (incident commander, responder, triage lead).',
          action: 'Step-by-step diagnostic workflow: logs, metrics, rollback vs hotfix, communication.',
          result: 'Resolution time, post-mortem outcome, and preventive measures implemented.'
        },
        keyKeywords: ['monitoring', 'logs', 'metrics', 'rollback', 'post-mortem', 'root cause', 'circuit breaker'],
        followUps: [
          'How did you communicate the outage status to stakeholders while investigating?',
          'What permanent guardrails did you put in place to prevent this bug from reoccurring?'
        ],
        modelAnswer: 'During a Black Friday traffic surge, our checkout API endpoint started returning 500 error spikes. As lead responder, I immediately reviewed our Datadog APM metrics and identified connection pool exhaustion in our Redis cache cluster. To restore user checkout immediately, I triggered an automated canary rollback to the previous stable release. Once traffic stabilized, I identified a leak in our connection pooling code, wrote regression tests, and merged a hotfix within 45 minutes. Subsequently, I established automated circuit breakers and load tests before major releases.'
      }
    ],
    technical: [
      {
        id: 'swe_t1',
        title: 'Concurrency & Race Conditions',
        question: 'How do you detect and prevent race conditions when building high-concurrency microservices?',
        starGuide: {
          situation: 'Scenarios like inventory updates, wallet balances, or seat reservations.',
          task: 'Preventing double-spend or inconsistent state across distributed workers.',
          action: 'Utilizing locks (pessimistic vs optimistic), atomic operations, database constraints, message queues.',
          result: 'Ensuring strict data consistency with minimal lock contention latency.'
        },
        keyKeywords: ['optimistic locking', 'pessimistic locking', 'mutex', 'atomic', 'distributed lock', 'redis', 'isolation level'],
        followUps: [
          'How do optimistic locks compare to pessimistic locks in high-throughput write environments?',
          'How would you prevent deadlocks when locking multiple resources simultaneously?'
        ],
        modelAnswer: 'To prevent race conditions in concurrent services like payment processing, I utilize optimistic locking with version vectors for medium-contention paths, and distributed Redis locks with Redlock algorithm for strict single-execution paths. At the database level, using atomic updates like UPDATE balance = balance - X WHERE balance >= X and appropriate transaction isolation levels (e.g. Repeatable Read) prevents double-allocation while avoiding heavy table locks.'
      }
    ],
    system_design: [
      {
        id: 'swe_sd1',
        title: 'Design a Real-Time Notification System',
        question: 'Walk me through designing a scalable real-time notification system capable of sending push notifications, emails, and SMS to 50 million active daily users.',
        starGuide: {
          situation: 'High volume, multi-channel notification requirements with varying priority.',
          task: 'Architecture for ingestion, queueing, routing, deduplication, and rate limiting.',
          action: 'Define components: API Gateway, Kafka/RabbitMQ queues, Worker pools, Notification Dispatchers, Cache layer.',
          result: 'Sub-second delivery latency, high availability, graceful degradation under load.'
        },
        keyKeywords: ['pub/sub', 'kafka', 'rate limiting', 'deduplication', 'idempotency', 'websockets', 'retry queue', 'dead letter queue'],
        followUps: [
          'How do you guarantee idempotency so users never receive duplicate push notifications?',
          'What happens when a third-party provider like Twilio or APNS experiences an outage?'
        ],
        modelAnswer: 'I would design a decoupled event-driven architecture. Incoming notification requests pass through an API gateway with token bucket rate limiting into a Kafka partition queue grouped by priority. Dedicated worker clusters consume events, check Redis for idempotency keys to avoid duplicate deliveries within a time window, and dispatch to third-party providers (APNS, Firebase FCM, SendGrid). Failed dispatches are routed to exponential backoff retry queues and eventually a Dead Letter Queue (DLQ) for alerting.'
      }
    ]
  },
  pm: {
    behavioral: [
      {
        id: 'pm_b1',
        title: 'Prioritizing Feature Roadmap',
        question: 'How do you prioritize competing feature requests from Sales, Engineering, and executive stakeholders when resources are limited?',
        starGuide: {
          situation: 'Conflicting priorities between immediate revenue and technical debt / UX.',
          task: 'Framework for objective prioritization without alienating teams.',
          action: 'Frameworks like RICE (Reach, Impact, Confidence, Effort) or Kano model, stakeholder alignment workshops.',
          result: 'Balanced roadmap delivering key ARR goals while maintaining platform health.'
        },
        keyKeywords: ['RICE framework', 'ROI', 'customer value', 'technical debt', 'stakeholder alignment', 'trade-offs'],
        followUps: [
          'How do you say "no" to an influential enterprise customer asking for a custom feature?',
          'What metrics do you use to evaluate if a prioritized feature was actually successful post-launch?'
        ],
        modelAnswer: 'I apply a transparent, data-driven framework using RICE scoring alongside strategic alignment buckets (Growth, Retention, Platform Health). When Sales requested custom enterprise features while Engineering advocated for refactoring our auth service, I facilitated a joint roadmap session. We quantified the ARR impact of the sales deals versus the latency risk on churn if auth degraded. By demonstrating the RICE breakdown, we carved out 70% capacity for core product value and 30% for platform stability, delivering both revenue and system reliability.'
      }
    ]
  },
  ds: {
    behavioral: [
      {
        id: 'ds_b1',
        title: 'Explaining Complex ML Models to Business Stakeholders',
        question: 'Describe a time you had to explain a complex machine learning model or statistical finding to non-technical executives. How did you ensure buy-in?',
        starGuide: {
          situation: 'Complex model (e.g., XGBoost, Deep Learning, Recommendation System).',
          task: 'Translating math/metrics (F1-score, AUC-ROC) into business value (ROI, Churn reduction).',
          action: 'Use of visual aids, SHAP feature importance charts, relatable analogies, clear dollar impact.',
          result: 'Executive sign-off, deployment approval, and measurable business growth.'
        },
        keyKeywords: ['SHAP values', 'business impact', 'ROI', 'model interpretability', 'data visualization', 'clarity'],
        followUps: [
          'How did you handle skepticism from executives who favored traditional heuristic rules?',
          'What key business metric did you tie your model performance directly to?'
        ],
        modelAnswer: 'We developed a gradient boosting model to predict customer churn. Instead of presenting Precision-Recall curves or Log-Loss metrics to the VP of Marketing, I translated the results into actionable business impact. Using SHAP value visualizations, I showed that targeting the top 15% risk segment identified by our model would preserve $2.4M in annual recurring revenue. By focusing on ROI, user risk personas, and actionable retention strategies rather than mathematical jargon, we secured budget for full production deployment.'
      }
    ]
  },
  fin: {
    behavioral: [
      {
        id: 'fin_b1',
        title: 'Financial Forecasting Under Uncertainty',
        question: 'Walk me through a scenario where you built a financial model with incomplete data or high market volatility.',
        starGuide: {
          situation: 'High volatility or launch in a new unproven market segment.',
          task: 'Building robust multi-scenario financial forecasts.',
          action: 'Sensitivity analysis, Monte Carlo simulation, benchmarking peer comps.',
          result: 'Risk-adjusted budget guidance adopted by C-suite.'
        },
        keyKeywords: ['sensitivity analysis', 'DCF', 'scenario modeling', 'EBITDA', 'variance analysis', 'risk mitigation'],
        followUps: [
          'Which assumptions turned out to be most sensitive in your financial sensitivity matrix?',
          'How often did you re-forecast once actual performance data began rolling in?'
        ],
        modelAnswer: 'When modeling revenue projections for a new SaaS product line in an emerging market, historical internal data was non-existent. I built a dynamic 3-way financial model using driver-based assumptions anchored on public competitor benchmarks and industry CAC/LTV ratios. I incorporated sensitivity tables testing worst-case, base-case, and bull-case customer adoption rates. This provided executive leadership with a clear risk-adjusted payback period view, enabling them to cap initial capital expenditure while maintaining strategic upside.'
      }
    ]
  },
  hr: {
    behavioral: [
      {
        id: 'hr_b1',
        title: 'Driving Organizational Change',
        question: 'Tell me about a time you led a major cultural or organizational policy shift across a team or company.',
        starGuide: {
          situation: 'Resistance to change, process rollout, remote work policy or restructuring.',
          task: 'Fostering adoption, transparent communication, and maintaining employee morale.',
          action: 'Town halls, feedback loops, champion networks, clear documentation.',
          result: 'High adoption rate, improved satisfaction scores, zero key talent loss.'
        },
        keyKeywords: ['change management', 'empowerment', 'active listening', 'transparency', 'pulse survey', 'retention'],
        followUps: [
          'How did you handle pushback from senior managers who resisted the new guidelines?',
          'How did you measure employee sentiment throughout the transition phase?'
        ],
        modelAnswer: 'When transitioning our 300-person organization to a hybrid work model, initial feedback showed anxiety around performance evaluation equity. I structured a transparent change management rollout: establishing a manager playbook, hosting open Q&A town halls, and implementing weekly pulse surveys. We established clear outcome-based OKRs rather than hours-logged metrics. As a result, team satisfaction scores increased by 28%, and retention remained at 96% over the year.'
      }
    ]
  }
};
