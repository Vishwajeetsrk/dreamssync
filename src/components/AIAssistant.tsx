'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Sparkles, HelpCircle, Search, Menu } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am your DreamSync AI Guide. How can I help you today? I can help you find tools, fix issues, or explore career paths.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch('/api/career-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: userMsg }],
          context: 'System Support Mode: Help user find ATS Check, Roadmap, Ikigai, or Portfolio tools.'
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed');

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting. Please try again or contact support.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-black text-white rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center z-[9998] hover:bg-blue-600 transition-colors group"
      >
        <div className="relative">
          <Sparkles className={`w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-90 scale-0' : 'scale-100'}`} />
          <X className={`w-8 h-8 absolute top-0 left-0 transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-0 -rotate-90'}`} />
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-24 right-6 w-[380px] h-[580px] bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] z-[9999] flex flex-col"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between border-b-4 border-black">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)]">
                  <span className="font-black text-xs">DS</span>
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">DreamSync AI Guide</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-[10px] uppercase font-bold text-gray-400">Online Support</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-red-600 px-3 py-1 flex items-center gap-1 transition-all border-2 border-transparent hover:border-white group"
              >
                <span className="text-[10px] font-black uppercase hidden group-hover:block">Close Assistant</span>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 border-2 border-black font-medium text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] ${
                    msg.role === 'user' ? 'bg-blue-100' : 'bg-white'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="p-2 flex gap-2 overflow-x-auto border-t-2 border-black bg-white no-scrollbar">
              {['Find ATS Tool', 'Fix Profile Photo', 'Contact Support'].map((txt) => (
                <button 
                  key={txt}
                  onClick={() => setInput(txt)}
                  className="whitespace-nowrap px-3 py-1 bg-gray-100 border-2 border-black text-[10px] font-black uppercase hover:bg-gray-200 transition-all"
                >
                  {txt}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t-4 border-black">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your question..."
                  className="w-full border-4 border-black p-3 pr-12 font-bold focus:bg-blue-50 transition-all outline-none"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="absolute right-2 p-2 text-black hover:text-blue-600 disabled:opacity-30 transition-all"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
