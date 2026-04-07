'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, Briefcase, ExternalLink, Book, Video, 
  GraduationCap, Box, CheckCircle, ArrowRight, ShieldCheck,
  Star, Download, Printer, Wrench
} from 'lucide-react';
import { validateCareerInput } from '@/lib/aiGuard';

export default function Roadmap() {
  const [steps, setSteps] = useState<any[]>([]);
  const [totalTimeline, setTotalTimeline] = useState<string>('');
  const [globalPrerequisites, setGlobalPrerequisites] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({ role: 'Frontend Developer', experience: 'Beginner', goal: '' });
  const [safetyError, setSafetyError] = useState<{ message: string, alternatives: string[] } | null>(null);

  const generateRoadmap = async () => {
    if (!query.role) return alert("Role is required.");
    
    // 1. Client-Side Safety Guard
    const safety = validateCareerInput(query.role);
    if (!safety.allowed) {
      setSafetyError({ 
        message: safety.message, 
        alternatives: [
          "Software Developer", 
          "Data Scientist", 
          "UI/UX Designer", 
          "Product Manager", 
          "Cybersecurity Analyst (Ethical)"
        ] 
      });
      return;
    }

    setLoading(true);
    setSafetyError(null);

    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 400 && data.error === 'Safety Violation') {
          setSafetyError({ 
            message: data.details, 
            alternatives: [
              "Software Developer", 
              "Data Scientist", 
              "UI/UX Designer", 
              "Product Manager", 
              "Cybersecurity Analyst (Ethical)"
            ] 
          });
          return;
        }
        throw new Error(data.error || "Generation failed");
      }
      
      setSteps(data.timeline || []);
      setTotalTimeline(data.totalTimeline || '');
      setGlobalPrerequisites(data.globalPrerequisites || null);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8">
      <header className="border-b-4 border-black pb-8 text-center md:text-left flex flex-col justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center md:justify-start justify-center gap-4">
            <Map className="w-12 h-12" /> AI Roadmap
          </h1>
          <p className="text-xl text-muted-foreground font-medium">Your customized path to mastering any career.</p>
        </div>
        
        <div className="bg-white border-4 border-black p-6 neo-box flex flex-col md:flex-row gap-4 items-end">
           <div className="flex-1 w-full space-y-2">
              <label className="font-bold text-sm">Target Role</label>
              <input type="text" value={query.role} onChange={e => setQuery({...query, role: e.target.value})} className="w-full p-2 border-2 border-black" placeholder="e.g. Data Scientist" />
           </div>
           <div className="flex-1 w-full space-y-2">
              <label className="font-bold text-sm">Experience</label>
              <select value={query.experience} onChange={e => setQuery({...query, experience: e.target.value})} className="w-full p-2 border-2 border-black">
                <option>Beginner</option>
                <option>Intermediate</option>
              </select>
           </div>
           <button onClick={generateRoadmap} disabled={loading} className="px-6 py-2.5 h-[44px] bg-accent text-black font-bold border-4 border-black hover:-translate-y-1 neo-box transition-all disabled:opacity-50">
             {loading ? 'Generating...' : 'Generate New Path'}
           </button>
        </div>
      </header>

      {steps.length === 0 && !loading && !safetyError && (
        <div className="text-center p-12 border-4 border-dashed border-gray-300">
           <p className="text-xl font-bold text-gray-500">Enter a role above to generate your dynamic roadmap.</p>
        </div>
      )}

      {safetyError && (
        <div className="bg-red-50 border-4 border-black p-8 neo-box-static max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 border-4 border-black flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-black mb-2 text-red-700">Invalid Career Path</h2>
          <p className="font-bold text-red-900 mb-6">{safetyError.message}</p>
          
          <div className="space-y-4">
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Try these safe alternatives instead:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {safetyError.alternatives.map(alt => (
                <button 
                  key={alt}
                  onClick={() => { setQuery({...query, role: alt}); setSafetyError(null); }}
                  className="px-4 py-2 bg-white border-2 border-black font-bold hover:bg-accent transition-all"
                >
                  {alt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center p-12">
           <div className="w-16 h-16 border-8 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {steps.length > 0 && (
        <div>
          {totalTimeline && (
            <div className="flex items-center justify-between gap-4 mb-8 journey-box">
              <div className="bg-accent border-4 border-black p-4 neo-box inline-block">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <Map className="w-6 h-6" /> Estimated Journey: {totalTimeline}
                </h2>
              </div>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-3 bg-white border-4 border-black font-bold hover:bg-yellow-50 transition-all neo-box no-print"
              >
                <Download className="w-5 h-5" /> Download Roadmap (PDF)
              </button>
            </div>
          )}

          {globalPrerequisites && (
            <div className="bg-white border-4 border-black p-8 neo-box mb-12 space-y-4 global-prereqs">
              <h2 className="text-2xl font-black flex items-center gap-3 border-b-4 border-black pb-2">
                <GraduationCap className="w-8 h-8" /> Core Prerequisites
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold uppercase text-sm mb-2 text-primary flex items-center gap-2">
                    <Box className="w-4 h-4" /> Education / Background
                  </h3>
                  <p className="font-medium text-gray-700">{globalPrerequisites.education}</p>
                </div>
                <div>
                  <h3 className="font-bold uppercase text-sm mb-2 text-primary flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Required Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {globalPrerequisites.technicalSkills?.map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-violet-100 border-2 border-black text-xs font-bold uppercase">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="relative border-l-8 border-black ml-4 md:ml-8 pl-8 md:pl-12 space-y-20 py-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 border-4 border-black neo-box bg-white`}
              >
                {/* Timeline node */}
                <div className={`absolute top-1/2 -translate-y-1/2 -left-[4.5rem] w-8 h-8 rounded-full border-4 border-black z-10 flex items-center justify-center bg-white`}>
                </div>

                {/* Horizontal connecting line */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-12 w-12 h-2 bg-black -z-10" />

                <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                  <div className="flex-1 space-y-6">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`p-2 border-2 border-black inline-flex bg-primary text-white`}>
                          <Briefcase className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-muted-foreground uppercase tracking-wider">{step.time}</span>
                      </div>
                      <h3 className="text-4xl font-black mb-2">{step.title}</h3>
                      <p className="font-medium text-xl text-gray-700 leading-relaxed">{step.desc}</p>
                    </div>

                    {step.phasePrerequisites?.length > 0 && (
                      <div className="bg-gray-100 border-2 border-black p-4">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5" /> Required Before This Phase
                        </h4>
                        <ul className="grid md:grid-cols-2 gap-x-4 gap-y-1 list-disc list-inside">
                          {step.phasePrerequisites.map((p: string) => (
                            <li key={p} className="text-sm font-medium text-gray-600">{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {step.skillsToLearn && step.skillsToLearn.length > 0 && (
                       <div className="space-y-2">
                          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">🎯 Skills You Will Target</h4>
                          <div className="flex gap-2 flex-wrap">
                            {step.skillsToLearn.map((s: string) => <span key={s} className="px-3 py-1 bg-yellow-100 border-2 border-black text-xs font-bold uppercase">{s}</span>)}
                          </div>
                       </div>
                    )}
                  </div>

                  <div className="w-full lg:w-[450px] shrink-0 space-y-6">
                    {/* Courses / Study Materials */}
                    {step.studyMaterials && step.studyMaterials.length > 0 && (
                      <div className="space-y-3">
                         <h4 className="font-black text-sm uppercase flex items-center gap-2 border-b-2 border-black pb-1">
                           <Book className="w-4 h-4" /> Study Materials
                         </h4>
                         <div className="space-y-2">
                           {step.studyMaterials.map((link: any, idx: number) => (
                             <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" 
                               className="block p-3 bg-blue-50 border-2 border-black hover:bg-blue-100 transition-colors neo-box group">
                               <div className="flex items-start justify-between gap-3 mb-1">
                                 <h5 className="font-black text-sm">{link.label}</h5>
                                 <ExternalLink className="w-3 h-3 shrink-0 group-hover:translate-x-1 transition-transform" />
                               </div>
                               <p className="text-[10px] font-medium text-blue-900 leading-normal">{link.summary}</p>
                             </a>
                           ))}
                         </div>
                      </div>
                    )}

                    {/* Videos */}
                    {step.videoLectures && step.videoLectures.length > 0 && (
                      <div className="space-y-3">
                         <h4 className="font-black text-sm uppercase flex items-center gap-2 border-b-2 border-black pb-1 text-red-600">
                           <Video className="w-4 h-4" /> Video Lectures
                         </h4>
                         <div className="space-y-2">
                           {step.videoLectures.map((link: any, idx: number) => (
                             <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" 
                               className="block p-3 bg-red-50 border-2 border-black hover:bg-red-100 transition-colors neo-box group">
                               <div className="flex items-start justify-between gap-3 mb-1">
                                 <h5 className="font-black text-sm text-red-900">{link.label}</h5>
                                 <ExternalLink className="w-3 h-3 shrink-0 text-red-900 transition-transform" />
                               </div>
                               <p className="text-[10px] font-medium text-red-900/80 leading-normal">{link.summary}</p>
                             </a>
                           ))}
                         </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {step.certifications && step.certifications.length > 0 && (
                      <div className="space-y-3">
                         <h4 className="font-black text-sm uppercase flex items-center gap-2 border-b-2 border-black pb-1 text-green-700">
                           <Star className="w-4 h-4" /> Recommended Certs
                         </h4>
                         <div className="space-y-2">
                           {step.certifications.map((link: any, idx: number) => (
                             <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" 
                               className="block p-3 bg-green-50 border-2 border-black hover:bg-green-100 transition-colors neo-box group">
                               <div className="flex items-start justify-between gap-3 mb-1">
                                 <h5 className="font-black text-sm text-green-900">{link.label}</h5>
                                 <ArrowRight className="w-3 h-3 shrink-0 text-green-900 transition-transform" />
                               </div>
                               <p className="text-[10px] font-medium text-green-900/80 leading-normal">{link.summary}</p>
                             </a>
                           ))}
                         </div>
                      </div>
                    )}

                    {/* Tools & Projects */}
                    {step.freeToolsAndProjects && step.freeToolsAndProjects.length > 0 && (
                      <div className="space-y-3">
                         <h4 className="font-black text-sm uppercase flex items-center gap-2 border-b-2 border-black pb-1 text-purple-700">
                           <Wrench className="w-4 h-4" /> Courses & Free Tools
                         </h4>
                         <div className="space-y-2">
                           {step.freeToolsAndProjects.map((link: any, idx: number) => (
                             <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" 
                               className="block p-3 bg-purple-50 border-2 border-black hover:bg-purple-100 transition-colors neo-box group">
                               <div className="flex items-start justify-between gap-3 mb-1">
                                 <h5 className="font-black text-sm text-purple-900">{link.label}</h5>
                                 <ExternalLink className="w-3 h-3 shrink-0 text-purple-900 transition-transform" />
                               </div>
                               <p className="text-[10px] font-medium text-purple-900/80 leading-normal">{link.summary}</p>
                             </a>
                           ))}
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          /* HIDE EVERYTHING EXCEPT THE TIMELINE */
          .no-print, header, .bg-accent, .global-prereqs, button, input, select, footer, h1, .journey-box {
            display: none !important;
          }
          body {
            background-color: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .max-w-5xl {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .neo-box {
            box-shadow: none !important;
            border: 1px solid black !important;
            background-color: white !important;
          }
          .border-l-8 {
            border-left-width: 6px !important;
            border-left-color: black !important;
          }
          .pl-8, .pl-12 {
            padding-left: 1.5rem !important;
          }
          .space-y-20 {
            margin-top: 1.5rem !important;
          }
          /* Ensure colors/backgrounds appear in PDF */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
           @page {
            margin: 0.5cm;
          }
          h4, h5, p {
            orphans: 3;
            widows: 3;
          }
        }
      `}</style>
    </div>
  );
}
