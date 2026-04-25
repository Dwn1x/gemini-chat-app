import { Chat, Message } from "@/types/chat";
import { nanoid } from "nanoid";

const STORAGE_KEY = "gemini-chat-store";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadChats(): Chat[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Chat[];
  } catch {
    return [];
  }
}

export function saveChats(chats: Chat[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
}

export function createChat(): Chat {
  return {
    id: nanoid(),
    title: "New conversation",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createMessage(
  role: "user" | "assistant",
  content: string
): Message {
  return {
    id: nanoid(),
    role,
    content,
    timestamp: Date.now(),
  };
}