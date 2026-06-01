import { GitHubUser, GitHubRepo, DeveloperDNA, DeveloperType } from '../types/github';

const FRONTEND_KEYWORDS = ['html', 'css', 'javascript', 'typescript', 'react', 'vue', 'angular', 'svelte', 'tailwind', 'frontend', 'ui', 'ux'];
const BACKEND_KEYWORDS = ['java', 'go', 'golang', 'rust', 'php', 'c#', 'c++', 'ruby', 'python', 'nodejs', 'express', 'nestjs', 'spring', 'django', 'backend', 'api', 'database'];
const AI_KEYWORDS = ['python', 'jupyter notebook', 'machine-learning', 'deep-learning', 'ai', 'tensorflow', 'pytorch', 'keras', 'llm', 'nlp', 'data-science', 'artificial-intelligence'];

export const analyzeDeveloperProfile = (user: GitHubUser, repos: GitHubRepo[]): DeveloperDNA => {
  const scores = {
    frontend: 0,
    backend: 0,
    ai: 0,
    openSource: 0,
  };

  // 1. Analyze Languages
  const languages = repos.map((repo) => repo.language?.toLowerCase()).filter(Boolean) as string[];
  languages.forEach((lang) => {
    if (FRONTEND_KEYWORDS.includes(lang)) scores.frontend += 2;
    if (BACKEND_KEYWORDS.includes(lang)) scores.backend += 2;
    if (AI_KEYWORDS.includes(lang)) scores.ai += 3; // AI languages are stronger indicators
  });

  // 2. Analyze Topics and Repo descriptions/names
  repos.forEach((repo) => {
    const searchString = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
    
    FRONTEND_KEYWORDS.forEach((kw) => {
      if (searchString.includes(kw)) scores.frontend += 1;
    });

    BACKEND_KEYWORDS.forEach((kw) => {
      if (searchString.includes(kw)) scores.backend += 1;
    });

    AI_KEYWORDS.forEach((kw) => {
      if (searchString.includes(kw)) scores.ai += 2;
    });

    // 3. Analyze Open Source contribution
    if (repo.fork) {
      scores.openSource += 1;
    } else if (repo.stargazers_count > 10) {
      scores.openSource += 2; // Popular original repos indicate good OS standing
    }
  });

  // Check Full Stack
  const isFullStack = scores.frontend > 10 && scores.backend > 10 && Math.abs(scores.frontend - scores.backend) <= 15;
  
  let developerType: DeveloperType = 'Frontend Engineer';
  let maxScore = 0;

  if (isFullStack) {
    developerType = 'Full Stack Engineer';
    maxScore = scores.frontend + scores.backend;
  } else {
    // Find the highest score among the rest
    const categoryScores: { type: DeveloperType; score: number }[] = [
      { type: 'Frontend Engineer', score: scores.frontend },
      { type: 'Backend Engineer', score: scores.backend },
      { type: 'AI Engineer', score: scores.ai },
      { type: 'Open Source Contributor', score: scores.openSource * 1.5 }, // Boost OS score to make it competitive
    ];

    const topCategory = categoryScores.reduce((prev, current) => (prev.score > current.score ? prev : current));
    developerType = topCategory.type;
    maxScore = topCategory.score;
  }

  // Calculate confidence (capped at 98%)
  const totalPoints = Object.values(scores).reduce((a, b) => a + b, 0);
  let confidence = 50; // Base confidence
  if (totalPoints > 0) {
     confidence = Math.min(98, Math.round(40 + (maxScore / totalPoints) * 60));
  }
  
  if(repos.length === 0) confidence = 20;

  // Generate Strengths and Recommendations
  const strengths = generateStrengths(developerType, scores, repos);
  const recommendations = generateRecommendations(developerType, scores);

  return {
    developerType,
    confidence,
    strengths,
    recommendations,
  };
};

const generateStrengths = (type: DeveloperType, scores: any, repos: GitHubRepo[]): string[] => {
  const strengths: string[] = [];
  
  if (type === 'Frontend Engineer') {
    strengths.push('Strong focus on user interface and experience');
    strengths.push('Proficient in modern web technologies and frameworks');
  } else if (type === 'Backend Engineer') {
    strengths.push('Focuses on system architecture and API design');
    strengths.push('Experienced with server-side languages and databases');
  } else if (type === 'Full Stack Engineer') {
    strengths.push('Versatile across the entire technology stack');
    strengths.push('Capable of building end-to-end applications independently');
  } else if (type === 'AI Engineer') {
    strengths.push('Expertise in machine learning and data science');
    strengths.push('Comfortable with complex analytical problem solving');
  } else if (type === 'Open Source Contributor') {
    strengths.push('Highly collaborative and active in the developer community');
    strengths.push('Experienced in reading and contributing to varied codebases');
  }

  // Add a generic strength based on repo count/stars
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  if (totalStars > 50) {
    strengths.push('Creates highly valued repositories recognized by the community');
  }
  
  return strengths;
};

const generateRecommendations = (type: DeveloperType, scores: any): string[] => {
  const recs: string[] = [];
  
  if (type === 'Frontend Engineer') {
    recs.push('Consider exploring backend technologies like Node.js to expand into Full Stack');
    recs.push('Contribute to open source UI component libraries to increase visibility');
  } else if (type === 'Backend Engineer') {
    recs.push('Learn a modern frontend framework like React or Vue to become Full Stack');
    recs.push('Explore cloud architecture and DevOps practices');
  } else if (type === 'Full Stack Engineer') {
    recs.push('Deep dive into system design for large scale applications');
    recs.push('Consider specializing in a niche area like Web3 or AI integration');
  } else if (type === 'AI Engineer') {
    recs.push('Publish papers or detailed articles on your ML models and findings');
    recs.push('Contribute to popular open source AI tools like PyTorch or HuggingFace');
  } else if (type === 'Open Source Contributor') {
    recs.push('Consider starting your own major open source project');
    recs.push('Sponsor or mentor junior developers in the open source space');
  }

  if (scores.openSource < 2) {
    recs.push('Try contributing to more external open source projects to diversify experience');
  }

  return recs;
};
