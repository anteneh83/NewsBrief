import { Story } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface SummaryCardProps {
    story: Story;
    onPlayAudio?: (storyId: string | number) => void;
}

export default function SummaryCard({ story, onPlayAudio }: SummaryCardProps) {
    const timeAgo = formatDistanceToNow(new Date(story.published_at), { addSuffix: true });
    // Consistently use _id (MongoDB)
    const storyId = story._id || (story.id as string);

    return (
        <div className="summary-card">
            <div className="flex justify-between items-start mb-2">
                <Link href={`/story/${storyId}`} className="flex-1">
                    <h3 className="text-lg font-semibold text-primary hover:text-accent transition-colors line-clamp-2">
                        {story.title}
                    </h3>
                </Link>
            </div>

            <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                    {story.source}
                </span>
                <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>

            <ul className="space-y-1 mb-3">
                {story.summary_bullets.slice(0, 3).map((bullet, index) => (
                    <li key={index} className="text-sm text-gray-700 line-clamp-1">
                        • {bullet}
                    </li>
                ))}
            </ul>

            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                    {story.topic_tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                        </span>
                    ))}
                </div>

                {onPlayAudio && storyId && (
                    <button
                        onClick={() => onPlayAudio(storyId)}
                        className="flex items-center gap-1 text-accent hover:text-accent-light transition-colors"
                        aria-label="Play audio"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                        <span className="text-sm font-medium">Play</span>
                    </button>
                )}
            </div>
        </div>
    );
}
