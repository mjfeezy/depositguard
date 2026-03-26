'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">DG</span>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mb-0.5">
          <span className="text-white text-xs font-bold">DG</span>
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
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

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  // Initialize: create case then load opening message
  useEffect(() => {
    async function init() {
      try {
        // Create a new case
        const createRes = await fetch('/api/intake', { method: 'POST' });
        const { case_id } = await createRes.json();
        if (!case_id) throw new Error('Failed to create case');
        setCaseId(case_id);

        // Load opening message
        const chatRes = await fetch(`/api/chat?case_id=${case_id}`);
        const data = await chatRes.json();
        setMessages(data.messages || []);
      } catch (e) {
        setError('Failed to start your session. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !caseId || sending) return;

    setInput('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setSending(true);

    // Optimistic update
    const userMessage: Message = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: caseId, message: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);

      if (data.case_ready) {
        setCaseReady(true);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I hit a snag — can you try sending that again?",
        },
      ]);
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

  const goToSummary = () => {
    router.push(`/summary?case_id=${caseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">DG</span>
          </div>
          <p className="text-gray-500 text-sm">Starting your case...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">DG</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">DepositGuard</p>
          <p className="text-xs text-green-500 font-medium">Online · California Deposit Specialist</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          Step 1 of 3
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {sending && <TypingIndicator />}

        {/* Case Ready CTA */}
        {caseReady && !sending && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={goToSummary}
              className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
            >
              View My Case Analysis
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {!caseReady && (
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              disabled={sending}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors active:scale-95"
            >
              <svg
                className={`w-5 h-5 ${!input.trim() || sending ? 'text-gray-400' : 'text-white'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
}
