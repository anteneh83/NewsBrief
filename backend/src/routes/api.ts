import { Router, Request, Response } from 'express';
import { Story } from '../models/Story';
import { Audio } from '../models/Audio';
import { generateAudioForStory } from '../services/ttsService';

const router = Router();

// GET /api/feed - Get stories feed
router.get('/feed', async (req: Request, res: Response) => {
    const { lang = 'en', topic, source, since, limit = '20' } = req.query;

    console.log('Story Model Schema paths:', Object.keys(Story.schema.paths));

    try {
        const query: any = {};

        // Only return stories that have a summary in the requested language
        query[`summary.${lang}`] = { $ne: '' };

        if (topic && topic !== 'all') {
            query.topic = { $regex: topic as string, $options: 'i' };
        }

        if (source && source !== 'all') {
            query['source.name'] = { $regex: source as string, $options: 'i' };
        }

        if (since) {
            query.publishedAt = { $gt: new Date(since as string) };
        }

        const stories = await Story.find(query)
            .sort({ publishedAt: -1 })
            .limit(Number(limit));

        res.json({ stories });
    } catch (err) {
        console.error('Error fetching feed:', err);
        res.status(500).json({ error: 'Failed to fetch feed' });
    }
});

// GET /api/search - Search stories
router.get('/search', async (req: Request, res: Response) => {
    const { q, lang = 'en', limit = '20' } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Query parameter required' });
    }

    try {
        const query = {
            $or: [
                { title: { $regex: q as string, $options: 'i' } },
                { 'summary.en': { $regex: q as string, $options: 'i' } },
                { 'summary.am': { $regex: q as string, $options: 'i' } }
            ]
        };

        const stories = await Story.find(query)
            .sort({ publishedAt: -1 })
            .limit(Number(limit));

        res.json({ stories });
    } catch (err) {
        console.error('Error searching stories:', err);
        res.status(500).json({ error: 'Search failed' });
    }
});

// GET /api/story/:id - Get single story details
router.get('/story/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const story = await Story.findOne({ _id: id });

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        res.json({ story });
    } catch (err) {
        console.error('Error fetching story:', err);
        res.status(500).json({ error: 'Failed to fetch story' });
    }
});

// GET /api/daily-brief
router.get('/daily-brief', async (req: Request, res: Response) => {
    const { slot = 'am', lang = 'en' } = req.query;

    try {
        const audio = await Audio.findOne({ slot: slot as string, lang: lang as string })
            .sort({ created_at: -1 });

        if (!audio) {
            return res.json({ audio: null, stories: [] });
        }

        // Get related stories
        const timeAgo = new Date();
        timeAgo.setHours(timeAgo.getHours() - 12);

        const stories = await Story.find({
            [`summary.${lang}`]: { $ne: '' },
            publishedAt: { $gt: timeAgo }
        })
            .sort({ publishedAt: -1 })
            .limit(6);

        res.json({
            audio: {
                ...audio.toObject(),
                url: `/api/audio/${audio._id}`
            },
            stories
        });
    } catch (err) {
        console.error('Error fetching daily brief:', err);
        res.status(500).json({ error: 'Failed to fetch daily brief' });
    }
});

// GET /api/audio/:id
router.get('/audio/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const audio = await Audio.findById(id);

        if (!audio) {
            return res.status(404).json({ error: 'Audio not found' });
        }

        res.sendFile(audio.file_path);
    } catch (err) {
        console.error('Error fetching audio:', err);
        res.status(500).json({ error: 'Failed to fetch audio' });
    }
});

// POST /api/story/:id/audio
router.post('/api/story/:id/audio', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { lang = 'en' } = req.body;

    try {
        const storyId = id as string;

        const existing = await Audio.findOne({ story_id: storyId, lang });

        if (existing) {
            return res.json({
                audio: {
                    ...existing.toObject(),
                    url: `/api/audio/${existing._id}`
                }
            });
        }

        // Get story
        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        const summary = lang === 'am' ? story.summary.am : story.summary.en;
        const text = `${story.title}. ${summary}`;

        // Generate audio
        const audioPath = await generateAudioForStory(storyId, text, lang as 'en' | 'am');

        // Return the new audio
        const newAudio = await Audio.findOne({ story_id: storyId, lang }).sort({ created_at: -1 });

        if (!newAudio) {
            return res.status(500).json({ error: 'Audio creation failed' });
        }

        res.json({
            audio: {
                ...newAudio.toObject(),
                url: `/api/audio/${newAudio._id}`
            }
        });

    } catch (err: any) {
        console.error('Error generating audio:', err);
        res.status(500).json({ error: err.message || 'Failed to generate audio' });
    }
});

export default router;
