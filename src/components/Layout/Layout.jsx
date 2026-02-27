import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Brain } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Dark Mode Logic
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    // Font Size Logic
    const [fontSize, setFontSize] = useState(() => {
        if (typeof window !== 'undefined') {
            return parseInt(localStorage.getItem('fontSize')) || 110;
        }
        return 110;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.style.fontSize = `${fontSize}%`;
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    const adjustFont = (change) => {
        setFontSize((prev) => {
            const newSize = prev + change;
            if (newSize < 80 || newSize > 150) return prev;
            return newSize;
        });
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Refined Syllabus', path: '/syllabus' },
        { name: 'Errata Database', path: '/errata' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
                <div className="flex items-center justify-between h-[80px]">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <div className="p-[8px] bg-gradient-to-br from-google-blue to-google-purple rounded-lg shadow-lg">
                            <Brain className="h-[24px] w-[24px] text-white" />
                        </div>
                        <div className="flex flex-col">
                            <Link to="/" className="text-[20px] font-display font-bold text-slate-900 dark:text-white leading-none">
                                Smart Education
                            </Link>
                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
                                Powered by Ministry of Education
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-[32px]">
                        <div className="flex items-baseline space-x-[4px]">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-[16px] py-[8px] rounded-full text-[14px] font-medium transition-all duration-200 ${isActive(link.path)
                                        ? 'text-white bg-slate-900 dark:bg-white dark:text-slate-900 shadow-md'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-google-blue dark:hover:text-google-blue hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-[16px] pl-[16px] border-l border-slate-200 dark:border-slate-700">
                            {/* Font Size Controls */}
                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-[4px] border border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => adjustFont(-10)}
                                    className="p-[6px] rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 transition-colors"
                                    disabled={fontSize <= 80}
                                    title="Decrease Font Size"
                                >
                                    <span className="text-[12px] font-bold px-[4px]">A-</span>
                                </button>
                                <span className="text-[12px] font-mono w-[32px] text-center text-slate-400 dark:text-slate-500">{fontSize}%</span>
                                <button
                                    onClick={() => adjustFont(10)}
                                    className="p-[6px] rounded-full hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 transition-colors"
                                    disabled={fontSize >= 150}
                                    title="Increase Font Size"
                                >
                                    <span className="text-[14px] font-bold px-[4px]">A+</span>
                                </button>
                            </div>

                            <button
                                onClick={toggleTheme}
                                className="p-[8px] rounded-full text-slate-500 hover:text-google-yellow hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                aria-label="Toggle Dark Mode"
                            >
                                {isDark ? <Sun className="h-[20px] w-[20px]" /> : <Moon className="h-[20px] w-[20px]" />}
                            </button>
                            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-google-blue dark:hover:bg-google-blue dark:hover:text-white px-[20px] py-[10px] rounded-full text-[14px] font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                                Start Learning
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-[16px]">
                        <button
                            onClick={toggleTheme}
                            className="p-[8px] rounded-full text-slate-500 dark:text-slate-400"
                        >
                            {isDark ? <Sun className="h-[20px] w-[20px]" /> : <Moon className="h-[20px] w-[20px]" />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-[8px] rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
                        >
                            {isOpen ? <X className="h-[24px] w-[24px]" /> : <Menu className="h-[24px] w-[24px]" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl">
                    <div className="px-[16px] pt-2 pb-6 space-y-2">
                        {/* Mobile Font Controls */}
                        <div className="flex items-center justify-center gap-4 mb-4 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                            <button
                                onClick={() => adjustFont(-10)}
                                className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-sm font-bold"
                                disabled={fontSize <= 80}
                            >
                                A-
                            </button>
                            <span className="text-sm font-mono text-slate-500">{fontSize}%</span>
                            <button
                                onClick={() => adjustFont(10)}
                                className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 text-lg font-bold"
                                disabled={fontSize >= 150}
                            >
                                A+
                            </button>
                        </div>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-[16px] py-[12px] rounded-xl text-[16px] font-medium ${isActive(link.path)
                                    ? 'bg-slate-100 dark:bg-slate-800 text-google-blue'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button className="w-full mt-4 bg-google-blue text-white px-[20px] py-[12px] rounded-xl text-[14px] font-bold shadow-lg">
                            Start Learning
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-google-blue selection:text-white">
            <Navbar />
            <main className="flex-grow relative">
                {/* Decorative background blurs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
                </div>
                {children}
            </main>
            <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Brain className="h-6 w-6 text-google-blue" />
                                <span className="text-xl font-display font-bold text-slate-900 dark:text-white">Smart Education</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                                Pakistan's first AI-powered education platform that transforms flawed curriculum into world-class learning experiences using Gemini's reasoning engine.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Platform</h4>
                            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <li>The Crisis</li>
                                <li>Gemini Solution</li>
                                <li>Features</li>
                                <li>Impact</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                                <li>Privacy Policy</li>
                                <li>Terms of Service</li>
                                <li>Cookie Policy</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center">
                        <p className="text-slate-400 text-sm">© 2026 Ministry of Education. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
