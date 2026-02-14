import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { Audio } from '../models/Audio';
import { Story } from '../models/Story';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

const audioDir = path.join(__dirname, '../../audio');

// Ensure audio directory exists
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

export async function generateAudioForStory(
    storyId: string | number,
    text: string,
    language: 'en' | 'am'
): Promise<string | null> {
    try {
        const voice = language === 'am' ? 'nova' : 'alloy'; // Nova works better for non-English

        const response = await openai.audio.speech.create({
            model: 'tts-1',
            voice: voice,
            input: text,
            speed: 1.0,
        });

        const buffer = Buffer.from(await response.arrayBuffer());
        const fileName = `story_${storyId}_${language}_${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);

        fs.writeFileSync(filePath, buffer);

        // Save to database
        const duration = Math.ceil(text.split(' ').length / 2.5); // Rough estimate

        const newAudio = new Audio({
            story_id: storyId,
            lang: language,
            file_path: filePath,
            duration_sec: duration
        });

        await newAudio.save();
        console.log(`Generated audio for story ${storyId}`);
        return filePath;

    } catch (error) {
        console.error('Error generating TTS:', error);
        throw error;
    }
}

export async function generateDailyBrief(
    slot: 'am' | 'pm',
    language: 'en' | 'am'
): Promise<string | null> {
    try {
        // Get top stories from the last 12 hours
        const timeAgo = new Date();
        timeAgo.setHours(timeAgo.getHours() - 12);

        // Find stories using Mongoose
        const stories = await Story.find({
            summary_lang: language,
            published_at: { $gt: timeAgo }
        })
            .sort({ published_at: -1 })
            .limit(6);

        if (stories.length === 0) {
            return null;
        }

        // Create brief text
        const intro = language === 'am'
            ? `የዕለቱ ዜና ማጠቃለያ - ${slot === 'am' ? 'ጠዋት' : 'ማታ'}`
            : `Daily Brief - ${slot === 'am' ? 'Morning' : 'Evening'}`;

        let briefText = `${intro}. `;

        for (const story of stories) {
            // In Mongoose schema, summary_bullets is already an array of strings
            const bullets = story.summary_bullets || [];
            briefText += `${story.title}. ${bullets.join('. ')}. `;
        }

        // Generate audio
        const response = await openai.audio.speech.create({
            model: 'tts-1',
            voice: language === 'am' ? 'nova' : 'alloy',
            input: briefText,
            speed: 1.0,
        });

        const buffer = Buffer.from(await response.arrayBuffer());
        const fileName = `daily_brief_${slot}_${language}_${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);

        fs.writeFileSync(filePath, buffer);

        // Save to database
        const duration = Math.ceil(briefText.split(' ').length / 2.5);

        const newAudio = new Audio({
            slot: slot,
            lang: language,
            file_path: filePath,
            duration_sec: duration
        });

        await newAudio.save();
        console.log(`Generated daily brief: ${slot} ${language}`);
        return filePath;

    } catch (error) {
        console.error('Error generating daily brief:', error);
        return null;
    }
}
