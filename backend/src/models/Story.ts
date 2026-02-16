import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
    title: string;
    summary: {
        am: string;
        en: string;
    };
    content: string;
    topic: string;
    source: {
        name: string;
        url: string;
        logo?: string;
        category: 'state' | 'private' | 'diaspora';
    };
    originalUrl: string;
    publishedAt: Date;
    audioUrl?: string;
    content_hash: string;
    createdAt: Date;
    updatedAt: Date;
}

const StorySchema: Schema = new Schema({
    title: { type: String, required: true },
    summary: {
        am: { type: String, default: '' },
        en: { type: String, default: '' }
    },
    content: { type: String },
    topic: { type: String },
    source: {
        name: { type: String, required: true },
        url: { type: String, required: true },
        logo: { type: String },
        category: { type: String, enum: ['state', 'private', 'diaspora'], required: true }
    },
    originalUrl: { type: String, required: true, unique: true },
    publishedAt: { type: Date, required: true },
    audioUrl: { type: String },
    content_hash: { type: String, required: true, unique: true },
}, {
    timestamps: true
});

// Indexes for performance
StorySchema.index({ publishedAt: -1 });
StorySchema.index({ topic: 1 });
StorySchema.index({ 'source.name': 1 });

export const Story = mongoose.model<IStory>('Story', StorySchema);
