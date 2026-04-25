"use client";

import { Sparkles, Zap, Code2, Lightbulb, BookOpen } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  {
    icon: Code2,
    label: "Write code",
    prompt: "Write a React hook for dark mode toggle with localStorage persistence",
    color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-300",
  },
  {
    icon: Lightbulb,
    label: "Brainstorm",
    prompt: "Give me 5 creative startup ideas that combine AI with sustainability",
    color: "from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-300",
  },
  {
    icon: Zap,
    label: "Explain",
    prompt: "Explain quantum computing like I'm a software engineer who has never studied physics",
    color: "from-violet-500/20 to-violet-600/5 border-violet-500/20 text-violet-300",
  },
  {
    icon: BookOpen,
    label: "Summarize",
    prompt: "What are the key differences between REST, GraphQL, and gRPC? Give me a comparison table",
    color: "from-sky-500/20 to-sky-600/5 border-sky-500/20 text-sky-300",
  },
];

export default function WelcomeScreen({ onSuggestion }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center animate-fade-in">
        {/* Logo */}
        <div className="relative inline-flex mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-500 via-accent-600 to-blue-600 flex items-center justify-center shadow-2xl shadow-accent-500/30 glow-accent">
            <Sparkles size={36} className="text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-4 border-dark-950 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-dark-100 mb-3">
          Hello! I&apos;m <span className="gradient-text">Gemini</span>
        </h1>
        <p className="text-dark-400 text-lg mb-10 max-w-md mx-auto">
          Your AI assistant powered by Google&apos;s latest model. Ask me anything
          — I&apos;m here to help.
        </p>

        {/* Suggestion cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => onSuggestion(s.prompt)}
              className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-br ${s.color} border hover:scale-[1.02] hover:shadow-lg transition-all duration-200 text-left`}
            >
              <s.icon size={18} className="flex-shrink-0 opacity-80" />
              <div className="min-w-0">
                <span className="text-sm font-medium">{s.label}</span>
                <p className="text-xs text-dark-400 truncate mt-0.5">
                  {s.prompt.slice(0, 40)}…
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}