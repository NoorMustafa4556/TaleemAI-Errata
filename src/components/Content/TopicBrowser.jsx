import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ChevronRight, FileText, Folder, ArrowLeft, BookOpen, Clock, Hash, ArrowRight } from 'lucide-react';

// Helper for Markdown rendering
const renderWithMarkdown = (text) => {
    if (!text) return null;
    // Split by **bold** and *italic*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index} className="italic">{part.slice(1, -1)}</em>;
        }
        return <span key={index}>{part}</span>;
    });
};

const TopicBrowser = () => {
    const { gradeId } = useParams();
    const location = useLocation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    // Initialize from state if passed (e.g., coming back from detail view), otherwise null
    const [selectedTopic, setSelectedTopic] = useState(location.state?.selectedTopic || null);

    useEffect(() => {
        fetch('/data/english_graph.json')
            .then(res => res.json())
            .then(jsonData => {
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load graph", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-google-blue"></div>
        </div>
    );

    if (!data) return (
        <div className="p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Failed to load content</h2>
            <p className="text-slate-500 dark:text-slate-400">Please check your internet connection or try again later.</p>
        </div>
    );

    // Filter concepts for the current grade
    const gradeConcepts = data.concepts.filter(c => c.grade_level === parseInt(gradeId));

    // Group by Topic
    const topics = {};
    gradeConcepts.forEach(concept => {
        if (!topics[concept.topic]) {
            topics[concept.topic] = [];
        }
        topics[concept.topic].push(concept);
    });

    // Render Subject Grid
    if (!selectedTopic) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-10 pb-12 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
                            <Link to="/" className="hover:text-google-blue transition-colors">Home</Link>
                            <ChevronRight size={14} />
                            <Link to="/syllabus" className="hover:text-google-blue transition-colors">Syllabus</Link>
                            <ChevronRight size={14} />
                            <span className="font-semibold text-slate-900 dark:text-slate-100">Grade {gradeId}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-2">
                            Select Subject
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Choose a subject to explore topics for Grade {gradeId}.
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {Object.keys(topics).map(topic => (
                        <button
                            key={topic}
                            onClick={() => setSelectedTopic(topic)}
                            className="text-left group bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-google-blue dark:hover:border-google-blue hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-google-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-7 h-7 text-google-blue" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-google-blue transition-colors">
                                {topic}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">
                                {topics[topic].length} Topics Available
                            </p>
                            <div className="mt-8 flex items-center font-bold text-google-blue opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>Explore Topics</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Render Concept Grid (Filtered by Topic)
    const topicConcepts = topics[selectedTopic] || [];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-10 pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
                        <Link to="/" className="hover:text-google-blue transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link to="/syllabus" className="hover:text-google-blue transition-colors">Syllabus</Link>
                        <ChevronRight size={14} />
                        <button onClick={() => setSelectedTopic(null)} className="hover:text-google-blue transition-colors">Grade {gradeId}</button>
                        <ChevronRight size={14} />
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedTopic}</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <button
                                onClick={() => setSelectedTopic(null)}
                                className="flex items-center gap-2 text-google-blue font-bold mb-4 hover:-translate-x-1 transition-transform"
                            >
                                <ArrowLeft size={20} />
                                Back to Subjects
                            </button>
                            <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-2">
                                {selectedTopic}
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400">
                                detailed concepts and learning modules.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Concept Grid */}
            <div className="max-w-6xl mx-auto px-4 mt-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
                    {topicConcepts.sort((a, b) => a.sequence_order - b.sequence_order).map((concept) => (
                        <Link
                            key={concept.concept_id}
                            to={`/content/${gradeId}/${selectedTopic}/${concept.concept_id}`}
                            className="block group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl hover:border-google-blue dark:hover:border-google-blue transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Hash className="w-16 h-16 text-google-blue" />
                            </div>

                            <div className="relative z-10">
                                <span className="inline-block px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">
                                    Topic {concept.sequence_order}
                                </span>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-google-blue transition-colors line-clamp-2">
                                    {renderWithMarkdown(concept.title)}
                                </h3>
                                <div className="mt-4 flex items-center text-sm font-bold text-google-blue opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                    Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopicBrowser;
