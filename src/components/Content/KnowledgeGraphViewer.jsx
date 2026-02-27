import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Globe, AlertTriangle } from 'lucide-react';
import ErrorPanel from './ErrorPanel';

// Helper to render bold text from markdown-style strings (e.g., "**Text**")
const renderWithMarkdown = (text) => {
    if (!text) return null;

    // Split by **bold** and *italic*
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={index} className="italic text-slate-800 dark:text-slate-200">{part.slice(1, -1)}</em>;
        }
        return <span key={index}>{part}</span>;
    });
};

const ContentView = ({ concept, language }) => {
    if (!concept) return <div className="p-4 text-center text-gray-400">Content not available in {language}</div>;

    const isUrdu = language === 'urdu';
    const dir = isUrdu ? 'rtl' : 'ltr';
    const fontClass = isUrdu ? 'font-urdu text-right' : 'font-sans text-left';

    const labels = isUrdu ? {
        intro: 'تعارف',
        def: 'تعریف',
        key: 'اہم نکات',
        ex: 'مثالیں',
        sol: 'حل',
        exp: 'توضیح'
    } : {
        intro: 'Introduction',
        def: 'Definition',
        key: 'Key Points',
        ex: 'Examples',
        sol: 'Solution',
        exp: 'Expected'
    };

    return (
        <div className={`p-8 ${fontClass}`} dir={dir}>
            <h1 className="text-3xl font-bold mb-6 text-emerald-900 dark:text-emerald-400 border-b border-gray-200 dark:border-slate-700 pb-4 leading-normal transition-colors">{concept.title}</h1>

            {/* Introduction */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-500 mb-3 uppercase tracking-wide text-xs">{labels.intro}</h2>
                <p className="text-lg leading-relaxed text-gray-700 dark:text-slate-300">
                    {renderWithMarkdown(concept.content.introduction)}
                </p>
            </div>

            {/* Definition */}
            <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3 uppercase tracking-wide text-xs">{labels.def}</h2>
                <p className="text-xl font-medium text-blue-900 dark:text-blue-100 leading-relaxed">
                    {renderWithMarkdown(concept.content.definition)}
                </p>
            </div>

            {/* Key Points */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-500 mb-4 uppercase tracking-wide text-xs">{labels.key}</h2>
                <ul className="space-y-3">
                    {concept.content.key_points.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                            <span className="inline-block w-2 h-2 mt-2 bg-emerald-500 rounded-full flex-shrink-0 mx-2"></span>
                            <span className="text-gray-800 dark:text-slate-200">
                                {renderWithMarkdown(point)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Examples */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-500 mb-4 uppercase tracking-wide text-xs">{labels.ex}</h2>
                <div className="grid gap-6">
                    {concept.content.examples.map((ex, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700 rounded-lg p-5 transition-colors">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2 leading-relaxed">{ex.title}</h3>
                            <div className={`bg-gray-50 dark:bg-slate-900/50 p-3 rounded text-sm text-gray-600 dark:text-slate-400 mb-3 ${!isUrdu ? 'font-mono' : ''}`} dir="ltr">
                                {renderWithMarkdown(ex.problem)}
                            </div>
                            <p className="text-gray-700 dark:text-slate-300 font-medium mb-1">{labels.sol}:</p>
                            <p className="text-gray-600 dark:text-slate-300 mb-2 leading-relaxed">
                                {renderWithMarkdown(ex.solution)}
                            </p>
                            {ex.explanation && (
                                <p className="text-sm text-gray-500 dark:text-slate-500 italic">
                                    {labels.exp}: {renderWithMarkdown(ex.explanation)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const KnowledgeGraphViewer = () => {
    const { gradeId, topicId, conceptId } = useParams();
    const navigate = useNavigate();
    const [englishData, setEnglishData] = useState(null);
    const [urduData, setUrduData] = useState(null);
    const [viewMode, setViewMode] = useState('both'); // 'english', 'urdu', 'both'
    const [showErrors, setShowErrors] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [engRes, urduRes] = await Promise.all([
                    fetch('/data/english_graph.json'),
                    fetch('/data/urdu_graph.json')
                ]);
                setEnglishData(await engRes.json());
                setUrduData(await urduRes.json());
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mr-3"></div>
            Loading Content...
        </div>
    );

    // Find the concept in both datasets
    const engConcept = englishData?.concepts.find(c => c.concept_id === conceptId);
    const urduConcept = urduData?.concepts.find(c => c.concept_id === conceptId);

    // If not found in one of them, fallback or show specific error
    if (!engConcept && !urduConcept) return <div className="p-10 text-center text-red-500 bg-white dark:bg-slate-950">Concept not found.</div>;

    const conceptImages = engConcept?.images || urduConcept?.images || [];

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Top Bar */}
            <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between shadow-sm z-10 transition-colors">
                <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                    <button
                        onClick={() => navigate(`/grade/${gradeId}`, { state: { selectedTopic: topicId } })}
                        className="hover:text-emerald-700 dark:hover:text-emerald-400 flex items-center transition-colors bg-transparent border-none p-0 cursor-pointer"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back to Topics
                    </button>
                    <span className="mx-3 text-gray-300 dark:text-slate-600">|</span>
                    <span className="font-semibold text-gray-800 dark:text-slate-200">{topicId}</span>
                </div>

                <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('english')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'english' ? 'bg-white dark:bg-slate-600 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setViewMode('both')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'both' ? 'bg-white dark:bg-slate-600 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}
                    >
                        Both
                    </button>
                    <button
                        onClick={() => setViewMode('urdu')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'urdu' ? 'bg-white dark:bg-slate-600 text-emerald-700 dark:text-emerald-300 shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}
                    >
                        Urdu
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex overflow-hidden relative">

                {/* English Panel */}
                {(viewMode === 'english' || viewMode === 'both') && (
                    <div className={`overflow-y-auto bg-white dark:bg-slate-900 transition-colors ${viewMode === 'both' ? 'w-1/2 border-r border-gray-200 dark:border-slate-800' : 'w-full'}`}>
                        <ContentView concept={engConcept} language="english" />
                    </div>
                )}

                {/* Urdu Panel */}
                {(viewMode === 'urdu' || viewMode === 'both') && (
                    <div className={`overflow-y-auto bg-yellow-50/30 dark:bg-slate-950/50 transition-colors ${viewMode === 'both' ? 'w-1/2' : 'w-full'}`}>
                        <ContentView concept={urduConcept} language="urdu" />
                    </div>
                )}

            </div>

            {/* Footer / Status Bar - Kept original dark, just ensure no conflicts */}
            <div className="bg-gray-800 dark:bg-black text-white px-6 py-3 flex justify-between items-center z-10">
                <div className="text-sm text-gray-400">
                    {conceptId} • {conceptImages.length > 0 ? `${conceptImages.length} Attached Assets` : 'No Assets'}
                </div>
                <button
                    onClick={() => setShowErrors(!showErrors)}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors shadow-lg"
                >
                    <AlertTriangle size={16} className="mr-2" />
                    Show Identified Errors
                </button>
            </div>

            {/* Slide-over Error Panel */}
            {showErrors && (
                <ErrorPanel
                    imageIds={conceptImages}
                    grade={gradeId}
                    topic={topicId}
                    onClose={() => setShowErrors(false)}
                />
            )}

        </div>
    );
};

export default KnowledgeGraphViewer;
