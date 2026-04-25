# ✨ Gemini Chat — AI Assistant

A stunning, full-stack AI chat application built with **Next.js 15**, **Tailwind CSS**, and **Google Gemini 2.0 Flash**. Features a dark-mode-first design, conversation history, markdown rendering, and one-click Vercel deployment.

![Gemini Chat](https://img.shields.io/badge/Powered%20by-Gemini%202.0-blue?style=for-the-badge&logo=google)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)

---

## 🚀 Features

- 🎨 **Dark Mode Design** — Sleek glassmorphism UI with smooth animations
- 💬 **Chat History** — Persistent conversations stored in localStorage
- 🤖 **Google Gemini 2.0 Flash** — Fast, intelligent AI responses
- 📝 **Markdown Support** — Code blocks with syntax highlighting, tables, lists
- 📱 **Fully Responsive** — Works beautifully on mobile, tablet, and desktop
- ⚡ **Server Actions** — Secure API key handling via Next.js server actions
- 🎯 **Smart Titles** — Auto-generated conversation titles
- 📋 **Code Copy** — One-click copy for code blocks

---

## 📦 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Dwn1x/gemini-chat-app.git
cd gemini-chat-app
npm install
```

### 2. Get Your Free API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key

> 💡 The free tier is very generous — perfect for personal use and prototyping!

### 3. Configure the API Key

Create a `.env.local` file in the project root:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
```

### 4. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start chatting! 🎉

---

## 🌐 Deploy to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your `gemini-chat-app` repository
4. Add Environment Variable: `GOOGLE_GENERATIVE_AI_API_KEY` = your API key
5. Click **Deploy**

---

## 📄 License

MIT — Use it, modify it, ship it.