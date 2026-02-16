import { Story } from '@/types';

const STORAGE_KEY = 'watchLater';

export function getWatchLater(): Story[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        console.error('Error reading watch later from storage:', err);
        return [];
    }
}

export function toggleWatchLater(story: Story): void {
    if (typeof window === 'undefined') return;

    const stories = getWatchLater();
    const storyId = story._id || story.id;
    const index = stories.findIndex(s => (s._id || s.id) === storyId);

    if (index > -1) {
        stories.splice(index, 1);
    } else {
        stories.unshift(story);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

export function isSaved(storyId: string | number): boolean {
    if (typeof window === 'undefined') return false;
    const stories = getWatchLater();
    return stories.some(s => (s._id || s.id) === storyId);
}
