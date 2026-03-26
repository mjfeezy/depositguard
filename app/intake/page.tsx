'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function TypingDots() {
  return (
    <div className="flex gap-1 items-center py-1">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  );
}

function Message({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-[70%] bg-gray-100 text-gray-900 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="mb-6">
      <p className="text-sm leading-relaxed text-gray-900 whitespace-pre-wrap">{message.content}</p>
    </div>
  );
}

export default function IntakePage() {
  const router = useRouter();
  const [caseId, setCaseId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [caseReady, setCaseReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  useEffect(() => {
    async function init() {
      try {
        const createRes = await fetch('/api/intake', { method: 'POST' });
        const { case_id } = await createRes.json();
        if (!case_id) throw new Error('Failed to create case');
        setCaseId(case_id);
        const chatRes = await fetch(`/api/chat?case_id=${case_id}`);
        const data = await chatRes.json();
        setMessages(data.messages || []);
      } catch (e) {
        setError('Something went wrong. Please refresh.');
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
    init();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !caseId || sending) return;
    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setSending(true);
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId, message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      if (data.case_ready) setCaseReady(true);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: "Something went wrong — try again." }]);
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-sm text-blue-600 underline">Refresh</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white" style={{ height: 'calc(100vh - 65px)' }}>
      {/* Messages scroll area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 pt-10 pb-4">
          {messages.map((msg, i) => (
            <Message key={i} message={msg} />
          ))}
          {sending && (
            <div className="mb-6">
              <TypingDots />
            </div>
          )}
          {caseReady && !sending && (
            <div className="mb-6">
              <button
                onClick={() => router.push(`/summary?case_id=${caseId}`)}
                className="mt-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all"
              >
                View my case analysis →
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input — always visible */}
      {!caseReady && (
        <div className="border-t border-gray-100 bg-white px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:border-gray-400 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                rows={1}
                disabled={sending}
                className="flex-1 bg-transparent resize-none text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-50 py-1"
                style={{ minHeight: '24px', maxHeight: '160px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className="flex-shrink-0 mb-0.5 w-7 h-7 rounded-lg bg-gray-900 disabled:bg-gray-200 flex items-center justify-center transition-colors active:scale-95"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1l7 7-7 7M1 8h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
