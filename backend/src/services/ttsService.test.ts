import { generateAudioForStory } from './ttsService';
import fs from 'fs';
import { Story } from '../models/Story';

// Mock gtts
jest.mock('gtts', () => {
    return jest.fn().mockImplementation(() => {
        return {
            save: jest.fn().mockImplementation((filePath: string, cb: Function) => {
                if (filePath.includes('fail')) {
                    cb(new Error('gTTS specific error'));
                } else {
                    cb(null);
                }
            })
        };
    });
});

// Mock fs
jest.mock('fs', () => ({
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn(),
}));

// Mock Models
jest.mock('../models/Audio', () => {
    return {
        Audio: class {
            _id = 'audio507f1f77bcf86cd799439011';
            save = jest.fn().mockResolvedValue(true);
            constructor() { }
        }
    };
});

jest.mock('../models/Story', () => ({
    Story: {
        findByIdAndUpdate: jest.fn().mockResolvedValue({}),
    }
}));

describe('ttsService', () => {
    const validId = '507f1f77bcf86cd799439011';
    const failId = '507f1f77bcf86cd799439022'; // Use this as "fail" trigger

    beforeEach(() => {
        jest.clearAllMocks();
        (fs.existsSync as jest.Mock).mockReturnValue(true);
    });

    test('generateAudioForStory calls gTTS and saves file', async () => {
        const result = await generateAudioForStory(validId, 'Test Text', 'en');

        // We verify success via return value and prefix
        expect(result).toContain(`story_${validId}_en`);
        expect(Story.findByIdAndUpdate).toHaveBeenCalled();
    });

    test('generateAudioForStory throws error on failure', async () => {
        // Redefine mock for this test to fail
        const gTTS = require('gtts');
        gTTS.mockImplementationOnce(() => ({
            save: (_: string, cb: Function) => cb(new Error('gTTS specific error'))
        }));

        await expect(generateAudioForStory(failId, 'some text', 'en'))
            .rejects.toThrow('gTTS specific error');
    });
});
