'use client';

import { useState, useEffect } from 'react';
import { DailyBrief, Language, TimeSlot } from '@/types';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import AudioPlayer from '@/components/AudioPlayer';
import SummaryCard from '@/components/SummaryCard';

export default function DailyBriefPage() {
    const { language } = useLanguage();
    const [slot, setSlot] = useState<TimeSlot>('am');
    const [brief, setBrief] = useState<DailyBrief | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDailyBrief();
    }, [language, slot]);

    const fetchDailyBrief = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await api.getDailyBrief({ slot, lang: language });
            setBrief(data);
        } catch (err) {
            console.error('Error fetching daily brief:', err);
            setError(language === 'am' ? 'የእለቱ ማጠቃለያ መጫን አልተቻለም' : 'Failed to load daily brief');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-6 max-w-4xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-primary mb-4">
                        {language === 'am' ? 'የአመቱ ማጠቃለያ' : 'Daily Brief'}
                    </h2>

                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setSlot('am')}
                            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${slot === 'am'
                                ? 'bg-accent text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {language === 'am' ? '🌅 ጠዋት' : '🌅 Morning'}
                        </button>
                        <button
                            onClick={() => setSlot('pm')}
                            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${slot === 'pm'
                                ? 'bg-accent text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {language === 'am' ? '🌙 ማታ' : '🌙 Evening'}
                        </button>
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
                            onClick={fetchDailyBrief}
                            className="ml-4 underline hover:no-underline"
                        >
                            {language === 'am' ? 'እንደገና ሞክር' : 'Try again'}
                        </button>
                    </div>
                )}

                {!loading && !error && brief && brief.audio && (
                    <>
                        <div className="mb-8">
                            <AudioPlayer
                                audioUrl={brief.audio.url}
                                title={language === 'am'
                                    ? `የድምፅ የ${slot === 'am' ? 'ጠዋት' : 'ማታ'} ማጠቃለያ`
                                    : `${slot === 'am' ? 'Morning' : 'Evening'} Brief Audio`
                                }
                                autoplay={false}
                            />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-primary mb-4">
                                {language === 'am' ? 'በዚህ ማጠቃለያ ውስጥ የተካተቱ ዜናዎች' : 'Stories in This Brief'}
                            </h3>
                            <div className="space-y-4">
                                {brief.stories.length > 0 ? (
                                    brief.stories.map((story) => (
                                        <SummaryCard key={story._id || story.id} story={story} />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">
                                        {language === 'am' ? 'ለዚህ ጊዜ ዝርዝር ዜናዎች አልተገኙም' : 'No detailed stories found for this brief'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {!loading && !error && (!brief || !brief.audio) && (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500">
                            {language === 'am' ? 'ለዚህ ጊዜ ማጠቃለያ የለም' : 'No brief available for this time'}
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
