import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { getChatResponse } from '../services/gemini';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'ai', text: "Hi! I'm your VidFind+ assistant. Ask me anything about movies, actors, or help finding something to watch!" }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => m.text);
    const responseText = await getChatResponse(userMsg.text, history);

    const aiMsg: Message = { id: Date.now() + 1, role: 'ai', text: responseText };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-dark-card rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
             <Bot className="text-white" size={24} />
        </div>
        <div>
            <h3 className="text-white font-bold">VidFind Assistant</h3>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-dark-muted">Online & Ready</span>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
               <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-brand-500'}`}>
                 {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
               </div>
               <div className={`p-4 rounded-2xl ${
                 msg.role === 'user' 
                   ? 'bg-indigo-600 text-white rounded-tr-none' 
                   : 'bg-white/10 text-gray-200 rounded-tl-none'
               }`}>
                 <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
               </div>
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex justify-start">
             <div className="flex max-w-[80%] gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-500 flex-shrink-0 flex items-center justify-center">
                    <Bot size={16} />
                </div>
                <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/5 bg-white/5">
         <div className="relative">
             <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about a movie plot, cast, or ask for recommendations..."
                className="w-full bg-dark-bg border border-white/10 text-white rounded-xl pl-4 pr-12 py-4 focus:outline-none focus:border-brand-500 transition-colors"
             />
             <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-2 p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 transition-colors"
             >
                <Send size={20} />
             </button>
         </div>
      </div>
    </div>
  );
};

export default Chat;