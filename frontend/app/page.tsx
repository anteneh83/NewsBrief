'use client';

import { useState, useEffect } from 'react';
import { Story, Language } from '@/types';
import { api } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import TopicChips from '@/components/TopicChips';
import SummaryCard from '@/components/SummaryCard';

export default function HomePage() {
  const { language } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, [language, selectedTopic]);

  const fetchStories = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = { lang: language, limit: 20 };
      if (selectedTopic !== 'all') {
        params.topic = selectedTopic;
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

  const handlePlayAudio = async (storyId: string | number) => {
    try {
      const data = await api.generateStoryAudio(storyId, language);
      if (data.audio?.url) {
        // In a real app, you'd open an audio player modal or navigate to story detail
        window.open(data.audio.url, '_blank');
      }
    } catch (err: any) {
      console.error('Error generating audio:', err);
      // Show error to user
      alert(err.message || 'Failed to generate audio');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-4">
            {language === 'am' ? 'የቅርብ ጊዜ ዜናዎች' : 'Latest News'}
          </h2>
          <TopicChips selectedTopic={selectedTopic} onSelectTopic={setSelectedTopic} />
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
              onClick={fetchStories}
              className="ml-4 underline hover:no-underline"
            >
              {language === 'am' ? 'እንደገና ሞክር' : 'Try again'}
            </button>
          </div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">
              {language === 'am' ? 'ምንም ዜና አልተገኘም' : 'No stories found'}
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
