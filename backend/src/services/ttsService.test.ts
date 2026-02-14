import { generateAudioForStory } from './ttsService';
import fs from 'fs';
import path from 'path';

// Mock OpenAI with conditional logic for success/failure
jest.mock('openai', () => {
    return class MockOpenAI {
        audio = {
            speech: {
                create: jest.fn().mockImplementation(async (args) => {
                    if (args.input.includes('fail')) {
                        throw new Error('OpenAI specific error');
                    }
                    return {
                        arrayBuffer: async () => new ArrayBuffer(10)
                    };
                })
            }
        };
    };
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

    test('generateAudioForStory calls OpenAI and saves file', async () => {
        const result = await generateAudioForStory('story123', 'Test Text', 'en');

        // We verify success via side effects (file write) and return value
        expect(fs.writeFileSync).toHaveBeenCalled();
        expect(result).toContain('story_story123_en');
    });

    // Test error case
    test('generateAudioForStory throws error on failure', async () => {
        // Trigger the conditional failure in the mock
        await expect(generateAudioForStory('badid', 'fail this', 'en'))
            .rejects.toThrow('OpenAI specific error');
    });
});
