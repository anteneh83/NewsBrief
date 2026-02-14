'use client';

import { useState, useRef } from 'react';
import { Story } from '@/types';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import SummaryCard from '@/components/SummaryCard';

export default function SearchPage() {
    const { language } = useLanguage();
    const [query, setQuery] = useState('');
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handlePlayAudio = async (storyId: string | number) => {
        try {
            const data = await api.generateStoryAudio(storyId, language);
            if (data.audio?.url) {
                window.open(data.audio.url, '_blank');
            }
        } catch (err) {
            console.error('Error generating audio:', err);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!query.trim()) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const data = await api.search({ q: query, lang: language, limit: 20 });
            setStories(data.stories || []);
        } catch (err) {
            console.error('Error searching:', err);
            setError(language === 'am' ? 'ፍለጋው አልተሳካም' : 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    const quickSearches = [
        { en: 'Economy', am: 'ምጣነ' },
        { en: 'Agriculture', am: 'ምርት' },
        { en: 'Health', am: 'ጤና' },
        { en: 'Education', am: 'ትምህርት' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-6 max-w-4xl">
                <h2 className="text-2xl font-bold text-primary mb-6">
                    {language === 'am' ? 'ዜናዎች ፈልግ' : 'Search News'}
                </h2>

                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={language === 'am'
                                ? 'ርዕስ፣ ቁልፍ ቃላት ወይም ርዕሰ ጉዳይ ፈልግ...'
                                : 'Search by topic, keyword, or title...'}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mb-8">
                    <p className="text-sm text-gray-600 mb-2">
                        {language === 'am' ? 'ፈጣን ፍለጋዎች:' : 'Quick searches:'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {quickSearches.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setQuery(language === 'am' ? item.am : item.en);
                                    inputRef.current?.focus();
                                }}
                                className="topic-chip"
                            >
                                {language === 'am' ? item.am : item.en}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
                        {error}
                        <button
                            onClick={() => handleSearch({ preventDefault: () => { } } as React.FormEvent)}
                            className="ml-4 underline hover:no-underline"
                        >
                            {language === 'am' ? 'እንደገና ሞክር' : 'Try again'}
                        </button>
                    </div>
                )}

                {!loading && !error && hasSearched && stories.length === 0 && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500">
                            {language === 'am' ? 'ምንም ውጤት አልተገኘም' : 'No results found'}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            {language === 'am' ? 'ሌላ ቁልፍ ቃል ይሞክሩ' : 'Try different keywords'}
                        </p>
                    </div>
                )}

                {!loading && !error && stories.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-600 mb-4">
                            {language === 'am'
                                ? `${stories.length} ውጤቶች ተገኝተዋል`
                                : `Found ${stories.length} result${stories.length !== 1 ? 's' : ''}`}
                        </p>
                        <div className="space-y-4">
                            {stories.map((story) => (
                                <SummaryCard
                                    key={story._id || story.id}
                                    story={story}
                                    onPlayAudio={handlePlayAudio}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
