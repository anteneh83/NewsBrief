const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
    async getFeed(params: { lang?: string; topic?: string; source?: string; since?: string; limit?: number }) {
        const queryParams = new URLSearchParams();
        if (params.lang) queryParams.append('lang', params.lang);
        if (params.topic) queryParams.append('topic', params.topic);
        if (params.source) queryParams.append('source', params.source);
        if (params.since) queryParams.append('since', params.since);
        if (params.limit) queryParams.append('limit', params.limit.toString());

        try {
            const response = await fetch(`${API_BASE_URL}/feed?${queryParams}`);
            if (!response.ok) throw new Error(`Feed fetch failed: ${response.status}`);
            return response.json();
        } catch (err) {
            console.error('API Error (getFeed):', err);
            throw err;
        }
    },

    async search(params: { q: string; lang?: string; limit?: number }) {
        const queryParams = new URLSearchParams();
        queryParams.append('q', params.q);
        if (params.lang) queryParams.append('lang', params.lang);
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const response = await fetch(`${API_BASE_URL}/search?${queryParams}`);
        if (!response.ok) throw new Error('Failed to search');
        return response.json();
    },

    async getStory(id: string | number, lang?: string) {
        const queryParams = new URLSearchParams();
        if (lang) queryParams.append('lang', lang);

        const response = await fetch(`${API_BASE_URL}/story/${id}?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch story');
        return response.json();
    },

    async getDailyBrief(params: { slot?: string; lang?: string }) {
        const queryParams = new URLSearchParams();
        if (params.slot) queryParams.append('slot', params.slot);
        if (params.lang) queryParams.append('lang', params.lang);

        const response = await fetch(`${API_BASE_URL}/daily-brief?${queryParams}`);
        if (response.status === 404) return null; // Handle empty DB gracefully
        if (!response.ok) throw new Error('Failed to fetch daily brief');
        return response.json();
    },

    async generateStoryAudio(storyId: string | number, lang: string) {
        const response = await fetch(`${API_BASE_URL}/story/${storyId}/audio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lang }),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to generate audio');
        }
        return response.json();
    },

    getAudioUrl(audioId: string | number) {
        return `${API_BASE_URL}/audio/${audioId}`;
    },
};
