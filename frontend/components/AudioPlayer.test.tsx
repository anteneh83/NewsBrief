import { render, screen, fireEvent } from '@testing-library/react';
import AudioPlayer from './AudioPlayer';

describe('AudioPlayer', () => {
    it('renders correctly with title', () => {
        render(<AudioPlayer audioUrl="http://test.com/audio.mp3" title="Test Audio" />);
        expect(screen.getByText('Test Audio')).toBeInTheDocument();
    });

    it('has play button', () => {
        render(<AudioPlayer audioUrl="http://test.com/audio.mp3" title="Test Audio" />);
        // The play button has an aria-label 'Play' or 'Pause'
        const playButton = screen.getByLabelText(/play/i);
        expect(playButton).toBeInTheDocument();

        const speedButton = screen.getByText(/1x/i);
        expect(speedButton).toBeInTheDocument();
    });
});
