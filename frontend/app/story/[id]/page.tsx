'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Story, Language } from '@/types';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';

import { useLanguage } from '@/context/LanguageContext';

export default function StoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const storyId = params.id as string;
    const { language } = useLanguage();
    const [story, setStory] = useState<Story | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingAudio, setLoadingAudio] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStory();
    }, [storyId, language]);

    const fetchStory = async () => {
        setLoading(true);
        setError(null);

        try {
            // Pass ID directly as string or number depending on what it looks like?
            // Actually, standard fetch accepts string/number and converts to string in URL.
            // But we should not try to parseInt it if it is MongoDB ID.
            const data = await api.getStory(storyId, language);

            // Ensure mapped ID
            const storyData = data.story;
            const id = storyData._id || storyData.id;
            setStory({ ...storyData, id });

        } catch (err) {
            console.error('Error fetching story:', err);
            setError(language === 'am' ? 'ዜናውን መጫን አልተቻለም' : 'Failed to load story');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAudio = async () => {
        if (!story) return;

        // Prefer _id or id
        const id = story.id || story._id;
        if (!id) return;

        setLoadingAudio(true);
        try {
            const data = await api.generateStoryAudio(id, language);
            if (data.audio?.url) {
                setAudioUrl(data.audio.url);
            }
        } catch (err) {
            console.error('Error generating audio:', err);
        } finally {
            setLoadingAudio(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
                        {error || (language === 'am' ? 'ዜና አልተገኘም' : 'Story not found')}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-6 max-w-4xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-accent hover:text-accent-light mb-6 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {language === 'am' ? 'ተመለስ' : 'Back'}
                </button>

                <article className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium">
                            {story.source}
                        </span>
                        <span className="text-sm text-gray-500">
                            {new Date(story.published_at).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-primary mb-6">
                        {story.title}
                    </h1>

                    <div className="prose max-w-none mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            {language === 'am' ? 'ማጠቃለያ' : 'Summary'}
                        </h3>
                        <ul className="space-y-2">
                            {story.summary_bullets.map((bullet, index) => (
                                <li key={index} className="text-gray-700 leading-relaxed">
                                    {bullet}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {story.topic_tags.map((tag, index) => (
                            <span key={index} className="topic-chip">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {audioUrl ? (
                        <AudioPlayer audioUrl={audioUrl} title={language === 'am' ? 'የድምጽ ማጠቃለያ' : 'Audio Summary'} />
                    ) : (
                        <button
                            onClick={handleGenerateAudio}
                            disabled={loadingAudio}
                            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingAudio
                                ? (language === 'am' ? 'ማዘጋጀት...' : 'Generating...')
                                : (language === 'am' ? 'የድምጽ ማጠቃለያ አድምጥ' : 'Listen to Audio Summary')}
                        </button>
                    )}

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <a
                            href={story.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-medium transition-colors"
                        >
                            {language === 'am' ? 'ሙሉ መጣጥፍ አንብብ' : 'Read Full Article'}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </article>
            </main>
        </div>
    );
}
