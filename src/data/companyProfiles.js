/**
 * Indian Placement & Global Enterprise Company Profiles, Roles & Interview Rounds
 */

export const TARGET_COMPANIES = [
  { id: 'tcs', name: 'TCS (Tata Consultancy Services)', category: 'Mass Recruiter / IT Services', difficulty: 'Medium', focusAreas: ['Java Core', 'SQL Databases', 'Aptitude & Logical', 'HRSTAR Behavioral'] },
  { id: 'infosys', name: 'Infosys (InfyTQ / HackWithInfy)', category: 'Mass Recruiter / Product', difficulty: 'Medium', focusAreas: ['Data Structures', 'OOP Java/Python', 'DBMS Queries', 'Pseudocode'] },
  { id: 'accenture', name: 'Accenture', category: 'Consulting & Technology', difficulty: 'Medium', focusAreas: ['Cloud Basics', 'System Fundamentals', 'Communication & English', 'HR Cultural'] },
  { id: 'wipro', name: 'Wipro (NLTH / Elite)', category: 'IT Services', difficulty: 'Medium', focusAreas: ['C++/Java', 'Coding Algorithms', 'Aptitude', 'Behavioral'] },
  { id: 'deloitte', name: 'Deloitte', category: 'Big 4 Consulting & Analytics', difficulty: 'Medium-Hard', focusAreas: ['Business Case Studies', 'SQL & Data', 'Problem Solving', 'Managerial'] },
  { id: 'microsoft', name: 'Microsoft', category: 'Product / Big Tech', difficulty: 'Hard', focusAreas: ['Advanced DSA', 'Trees & Graphs', 'System Design', 'Leadership Principles'] },
  { id: 'google', name: 'Google', category: 'Product / Big Tech', difficulty: 'Hard', focusAreas: ['Complex Algorithms', 'Dynamic Programming', 'Scalability', 'Googliness HR'] },
  { id: 'custom', name: 'Custom Target Company', category: 'User Custom', difficulty: 'Adaptive', focusAreas: ['Core DSA', 'Technical Stack', 'Behavioral'] }
];

export const TARGET_ROLES = [
  { id: 'sde', name: 'Software Development Engineer (SDE)', focus: 'DSA, System Fundamentals, OOP & Code Quality' },
  { id: 'backend', name: 'Backend Engineer (Java / Node / Python)', focus: 'REST APIs, Databases, Concurrency, Microservices' },
  { id: 'aiml', name: 'AI / ML Engineer', focus: 'Python, ML Algorithms, Data Pipelines, Mathematics' },
  { id: 'data_analyst', name: 'Data Analyst & BI Engineer', focus: 'SQL Queries, Python Pandas, Data Viz, Business Metrics' },
  { id: 'custom_role', name: 'Custom Specialized Role', focus: 'Tailored Job Description requirements' }
];

export const INTERVIEW_ROUNDS = [
  { id: 'full', name: 'Full Comprehensive Interview (All Rounds)', roundsCount: 4, desc: 'Technical + Coding + System Design + HR Managerial' },
  { id: 'technical', name: 'Technical Deep-Dive Round', roundsCount: 1, desc: 'Core CS, Java/Python, DBMS, OS, Computer Networks' },
  { id: 'coding_dsa', name: 'Coding & DSA Round', roundsCount: 1, desc: 'Arrays, Strings, Trees, Graphs, Dynamic Programming' },
  { id: 'hr_managerial', name: 'HR & Managerial Fit Round', roundsCount: 1, desc: 'STAR Behavioral, Conflict Management, Ownership & Culture' },
  { id: 'aptitude_logic', name: 'Aptitude & Technical Logical Round', roundsCount: 1, desc: 'Pseudocode, Data Interpretation, Logical Reasoning' }
];
