import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import apiRoutes from './api';
import { Story } from '../models/Story';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Story.deleteMany({});
});

describe('API Routes', () => {
    describe('GET /api/feed', () => {
        it('should return empty list when no stories exist', async () => {
            const res = await request(app).get('/api/feed');
            expect(res.status).toBe(200);
            expect(res.body.stories).toEqual([]);
        });

        it('should return stories when they exist', async () => {
            await Story.create({
                title: 'Test Story',
                source: 'Test Source',
                url: 'http://test.com',
                published_at: new Date(),
                topic_tags: ['test'],
                summary_bullets: ['bullet 1'],
                summary_lang: 'en',
                content_hash: 'hash1'
            });

            const res = await request(app).get('/api/feed');
            expect(res.status).toBe(200);
            expect(res.body.stories).toHaveLength(1);
            expect(res.body.stories[0].title).toBe('Test Story');
        });

        it('should filter by language', async () => {
            await Story.create({
                title: 'English Story',
                source: 'Source',
                url: 'http://en.com',
                published_at: new Date(),
                summary_bullets: ['en'],
                summary_lang: 'en',
                content_hash: 'hash2'
            });
            await Story.create({
                title: 'Amharic Story',
                source: 'Source',
                url: 'http://am.com',
                published_at: new Date(),
                summary_bullets: ['am'],
                summary_lang: 'am',
                content_hash: 'hash3'
            });

            const resEn = await request(app).get('/api/feed?lang=en');
            expect(resEn.body.stories).toHaveLength(1);
            expect(resEn.body.stories[0].title).toBe('English Story');

            const resAm = await request(app).get('/api/feed?lang=am');
            expect(resAm.body.stories).toHaveLength(1);
            expect(resAm.body.stories[0].title).toBe('Amharic Story');
        });
    });

    describe('GET /api/search', () => {
        it('should return stories matching query', async () => {
            await Story.create({
                title: 'Unique Query Story',
                source: 'Source',
                url: 'http://unique.com',
                published_at: new Date(),
                summary_bullets: ['bullet'],
                summary_lang: 'en',
                content_hash: 'hash_search'
            });

            const res = await request(app).get('/api/search?q=Unique');
            expect(res.status).toBe(200);
            expect(res.body.stories).toHaveLength(1);
            expect(res.body.stories[0].title).toBe('Unique Query Story');
        });

        it('should return 400 if query is missing', async () => {
            const res = await request(app).get('/api/search');
            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/story/:id', () => {
        it('should return story detail', async () => {
            const story = await Story.create({
                title: 'Detail Story',
                source: 'Source',
                url: 'http://detail.com',
                published_at: new Date(),
                summary_bullets: ['bullet'],
                summary_lang: 'en',
                content_hash: 'hash_detail'
            });

            const res = await request(app).get(`/api/story/${story._id}`);
            expect(res.status).toBe(200);
            expect(res.body.story.title).toBe('Detail Story');
        });

        it('should return 404 for non-existent story', async () => {
            const res = await request(app).get('/api/story/507f1f77bcf86cd799439011');
            expect(res.status).toBe(404);
        });
    });
});
