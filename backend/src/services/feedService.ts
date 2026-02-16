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
// Ethiopian news sources
const SOURCES = [
    {
        name: "Fana",
        url: "https://www.fanabc.com/english/feed/",
        category: "state"
    },
    {
        name: "EBC",
        url: "https://www.fanabc.com/english/feed/", // Fallback to Fana as EBC feed is down
        category: "state"
    },
    {
        name: "EBS",
        url: "https://ebstv.tv/feed/",
        category: "private"
    },
    {
        name: "ESAT",
        url: "https://ethsat.com/feed/",
        category: "diaspora"
    },
    {
        name: "Addis Standard",
        url: "https://addisstandard.com/feed/",
        category: "private"
    },
    {
        name: "Ethiopian Herald",
        url: "https://allafrica.com/tools/headlines/rdf/latest/latestec_et_all.xml",
        category: "state"
    }
];

interface FeedItem {
    title: string;
    link: string;
    pubDate: string;
    content?: string;
    contentSnippet?: string;
}

const TOPIC_KEYWORDS: Record<string, string[]> = {
    economy: ['economy', 'finance', 'business', 'trade', 'investment', 'market', 'economic', 'bank', 'budget'],
    agriculture: ['agriculture', 'farm', 'crop', 'irrigation', 'livestock', 'wheat', 'coffee', 'fertilizer'],
    health: ['health', 'medical', 'hospital', 'vaccine', 'disease', 'pandemic', 'covid', 'doctor', 'patient'],
    politics: ['politics', 'government', 'parliament', 'election', 'diplomat', 'policy', 'minister', 'security', 'peace'],
    education: ['education', 'school', 'university', 'student', 'learning', 'tuition', 'scholarship', 'teacher'],
    sports: ['sports', 'football', 'athlete', 'stadium', 'olympic', 'match', 'tournament', 'club', 'league']
};

function detectTopic(title: string, content: string): string {
    const fullText = `${title} ${content}`.toLowerCase();

    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
        if (keywords.some(keyword => fullText.includes(keyword))) {
            return topic;
        }
    }

    return 'national'; // Default topic
}

export async function fetchAllFeeds(): Promise<void> {
    console.log('Starting feed fetch...');

    for (const source of SOURCES) {
        try {
            console.log(`Fetching feed from ${source.name}...`);
            const feedData = await parser.parseURL(source.url);

            for (const item of feedData.items) {
                await processStory(item as FeedItem, source);
            }
        } catch (error) {
            console.error(`Error fetching feed from ${source.name}:`, error);
        }
    }

    console.log('Feed fetch completed');
}

async function processStory(item: FeedItem, sourceInfo: any): Promise<void> {
    const contentHash = crypto
        .createHash('md5')
        .update(item.link)
        .digest('hex');

    try {
        // Check if story already exists
        const existingStory = await Story.findOne({
            $or: [{ originalUrl: item.link }, { content_hash: contentHash }]
        });

        if (existingStory) {
            return;
        }

        const content = item.contentSnippet || item.content || item.title;
        const topic = detectTopic(item.title, content);

        // Insert new story
        const newStory = new Story({
            title: item.title,
            content: content,
            topic: topic,
            source: {
                name: sourceInfo.name,
                url: sourceInfo.url,
                category: sourceInfo.category
            },
            originalUrl: item.link,
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
            content_hash: contentHash
        });

        await newStory.save();
        console.log(`Added new story [Topic: ${topic}]: ${item.title}`);
    } catch (err) {
        console.error('Error processing story:', err);
    }
}

export { SOURCES as RSS_FEEDS };
