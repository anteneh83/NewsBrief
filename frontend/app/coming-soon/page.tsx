'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';

export default function ComingSoonPage() {
    const { language } = useLanguage();

    return (
        <div className="min-h-screen bg-background text-gray-900">
            <Header />

            <main className="container mx-auto px-4 py-20 max-w-4xl text-center">
                <div className="relative mb-12">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 bg-accent/10 rounded-full animate-ping duration-[3000ms]"></div>
                    </div>
                    <div className="relative z-10 bg-white w-24 h-24 rounded-3xl shadow-2xl flex items-center justify-center mx-auto border border-gray-100 transform rotate-12 group-hover:rotate-0 transition-transform">
                        <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-5xl font-black text-primary mb-6 tracking-tight">
                    {language === 'am' ? 'በቅርቡ ይጠብቁ' : 'Coming Soon'}
                </h1>

                <div className="max-w-xl mx-auto mb-12">
                    <p className="text-xl text-gray-500 leading-relaxed">
                        {language === 'am'
                            ? 'ይህ ልዩ ባህሪ (እንደ "የመጀመሪያ ዝግጅት") በአሁኑ ጊዜ በልማት ላይ ነው። መረጃን ለመጭመቅ እና ለእርስዎ ምቹ በሆነ መልኩ ለማቅረብ እየሰራን ነው።'
                            : 'This cutting-edge feature (like "Initial Briefing") is currently under heavy development. We are engineering new ways to compress and deliver signal-rich intelligence just for you.'}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-2xl hover:bg-primary-dark transition-all transform hover:-translate-y-1 active:translate-y-0"
                    >
                        {language === 'am' ? 'ወደ ዋና ገጽ ተመለስ' : 'Return to Home'}
                    </Link>
                    <button
                        className="px-10 py-4 border-2 border-primary/10 text-primary rounded-2xl font-black hover:bg-gray-50 transition-all"
                        onClick={() => alert(language === 'am' ? 'ለንቁ ተሳትፎዎ እናመሰግናለን!' : 'Thank you for your interest!')}
                    >
                        {language === 'am' ? 'አሳውቀኝ' : 'Notify Me'}
                    </button>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-50">
                    <div className="p-6">
                        <h3 className="font-black text-accent mb-2">01. AI Signal</h3>
                        <p className="text-sm font-medium">Deep analysis across thousands of sources.</p>
                    </div>
                    <div className="p-6">
                        <h3 className="font-black text-accent mb-2">02. Voice First</h3>
                        <p className="text-sm font-medium">Hyper-realistic audio briefing experience.</p>
                    </div>
                    <div className="p-6">
                        <h3 className="font-black text-accent mb-2">03. Fully Offline</h3>
                        <p className="text-sm font-medium">Intelligence secured on your local device.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
