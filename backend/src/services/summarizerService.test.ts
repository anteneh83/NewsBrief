import { summarizeStory, summarizeUnsummarizedStories } from './summarizerService';
import { Story } from '../models/Story';

// Mock OpenAI
jest.mock('openai', () => {
    return class MockOpenAI {
        chat = {
            completions: {
                create: jest.fn().mockResolvedValue({
                    choices: [{
                        message: {
                            content: JSON.stringify({
                                title: 'Test Summary',
                                bullets: ['Bullet 1', 'Bullet 2'],
                                language: 'en'
                            })
                        }
                    }]
                })
            }
        };
    };
});

// Mock Story model
jest.mock('../models/Story', () => ({
    Story: {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(), // If used with `new Story()`
    }
}));

// We need to mock Mongoose document instances properly
// But since the service saves via instance method `story.save()`, we handle that via return value of find

describe('summarizerService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('summarizeStory returns valid summary', async () => {
        const result = await summarizeStory('Test Title', 'Test Content', 'en');
        expect(result).toEqual({
            title: 'Test Summary',
            bullets: ['Bullet 1', 'Bullet 2'],
            language: 'en'
        });
    });

    // More tests can be added for failure cases
});
