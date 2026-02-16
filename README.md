# NewsBrief — AI-Powered News Summarizer for Ethiopia

A lightweight, bilingual (Amharic/English) news summarization platform that delivers quick, neutral news summaries with audio playback. Built with Next.js and Express.

## 🌟 Features

- **Bilingual Support**: Full Amharic and English language support with instant switching
- **AI Summarization**: Powered by OpenAI GPT-4 with a robust fallback mechanism for maximum uptime
- **Watch Later**: Privacy-focused, local-first saving of stories for reading offline or later
- **Refined Filter Layout**: Side-by-side Topic and Source filters for a professional, compact desktop experience
- **Text-to-Speech**: High-quality audio playback using gTTS with automatic language detection
- **Daily Brief**: Curated morning and evening news digests with integrated 'Initiate Briefing' calls-to-action
- **Automatic Topic Detection**: Intelligent categorization into Economy, Politics, Health, and more
- **Search**: Global search through headlines and summaries across all sources
- **Coming Soon Page**: Integrated placeholders for upcoming high-end features like 'Audio Briefcast'

## 🏗️ Tech Stack

### Frontend
- **Next.js 15 (App Router)** with TypeScript
- **Tailwind CSS** for a premium, mobile-first design system
- **React Hooks & Context API** for state and language management
- **Local Storage** for "Watch Later" persistence without accounts

### Backend
- **Node.js** with Express
- **TypeScript** for typed backend logic
- **MongoDB** for persistent intelligence storage
- **OpenAI API** for summaries
- **gTTS (Google Text-to-Speech)** for audio generation
- **RSS Parser** for multi-source ingestion
- **Node Schedule** for automated ingestion and summarization pipelines

## 📋 Prerequisites

- Node.js 20+ and npm
- MongoDB instance (local or Atlas)
- OpenAI API key

## 🚀 Quick Start

### 1. Clone and Setup

```bash
cd NewsBrief
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and configure your keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=your_mongodb_uri
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

The backend will start on http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will start on http://localhost:3000

## 📱 Usage

1. **Home Feed**: Browse latest news with side-by-side topic and source filters
2. **Watch Later**: Click the bookmark icon to save stories; access them via the Header link
3. **Daily Brief**: Access morning/evening digests with curated summaries
4. **Search**: Find specific stories or keywords globally
5. **Language Toggle**: Switch between English (EN) and Amharic (አማ) with a single click

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=5000                          # Server port
OPENAI_API_KEY=your_key_here      # Required for AI summaries
MONGODB_URI=mongodb+srv://...     # MongoDB connection string
FEED_UPDATE_INTERVAL=15           # Feed refresh interval (minutes)
CORS_ORIGIN=http://localhost:3000 # Frontend URL
TTS_PROVIDER=gTTS                 # Audio engine (defaults to gTTS)
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Backend API URL
```

## 📚 API Endpoints

- `GET /api/feed` - Filtered news feed (topic, source, lang, since)
- `GET /api/search?q=query` - Global search
- `GET /api/story/:id` - Story details
- `GET /api/daily-brief?slot=am|pm` - Curated briefing with associated stories
- `GET /api/audio/:id` - Stream generated audio
- `POST /api/story/:id/audio` - Trigger TTS generation for a story

## 🎨 Project Structure

```
NewsBrief/
├── backend/
│   ├── src/
│   │   ├── config/         # Database and environment config
│   │   ├── services/       # Feeds, Summarizer (GPT), TTS (gTTS)
│   │   ├── routes/         # Express API routes
│   │   ├── models/         # Mongoose User and Story models
│   │   ├── jobs/           # Scheduled ingestion & summaries
│   │   └── index.ts        # Server entry point
│
└── frontend/
    ├── app/                # App Router directory
    │   ├── page.tsx        # Home feed & filters
    │   ├── watch-later/    # Offline saved stories
    │   ├── daily-brief/    # Curated intelligence slots
    │   ├── search/         # Discovery page
    │   ├── coming-soon/    # Future feature placeholders
    │   ├── story/[id]/     # Immersive story view
    │   └── layout.tsx      # Root layout with Header, Footer, etc.
    ├── components/         # Reusable UI (SummaryCard, Header, etc.)
    ├── context/            # Global LanguageContext
    ├── lib/                # API client & Watch Later storage logic
    └── types/              # Unified TypeScript definitions
```

## 🔄 Background Jobs

The backend automatically runs:
- Feed fetching every 15 minutes
- Story summarization every 5 minutes
- Daily brief generation at 6 AM and 6 PM

## 🌍 News Sources

Our intelligent ingestion pipeline currently supports:
- **Fana Broadcasting**
- **EBC (Ethiopian Broadcasting Corporation)**
- **ESAT**
- **Addis Standard**
- **Ethiopian Herald**
- **EBS**

## 🎯 Design Principles

1. **Premium Aesthetics**: High-end mobile-first UI with modern typography and animations
2. **Privacy First**: Local-first personalization; no tracking or accounts required
3. **Resilient Intelligence**: Built-in fallbacks for API outages and ingestion errors
4. **Cultural Context**: First-class support for Amharic language and local sources
5. **Clean Performance**: Minimal data usage with text-first summarization

## 🐛 Troubleshooting

### Backend won't start
- Ensure OpenAI API key is set in `.env`
- Check if port 5000 is available

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### No stories appearing
- Wait for initial feed fetch (happens automatically on startup)
- Check backend logs for RSS feed errors

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- OpenAI for GPT-4 and TTS APIs
- Ethiopian news sources for content
- Next.js and Express communities

---

Built with ❤️ for Ethiopia
