import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Play, CheckCircle, BookOpen, AlertOctagon, ArrowRight, Brain, Zap, Globe } from 'lucide-react';

const Hero = () => (
    <div className="relative pt-20 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">


            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-8 animate-fade-in-up animate-delay-100">
                Reimagining Learning with <br />
                <span className="bg-gradient-to-r from-google-blue via-google-red to-google-yellow bg-clip-text text-transparent">Smart Education</span>
            </h1>

            <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10 animate-fade-in-up animate-delay-200">
                Pakistan's first AI-powered education platform that transforms flawed curriculum into world-class learning experiences using Gemini's reasoning engine.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
                <Link
                    to="/syllabus"
                    className="w-full sm:w-auto px-8 py-4 bg-google-blue hover:bg-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                    <BookOpen className="w-5 h-5" />
                    Start Learning Free
                </Link>
                <Link
                    to="/errata"
                    className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                    <AlertOctagon className="w-5 h-5 text-google-red" />
                    View Errata
                </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400 animate-fade-in-up animate-delay-500">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-google-green" />
                    <span>Govt. Approved</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-google-green" />
                    <span>Bilingual Support</span>
                </div>
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-google-green" />
                    <span>Free Forever</span>
                </div>
            </div>
        </div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, description, link, colorClass }) => (
    <Link to={link} className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-google-blue/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
        <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
            {description}
        </p>
        <div className="flex items-center font-bold text-google-blue group-hover:gap-2 transition-all">
            <span>Explore Now</span>
            <ArrowRight className="w-4 h-4 ml-2" />
        </div>
    </Link>
);

const Stats = () => (
    <div className="py-20 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Designed for National Impact</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { label: 'Students', value: '50M+' },
                    { label: 'Languages', value: '2' },
                    { label: 'Cognitive Coverage', value: '100%' },
                    { label: 'Scalability', value: '999+' },
                ].map((stat, index) => (
                    <div key={index} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center hover:border-google-blue/50 transition-colors">
                        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                        <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const Home = () => {
    return (
        <div className="min-h-screen">
            <Hero />

            <section className="py-24 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">The Education Solutions</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Comprehensive tools designed to address the critical gaps in content delivery and curriculum quality.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <FeatureCard
                            title="Refined Syllabus"
                            description="Experience a completely reimagined curriculum with interactive Knowledge Graphs, bilingual support (English/Urdu), and cognitive mapping."
                            icon={Brain}
                            link="/syllabus"
                            colorClass="bg-google-blue"
                        />
                        <FeatureCard
                            title="Errata Database"
                            description="A transparent, real-time audit system tracking corrections, factual errors, and quality improvements across all textbooks."
                            icon={AlertOctagon}
                            link="/errata"
                            colorClass="bg-google-red"
                        />
                    </div>
                </div>
            </section>

            <Stats />
        </div>
    );
};

export default Home;
