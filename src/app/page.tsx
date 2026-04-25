"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, ArrowDown } from "lucide-react";
import { Chat, Message } from "@/types/chat";
import { loadChats, saveChats, createChat, createMessage } from "@/lib/store";
import { generateChatResponse, generateTitle } from "@/lib/gemini";
import Sidebar from "@/components/Sidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import WelcomeScreen from "@/components/WelcomeScreen";

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  // Load persisted chats on mount
  useEffect(() => {
    const stored = loadChats();
    setChats(stored);
    if (stored.length > 0) {
      setActiveChatId(stored.sort((a, b) => b.updatedAt - a.updatedAt)[0].id);
    }
    setMounted(true);
  }, []);

  // Save chats whenever they change
  useEffect(() => {
    if (mounted && chats.length > 0) {
      saveChats(chats);
    }
  }, [chats, mounted]);

  // Auto-scroll
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (activeChat?.messages.length) {
      scrollToBottom("smooth");
    }
  }, [activeChat?.messages.length, activeChat?.messages, scrollToBottom]);

  // Track scroll position for "scroll to bottom" button
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeChatId]);

  const updateChat = useCallback(
    (chatId: string, updater: (chat: Chat) => Chat) => {
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? updater(c) : c))
      );
    },
    []
  );

  const handleSend = useCallback(
    async (content: string) => {
      let chatId = activeChatId;
      let isNew = false;

      // Create new chat if needed
      if (!chatId) {
        const newChat = createChat();
        chatId = newChat.id;
        isNew = true;
        setChats((prev) => [newChat, ...prev]);
        setActiveChatId(chatId);
      }

      const userMessage = createMessage("user", content);
      const assistantMessage = createMessage("assistant", "");

      // Add user message
      updateChat(chatId, (chat) => ({
        ...chat,
        messages: [...chat.messages, userMessage],
        updatedAt: Date.now(),
      }));

      setIsLoading(true);
      setStreamingMessageId(assistantMessage.id);

      try {
        // Get all messages for context
        const currentChat = isNew
          ? { messages: [userMessage] }
          : chats.find((c) => c.id === chatId);
        const allMessages = [
          ...(currentChat?.messages || []),
          ...(isNew ? [] : [userMessage]),
        ];

        const messagesForApi = allMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await generateChatResponse(messagesForApi);

        // Add assistant response
        const finalMessage = { ...assistantMessage, content: response };
        updateChat(chatId, (chat) => ({
          ...chat,
          messages: [...chat.messages, finalMessage],
          updatedAt: Date.now(),
        }));

        // Generate title for new chats
        if (isNew || chats.find((c) => c.id === chatId)?.title === "New conversation") {
          const title = await generateTitle(content);
          updateChat(chatId, (chat) => ({ ...chat, title }));
        }
      } catch (error) {
        const errorMessage = {
          ...assistantMessage,
          content: "⚠️ Something went wrong. Please try again.",
        };
        updateChat(chatId, (chat) => ({
          ...chat,
          messages: [...chat.messages, errorMessage],
          updatedAt: Date.now(),
        }));
        console.error("Chat error:", error);
      } finally {
        setIsLoading(false);
        setStreamingMessageId(null);
      }
    },
    [activeChatId, chats, updateChat]
  );

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
  }, []);

  const handleDeleteChat = useCallback(
    (id: string) => {
      setChats((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        saveChats(updated);
        return updated;
      });
      if (activeChatId === id) {
        setActiveChatId(null);
      }
    },
    [activeChatId]
  );

  if (!mounted) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-950">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-dark-950">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-dark-800/50 glass-panel">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-dark-800/80 text-dark-400 hover:text-dark-200 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium text-dark-200 truncate max-w-[200px] md:max-w-md">
                {activeChat?.title || "New conversation"}
              </h2>
              {activeChat && (
                <span className="text-[11px] text-dark-500 hidden sm:inline">
                  · {activeChat.messages.length} messages
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium text-emerald-400">
                Gemini 2.0 Flash
              </span>
            </div>
          </div>
        </header>

        {/* Messages area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
        >
          {!activeChat || activeChat.messages.length === 0 ? (
            <WelcomeScreen onSuggestion={handleSend} />
          ) : (
            <div className="max-w-3xl mx-auto py-4">
              {activeChat.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={message.id === streamingMessageId}
                />
              ))}
              {isLoading && !streamingMessageId && <TypingIndicator />}
              {isLoading && streamingMessageId && !activeChat.messages.find(m => m.id === streamingMessageId) && (
                <TypingIndicator />
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Scroll to bottom */}
        {showScrollBtn && (
          <button
            onClick={() => scrollToBottom()}
            className="absolute bottom-28 right-6 p-2.5 rounded-full glass-panel shadow-xl hover:bg-dark-800/80 text-dark-400 hover:text-dark-200 transition-all animate-fade-in z-10"
          >
            <ArrowDown size={18} />
          </button>
        )}

        {/* Input area */}
        <div className="flex-shrink-0 border-t border-dark-800/30 pt-3 bg-gradient-to-t from-dark-950 via-dark-950/95 to-transparent">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}