import { generateAudioForStory } from './ttsService';
import fs from 'fs';

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

// Mock Audio model
jest.mock('../models/Audio', () => {
    return {
        Audio: class {
            save = jest.fn().mockResolvedValue(true);
            constructor() { }
        }
    };
});

describe('ttsService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (fs.existsSync as jest.Mock).mockReturnValue(true);
    });

    test('generateAudioForStory calls gTTS and saves file', async () => {
        const result = await generateAudioForStory('story123', 'Test Text', 'en');

        // We verify success via return value and prefix
        expect(result).toContain('story_story123_en');
    });

    // Test error case
    test('generateAudioForStory throws error on failure', async () => {
        // Trigger the conditional failure in the mock by using an ID that will be in the path
        await expect(generateAudioForStory('failid', 'some text', 'en'))
            .rejects.toThrow('gTTS specific error');
    });
});
