'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Send, Sparkles, TrendingUp, MapPin,
  ExternalLink, Briefcase, ChevronRight, RotateCcw,
  IndianRupee, Building2, Zap, MessageSquare, BookOpen
} from 'lucide-react';
import CareerPathCard from '@/components/CareerPathCard';
import { graphicDesignPath } from '@/data/careerPaths';
import { validateCareerInput } from '@/lib/aiGuard';

// ── Types ─────────────────────────────────────────────────────────
interface Role {
  title: string;
  salary: string;
  demand: 'High' | 'Medium' | 'Low';
  skills: string[];
  companies: string[];
  prerequisites?: string;
}

interface RoadmapNode {
  id: number;
  label: string;
  sublabel: string;
  next: number[];
  summary?: string;
}

interface JobLink {
  platform: string;
  url: string;
  label: string;
  summary?: string;
}

interface AgentResponse {
  reply: string;
  roles: Role[];
  roadmapNodes: RoadmapNode[];
  jobLinks: JobLink[];
  quickTips: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: AgentResponse;
}

// ── Suggested Prompts ─────────────────────────────────────────────
const suggestions = [
  "I'm a CSE fresher. What roles should I target?",
  "Compare salary: service company vs startup India",
  "How to become a Data Scientist in 6 months?",
  "Best companies hiring React developers in 2025",
  "GATE vs direct job — which is better?",
  "I want to switch from TCS to a product company",
];

// ── Flowchart ─────────────────────────────────────────────────────
function Flowchart({ nodes }: { nodes: RoadmapNode[] }) {
  if (!nodes || nodes.length === 0) return null;
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const colors = ['bg-violet-500', 'bg-blue-500', 'bg-primary', 'bg-green-500', 'bg-amber-500', 'bg-rose-500'];

  return (
    <div className="bg-white border-4 border-black neo-box p-5">
      <h3 className="font-black text-lg mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5" /> Career Roadmap
      </h3>
      <div className="overflow-x-auto pb-2">
        <div className="flex items-start gap-0 min-w-max">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex items-center">
              {/* Node */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col items-center`}
              >
                <div className={`w-10 h-10 rounded-full ${colors[i % colors.length]} border-4 border-black flex items-center justify-center text-white font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                  {i + 1}
                </div>
                <div className="mt-2 text-center max-w-[100px]">
                  <p className="text-xs font-black leading-tight">{node.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{node.sublabel}</p>
                </div>
              </motion.div>
              {/* Arrow */}
              {i < nodes.length - 1 && (
                <div className="flex items-center mb-8 mx-1">
                  <div className="w-8 h-0.5 bg-black" />
                  <ChevronRight className="w-4 h-4 -ml-1 shrink-0" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Role Card ─────────────────────────────────────────────────────
function RoleCard({ role }: { role: Role }) {
  const demandColor = role.demand === 'High' ? 'bg-green-100 text-green-800 border-green-400' :
    role.demand === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-400' :
      'bg-gray-100 text-gray-700 border-gray-400';

  return (
    <div className="bg-white border-2 border-black p-4 neo-box space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-black text-base leading-tight">{role.title}</h4>
        <span className={`px-2 py-0.5 text-xs font-bold border rounded-full shrink-0 ${demandColor}`}>
          {role.demand}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-sm font-bold text-green-700">
        <IndianRupee className="w-3.5 h-3.5" /> {role.salary}
      </div>
      <div className="flex flex-wrap gap-1">
        {role.skills.slice(0, 4).map(s => (
          <span key={s} className="px-2 py-0.5 bg-violet-50 border border-violet-300 text-violet-800 text-xs font-medium rounded">{s}</span>
        ))}
      </div>
      {role.companies?.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium border-t border-gray-100 pt-2">
          <Building2 className="w-3 h-3" />
          {role.companies.slice(0, 3).join(' · ')}
        </div>
      )}
      {role.prerequisites && (
        <div className="bg-rose-50 border border-rose-100 p-2 text-[10px] font-medium text-rose-700">
          <strong className="uppercase">Pre-req:</strong> {role.prerequisites}
        </div>
      )}
    </div>
  );
}

// ── Chat Bubble ───────────────────────────────────────────────────
function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-violet-500 border-2 border-black flex items-center justify-center shrink-0 mt-1">
          <Brain className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[85%] space-y-3`}>
        <div className={`p-4 border-2 border-black ${isUser ? 'bg-primary text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}>
          <p className={`text-sm font-medium whitespace-pre-wrap leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {isUser ? msg.content : msg.data?.reply || msg.content}
          </p>
        </div>

        {/* Rich response data */}
        {!isUser && msg.data && (
          <div className="space-y-3">
            {/* Roadmap */}
            {msg.data.roadmapNodes?.length > 0 && (
              <Flowchart nodes={msg.data.roadmapNodes} />
            )}

            {/* Roles */}
            {msg.data.roles?.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> Suggested Roles
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {msg.data.roles.map((r, i) => <RoleCard key={i} role={r} />)}
                </div>
              </div>
            )}

            {/* Quick Tips */}
            {msg.data.quickTips?.length > 0 && (
              <div className="bg-amber-50 border-2 border-amber-400 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-amber-900 mb-2">⚡ Quick Tips</p>
                <ul className="space-y-1">
                  {msg.data.quickTips.map((tip, i) => (
                    <li key={i} className="text-sm text-amber-800 font-medium flex gap-2">
                      <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Job Links */}
            {msg.data.jobLinks?.length > 0 && (
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3" /> Find Real Jobs
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {msg.data.jobLinks.map((j, i) => (
                    <a key={i} href={j.url} target="_blank" rel="noopener noreferrer"
                      className="block p-3 bg-white border-2 border-black hover:border-violet-500 transition-colors neo-box group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black uppercase text-violet-600">{j.platform}</span>
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <h5 className="font-bold text-sm mb-1">{j.label}</h5>
                      {j.summary && <p className="text-[10px] text-gray-500 font-medium leading-tight">{j.summary}</p>}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function CareerAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    // 1. Safety Guard
    const safety = validateCareerInput(userText);
    if (!safety.allowed) {
      setMessages(prev => [
        ...prev, 
        { role: 'user', content: userText },
        { 
          role: 'assistant', 
          content: `⚠️ Safety Warning: ${safety.message}\n\nPlease ask about professional, legal, and ethical career paths. I am here to help with legitimate career growth.` 
        }
      ]);
      setInput('');
      return;
    }

    const userMsg: Message = { role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.role === 'user' ? m.content : (m.data?.reply || m.content),
      }));

      const res = await fetch('/api/career-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data: AgentResponse = await res.json();
      if (!res.ok) throw new Error((data as any).error || 'Failed');

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        data,
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${err.message || 'Something went wrong. Please try again.'}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <header className="border-b-4 border-black pb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-violet-500 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black">AI Career Agent</h1>
            <p className="text-gray-500 font-medium mt-1">India-focused guidance · Salary insights · Real jobs · Visual roadmaps</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Salary Benchmarks', 'Role Suggestions', 'Visual Roadmap', 'Real Job Links', 'India Market'].map(t => (
            <span key={t} className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold border border-violet-300 rounded-full">{t}</span>
          ))}
        </div>
      </header>

      {/* Chat Area */}
      <div className="bg-gray-50 border-4 border-black min-h-[450px] max-h-[600px] overflow-y-auto p-5 space-y-6 neo-box">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-violet-100 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-8 h-8 text-violet-600" />
            </div>
            <h2 className="text-xl font-black">Ask me anything about your career!</h2>
            <p className="text-muted-foreground font-medium text-sm">Salaries, companies, skills, roadmaps — all India-focused.</p>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-500 border-2 border-black flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-2 h-2 bg-violet-500 rounded-full"
                    animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.6 }} />
                ))}
                <span className="text-xs text-muted-foreground ml-2">Analyzing Indian market...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Featured Career Path — shown only when no chat started */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Featured Career Path — Explore or ask a question above
            </p>
          </div>
          <CareerPathCard path={graphicDesignPath} />
        </motion.div>
      )}

      {/* Quick Suggestions */}
      {messages.length === 0 && (
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3" /> Or try asking
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => sendMessage(s)}
                className="px-3 py-2 bg-white border-2 border-black text-sm font-medium hover:bg-violet-50 hover:border-violet-400 transition-colors text-left neo-box"
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-4 border-black neo-box flex items-end gap-0 overflow-hidden">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about careers, salaries, skills, companies..."
          rows={2}
          className="flex-1 p-4 text-sm font-medium resize-none focus:outline-none bg-transparent"
          disabled={loading}
        />
        <div className="flex flex-col border-l-4 border-black h-full">
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="p-3 hover:bg-gray-100 transition-colors border-b-2 border-black"
              title="New conversation"
            >
              <RotateCcw className="w-4 h-4 text-gray-500" />
            </button>
          )}
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="flex-1 px-5 py-3 bg-violet-500 text-white font-black hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        AI responses are for guidance only. Always verify salary data on Glassdoor, AmbitionBox, or Levels.fyi for the latest numbers.
      </p>
    </div>
  );
}
