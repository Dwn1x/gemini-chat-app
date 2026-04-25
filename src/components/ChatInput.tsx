"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { SendHorizonal, Square } from "lucide-react";
import clsx from "clsx";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  onStop,
  isLoading,
  disabled,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || (isLoading && !onStop)) return;
    if (isLoading && onStop) {
      onStop();
      return;
    }
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [input, isLoading, onSend, onStop]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 md:pb-6">
      <div
        className={clsx(
          "glass-panel rounded-2xl transition-all duration-300 input-glow",
          "flex items-end gap-2 p-3"
        )}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Message Gemini…"
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-dark-100 placeholder:text-dark-500 resize-none outline-none text-[15px] leading-relaxed py-1.5 px-2 max-h-[200px]"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || (!input.trim() && !isLoading)}
          className={clsx(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
            isLoading
              ? "bg-red-500/80 hover:bg-red-500 text-white"
              : input.trim()
              ? "bg-accent-500 hover:bg-accent-400 text-white shadow-lg shadow-accent-500/25"
              : "bg-dark-800 text-dark-500 cursor-not-allowed"
          )}
        >
          {isLoading ? <Square size={16} /> : <SendHorizonal size={18} />}
        </button>
      </div>
      <p className="text-center text-xs text-dark-500 mt-3">
        Gemini may produce inaccurate information. Verify important details.
      </p>
    </div>
  );
}