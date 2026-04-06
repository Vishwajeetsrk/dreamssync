'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Download, ExternalLink, ChevronDown, ChevronUp, Briefcase, BarChart3, Globe, Printer, FileDown } from 'lucide-react';
import Link from 'next/link';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';

interface CompanyResult {
  company: string;
  eligibility: 'Eligible' | 'Partially Eligible' | 'Not Eligible';
  score: number;
  reasons: string[];
  missing_skills: string[];
  suggestions: string[];
}

interface AnalysisResult {
  ats_score: number;
  keyword_match: number;
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  improvement_suggestions: string[];
  company_eligibility: CompanyResult[];
  improved_resume_markdown: string;
  _provider?: string;
}

export default function AdvancedATS() {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File too large (max 5MB)');
        return;
      }
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are supported');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const analyzeResume = async () => {
    if (!file || !jobRole) {
      setError('Please upload a resume and enter a target job role.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobRole', jobRole);
    formData.append('jobDescription', jobDescription);
    formData.append('experienceLevel', experienceLevel);

    try {
      const res = await fetch('/api/ats-advanced', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || 'Analysis failed');
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Eligible': return 'bg-green-100 border-green-500 text-green-700';
      case 'Partially Eligible': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'Not Eligible': return 'bg-red-100 border-red-500 text-red-700';
      default: return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="w-20 h-20 bg-accent flex items-center justify-center border-4 border-black neo-box mb-6">
          <BarChart3 className="w-10 h-10 text-black" />
        </div>
        <h1 className="text-5xl font-black mb-4">Smart ATS Analyzer.</h1>
        <p className="text-xl text-muted-foreground max-w-2xl font-medium">
          The most advanced AI system to analyze your resume against top companies like Google, Microsoft, and Amazon.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left: Input Panel */}
        <div className="bg-white border-4 border-black p-8 neo-box-static">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6" /> Input Resume Data
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block font-black text-sm uppercase mb-2">1. Upload Resume (PDF Only)</label>
              <div className="relative group">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`p-6 border-4 border-dashed border-black ${file ? 'bg-green-50' : 'bg-gray-50'} flex flex-col items-center justify-center transition-all`}>
                  <Upload className={`w-10 h-10 mb-2 ${file ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className="font-bold text-center">
                    {file ? file.name : 'Click or Drag & Drop PDF'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 text-center">MAX 5MB • TEXT-BASED PDF ONLY</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-black text-sm uppercase mb-2">2. Target Job Role</label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full border-4 border-black p-4 font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-black text-sm uppercase mb-2">3. Experience Level</label>
                <select 
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full border-4 border-black p-4 font-bold outline-none"
                >
                  <option>Fresher</option>
                  <option>1-3 Years</option>
                  <option>3-5 Years</option>
                  <option>5-10 Years</option>
                  <option>10+ Years</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={analyzeResume}
                  disabled={loading || !file || !jobRole}
                  className="w-full bg-accent text-black p-4 font-black text-lg border-4 border-black flex items-center justify-center gap-2 hover:bg-yellow-400 disabled:opacity-50 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Analyze Now'}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-black text-sm uppercase mb-2">4. Job Description (Optional)</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description for a more precise match..."
                rows={4}
                className="w-full border-4 border-black p-4 font-medium focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="mt-8 bg-red-100 border-4 border-red-500 p-4 flex gap-3 text-red-700">
              <AlertCircle className="shrink-0" />
              <p className="font-bold">{error}</p>
            </div>
          )}
        </div>

        {/* Right: Results Display */}
        <div className="space-y-8">
          {!result && !loading && (
            <div className="h-full border-4 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-12 text-center text-gray-400">
              <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-xl font-bold">Analysis details will appear here</p>
              <p className="text-sm">Upload your resume to start the eligibility check.</p>
            </div>
          )}

          {loading && (
            <div className="bg-white border-4 border-black p-12 neo-box-static flex flex-col items-center justify-center text-center">
              <Loader2 className="w-16 h-16 animate-spin text-accent mb-6" />
              <h2 className="text-3xl font-black mb-2">AI Analyzing...</h2>
              <p className="font-bold text-muted-foreground animate-pulse">Checking eligibility for Google, Microsoft, Meta...</p>
              <div className="mt-8 w-full max-w-xs bg-gray-200 h-4 border-2 border-black overflow-hidden">
                <div className="bg-accent h-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}

          {result && (
            <>
              {/* ATS Overview */}
              <div className="bg-black text-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-3xl font-black">ATS Score</h2>
                    <p className="font-bold text-gray-400 uppercase tracking-widest text-sm">Target Role: {jobRole}</p>
                  </div>
                  <div className={`text-5xl font-black w-24 h-24 flex items-center justify-center rounded-full border-8 ${result.ats_score > 80 ? 'border-green-500 text-green-400' : 'border-yellow-400 text-yellow-400'}`}>
                    {result.ats_score}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 border border-white/20">
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Keyword Match</p>
                    <p className="text-2xl font-black">{result.keyword_match}%</p>
                  </div>
                  <div className="bg-white/10 p-4 border border-white/20">
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Experience Fit</p>
                    <p className="text-2xl font-black tracking-tight">{experienceLevel}</p>
                  </div>
                </div>
              </div>

              {/* Company Eligibility */}
              <div className="bg-white border-4 border-black p-6 neo-box-static">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <Globe className="w-6 h-6" /> High-Tier Eligibility Report
                </h2>
                <div className="space-y-4">
                  {result.company_eligibility.map((comp) => (
                    <div key={comp.company} className="border-4 border-black overflow-hidden group">
                      <button 
                        onClick={() => setExpandedCompany(expandedCompany === comp.company ? null : comp.company)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 border-2 border-black font-black text-xs uppercase ${getStatusColor(comp.eligibility)}`}>
                            {comp.eligibility}
                          </div>
                          <span className="font-black text-lg">{comp.company}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Confidence</span>
                            <span className="font-black">{comp.score}%</span>
                          </div>
                          {expandedCompany === comp.company ? <ChevronUp /> : <ChevronDown />}
                        </div>
                      </button>
                      
                      {expandedCompany === comp.company && (
                        <div className="p-6 bg-white border-t-4 border-black animate-in slide-in-from-top-2 duration-200">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-black text-sm uppercase mb-3 text-primary flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Reasons & Fit
                              </h4>
                              <ul className="space-y-2">
                                {comp.reasons.map((r, i) => (
                                  <li key={i} className="flex gap-2 text-sm font-medium">
                                    <span className="text-accent">•</span> {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-black text-sm uppercase mb-3 text-red-600 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Missing for {comp.company}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {comp.missing_skills.map((s, i) => (
                                  <span key={i} className="bg-red-50 text-red-700 border-2 border-red-200 px-2 py-1 text-xs font-bold uppercase">
                                    {s}
                                  </span>
                                ))}
                              </div>
                              <div className="mt-4 p-3 bg-accent/10 border-2 border-accent border-dashed text-xs font-bold">
                                SUGGESTION: {comp.suggestions[0]}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
