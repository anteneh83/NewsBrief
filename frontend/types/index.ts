export interface Story {
    _id?: string;
    id?: string | number; // For backward compatibility or mapped ID
    title: string;
    source: string;
    url: string;
    published_at: string;
    topic_tags: string[];
    summary_bullets: string[];
    summary_lang: string;
    created_at: string;
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
