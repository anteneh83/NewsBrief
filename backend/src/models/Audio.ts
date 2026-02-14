import mongoose, { Schema, Document } from 'mongoose';

export interface IAudio extends Document {
    story_id?: mongoose.Types.ObjectId;
    slot?: 'am' | 'pm';
    lang: 'en' | 'am';
    file_path: string;
    duration_sec: number;
    created_at: Date;
}

const AudioSchema: Schema = new Schema({
    story_id: { type: Schema.Types.ObjectId, ref: 'Story' },
    slot: { type: String, enum: ['am', 'pm'] },
    lang: { type: String, enum: ['en', 'am'], required: true },
    file_path: { type: String, required: true },
    duration_sec: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});

// Indexes
AudioSchema.index({ story_id: 1 });
AudioSchema.index({ slot: 1, lang: 1 });
AudioSchema.index({ created_at: -1 });

export const Audio = mongoose.model<IAudio>('Audio', AudioSchema);
