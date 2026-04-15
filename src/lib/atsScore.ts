import { ResumeData } from '@/components/ResumePreview';

export interface ATSAnalysis {
  score: number;
  breakdown: {
    keywords: number;
    skills: number;
    experience: number;
    projects: number;
    formatting: number;
  };
  eligibility: {
    company: string;
    status: 'Eligible ✅' | 'Partially Eligible ⚠️' | 'Not Eligible ❌';
    reason: string;
  }[];
  missingCapabilities: string[];
  strategy: string[];
  freeResources: {
    label: string;
    links: { title: string; url: string; platform: string }[];
  }[];
  improvements: {
    type: 'bullet' | 'section' | 'ats';
    original?: string;
    suggestion: string;
    tip: string;
  }[];
}

const ROLE_INTELLIGENCE: Record<string, { keywords: string[]; courses: Record<string, any> }> = {
  "Frontend Developer": {
    keywords: ["React", "JavaScript", "TypeScript", "Tailwind", "Next.js", "Redux", "Vite", "Testing Library", "Performance Optimization", "Web Vitals", "State Management"],
    courses: {
      "React": { title: "Meta Front-End Developer Professional Certificate", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer", platform: "Coursera" },
      "Performance": { title: "Web Performance (Google Devs)", url: "https://web.dev/learn/performance", platform: "web.dev" },
      "Testing": { title: "JavaScript Testing - Testing Library", url: "https://testing-library.com/", platform: "Official Docs" }
    }
  },
  "Software Engineer": {
    keywords: ["DSA", "System Design", "Scalability", "Clean Code", "Unit Testing", "Microservices", "Cloud", "Architecture", "Design Patterns", "CI/CD"],
    courses: {
      "DSA": { title: "CS50 Introduction to Computer Science", url: "https://pll.harvard.edu/course/cs50-introduction-computer-science", platform: "Harvard/edX" },
      "System Design": { title: "System Design for Beginners", url: "https://github.com/donnemartin/system-design-primer", platform: "GitHub" },
      "Cloud": { title: "AWS Cloud Practitioner Essentials", url: "https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials", platform: "AWS" }
    }
  }
};

export function calculateATSScore(data: ResumeData): ATSAnalysis {
  const roleName = data.personalInfo.role || "Software Engineer";
  const intel = ROLE_INTELLIGENCE[roleName] || ROLE_INTELLIGENCE["Software Engineer"];
  const resumeText = JSON.stringify(data).toLowerCase();
  
  // 1. Keyword Match (25%)
  const matchedKWs = intel.keywords.filter(kw => resumeText.includes(kw.toLowerCase()));
  const missingKWs = intel.keywords.filter(kw => !resumeText.includes(kw.toLowerCase()));
  const kwScore = (matchedKWs.length / intel.keywords.length) * 100;

  // 2. Skills Match (25%)
  const skillsCount = data.skills.length;
  const skillScore = Math.min((skillsCount / 5) * 100, 100);

  // 3. Experience / Impact (20%)
  const hasImpactMarkers = ["%", "increased", "decreased", "improved", "optimized", "scale"].some(m => resumeText.includes(m));
  const expQuality = data.experience.length > 0 ? (hasImpactMarkers ? 100 : 60) : 0;

  // 4. Projects (15%)
  const projScore = data.projects && data.projects.length > 0 ? (data.projects.length >= 2 ? 100 : 70) : 0;

  // 5. Formatting (15%)
  let formatPoints = 0;
  if (data.personalInfo.email && data.personalInfo.phone) formatPoints += 40;
  if (!resumeText.includes('base64') && !resumeText.includes('data:image')) formatPoints += 60; // No images for ATS parity
  const formatScore = formatPoints;

  const finalScore = Math.round(
    (kwScore * 0.25) + (skillScore * 0.25) + (expQuality * 0.20) + (projScore * 0.15) + (formatScore * 0.15)
  );

  // Eligibility Logic
  const eligibility: ATSAnalysis['eligibility'] = [
    {
      company: 'Google',
      status: finalScore > 85 ? 'Eligible ✅' : finalScore > 65 ? 'Partially Eligible ⚠️' : 'Not Eligible ❌',
      reason: finalScore > 85 ? 'Strong technical signals matching FAANG standards.' : 'Requires more metrics and high-scale project depth.'
    },
    {
      company: 'Microsoft',
      status: finalScore > 80 ? 'Eligible ✅' : finalScore > 60 ? 'Partially Eligible ⚠️' : 'Not Eligible ❌',
      reason: finalScore > 80 ? 'Solid engineering foundations and project complexity.' : 'Improve system architecture and cloud signals.'
    }
  ];

  // Strategy & Improvements
  const strategy: string[] = [];
  if (!hasImpactMarkers) strategy.push("Inject quantitative metrics: Use the formula 'Accomplished [X] as measured by [Y], by doing [Z]'.");
  if (missingKWs.includes('Cloud') || missingKWs.includes('AWS')) strategy.push("Deploy your next project to AWS/Vercel and mention 'Cloud Deployment' specifically.");
  if (data.projects?.length === 0) strategy.push("Build and document 2 technical projects that solve real-world scale problems.");

  const enhancements: ATSAnalysis['improvements'] = [];
  data.experience.slice(0, 1).forEach(exp => {
    if (exp.bullets.length > 0) {
      enhancements.push({
        type: 'bullet',
        original: exp.bullets[0],
        suggestion: `Optimized ${exp.role} workflows by 35% through ${exp.bullets[0].toLowerCase().replace('worked on', 'architecting')}.`,
        tip: "Avoid 'worked on'. Use active verbs like 'Architected', 'Spearheaded', or 'Optimized'."
      });
    }
  });

  // Resources
  const resources: ATSAnalysis['freeResources'] = [];
  if (missingKWs.length > 0) {
    const mainMissing = missingKWs[0];
    const rec = intel.courses[mainMissing] || intel.courses['DSA'];
    resources.push({
      label: `Master ${mainMissing}`,
      links: [rec, { title: "YouTube Professional Tutorial", url: "https://youtube.com", platform: "YouTube" }]
    });
  }

  return {
    score: finalScore,
    breakdown: { keywords: kwScore, skills: skillScore, experience: expQuality, projects: projScore, formatting: formatScore },
    eligibility,
    missingCapabilities: missingKWs.slice(0, 5),
    strategy: strategy.length > 0 ? strategy : ["Maintain current momentum, your resume is highly optimized."],
    freeResources: resources,
    improvements: enhancements
  };
}
