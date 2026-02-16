'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Story } from '@/types';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import SummaryCard from '@/components/SummaryCard';

function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const q = searchParams.get('q') || '';
    const { language } = useLanguage();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState(q);

    useEffect(() => {
        if (q) {
            searchStories(q);
        }
    }, [q, language]);

    const searchStories = async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.search({ q: query, lang: language, limit: 30 });
            setStories(data.stories || []);
        } catch (err) {
            console.error('Search error:', err);
            setError(language === 'am' ? 'ፍለጋው አልተሳካም' : 'Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
        }
    };

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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-10">
                <form onSubmit={handleSearch} className="relative group max-w-2xl">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder={language === 'am' ? 'ዜናዎችን ይፈልጉ...' : 'Search stories...'}
                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all text-lg font-medium"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-3 p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </form>
            </div>

            {q && (
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-primary mb-2">
                        {language === 'am' ? `ለ "${q}" የተገኙ ውጤቶች` : `Intelligence for "${q}"`}
                    </h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                        {stories.length} {language === 'am' ? 'ውጤቶች ተገኝተዋል' : 'Verified Briefs'}
                    </p>
                </div>
            )}

            {loading && (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-accent border-t-transparent"></div>
                </div>
            )}

            {error && !loading && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-red-700 text-center font-bold shadow-sm">
                    {error}
                </div>
            )}

            {!loading && !error && q && stories.length === 0 && (
                <div className="bg-white rounded-3xl shadow-sm p-24 text-center border border-dashed border-gray-200">
                    <svg className="w-20 h-20 text-gray-100 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-gray-400 font-bold italic text-lg">
                        {language === 'am' ? 'ምንም ውጤት አልተገኘም' : 'No intelligence found for this query'}
                    </p>
                </div>
            )}

            {!loading && !error && stories.length > 0 && (
                <div className="space-y-6">
                    {stories.map((story) => (
                        <SummaryCard
                            key={story._id || story.id}
                            story={story}
                            onPlayAudio={handlePlayAudio}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-background text-gray-900">
            <Header />
            <Suspense fallback={
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-accent border-t-transparent"></div>
                </div>
            }>
                <SearchResults />
            </Suspense>
        </div>
    );
}
