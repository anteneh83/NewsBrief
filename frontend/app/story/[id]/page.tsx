'use client';

import { useState, useEffect, use } from 'react';
import { Story } from '@/types';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import { format } from 'date-fns';
import { toggleWatchLater, isSaved } from '@/lib/watchLater';
import { useRouter } from 'next/navigation';

export default function StoryPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const router = useRouter();
    const { language } = useLanguage();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchStory();
    }, [id]);

    useEffect(() => {
        if (story?._id) {
            setSaved(isSaved(story._id));
        }
    }, [story?._id]);

    const fetchStory = async () => {
        setLoading(true);
        try {
            const data = await api.getStory(id);
            setStory(data.story);
        } catch (err) {
            console.error('Error fetching story:', err);
            setError(language === 'am' ? 'ዜናውን መጫን አልተቻለም' : 'Failed to load story');
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAudio = async () => {
        if (!story?._id) return;
        try {
            const data = await api.generateStoryAudio(story._id, language);
            if (data.audio?.url) {
                window.open(data.audio.url, '_blank');
            }
        } catch (err: any) {
            console.error('Error generating audio:', err);
            alert(err.message || 'Failed to generate audio');
        }
    };

    const handleSave = () => {
        if (!story) return;
        toggleWatchLater(story);
        setSaved(!saved);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background text-gray-900">
                <Header />
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-accent border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className="min-h-screen bg-background text-gray-900">
                <Header />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-red-500 mb-4">{error || 'Story not found'}</p>
                    <button onClick={() => router.push('/')} className="text-accent underline font-medium">
                        {language === 'am' ? 'ወደ ዋናው ገጽ ይመለሱ' : 'Back to Home'}
                    </button>
                </div>
            </div>
        );
    }

    const summary = language === 'am' ? story.summary.am : story.summary.en;

    return (
        <div className="min-h-screen bg-background text-gray-900 pb-20">
            <Header />

            <article className="container mx-auto px-4 py-8 max-w-3xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-primary mb-8 transition-colors text-sm font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {language === 'am' ? 'ተመለስ' : 'Back'}
                </button>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-widest shadow-sm">
                            {story.source.name}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">
                            {format(new Date(story.publishedAt), 'PPP')}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${story.source.category === 'state' ? 'border-blue-100 text-blue-600' :
                                story.source.category === 'private' ? 'border-green-100 text-green-600' :
                                    'border-purple-100 text-purple-600'
                            } uppercase font-bold`}>
                            {story.source.category}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight tracking-tight">
                        {story.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 py-5 border-y border-gray-100 mb-10">
                        <button
                            onClick={handlePlayAudio}
                            className="flex items-center gap-2.5 px-6 py-3 bg-accent text-white rounded-full font-bold shadow-lg shadow-accent/20 hover:bg-accent-dark transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <div className="bg-white/20 p-1 rounded-full">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                            </div>
                            <span>{language === 'am' ? 'ማጠቃለያውን አዳምጥ' : 'Listen to Brief'}</span>
                        </button>

                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-bold border transition-all ${saved
                                    ? 'bg-accent/10 border-accent text-accent'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-accent hover:text-accent shadow-sm'
                                }`}
                        >
                            <svg className="w-5 h-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span>
                                {saved
                                    ? (language === 'am' ? 'ተቀምጧል' : 'Saved')
                                    : (language === 'am' ? 'ቆይተው ያንብቡ' : 'Save for Later')}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none">
                    <div className="bg-primary/5 rounded-3xl p-8 md:p-10 border border-primary/10 mb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        <h3 className="text-xs font-black uppercase tracking-[.25em] text-accent mb-6 flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-accent/30"></span>
                            {language === 'am' ? 'AI ማጠቃለያ' : 'AI Summary'}
                        </h3>
                        <p className="text-gray-800 leading-[1.8] text-[1.1rem] font-medium italic">
                            {summary || (language === 'am' ? 'ማጠቃለያ በመዘጋጀት ላይ ነው...' : 'Summary is being generated...')}
                        </p>
                    </div>

                    <div className="mt-12 pt-10 border-t border-gray-100">
                        <h3 className="text-xl font-black text-primary mb-6 uppercase tracking-tight">
                            {language === 'am' ? 'ሙሉ ታሪክ' : 'Original Story'}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-8 text-[1.05rem]">
                            {story.content || story.title}
                        </p>
                        <a
                            href={story.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                        >
                            {language === 'am' ? 'ሙሉውን ምንጭ ይመልከቱ' : 'View Original Source'}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            </article>
        </div>
    );
}
