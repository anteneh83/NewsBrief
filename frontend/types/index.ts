export interface Story {
    _id?: string;
    id?: string | number;
    title: string;
    summary: {
        am: string;
        en: string;
    };
    content?: string;
    topic?: string;
    source: {
        name: string;
        url: string;
        logo?: string;
        category: 'state' | 'private' | 'diaspora';
    };
    originalUrl: string;
    publishedAt: string;
    audioUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Audio {
    _id?: string;
    id?: string | number;
    story_id?: string | number;
    slot?: 'am' | 'pm';
    lang: string;
    url: string;
    duration_sec: number;
    created_at: string;
}

export interface DailyBrief {
    audio: Audio;
    stories: Story[];
}

export type Language = 'en' | 'am';
export type TimeSlot = 'am' | 'pm';
