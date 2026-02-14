'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    // Load from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('newsbrief_lang') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'am')) {
            setLanguage(savedLang);
        }
    }, []);

    // Save to localStorage on change
    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('newsbrief_lang', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
