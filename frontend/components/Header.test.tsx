import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock usePathname
jest.mock('next/navigation', () => ({
    usePathname: () => '/',
}));

const renderWithContext = (component: React.ReactNode) => {
    return render(
        <LanguageProvider>
            {component}
        </LanguageProvider>
    );
};

describe('Header', () => {
    it('renders correctly', () => {
        renderWithContext(<Header />);
        expect(screen.getByText('NewsBrief')).toBeInTheDocument();
        expect(screen.getByText('EN')).toBeInTheDocument();
        // Since default is 'en', 'am' button exists
        expect(screen.getByText('አማ')).toBeInTheDocument();
    });

    it('changes language when button clicked', () => {
        renderWithContext(<Header />);

        // Click Amharic button
        fireEvent.click(screen.getByText('አማ'));

        // Since we can't easily check context state directly without a test harness that exposes it,
        // we can check if the UI updated (e.g. the subtitle text changes based on language).
        // Header component: {language === 'am' ? 'የዕለቱ ዜና' : 'Your Daily News'}

        expect(screen.getByText('የዕለቱ ዜና')).toBeInTheDocument();
    });
});
