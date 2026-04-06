import { ResumeData } from '@/components/ResumePreview';

export interface ATSAnalysis {
  score: number;
  keywordMatch: number;
  skillsScore: number;
  experienceScore: number;
  formattingScore: number;
  suggestions: string[];
  missingKeywords: string[];
}

const ROLE_KEYWORDS: Record<string, string[]> = {
  "Frontend Developer": ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind", "Next.js", "REST API", "Redux", "Framer Motion", "Vite", "Webpack", "D3.js"],
  "Backend Developer": ["Node.js", "Express", "MongoDB", "PostgreSQL", "SQL", "Python", "Django", "Docker", "Kubernetes", "AWS", "Redis", "Auth", "Security"],
  "Full Stack Developer": ["React", "Node.js", "Express", "MongoDB", "TypeScript", "Next.js", "API", "Git", "SQL", "Cloud", "Vercel"],
  "Software Engineer": ["Algorithms", "Data Structures", "System Design", "Java", "Python", "C++", "Testing", "Unit Testing", "Debugging", "Git", "Cloud"],
  "UI/UX Designer": ["Figma", "Adobe XD", "User Research", "Prototyping", "Wireframing", "Typography", "Color Theory", "HCI", "Accessibility", "Design Systems"],
  "Data Scientist": ["Python", "R", "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
  "DevOps Engineer": ["AWS", "Azure", "GCP", "CI/CD", "Docker", "Kubernetes", "Terraform", "Ansible", "Linux", "Scripting", "Monitoring"],
};

export function calculateATSScore(data: ResumeData): ATSAnalysis {
  const role = data.personalInfo.role || "Software Engineer";
  const targetKeywords = ROLE_KEYWORDS[role] || ROLE_KEYWORDS["Software Engineer"];
  
  const resumeText = JSON.stringify(data).toLowerCase();
  const suggestions: string[] = [];
  
  // 1. Keywords Match (40 points)
  const matchedKeywords = targetKeywords.filter(kw => resumeText.includes(kw.toLowerCase()));
  const missingKeywords = targetKeywords.filter(kw => !resumeText.includes(kw.toLowerCase()));
  const keywordMatchScore = (matchedKeywords.length / targetKeywords.length) * 40;
  
  if (missingKeywords.length > 3) {
    suggestions.push(`Add missing industry keywords like: ${missingKeywords.slice(0, 3).join(", ")}`);
  }

  // 2. Skills Completeness (20 points)
  let skillsScore = 0;
  if (data.skills.length >= 3) skillsScore = 20;
  else if (data.skills.length > 0) skillsScore = 15;
  else suggestions.push("Categorize your skills into sections (e.g., Languages, Tools, Frameworks)");

  // 3. Experience Quality (20 points)
  let expScore = 0;
  const longBullets = data.experience.reduce((acc, exp) => acc + exp.bullets.filter(b => b.length > 40).length, 0);
  
  if (data.experience.length >= 2 && longBullets >= 4) expScore = 20;
  else if (data.experience.length > 0) expScore = 15;
  
  if (longBullets < 3) suggestions.push("Make bullet points more detailed (Action verb + Result + Metric)");

  // 4. Formatting & Sections (20 points)
  let formattingScore = 0;
  if (data.personalInfo.fullName && data.personalInfo.email && data.personalInfo.phone) formattingScore += 4;
  if (data.summary && data.summary.length > 50) formattingScore += 4;
  if (data.education.length > 0) formattingScore += 4;
  if (data.projects && data.projects.length > 0) formattingScore += 4;
  if ((data.achievements && data.achievements.length > 0) || (data.certifications && data.certifications.length > 0)) formattingScore += 4;

  if (!data.summary) suggestions.push("Add a professional summary (2-3 lines)");
  if (data.education.length === 0) suggestions.push("Include your educational background");
  if (!data.projects || data.projects.length === 0) suggestions.push("Highlight technical projects to demonstrate hands-on skills");

  const totalScore = Math.round(keywordMatchScore + skillsScore + expScore + formattingScore);

  return {
    score: totalScore,
    keywordMatch: Math.round((matchedKeywords.length / targetKeywords.length) * 100),
    skillsScore: Math.round((skillsScore / 20) * 100),
    experienceScore: Math.round((expScore / 20) * 100),
    formattingScore: Math.round((formattingScore / 20) * 100),
    suggestions,
    missingKeywords: missingKeywords.slice(0, 10)
  };
}
