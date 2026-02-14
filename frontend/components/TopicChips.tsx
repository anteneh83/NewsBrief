import { useLanguage } from '@/context/LanguageContext';

interface TopicChipsProps {
    selectedTopic: string;
    onSelectTopic: (topic: string) => void;
}

const TOPICS = [
    { id: 'all', en: 'All', am: 'ሁሉም' },
    { id: 'economy', en: 'Economy', am: 'ምጣኔ ሀብት' },
    { id: 'agriculture', en: 'Agriculture', am: 'ግብርና' },
    { id: 'health', en: 'Health', am: 'ጤና' },
    { id: 'politics', en: 'Politics', am: 'ፖለቲካ' },
    { id: 'education', en: 'Education', am: 'ትምህርት' },
    { id: 'sports', en: 'Sports', am: 'ስፖርት' },
];

export default function TopicChips({ selectedTopic, onSelectTopic }: TopicChipsProps) {
    const { language } = useLanguage();

    return (
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {TOPICS.map((topic) => (
                <button
                    key={topic.id}
                    onClick={() => onSelectTopic(topic.id)}
                    className={`topic-chip whitespace-nowrap ${selectedTopic === topic.id
                        ? 'bg-accent text-white'
                        : ''
                        }`}
                >
                    {language === 'am' ? topic.am : topic.en}
                </button>
            ))}
        </div>
    );
}
