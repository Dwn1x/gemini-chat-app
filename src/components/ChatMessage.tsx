"use client";

import { Message } from "@/types/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";
import clsx from "clsx";

function CodeBlock({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-dark-900 border border-dark-700/50 rounded-t-xl">
        <span className="text-xs font-medium text-dark-400 uppercase tracking-wider">
          {lang || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-dark-400 hover:text-dark-200 transition-colors"
        >
          {copied ? (
            <>
              <Check size={13} /> Copied
            </>
          ) : (
            <>
              <Copy size={13} /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="!mt-0 !rounded-t-none !border-t-0">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

export default function ChatMessage({
  message,
  isStreaming,
}: {
  message: Message;
  isStreaming?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "flex gap-4 animate-slide-up px-4 py-6 md:px-0",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/20 mt-1">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div
        className={clsx(
          "max-w-[85%] md:max-w-[75%] rounded-2xl",
          isUser
            ? "bg-accent-600/90 text-white px-5 py-3 rounded-br-md shadow-lg shadow-accent-600/10"
            : "bg-dark-900/50 border border-dark-700/30 px-5 py-3 rounded-bl-md"
        )}
      >
        {isUser ? (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <CodeBlock className={className}>{children}</CodeBlock>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {isStreaming && (
              <span className="inline-block w-2 h-5 bg-accent-400 rounded-sm animate-pulse ml-0.5 -mb-1" />
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-dark-700/80 flex items-center justify-center mt-1">
          <User size={16} className="text-dark-300" />
        </div>
      )}
    </div>
  );
}