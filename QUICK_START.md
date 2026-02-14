# Quick Start Guide

## ✅ Fixed: Nodemon installed

## 🔑 OpenAI API Key Setup

You need your **OpenAI SECRET KEY** (not just any key).

### How to get it:
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-...`)
4. Add it to `backend/.env`:

```env
OPENAI_API_KEY=sk-proj-your-actual-secret-key-here
```

⚠️ **Important:** The key starts with `sk-` and is your secret API key from OpenAI platform.

## 🚀 Now Run the Backend

```bash
cd backend
npm run dev
```

The server should start at http://localhost:5000

## 📝 About MongoDB Request

You mentioned wanting to use MongoDB instead of SQLite. I can refactor the database layer to use MongoDB if you'd like. This would involve:

1. Installing mongoose
2. Replacing SQLite code with MongoDB schemas
3. Updating all database queries

**Should I proceed with converting to MongoDB?** This will take a few minutes but will give you a more scalable database solution.
