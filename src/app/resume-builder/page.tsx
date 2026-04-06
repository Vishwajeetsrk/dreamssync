'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { 
  Plus, Trash2, Download, Printer, User, Briefcase, 
  GraduationCap, Palette, Layout, Save, Sparkles, Send, FileText, Award
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ExternalHyperlink, BorderStyle } from 'docx';
import ResumePreview, { ResumeData } from '@/components/ResumePreview';
import { calculateATSScore, ATSAnalysis } from '@/lib/atsScore';
import { BarChart3, AlertCircle, CheckCircle2, Info, Upload } from 'lucide-react';

const DEFAULT_RESUME: ResumeData = {
  personalInfo: {
    fullName: "VASHNAVI CHAUHAN",
    role: "Frontend Developer",
    email: "vashnavichauhan1@gmail.com",
    phone: "+91 9174403667",
    location: "Bengaluru, India",
    linkedin: "vashnavichauhan18",
    github: "vashnavichauhan18",
  },
  summary: "Self-taught Frontend Engineer with hands-on production experience in modern JavaScript frameworks. Proven track record in developing scalable frontend features and optimizing web performance for high-growth startups.",
  skills: [
    { category: "Languages & Frameworks", items: "Javascript, Typescript, Python, HTML, CSS" },
    { category: "Frontend Technologies", items: "Vue, React, React Native, Nuxt, Tailwind CSS, MUI" },
    { category: "State Management", items: "Redux Toolkit, Pinia, Vuex, Zustand" },
    { category: "Backend & Tools", items: "Node.js, Express.js, MongoDB, Flask, Docker, D3.js" }
  ],
  experience: [
    {
      company: "Rapid Rocket",
      role: "Frontend Developer (Freelance)",
      location: "Remote",
      date: "Sep 2025 – Present",
      bullets: [
        "Built scalable frontend features using React.js and Next.js, driving significant UX improvements across the platform.",
        "Improved web performance through advanced frontend optimization and efficient rendering strategies, resulting in faster load times.",
        "Collaborated with cross-functional teams to integrate new features and maintain high code quality standards."
      ]
    },
    {
      company: "Aiseberg - AiseDiscovery",
      role: "Senior Frontend Engineer",
      location: "Bengaluru, India",
      date: "Jan 2025 – Jul 2025",
      bullets: [
        "Developed a real-time chat interface in React TSX, significantly enhancing user engagement metrics.",
        "Optimized list virtualization with TanStack Virtual and Redux Toolkit, contributing to a 40–50% activation rate among demo users.",
        "Integrated D3 tree chart with custom SCSS styling, reducing UI development time by 30% for data visualization components."
      ]
    },
    {
      company: "PropVR 3D Squareyards",
      role: "Frontend Developer (SDE-1)",
      location: "Bengaluru, India",
      date: "Nov 2022 – Dec 2024",
      bullets: [
        "Collaborated with a 12-member team on the PropVR metaverse project, boosting project delivery efficiency by 20%.",
        "Led full-stack development of propvr.ai, achieving significant improvements in SEO rankings and user retention.",
        "Implemented robust security measures, enhancing overall application security posture by 50% through strict policy enforcement."
      ]
    }
  ],
  education: [
    {
      school: "Delhi University",
      degree: "B.A Hons Political Science",
      location: "New Delhi",
      date: "2019 – 2022"
    }
  ],
  projects: [
    {
      name: "Metaverse Real Estate",
      link: "propvr.ai",
      description: "Implemented high-performance 3D visualization for real estate properties using proprietary rendering engines."
    }
  ],
  achievements: [
    "RNR Certificate in Software Development",
    "Blog: Securing Web: A Deep Dive into Content Security Policy (CSP)",
    "Blog: Understanding Cookie Security: Best Practices for Developers"
  ],
  languages: ["English", "Hindi"],
  certifications: [],
  extra: "Passionate about web security and technical blogging."
};

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(DEFAULT_RESUME);
  const [template, setTemplate] = useState<'minimal' | 'modern' | 'professional'>('professional');
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  // Debounced ATS Calculation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const analysis = calculateATSScore(data);
      setAtsAnalysis(analysis);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${data.personalInfo.fullName.replace(/\s/g, '_')}_Resume`,
  });

  const handleImportPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/resume-parse', {
        method: 'POST',
        body: formData,
      });
      const parsedData = await res.json();
      if (!res.ok) throw new Error(parsedData.error);
      
      // Ensure all fields exist to avoid UI crashes
      const formattedData: ResumeData = {
        ...parsedData,
        projects: parsedData.projects || [],
        achievements: parsedData.achievements || [],
        languages: parsedData.languages || [],
        certifications: parsedData.certifications || [],
        extra: parsedData.extra || ""
      };
      
      setData(formattedData);
    } catch (err: any) {
      console.error(err);
      alert("Failed to parse resume: " + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const generateWordDoc = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: data.personalInfo.fullName.toUpperCase(),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: data.personalInfo.role,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun(`${data.personalInfo.phone} | ${data.personalInfo.email} | ${data.personalInfo.location}`),
            ],
          }),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            text: "PROFESSIONAL SUMMARY",
            heading: HeadingLevel.HEADING_2,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          }),
          new Paragraph({ text: data.summary }),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            text: "WORK EXPERIENCE",
            heading: HeadingLevel.HEADING_2,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          }),
          ...data.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.role, bold: true }),
                new TextRun({ text: ` | ${exp.company}`, bold: true }),
                new TextRun({ text: `\t${exp.date}`, bold: false }),
              ],
            }),
            ...exp.bullets.map(bullet => new Paragraph({
              text: bullet,
              bullet: { level: 0 },
            }))
          ]),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            text: "TECHNICAL SKILLS",
            heading: HeadingLevel.HEADING_2,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          }),
          ...data.skills.map(skill => new Paragraph({
            children: [
              new TextRun({ text: `${skill.category}: `, bold: true }),
              new TextRun(skill.items),
            ],
          })),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            text: "TECHNICAL PROJECTS",
            heading: HeadingLevel.HEADING_2,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          }),
          ...(data.projects || []).flatMap(proj => [
            new Paragraph({
              children: [
                new TextRun({ text: proj.name, bold: true }),
                new TextRun({ text: proj.link ? ` (${proj.link})` : "", color: "2563EB" }),
              ],
            }),
            new Paragraph({ text: proj.description })
          ]),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            text: "CERTIFICATIONS",
            heading: HeadingLevel.HEADING_2,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          }),
          ...(data.certifications || []).map(cert => new Paragraph({
             children: [
               new TextRun({ text: cert.name, bold: true }),
               new TextRun(` — ${cert.issuer}\t${cert.date}`),
             ],
          })),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            text: "AWARDS & ACHIEVEMENTS",
            heading: HeadingLevel.HEADING_2,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          }),
          ...(data.achievements || []).map(ach => new Paragraph({ text: ach, bullet: { level: 0 } })),
          new Paragraph({ text: "", spacing: { before: 200 } }),
          new Paragraph({
            text: "EDUCATION",
            heading: HeadingLevel.HEADING_2,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          }),
          ...data.education.map(edu => new Paragraph({
             children: [
               new TextRun({ text: edu.school, bold: true }),
               new TextRun(` | ${edu.degree}\t${edu.date}`),
             ],
          })),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${data.personalInfo.fullName.replace(/\s/g, '_')}_Resume.docx`);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateSummary = (value: string) => {
    setData(prev => ({ ...prev, summary: value }));
  };

  const updateSkill = (index: number, field: 'category' | 'items', value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, { category: "", items: "" }]
    }));
  };

  const removeSkill = (index: number) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const newExperience = [...data.experience];
    (newExperience[index] as any)[field] = value;
    setData(prev => ({ ...prev, experience: newExperience }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "", role: "", location: "", date: "", bullets: [""] }]
    }));
  };

  const removeExperience = (index: number) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const updateEdu = (index: number, field: string, value: string) => {
    const newEdu = [...data.education];
    (newEdu[index] as any)[field] = value;
    setData(prev => ({ ...prev, education: newEdu }));
  };

  const updateArrayField = (field: 'achievements' | 'languages', index: number, value: string) => {
    const newArr = [...(data[field] || [])];
    newArr[index] = value;
    setData(prev => ({ ...prev, [field]: newArr }));
  };

  const addArrayItem = (field: 'achievements' | 'languages') => {
    setData(prev => ({ ...prev, [field]: [...(prev[field] || []), ""] }));
  };

  const updateProjects = (index: number, field: string, value: string) => {
    const newProjects = [...(data.projects || [])];
    (newProjects[index] as any)[field] = value;
    setData(prev => ({ ...prev, projects: newProjects }));
  };

  const updateCert = (index: number, field: string, value: string) => {
    const newCerts = [...(data.certifications || [])];
    (newCerts[index] as any)[field] = value;
    setData(prev => ({ ...prev, certifications: newCerts }));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar - Form Editor */}
      <aside className="w-full lg:w-[450px] bg-white border-r border-gray-200 overflow-y-auto p-6 lg:p-8 space-y-8 scrollbar-hide shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" /> Resume Builder
          </h1>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {/* Form: Personal Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-4">
              <User className="w-5 h-5" />
              <h2 className="text-lg font-black uppercase tracking-wider">Personal Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Full Name</label>
                <input 
                   name="fullName"
                  type="text" 
                  value={data.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-black outline-none font-medium h-10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Professional Role</label>
                <input 
                  type="text" 
                  value={data.personalInfo.role}
                  onChange={(e) => updatePersonalInfo('role', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-black outline-none font-medium h-10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-black outline-none h-10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Phone Number</label>
                <input 
                  type="text" 
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-black outline-none h-10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">LinkedIn ID</label>
                <input 
                  type="text" 
                  value={data.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-black outline-none h-10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">GitHub ID</label>
                <input 
                  type="text" 
                  value={data.personalInfo.github}
                  onChange={(e) => updatePersonalInfo('github', e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-black outline-none h-10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Portfolio URL</label>
                <input 
                  type="text" 
                  value={data.personalInfo.portfolio || ""}
                  onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                  placeholder="e.g. vashnavi.dev"
                  className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-black outline-none h-10 text-blue-600 font-bold"
                />
              </div>
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-bold uppercase text-gray-400">Location</label>
              <input 
                type="text" 
                value={data.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-black outline-none h-10"
              />
            </div>
          </section>

          {/* Form: Summary */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-4">
              <Layout className="w-5 h-5" />
              <h2 className="text-lg font-black uppercase tracking-wider">Professional Summary</h2>
            </div>
            <textarea 
              value={data.summary}
              onChange={(e) => updateSummary(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded focus:ring-2 focus:ring-black outline-none min-h-[120px] text-sm leading-relaxed"
              placeholder="Briefly describe your career achievements and goals..."
            />
          </section>

          {/* Form: Skills */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                <h2 className="text-lg font-black uppercase tracking-wider">Skills</h2>
              </div>
              <button 
                onClick={addSkill}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-primary"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {data.skills.map((skill, idx) => (
              <div key={idx} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100 relative group">
                <div className="flex-1 space-y-2">
                  <input 
                    type="text" 
                    value={skill.category}
                    onChange={(e) => updateSkill(idx, 'category', e.target.value)}
                    placeholder="Category (e.g. Frontend)"
                    className="w-full p-2 bg-transparent font-bold text-xs uppercase border-b border-gray-200 outline-none"
                  />
                  <input 
                    type="text" 
                    value={skill.items}
                    onChange={(e) => updateSkill(idx, 'items', e.target.value)}
                    placeholder="Skills (comma separated)"
                    className="w-full p-2 bg-transparent text-sm outline-none"
                  />
                </div>
                <button 
                  onClick={() => removeSkill(idx)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded hidden group-hover:block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </section>

          {/* Form: Experience */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <h2 className="text-lg font-black uppercase tracking-wider">Experience</h2>
              </div>
              <button 
                onClick={addExperience}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-primary"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {data.experience.map((exp, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    value={exp.role}
                    onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                    placeholder="Role"
                    className="p-2 bg-white border border-gray-200 rounded text-sm font-bold h-9"
                  />
                  <input 
                    type="text" 
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    placeholder="Company"
                    className="p-2 bg-white border border-gray-200 rounded text-sm font-bold h-9"
                  />
                  <input 
                    type="text" 
                    value={exp.date}
                    onChange={(e) => updateExperience(idx, 'date', e.target.value)}
                    placeholder="Date Range"
                    className="p-2 bg-white border border-gray-200 rounded text-xs h-9"
                  />
                  <input 
                    type="text" 
                    value={exp.location}
                    onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                    placeholder="Location"
                    className="p-2 bg-white border border-gray-200 rounded text-xs h-9"
                  />
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase text-gray-400">Bullet Points</p>
                   {exp.bullets.map((bullet, bIdx) => (
                     <div key={bIdx} className="flex gap-2">
                       <input 
                         type="text" 
                         value={bullet}
                         onChange={(e) => {
                           const newBullets = [...exp.bullets];
                           newBullets[bIdx] = e.target.value;
                           updateExperience(idx, 'bullets', newBullets);
                         }}
                         placeholder="Action verb + impact + result"
                         className="flex-1 p-2 bg-white border border-gray-200 rounded text-xs min-h-[40px]"
                       />
                       <button 
                         onClick={() => {
                            const newBullets = exp.bullets.filter((_, i) => i !== bIdx);
                            updateExperience(idx, 'bullets', newBullets.length ? newBullets : [""]);
                         }}
                         className="p-1 text-gray-300 hover:text-red-500"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   ))}
                   <button 
                    onClick={() => updateExperience(idx, 'bullets', [...exp.bullets, ""])}
                    className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline mt-1"
                   >
                     <Plus className="w-3 h-3" /> Add Bullet Point
                   </button>
                </div>
                <button 
                  onClick={() => removeExperience(idx)}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full hidden group-hover:block shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </section>

          {/* Form: Projects */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <h2 className="text-lg font-black uppercase tracking-wider">Technical Projects</h2>
              </div>
              <button 
                onClick={() => setData(prev => ({ ...prev, projects: [...(prev.projects || []), { name: "", link: "", description: "" }] }))}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-primary"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {(data.projects || []).map((proj, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group space-y-3 shadow-sm">
                <input 
                  type="text" 
                  value={proj.name}
                  onChange={(e) => updateProjects(idx, 'name', e.target.value)}
                  placeholder="Project Name"
                  className="w-full p-2 bg-white border border-gray-200 rounded text-sm font-bold"
                />
                <input 
                  type="text" 
                  value={proj.link}
                  onChange={(e) => updateProjects(idx, 'link', e.target.value)}
                  placeholder="Project Link (GitHub/Live)"
                  className="w-full p-2 bg-white border border-gray-200 rounded text-xs"
                />
                <textarea 
                  value={proj.description}
                  onChange={(e) => updateProjects(idx, 'description', e.target.value)}
                  placeholder="Describe your role and metrics..."
                  className="w-full p-2 bg-white border border-gray-200 rounded text-xs min-h-[60px]"
                />
                <button 
                  onClick={() => setData(prev => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== idx) }))}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full hidden group-hover:block border border-red-200 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </section>

          {/* Form: Certifications */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <h2 className="text-lg font-black uppercase tracking-wider">Certifications</h2>
              </div>
              <button 
                onClick={() => setData(prev => ({ ...prev, certifications: [...(prev.certifications || []), { name: "", issuer: "", date: "" }] }))}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-primary"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {(data.certifications || []).map((cert, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group space-y-2">
                <input 
                  type="text" 
                  value={cert.name}
                  onChange={(e) => updateCert(idx, 'name', e.target.value)}
                  placeholder="Certificate Name"
                  className="w-full p-2 bg-white border border-gray-200 rounded text-xs font-bold"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    value={cert.issuer}
                    onChange={(e) => updateCert(idx, 'issuer', e.target.value)}
                    placeholder="Issuer"
                    className="p-2 bg-white border border-gray-200 rounded text-[10px]"
                  />
                  <input 
                    type="text" 
                    value={cert.date}
                    onChange={(e) => updateCert(idx, 'date', e.target.value)}
                    placeholder="Date"
                    className="p-2 bg-white border border-gray-200 rounded text-[10px]"
                  />
                </div>
                <input 
                  type="text" 
                  value={cert.link}
                  onChange={(e) => updateCert(idx, 'link', e.target.value)}
                  placeholder="Certificate URL (Link)"
                  className="w-full p-2 bg-white border border-gray-200 rounded text-[10px]"
                />
                <button 
                  onClick={() => setData(prev => ({ ...prev, certifications: (prev.certifications || []).filter((_, i) => i !== idx) }))}
                  className="absolute -top-2 -right-2 p-1 text-red-500 hidden group-hover:block"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </section>

          {/* Form: Others */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-4">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-lg font-black uppercase tracking-wider">Others</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Achievements</label>
              {(data.achievements || []).map((ach, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={ach}
                    onChange={(e) => updateArrayField('achievements', idx, e.target.value)}
                    className="flex-1 p-2 bg-white border border-gray-200 rounded text-xs"
                  />
                </div>
              ))}
              <button 
                onClick={() => addArrayItem('achievements')}
                className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Achievement
              </button>
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-[10px] font-black uppercase text-gray-400">Languages (comma separated)</label>
              <input 
                type="text" 
                value={data.languages?.join(", ")}
                onChange={(e) => setData(prev => ({ ...prev, languages: e.target.value.split(",").map(s => s.trim()) }))}
                className="w-full p-2 bg-white border border-gray-200 rounded text-xs"
              />
            </div>

            <div className="space-y-2 mt-4">
              <label className="text-[10px] font-black uppercase text-gray-400">Hobbies & Addition Extra</label>
              <textarea 
                value={data.extra}
                onChange={(e) => setData(prev => ({ ...prev, extra: e.target.value }))}
                className="w-full p-2 bg-white border border-gray-200 rounded text-xs min-h-[80px]"
                placeholder="Share your interests or extra info..."
              />
            </div>
          </section>

          {/* Form: Education */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2 mb-4">
              <GraduationCap className="w-5 h-5" />
              <h2 className="text-lg font-black uppercase tracking-wider">Education</h2>
            </div>
            {data.education.map((edu, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <input 
                  type="text" 
                  value={edu.school}
                  onChange={(e) => updateEdu(idx, 'school', e.target.value)}
                  placeholder="University / School"
                  className="w-full p-2 bg-white border border-gray-200 rounded text-sm font-bold"
                />
                <input 
                  type="text" 
                  value={edu.degree}
                  onChange={(e) => updateEdu(idx, 'degree', e.target.value)}
                  placeholder="Degree"
                  className="w-full p-2 bg-white border border-gray-200 rounded text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    value={edu.date}
                    onChange={(e) => updateEdu(idx, 'date', e.target.value)}
                    placeholder="Duration"
                    className="p-2 bg-white border border-gray-200 rounded text-xs"
                  />
                  <input 
                    type="text" 
                    value={edu.location}
                    onChange={(e) => updateEdu(idx, 'location', e.target.value)}
                    placeholder="Location"
                    className="p-2 bg-white border border-gray-200 rounded text-xs"
                  />
                </div>
              </div>
            ))}
          </section>
        </div>
        
        {/* Layout Templates */}
        <div className="border-t border-gray-200 pt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Layout Templates</h3>
          <div className="grid grid-cols-3 gap-3">
            {['minimal', 'professional', 'modern'].map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t as any)}
                className={`py-2 px-3 rounded text-xs font-bold capitalize transition-all border-2 ${template === t ? 'bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(37,99,235,1)]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        
        {/* Footer info */}
        <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-lg flex gap-3 items-start">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs font-medium text-amber-800 leading-relaxed">
            <strong>ATS Tip:</strong> Use standard section headings and avoid complex graphics. Our templates are pre-optimized for FAANG recruitment systems.
          </p>
        </div>
      </aside>

      {/* Main Content - Real-time Preview */}
      <main className="flex-1 overflow-y-auto bg-gray-200 p-4 lg:p-12 xl:p-16 flex justify-center scrollbar-hide">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[800px] h-fit"
        >
          <div className="mb-4 flex flex-col sm:flex-row justify-end items-end sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={generateWordDoc}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-black border-2 border-black rounded-xl hover:bg-gray-50 transition-all font-black text-sm uppercase"
              >
                <FileText className="w-4 h-4" /> Word
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all font-black text-sm uppercase tracking-wider"
              >
                <Printer className="w-4 h-4" /> PDF
              </button>
            </div>
          </div>
          
          <div className="shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden transform-gpu transition-all">
            <ResumePreview ref={componentRef} data={data} template={template} />
          </div>
          
          <p className="text-center mt-8 text-gray-400 text-xs font-medium mb-12">
            © 2026 DreamSync Resume Builder. Built for Tier-1 Companies.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
