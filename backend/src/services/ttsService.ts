const gTTS = require('gtts');
import fs from 'fs';
import path from 'path';
import { Audio } from '../models/Audio';
import { Story } from '../models/Story';

const audioDir = path.join(__dirname, '../../audio');

// Ensure audio directory exists
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

/**
 * Generate audio for a story using gTTS
 */
export async function generateAudioForStory(
    storyId: string | number,
    text: string,
    language: 'en' | 'am'
): Promise<string | null> {
    try {
        const fileName = `story_${storyId}_${language}_${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);

        const gtts = new gTTS(text, language);

        await new Promise<void>((resolve, reject) => {
            gtts.save(filePath, (err: any) => {
                if (err) {
                    console.error('gTTS save error:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        // Save to database
        const duration = Math.ceil(text.split(' ').length / 2.5); // Rough estimate

        const newAudio = new Audio({
            story_id: storyId,
            lang: language,
            file_path: filePath,
            duration_sec: duration
        });

        await newAudio.save();
        console.log(`Generated audio for story ${storyId} using gTTS`);
        return filePath;

    } catch (error) {
        console.error('Error generating TTS with gTTS:', error);
        throw error;
    }
}

/**
 * Generate aggregate audio for daily brief using gTTS
 */
export async function generateDailyBrief(
    slot: 'am' | 'pm',
    language: 'en' | 'am'
): Promise<string | null> {
    try {
        const timeAgo = new Date();
        timeAgo.setHours(timeAgo.getHours() - 12);

        const stories = await Story.find({
            summary_lang: language,
            published_at: { $gt: timeAgo }
        })
            .sort({ published_at: -1 })
            .limit(6);

        if (stories.length === 0) {
            return null;
        }

        const intro = language === 'am'
            ? `የዕለቱ ዜና ማጠቃለያ - ${slot === 'am' ? 'ጠዋት' : 'ማታ'}`
            : `Daily Brief - ${slot === 'am' ? 'Morning' : 'Evening'}`;

        let briefText = `${intro}. `;

        for (const story of stories) {
            const bullets = story.summary_bullets || [];
            briefText += `${story.title}. ${bullets.join('. ')}. `;
        }

        const fileName = `daily_brief_${slot}_${language}_${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);

        const gtts = new gTTS(briefText, language);

        await new Promise<void>((resolve, reject) => {
            gtts.save(filePath, (err: any) => {
                if (err) {
                    console.error('gTTS daily brief save error:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        const duration = Math.ceil(briefText.split(' ').length / 2.5);

        const newAudio = new Audio({
            slot: slot,
            lang: language,
            file_path: filePath,
            duration_sec: duration
        });

        await newAudio.save();
        console.log(`Generated daily brief: ${slot} ${language} using gTTS`);
        return filePath;

    } catch (error) {
        console.error('Error generating daily brief with gTTS:', error);
        return null;
    }
}
