"use client";

import { Chat } from "@/types/chat";
import {
  Plus,
  MessageSquare,
  Trash2,
  X,
  Sparkles,
  Github,
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

function formatRelativeDate(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onClose,
}: SidebarProps) {
  const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed lg:static inset-y-0 left-0 z-50 w-[280px] flex flex-col",
          "bg-dark-950/95 lg:bg-dark-950/50 backdrop-blur-xl",
          "border-r border-dark-800/50",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/20">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-dark-100">
                Gemini Chat
              </h1>
              <p className="text-[10px] text-dark-500 font-medium uppercase tracking-wider">
                AI Assistant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-dark-800/80 text-dark-400 hover:text-dark-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* New chat button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-600/10 hover:bg-accent-600/20 border border-accent-500/20 hover:border-accent-500/30 text-accent-300 transition-all duration-200 group"
          >
            <Plus
              size={18}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            <span className="text-sm font-medium">New chat</span>
          </button>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {sortedChats.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageSquare
                size={32}
                className="mx-auto text-dark-600 mb-3"
              />
              <p className="text-sm text-dark-500">No conversations yet</p>
              <p className="text-xs text-dark-600 mt-1">
                Start a new chat to begin
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {sortedChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat.id);
                    onClose();
                  }}
                  className={clsx(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200",
                    activeChatId === chat.id
                      ? "bg-dark-800/80 border border-dark-700/50"
                      : "hover:bg-dark-800/40 border border-transparent"
                  )}
                >
                  <MessageSquare
                    size={15}
                    className={clsx(
                      "flex-shrink-0",
                      activeChatId === chat.id
                        ? "text-accent-400"
                        : "text-dark-500"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={clsx(
                        "text-sm truncate",
                        activeChatId === chat.id
                          ? "text-dark-100 font-medium"
                          : "text-dark-300"
                      )}
                    >
                      {chat.title}
                    </p>
                    <p className="text-[11px] text-dark-500 mt-0.5">
                      {formatRelativeDate(chat.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-dark-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-800/50">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-xs text-dark-500 hover:text-dark-300 transition-colors"
          >
            <Github size={14} />
            <span>Powered by Google Gemini</span>
          </a>
        </div>
      </aside>
    </>
  );
}