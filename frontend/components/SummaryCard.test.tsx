import { render, screen, fireEvent } from '@testing-library/react';
import SummaryCard from './SummaryCard';
import { Story } from '@/types';

const mockStory: Story = {
    _id: '123',
    title: 'Test Story Title',
    source: 'Test Source',
    url: 'http://test.com',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    topic_tags: ['test', 'news'],
    summary_bullets: ['Point 1', 'Point 2'],
    summary_lang: 'en'
};

describe('SummaryCard', () => {
    it('renders story details correctly', () => {
        render(<SummaryCard story={mockStory} />);
        expect(screen.getByText('Test Story Title')).toBeInTheDocument();
        expect(screen.getByText('Test Source')).toBeInTheDocument();
        expect(screen.getByText('• Point 1')).toBeInTheDocument();
        expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('calls onPlayAudio when play button is clicked', () => {
        const onPlayAudio = jest.fn();
        render(<SummaryCard story={mockStory} onPlayAudio={onPlayAudio} />);

        const playButton = screen.getByLabelText(/play audio/i);
        fireEvent.click(playButton);

        expect(onPlayAudio).toHaveBeenCalledWith('123');
    });

    it('links to the correct story detail page', () => {
        render(<SummaryCard story={mockStory} />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/story/123');
    });
});
