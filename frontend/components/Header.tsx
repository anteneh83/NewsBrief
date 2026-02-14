'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Language } from '@/types';

import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
    const { language, setLanguage } = useLanguage();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-primary text-white sticky top-0 z-50 shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">NewsBrief</h1>
                            <p className="text-xs text-gray-300">{language === 'am' ? 'የዕለቱ ዜና' : 'Your Daily News'}</p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${language === 'en' ? 'bg-accent text-white' : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => setLanguage('am')}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${language === 'am' ? 'bg-accent text-white' : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            አማ
                        </button>
                    </div>
                </div>

                <nav className="flex gap-4 border-t border-white/10 pt-3">
                    <Link
                        href="/"
                        className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-accent' : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        {language === 'am' ? 'ዋና' : 'Feed'}
                    </Link>
                    <Link
                        href="/daily-brief"
                        className={`text-sm font-medium transition-colors ${isActive('/daily-brief') ? 'text-accent' : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        {language === 'am' ? 'የዕለቱ ማጠቃለያ' : 'Daily Brief'}
                    </Link>
                    <Link
                        href="/search"
                        className={`text-sm font-medium transition-colors ${isActive('/search') ? 'text-accent' : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        {language === 'am' ? 'ፈልግ' : 'Search'}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
