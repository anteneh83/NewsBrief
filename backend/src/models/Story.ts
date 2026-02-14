import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
    title: string;
    source: string;
    url: string;
    published_at: Date;
    topic_tags: string[];
    summary_bullets: string[];
    summary_lang: 'en' | 'am';
    content_hash: string;
    created_at: Date;
}

const StorySchema: Schema = new Schema({
    title: { type: String, required: true },
    source: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    published_at: { type: Date, required: true },
    topic_tags: [{ type: String }],
    summary_bullets: [{ type: String }],
    summary_lang: { type: String, enum: ['en', 'am'], default: 'en' },
    content_hash: { type: String, required: true, unique: true },
    created_at: { type: Date, default: Date.now }
});

// Indexes for performance
StorySchema.index({ published_at: -1 });
StorySchema.index({ topic_tags: 1 });
StorySchema.index({ summary_lang: 1 });

export const Story = mongoose.model<IStory>('Story', StorySchema);
