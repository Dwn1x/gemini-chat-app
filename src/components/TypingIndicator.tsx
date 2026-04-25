"use client";

import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex gap-4 px-4 md:px-0 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/20 mt-1">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-dark-900/50 border border-dark-700/30 rounded-2xl rounded-bl-md px-5 py-4">
        <div className="typing-indicator flex items-center gap-1">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}