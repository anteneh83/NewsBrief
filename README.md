# NewsBrief — AI-Powered News Summarizer for Ethiopia

A lightweight, bilingual (Amharic/English) news summarization platform that delivers quick, neutral news summaries with audio playback. Built with Next.js and Express.

## 🌟 Features

- **Bilingual Support**: Full Amharic and English language support
- **AI Summarization**: Powered by OpenAI GPT-4 for neutral, concise summaries
- **Text-to-Speech**: Audio playback for all stories and daily briefs
- **Daily Brief**: Morning and evening news digests
- **Topic Filtering**: Economy, Agriculture, Health, Politics, Education, Sports
- **Search**: Find stories by keywords and topics
- **Mobile Responsive**: Optimized for mobile devices with data-saver approach
- **Offline Ready**: Architecture supports caching for offline access

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **React Hooks** for state management
- Mobile-first responsive design

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **SQLite** for database
- **OpenAI API** for summarization and TTS
- **RSS Parser** for feed ingestion
- **Node Schedule** for background jobs

## 📋 Prerequisites

- Node.js 18+ and npm
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

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
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

1. **Home Feed**: Browse latest news with topic filters
2. **Daily Brief**: Listen to morning/evening news summaries
3. **Search**: Find specific topics or keywords
4. **Story Detail**: Read full summaries and listen to audio
5. **Language Toggle**: Switch between English (EN) and Amharic (አማ)

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=5000                          # Server port
OPENAI_API_KEY=your_key_here      # Required for AI features
DATABASE_PATH=./data/newsbrief.db # SQLite database location
FEED_UPDATE_INTERVAL=15           # Feed refresh interval (minutes)
CORS_ORIGIN=http://localhost:3000 # Frontend URL
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Backend API URL
```

## 📚 API Endpoints

- `GET /api/feed` - Get news feed with optional filters
- `GET /api/search?q=query` - Search stories
- `GET /api/story/:id` - Get single story details
- `GET /api/daily-brief?slot=am|pm` - Get daily brief
- `GET /api/audio/:id` - Stream audio file
- `POST /api/story/:id/audio` - Generate audio for story

## 🎨 Project Structure

```
NewsBrief/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── services/       # Feed, summarizer, TTS services
│   │   ├── routes/         # API routes
│   │   ├── jobs/           # Background job scheduler
│   │   └── index.ts        # Express server
│   ├── data/               # SQLite database
│   └── audio/              # Generated audio files
│
└── frontend/
    ├── app/                # Next.js app directory
    │   ├── page.tsx        # Home feed
    │   ├── daily-brief/    # Daily brief page
    │   ├── search/         # Search page
    │   └── story/[id]/     # Story detail page
    ├── components/         # React components
    ├── lib/                # API client utilities
    └── types/              # TypeScript types
```

## 🔄 Background Jobs

The backend automatically runs:
- Feed fetching every 15 minutes
- Story summarization every 5 minutes
- Daily brief generation at 6 AM and 6 PM

## 🌍 News Sources

Currently configured sources:
- Addis Standard
- Ethiopian Herald
- (More sources can be added in `backend/src/services/feedService.ts`)

## 🎯 Design Principles

1. **Simplicity First**: Easy to search, read, and listen
2. **Neutral & Transparent**: No opinions, always show source
3. **Data-Saver**: Text-first, optimized for low bandwidth
4. **Bilingual**: Everything works in Amharic and English
5. **Privacy by Default**: No accounts required

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
