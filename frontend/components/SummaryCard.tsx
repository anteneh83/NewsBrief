import { Story } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';
import { toggleWatchLater, isSaved } from '@/lib/watchLater';

interface SummaryCardProps {
    story: Story;
    onPlayAudio?: (storyId: string) => void;
}

export default function SummaryCard({ story, onPlayAudio }: SummaryCardProps) {
    const { language } = useLanguage();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (story._id) {
            setSaved(isSaved(story._id));
        }
    }, [story._id]);

    const getSafeTimeAgo = () => {
        try {
            const date = new Date(story.publishedAt);
            if (isNaN(date.getTime())) return '';
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (err) {
            return '';
        }
    };

    const timeAgo = getSafeTimeAgo();
    const storyId = story._id || (story.id as string);
    const summary = language === 'am' ? story.summary.am : story.summary.en;

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchLater(story);
        setSaved(!saved);
    };

    return (
        <div className="summary-card group">
            <div className="flex justify-between items-start mb-2">
                <Link href={`/story/${storyId}`} className="flex-1">
                    <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                        {story.title}
                    </h3>
                </Link>
                <button
                    onClick={handleSave}
                    className={`ml-2 p-2 rounded-full transition-all duration-300 transform active:scale-90 ${saved ? 'text-accent bg-accent/15 shadow-inner' : 'text-gray-400 hover:text-accent hover:bg-accent/5'}`}
                    title={saved ? "Remove from Watch Later" : "Save for later"}
                >
                    <svg className="w-6 h-6 transition-transform duration-300"
                        fill={saved ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{ transform: saved ? 'scale(1.1)' : 'scale(1)' }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5">
                    {story.source.logo && (
                        <img src={story.source.logo} alt={story.source.name} className="w-4 h-4 rounded-sm" />
                    )}
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-[11px] rounded-full font-bold uppercase tracking-wider">
                        {story.source.name}
                    </span>
                </div>
                <span className="text-xs text-gray-500">{timeAgo}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${story.source.category === 'state' ? 'border-blue-100 text-blue-600' :
                    story.source.category === 'private' ? 'border-green-100 text-green-600' :
                        'border-purple-100 text-purple-600'
                    } uppercase font-semibold`}>
                    {story.source.category}
                </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {summary || (language === 'am' ? 'ማጠቃለያ የለም' : 'No summary available')}
            </p>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {onPlayAudio && storyId && (
                        <button
                            onClick={() => onPlayAudio(storyId)}
                            className="flex items-center gap-1.5 text-accent hover:text-accent-light transition-colors"
                            aria-label="Play audio"
                        >
                            <div className="bg-accent/10 p-1.5 rounded-full">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                            </div>
                            <span className="text-sm font-semibold">{language === 'am' ? 'አዳምጥ' : 'Listen'}</span>
                        </button>
                    )}
                </div>

                <Link href={`/story/${storyId}`} className="text-xs font-medium text-gray-400 hover:text-primary transition-colors">
                    {language === 'am' ? 'ሙሉውን አንብብ →' : 'Read Full Story →'}
                </Link>
            </div>
        </div>
    );
}
