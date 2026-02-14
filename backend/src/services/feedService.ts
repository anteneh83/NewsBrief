import Parser from 'rss-parser';
import crypto from 'crypto';
import { Story } from '../models/Story';

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://google.com'
    }
});

// Ethiopian news sources
const RSS_FEEDS = [
    {
        url: 'https://addisstandard.com/feed/',
        source: 'Addis Standard',
        topics: ['politics', 'economy', 'society']
    },
    {
        url: 'https://www.fanabc.com/english/feed/',
        source: 'Fana Broadcasting',
        topics: ['politics', 'economy', 'national']
    },
    {
        url: 'https://www.thereporterethiopia.com/feed/',
        source: 'The Reporter',
        topics: ['business', 'politics', 'society']
    }
];

interface FeedItem {
    title: string;
    link: string;
    pubDate: string;
    content?: string;
    contentSnippet?: string;
}

export async function fetchAllFeeds(): Promise<void> {
    console.log('Starting feed fetch...');

    for (const feed of RSS_FEEDS) {
        try {
            console.log(`Fetching feed from ${feed.source}...`);
            const feedData = await parser.parseURL(feed.url);

            for (const item of feedData.items) {
                await processStory(item as FeedItem, feed.source, feed.topics);
            }
        } catch (error) {
            console.error(`Error fetching feed from ${feed.source}:`, error);
            // Continue with other feeds even if one fails
        }
    }

    console.log('Feed fetch completed');
}

async function processStory(item: FeedItem, source: string, topics: string[]): Promise<void> {
    const contentHash = crypto
        .createHash('md5')
        .update(item.link)
        .digest('hex');

    try {
        // Check if story already exists
        const existingStory = await Story.findOne({
            $or: [{ url: item.link }, { content_hash: contentHash }]
        });

        if (existingStory) {
            // Story already exists, skip
            return;
        }

        // Insert new story (will be summarized later)
        const newStory = new Story({
            title: item.title,
            source: source,
            url: item.link,
            published_at: item.pubDate ? new Date(item.pubDate) : new Date(),
            topic_tags: topics,
            summary_bullets: [], // Initialize empty
            content_hash: contentHash
        });

        await newStory.save();
        console.log(`Added new story: ${item.title}`);
    } catch (err) {
        console.error('Error processing story:', err);
    }
}

export { RSS_FEEDS };
