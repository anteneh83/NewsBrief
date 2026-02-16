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

        const systemPrompt = `You are a neutral news summarizer for an Ethiopian news aggregator. 
Generate a concise, unbiased summary in ${languageName}.
Return a JSON object with this structure:
{
  "title": "Optimized neutral title",
  "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
  "language": "${language}"
}`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Title: ${title}\n\nContent: ${content}` }
            ],
            response_format: { type: "json_object" }
        });

        const summaryJson = response.choices[0]?.message?.content || '{}';
        const result = JSON.parse(summaryJson) as SummaryResult;
        return result;
    } catch (error: any) {
        console.error('Error summarizing story:', error.message || error);

        // Fallback for quota issues or other errors
        const fallbackBullets = content
            .split(/[.!?]/)
            .filter(s => s.trim().length > 20)
            .slice(0, 3)
            .map(s => s.trim() + '.');

        if (fallbackBullets.length === 0) {
            fallbackBullets.push(title);
        }

        return {
            title: title,
            bullets: fallbackBullets,
            language: language
        };
    }
}

export async function summarizeUnsummarizedStories(): Promise<void> {
    console.log('Starting story summarization...');

    try {
        // Find stories that are missing either English or Amharic summaries
        const storiesToSummarize = await Story.find({
            $or: [
                { 'summary.en': { $in: [null, ''] } },
                { 'summary.am': { $in: [null, ''] } }
            ]
        }).limit(5);

        for (const story of storiesToSummarize) {
            console.log(`Summarizing ${story.title}...`);
            const content = story.content || story.title;

            // 1. Generate English Summary if missing
            if (!story.summary.en) {
                const resultEn = await summarizeStory(story.title, content, 'en');
                if (resultEn) {
                    story.summary.en = resultEn.bullets.join(' ');
                }
            }

            // 2. Generate Amharic Summary if missing
            if (!story.summary.am) {
                const resultAm = await summarizeStory(story.title, content, 'am');
                if (resultAm) {
                    story.summary.am = resultAm.bullets.join(' ');
                }
            }

            await story.save();
            console.log(`Updated summaries for story: ${story.title}`);

            // Small delay to be nice to OpenAI
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (err) {
        console.error('Error in summarization job:', err);
    }
}
