'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DailyBrief, TimeSlot } from '@/types';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import SummaryCard from '@/components/SummaryCard';
import { format } from 'date-fns';

export default function DailyBriefPage() {
    const { language } = useLanguage();
    const [slot, setSlot] = useState<TimeSlot>(new Date().getHours() < 12 ? 'am' : 'pm');
    const [brief, setBrief] = useState<DailyBrief | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBrief();
    }, [language, slot]);

    const fetchBrief = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getDailyBrief({ slot, lang: language });
            setBrief(data);
        } catch (err) {
            console.error('Error fetching brief:', err);
            setError(language === 'am' ? 'ማጠቃለያውን ማግኘት አልተቻለም' : 'Failed to fetch daily intelligence');
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAudio = (url: string) => {
        window.open(url, '_blank');
    };

    const handleStoryPlayAudio = async (storyId: string) => {
        try {
            const data = await api.generateStoryAudio(storyId, language);
            if (data.audio?.url) {
                window.open(data.audio.url, '_blank');
            }
        } catch (err: any) {
            console.error('Error generating audio:', err);
            alert(err.message || 'Failed to generate audioBrief');
        }
    };

    return (
        <div className="min-h-screen bg-background text-gray-900 pb-20">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-primary mb-3 tracking-tight">
                            {language === 'am' ? 'የዕለቱ ማጠቃለያ' : 'Daily Intelligence'}
                        </h1>
                        <p className="text-gray-400 font-bold tracking-[.1em] uppercase text-xs flex items-center gap-2">
                            <span className="w-6 h-[2px] bg-accent"></span>
                            {format(new Date(), 'EEEE, MMMM do')} • {slot === 'am' ? (language === 'am' ? 'የጠዋት እትም' : 'Morning Edition') : (language === 'am' ? 'የማታ እትም' : 'Evening Edition')}
                        </p>
                    </div>

                    <div className="flex bg-gray-100/80 p-1.5 rounded-2xl self-start shadow-inner border border-gray-200/50 backdrop-blur-sm">
                        <button
                            onClick={() => setSlot('am')}
                            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${slot === 'am'
                                ? 'bg-white text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)] scale-100'
                                : 'text-gray-400 hover:text-gray-600 scale-95'
                                }`}
                        >
                            {language === 'am' ? 'ጠዋት' : 'AM'}
                        </button>
                        <button
                            onClick={() => setSlot('pm')}
                            className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all ${slot === 'pm'
                                ? 'bg-white text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)] scale-100'
                                : 'text-gray-400 hover:text-gray-600 scale-95'
                                }`}
                        >
                            {language === 'am' ? 'ማታ' : 'PM'}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-accent border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center text-red-600 font-black shadow-sm">
                        {error}
                    </div>
                ) : !brief || brief.stories.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] shadow-sm p-24 text-center border border-dashed border-gray-200">
                        <p className="text-gray-400 font-bold italic text-lg mb-8">
                            {language === 'am' ? 'ለዚህ ሰዓት ምንም ማጠቃለያ የለም' : 'No intelligence available for this window yet'}
                        </p>
                        <Link
                            href="/coming-soon"
                            className="inline-flex items-center gap-2 px-10 py-4 bg-accent text-white rounded-2xl font-black shadow-2xl shadow-accent/40 hover:bg-accent-dark transition-all transform hover:-translate-y-1 active:translate-y-0"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {language === 'am' ? 'ያጭሩልኝ' : 'Initiate Briefing'}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {brief.audio?.url && (
                            <div className="bg-primary text-white rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group border border-white/10">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full -mr-40 -mt-40 transition-transform duration-700 group-hover:scale-110"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                    <div className="bg-white/10 p-8 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl group-hover:scale-105 transition-transform">
                                        <svg className="w-14 h-14 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2A1 1 0 007 8z" />
                                        </svg>
                                    </div>
                                    <div className="text-center md:text-left flex-1">
                                        <h3 className="text-3xl font-black mb-3 uppercase tracking-tighter">
                                            {language === 'am' ? 'የድምጽ ማጠቃለያ' : 'Audio Briefcast'}
                                        </h3>
                                        <p className="text-primary-foreground/60 mb-8 font-medium text-lg leading-relaxed">
                                            {brief.stories.length} {language === 'am' ? 'ዋና ዋና ዜናዎች በደቂቃዎች ውስጥ ተጠቃለዋል' : 'curated signals compressed into a 3-minute brief'}
                                        </p>
                                        <button
                                            onClick={() => handlePlayAudio(brief.audio.url)}
                                            className="px-10 py-4 bg-accent text-white rounded-2xl font-black shadow-2xl shadow-accent/40 hover:bg-accent-dark transition-all transform hover:-translate-y-1 active:translate-y-0"
                                        >
                                            {language === 'am' ? 'አሁን አዳምጥ' : 'Initiate Briefing'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-8">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[.4em] flex items-center gap-4">
                                <span className="w-12 h-[2px] bg-accent/30"></span>
                                {language === 'am' ? 'ዋና ቁልፍ ዜናዎች' : 'Signal Summary'}
                            </h3>
                            <div className="grid gap-6">
                                {brief.stories.map((story) => (
                                    <SummaryCard
                                        key={story._id || story.id}
                                        story={story}
                                        onPlayAudio={handleStoryPlayAudio}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
