'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Story, Language } from '@/types';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import TopicChips from '@/components/TopicChips';
import SummaryCard from '@/components/SummaryCard';

export default function HomePage() {
  const { language } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SOURCES = [
    'all', 'Fana', 'EBC', 'EBS', 'ESAT', 'Addis Standard', 'Ethiopian Herald'
  ];

  useEffect(() => {
    fetchStories();
  }, [language, selectedTopic, selectedSource]);

  const fetchStories = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = { lang: language, limit: 20 };
      if (selectedTopic !== 'all') {
        params.topic = selectedTopic;
      }
      if (selectedSource !== 'all') {
        params.source = selectedSource;
      }

      const data = await api.getFeed(params);
      setStories(data.stories || []);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError(language === 'am' ? 'ዜናዎችን መጫን አልተቻለም' : 'Failed to load stories');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-1">
                {language === 'am' ? 'የቅርብ ጊዜ ዜናዎች' : 'Latest News'}
              </h2>
              <p className="text-gray-500 text-sm">
                {language === 'am' ? 'ከታመኑ ምንጮች የተገኘ ትክክለኛ መረጃ' : 'Verified updates from trusted media outlets'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1 flex items-center gap-2">
                <span className="w-1 h-1 bg-accent rounded-full"></span>
                {language === 'am' ? 'ርዕሰ ጉዳይ' : 'Topics'}
              </p>
              <TopicChips selectedTopic={selectedTopic} onSelectTopic={setSelectedTopic} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 ml-1 flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full"></span>
                {language === 'am' ? 'ምንጮች' : 'Sources'}
              </p>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map(source => (
                  <button
                    key={source}
                    onClick={() => setSelectedSource(source)}
                    className={`px-3 py-1.5 text-[11px] font-medium rounded-full border transition-all ${selectedSource === source
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-gray-50 text-gray-600 border-transparent hover:border-primary/30 hover:bg-white hover:text-primary shadow-sm active:scale-95'
                      }`}
                  >
                    {source === 'all' ? (language === 'am' ? 'ሁሉም' : 'All') : source}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-accent border-t-transparent"></div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-red-700 text-center">
            <p className="mb-4 font-medium">{error}</p>
            <button
              onClick={fetchStories}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-sm"
            >
              {language === 'am' ? 'እንደገና ሞክር' : 'Try again'}
            </button>
          </div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-20 text-center border border-dashed border-gray-200">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 font-medium italic">
              {language === 'am' ? 'ምንም ዜና አልተገኘም' : 'No stories found matching your criteria'}
            </p>
          </div>
        )}

        {!loading && !error && stories.length > 0 && (
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
