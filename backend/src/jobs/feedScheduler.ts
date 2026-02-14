import schedule from 'node-schedule';
import { fetchAllFeeds } from '../services/feedService';
import { summarizeUnsummarizedStories } from '../services/summarizerService';
import { generateDailyBrief } from '../services/ttsService';

// Fetch feeds every 15 minutes
export function scheduleFeedUpdates() {
    console.log('Scheduling feed updates every 15 minutes...');

    // Run immediately on start
    fetchAllFeeds().catch(console.error);

    // Then every 15 minutes
    schedule.scheduleJob('*/15 * * * *', async () => {
        console.log('Running scheduled feed update...');
        await fetchAllFeeds();
    });
}

// Summarize stories every 5 minutes
export function scheduleSummarization() {
    console.log('Scheduling story summarization every 5 minutes...');

    // Run immediately on start
    summarizeUnsummarizedStories().catch(console.error);

    // Then every 5 minutes
    schedule.scheduleJob('*/5 * * * *', async () => {
        console.log('Running scheduled summarization...');
        await summarizeUnsummarizedStories();
    });
}

// Generate daily briefs at specific times
export function scheduleDailyBriefs() {
    console.log('Scheduling daily briefs (6 AM and 6 PM)...');

    // Run check on startup for current slot
    const now = new Date();
    const currentHour = now.getHours();
    const currentSlot = currentHour < 12 ? 'am' : 'pm';

    console.log(`Checking/Generating ${currentSlot} daily brief on startup...`);
    generateDailyBrief(currentSlot, 'en').catch(console.error);
    generateDailyBrief(currentSlot, 'am').catch(console.error);

    // Morning brief at 6:00 AM
    schedule.scheduleJob('0 6 * * *', async () => {
        console.log('Generating morning daily brief...');
        await generateDailyBrief('am', 'en');
        await generateDailyBrief('am', 'am');
    });

    // Evening brief at 6:00 PM
    schedule.scheduleJob('0 18 * * *', async () => {
        console.log('Generating evening daily brief...');
        await generateDailyBrief('pm', 'en');
        await generateDailyBrief('pm', 'am');
    });
}

export function startAllJobs() {
    scheduleFeedUpdates();
    scheduleSummarization();
    scheduleDailyBriefs();
    console.log('All background jobs scheduled successfully');
}
