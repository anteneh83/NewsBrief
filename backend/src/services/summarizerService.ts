import OpenAI from 'openai';
import { Story } from '../models/Story';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

interface SummaryResult {
    title: string;
    bullets: string[];
    language: string;
}

export async function summarizeStory(
    title: string,
    content: string,
    language: 'en' | 'am' = 'en'
): Promise<SummaryResult | null> {
    try {
        const languageName = language === 'am' ? 'Amharic' : 'English';

        const prompt = `Summarize this news article neutrally in simple ${languageName}. 
Output 3-5 bullet points (max 120 words total). 
Include no opinion. 
If the text has insufficient details, say "Insufficient details".

Article Title: ${title}
Article Content: ${content}

Format your response as JSON:
{
  "title": "Clear headline",
  "bullets": ["point 1", "point 2", "point 3"],
  "language": "${language}"
}`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a neutral news summarizer. Always output valid JSON.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 300,
        });

        const content_text = response.choices[0]?.message?.content;
        if (!content_text) {
            throw new Error('No response from OpenAI');
        }

        // Parse JSON response
        const jsonMatch = content_text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid JSON in response');
        }

        const result: SummaryResult = JSON.parse(jsonMatch[0]);
        return result;
    } catch (error) {
        console.error('Error summarizing story:', error);
        return null;
    }
}

export async function summarizeUnsummarizedStories(): Promise<void> {
    console.log('Starting story summarization...');

    try {
        // Find stories that haven't been summarized yet (empty summary_bullets)
        const storiesToSummarize = await Story.find({
            $or: [
                { summary_bullets: { $exists: false } },
                { summary_bullets: { $size: 0 } }
            ]
        }).limit(5); // Limit to 5 at a time to avoid rate limits

        for (const story of storiesToSummarize) {
            console.log(`Summarizing ${story.title}...`);

            // 1. Generate English Summary
            const summaryEn = await summarizeStory(story.title, story.title, 'en'); // Using title as content for now

            if (summaryEn) {
                // Update the original story with English summary
                story.summary_bullets = summaryEn.bullets;
                story.summary_lang = 'en';
                await story.save();
                console.log(`Summarized story ${story._id} in English`);
            }

            // 2. Generate Amharic Summary
            // We create a COPY of the story for the Amharic version
            const summaryAm = await summarizeStory(story.title, story.title, 'am');

            if (summaryAm) {
                // Check if Amharic version already exists (to prevent duplicates if job crashes)
                const existingAm = await Story.findOne({
                    url: story.url,
                    summary_lang: 'am'
                });

                if (!existingAm) {
                    const amStory = new Story({
                        title: story.title, // Title remains same (or could be translated)
                        source: story.source,
                        url: story.url,
                        published_at: story.published_at,
                        topic_tags: story.topic_tags,
                        content_hash: story.content_hash,
                        summary_bullets: summaryAm.bullets,
                        summary_lang: 'am'
                    });

                    await amStory.save();
                    console.log(`Created Amharic version for story ${story.url}`);
                }
            }

            // Small delay to be nice to OpenAI
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (err) {
        console.error('Error in summarization job:', err);
    }
}
