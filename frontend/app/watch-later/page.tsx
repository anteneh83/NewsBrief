'use client';

import { useState, useEffect } from 'react';
import { Story } from '@/types';
import { getWatchLater } from '@/lib/watchLater';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import SummaryCard from '@/components/SummaryCard';
import { api } from '@/lib/api';

export default function WatchLaterPage() {
    const { language } = useLanguage();
    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {
        setStories(getWatchLater());
    }, []);

    const handlePlayAudio = async (storyId: string) => {
        try {
            const data = await api.generateStoryAudio(storyId, language);
            if (data.audio?.url) {
                window.open(data.audio.url, '_blank');
            }
        } catch (err: any) {
            console.error('Error generating audio:', err);
            alert(err.message || 'Failed to generate audio');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-6 max-w-4xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-primary mb-2">
                        {language === 'am' ? 'ቆይተው የሚነበቡ' : 'Watch Later'}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {language === 'am'
                            ? 'ያስቀመጧቸው ዜናዎች እዚህ ይገኛሉ (ያለ ኢንተርኔት መጠቀም ይቻላል)'
                            : 'Stories you\'ve saved for later (accessible offline)'}
                    </p>
                </div>

                {stories.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-100 italic">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <p className="text-gray-400">
                            {language === 'am' ? 'ምንም የተቀመጠ ዜና የለም' : 'No stories saved yet'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {stories.map((story) => (
                            <SummaryCard
                                key={story._id || story.id}
                                story={story}
                                onPlayAudio={handlePlayAudio}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
