import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Search, AlertCircle, UserCheck, Gavel, School, ChevronRight, BookOpen, Layers, Book, AlertTriangle, FileText, CheckCircle, Download } from 'lucide-react';
import errataData from '../../data/errata_data.json';

// --- Reusable Components ---

const SelectionCard = ({ title, description, icon: Icon, onClick, colorClass, ringColor, active }) => (
    <button
        onClick={onClick}
        className={`w-full text-left relative overflow-hidden group p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${active
            ? `bg-slate-900 dark:bg-white border-transparent ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 ${ringColor || 'ring-google-blue'}`
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-google-blue/50 dark:hover:border-google-blue/50'
            }`}
    >
        <div className={`mb-4 inline-flex p-3 rounded-xl ${colorClass} text-white shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>

        <h3 className={`text-xl font-bold mb-2 font-display ${active ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
            {title}
        </h3>
        {description && (
            <p className={`text-sm mb-4 leading-relaxed ${active ? 'text-slate-300 dark:text-slate-600' : 'text-slate-600 dark:text-slate-400'}`}>
                {description}
            </p>
        )}

        <div className={`flex items-center text-sm font-bold group-hover:gap-2 transition-all ${active ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
            <span>Select</span>
            <ArrowRight className="w-4 h-4 ml-1" />
        </div>
    </button>
);

const StatusBadge = ({ type, onClick }) => {
    const styles = {
        Factual: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/20',
        Pedagogical: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/20',
        Editorial: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-200 dark:hover:bg-blue-500/20',
    };

    return (
        <button
            onClick={onClick}
            className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${styles[type] || styles.Editorial}`}
        >
            {type}
        </button>
    );
};

// Helper to render bold text from markdown-style strings (e.g., "**Text**")
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

const ErrorCard = ({ item, stakeholder }) => {
    // Show sections if they exist. We simply check distinct lengths.
    const hasFactual = item.errors.factual && item.errors.factual.length > 0;
    const hasEditorial = item.errors.editorial && item.errors.editorial.length > 0;
    const hasPedagogical = item.errors.pedagogical && item.errors.pedagogical.length > 0;
    const hasAuditIssues = item.audit_issues && item.audit_issues.length > 0;

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Optional: Highlight effect
            element.classList.add('ring-2', 'ring-google-blue', 'ring-offset-2');
            setTimeout(() => {
                element.classList.remove('ring-2', 'ring-google-blue', 'ring-offset-2');
            }, 2000);
        }
    };

    // Define visibility: Show everything available.
    // The user explicitly requested "Aik Page pr Jitny Bhi Errors hain Wo Sab Aik Hi Card main Aain"
    // So we won't hide Pedagogical from Students or Editorial from Teachers anymore. 
    // We'll show all categories present in the data for maximum transparency as requested.

    return (
        <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 text-lg shadow-inner">
                        {item.page}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.subject}</h4>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <span>Class {item.class}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {item.image}</span>
                        </div>
                    </div>
                </div>

                {/* Optional Status Badges based on content */}
                <div className="flex gap-2">
                    {hasFactual && <StatusBadge type="Factual" onClick={() => scrollToSection(`factual-${item.id}`)} />}
                    {hasPedagogical && <StatusBadge type="Pedagogical" onClick={() => scrollToSection(`pedagogical-${item.id}`)} />}
                    {hasEditorial && <StatusBadge type="Editorial" onClick={() => scrollToSection(`editorial-${item.id}`)} />}
                </div>
            </div>

            <div className="space-y-6">
                {hasFactual && (
                    <div id={`factual-${item.id}`} className="bg-red-50 dark:bg-red-900/10 rounded-xl p-5 border border-red-100 dark:border-red-900/20 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <h5 className="font-bold text-red-700 dark:text-red-400">Factual Errors</h5>
                        </div>
                        <ul className="list-disc list-outside ml-5 space-y-2">
                            {item.errors.factual.map((err, idx) => (
                                <li key={idx} className="text-slate-700 dark:text-slate-300 text-base leading-relaxed font-urdu pl-1">
                                    {renderWithMarkdown(err)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {hasPedagogical && (
                    <div id={`pedagogical-${item.id}`} className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-5 border border-amber-100 dark:border-amber-900/20 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-3">
                            <School className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            <h5 className="font-bold text-amber-700 dark:text-amber-400">Pedagogical Issues</h5>
                        </div>
                        <ul className="list-disc list-outside ml-5 space-y-2">
                            {item.errors.pedagogical.map((err, idx) => (
                                <li key={idx} className="text-slate-700 dark:text-slate-300 text-base leading-relaxed font-urdu pl-1">
                                    {renderWithMarkdown(err)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {hasEditorial && (
                    <div id={`editorial-${item.id}`} className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/20 transition-all duration-300">
                        <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h5 className="font-bold text-blue-700 dark:text-blue-400">Editorial Corrections</h5>
                        </div>
                        <ul className="list-disc list-outside ml-5 space-y-2">
                            {item.errors.editorial.map((err, idx) => (
                                <li key={idx} className="text-slate-700 dark:text-slate-300 text-base leading-relaxed font-urdu pl-1">
                                    {renderWithMarkdown(err)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Show Audit Issues if they exist (mostly for policymakers, but good for transparency) */}
                {hasAuditIssues && (
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-3">
                            <Gavel className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <h5 className="font-bold text-gray-700 dark:text-gray-300">Detailed Audit Notes</h5>
                        </div>
                        <div className="space-y-3">
                            {item.audit_issues.map((issue, idx) => (
                                <div key={idx} className="text-sm border-l-2 border-gray-300 dark:border-slate-600 pl-3">
                                    <span className="font-bold text-xs uppercase text-google-red block mb-1">{issue.status}</span>
                                    <span className="text-slate-600 dark:text-slate-400">{issue.question}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ... (Rest of the component remains same, only renderErrorList changes)

const renderErrorList = () => (
    <div className="space-y-6 animate-fade-in-up">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Active Filters</h3>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-google-blue/10 border border-google-blue/20 rounded-lg text-sm font-bold text-google-blue capitalize">
                        {stakeholder}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300">
                        Class {selectedClass}
                    </span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300">
                        {selectedSubject}
                    </span>
                </div>
            </div>
            <button
                onClick={() => { setSelectedSubject(null) }}
                className="text-sm font-medium text-google-red hover:bg-google-red/5 px-4 py-2 rounded-lg transition-colors"
            >
                Clear Filters
            </button>
        </div>

        {filteredNavData.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No records found for this selection.</p>
            </div>
        ) : (
            <div className="grid gap-6">
                {filteredNavData.map(item => (
                    <ErrorCard key={item.id} item={item} stakeholder={stakeholder} />
                ))}
            </div>
        )}
    </div>
);

// --- Main Component ---

const ErrataViewer = () => {
    // Navigation State
    const [stakeholder, setStakeholder] = useState(null); // 'students', 'policymakers', 'teachers'
    const [selectedClass, setSelectedClass] = useState(null); // '6', '7', '8'
    const [selectedSubject, setSelectedSubject] = useState(null); // 'Algebra', 'Sets', etc.
    const [selectedPageItem, setSelectedPageItem] = useState(null); // Track selected page for Detail View

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [pageQuery, setPageQuery] = useState('');

    // --- Derived Data & Helpers ---

    const uniqueClasses = ['6', '7', '8'];

    const availableSubjects = useMemo(() => {
        if (!selectedClass) return [];
        const subjects = new Set(
            errataData
                .filter(i => i.class.replace(/\s/g, '') === `Class${selectedClass}`)
                .map(i => i.subject)
        );
        return Array.from(subjects);
    }, [selectedClass]);

    // Unified Filtering Logic
    const displayData = useMemo(() => {
        return errataData.filter(item => {
            // 1. Class Filter
            if (selectedClass) {
                const dataClass = item.class.replace(/\s/g, '');
                if (dataClass !== `Class${selectedClass}`) return false;
            }

            // 2. Subject Filter
            if (selectedSubject && item.subject !== selectedSubject) return false;

            // 3. Page Filter (Strict Text Match)
            if (pageQuery) {
                // User might type "101", check if item.page contains "101" (or strict match if desired, but contains is usually friendlier for '10' finding '101')
                // User asked for "Page Wise Searching", let's make it strict if it matches exactly, or loose? 
                // "OverAll Na Aaye" implies precision. Let's do a startsWith or exact match for purely numeric?
                // Actually typical use: "10" -> Page 10. "102" -> Page 102. 
                // Let's use includes for now but restrict it to the 'page' field only.
                if (!item.page.toLowerCase().includes(pageQuery.toLowerCase())) return false;
            }

            // 4. Content Search (Scope: Inside the above result set)
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesContent =
                    item.subject.toLowerCase().includes(q) ||
                    // item.page check is already handled by pageQuery if strict, but if user uses main search for page it works too.
                    // But here we focus on content mostly.
                    JSON.stringify(item.errors).toLowerCase().includes(q) ||
                    JSON.stringify(item.audit_issues || []).toLowerCase().includes(q);

                if (!matchesContent) return false;
            }

            return true;
        });
    }, [selectedClass, selectedSubject, pageQuery, searchQuery]);

    // Stepwise Back Navigation (Mimics Navigator.pop behavior)
    const handleBack = () => {
        if (selectedPageItem) {
            setSelectedPageItem(null); // Back to Page Grid
        } else if (selectedSubject) {
            setSelectedSubject(null); // Back to Subject Selection
        } else if (selectedClass) {
            setSelectedClass(null); // Back to Class Selection
        } else if (stakeholder) {
            setStakeholder(null); // Back to Stakeholder Selection (Home of Errata)
        } else {
            // If at root of Errata, maybe go to valid prev page or just allow default behavior
            // Since this button is conditionally rendered when something is selected, 
            // the above covers the flow. However, if user wants to go 'Back' from Stakeholder selection to App Home?
            // The top back button is only shown if (stakeholder || ...) is true. 
        }
    };

    const resetAll = () => {
        setStakeholder(null);
        setSelectedClass(null);
        setSelectedSubject(null);
        setSelectedPageItem(null);
        setSearchQuery('');
        setPageQuery('');
    };

    // --- Render Steps ---

    const renderStakeholderSelection = () => (
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
            <SelectionCard
                title="For Students"
                description="Verify textbook content and check for specific page errors."
                icon={UserCheck}
                onClick={() => setStakeholder('students')}
                colorClass="bg-google-blue"
                ringColor="ring-google-blue"
                active={stakeholder === 'students'}
            />
            <SelectionCard
                title="For Policymakers"
                description="View curriculum audit stats and rewrite directives."
                icon={Gavel}
                onClick={() => setStakeholder('policymakers')}
                colorClass="bg-google-red"
                ringColor="ring-google-red"
                active={stakeholder === 'policymakers'}
            />
            <SelectionCard
                title="For Teachers"
                description="Access instructional guides and pedagogical alerts."
                icon={School}
                onClick={() => setStakeholder('teachers')}
                colorClass="bg-google-green"
                ringColor="ring-google-green"
                active={stakeholder === 'teachers'}
            />
        </div>
    );

    const renderClassSelection = () => (
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
            {uniqueClasses.map(cls => (
                <SelectionCard
                    key={cls}
                    title={`Class ${cls}`}
                    description={`View Errata for Grade ${cls}`}
                    icon={Layers}
                    onClick={() => setSelectedClass(cls)}
                    colorClass="bg-slate-700"
                    ringColor="ring-slate-700"
                    active={selectedClass === cls}
                />
            ))}
        </div>
    );

    const renderSubjectSelection = () => (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {availableSubjects.map(sub => (
                <SelectionCard
                    key={sub}
                    title={sub}
                    icon={Book}
                    onClick={() => setSelectedSubject(sub)}
                    colorClass="bg-google-yellow"
                    ringColor="ring-google-yellow"
                    active={selectedSubject === sub}
                />
            ))}
        </div>
    );

    const renderPageGrid = () => (
        <div className="animate-fade-in-up">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayData.map(item => {
                    // Extract numeric page for cleaner display if possible, else use full string
                    const displayPage = item.page.replace(/Page\s*/i, '').trim();
                    const totalErrors = (item.errors.factual?.length || 0) + (item.errors.pedagogical?.length || 0) + (item.errors.editorial?.length || 0);

                    return (
                        <button
                            key={item.id}
                            onClick={() => setSelectedPageItem(item)}
                            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:shadow-xl hover:border-google-blue dark:hover:border-google-blue transition-all group aspect-[3/4]"
                        >
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Page</span>
                            <span className="text-5xl font-display font-bold text-slate-800 dark:text-white mb-2 group-hover:scale-110 transition-transform">
                                {displayPage}
                            </span>
                            <div className="mt-auto flex flex-col items-center">
                                <span className={`text-lg font-bold ${totalErrors > 0 ? 'text-google-red' : 'text-google-green'}`}>
                                    {totalErrors}
                                </span>
                                <span className="text-xs text-slate-400 font-medium uppercase">Errors</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const renderDetailView = () => (
        <div className="animate-fade-in-up space-y-6">
            <button
                onClick={() => setSelectedPageItem(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-google-blue transition-colors font-medium mb-2 pl-1"
            >
                <ArrowLeft size={18} />
                Back to Pages
            </button>
            <ErrorCard item={selectedPageItem} stakeholder={stakeholder} />
        </div>
    );

    const renderBrowseContent = () => (
        <div className="space-y-6 animate-fade-in-up">
            {/* Sticky Navigation / Header */}
            <div className="sticky top-[84px] z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-all duration-300">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-google-blue/10 text-google-blue font-bold rounded-lg text-sm capitalize shadow-sm">{stakeholder}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-sm shadow-sm">Class {selectedClass}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-sm shadow-sm">{selectedSubject}</span>
                    {selectedPageItem && (
                        <>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                            <span className="px-3 py-1 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-lg text-sm border dark:border-slate-600 shadow-sm">{selectedPageItem.page}</span>
                        </>
                    )}
                </div>
                <button onClick={() => { setSelectedSubject(null); setSelectedPageItem(null); }} className="text-sm text-google-red font-medium hover:bg-google-red/5 px-3 py-1.5 rounded-lg transition-colors">
                    Change Subject
                </button>
            </div>

            {displayData.length === 0 ? (
                <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No records found for this selection.</p>
                </div>
            ) : (
                selectedPageItem ? renderDetailView() : renderPageGrid()
            )}
        </div>
    );

    const renderErrorList = () => (
        <div className="space-y-6 animate-fade-in-up">
            {displayData.length === 0 ? (
                <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">No records found for this selection.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {displayData.map(item => (
                        <ErrorCard key={item.id} item={item} stakeholder={stakeholder} />
                    ))}
                </div>
            )}
        </div>
    );

    // --- Main Render ---

    return (
        <div className="min-h-[calc(100vh-80px)]">
            <div className="max-w-6xl mx-auto px-4 py-12">

                {/* Top Search Bar & Filters */}
                <div className="mb-10 flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            {(stakeholder || selectedClass || searchQuery || pageQuery) && (
                                <button
                                    onClick={handleBack}
                                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
                                    title="Back / Reset"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <div>
                                <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                                    {(searchQuery || pageQuery) ? 'Search Results' :
                                        !stakeholder ? 'Errata Database' :
                                            !selectedClass ? 'Select Class' :
                                                !selectedSubject ? 'Select Subject' : 'Details'}
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    {stakeholder ? `Viewing as ${stakeholder.charAt(0).toUpperCase() + stakeholder.slice(1)}` : 'Select a stakeholder to begin'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            {/* Page Number Filter */}
                            <div className="relative w-full md:w-40">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                    Page
                                </div>
                                <input
                                    type="text"
                                    placeholder="No."
                                    value={pageQuery}
                                    onChange={(e) => setPageQuery(e.target.value)}
                                    className="w-full pl-14 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all shadow-sm"
                                />
                            </div>

                            {/* Content Search */}
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}

                {/* 1. If we are searching (Page or Content), show results immediately without requiring deep drill-down */}
                {(searchQuery || pageQuery) ? (
                    renderErrorList()
                ) : (
                    <>
                        <div className="mb-0">
                            {!stakeholder && renderStakeholderSelection()}
                            {stakeholder && !selectedClass && renderClassSelection()}
                            {stakeholder && selectedClass && !selectedSubject && renderSubjectSelection()}
                        </div>

                        {/* Dashboard Stats (Only when no specific subject selected) */}
                        {!selectedSubject && !searchQuery && !pageQuery && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up mt-12">
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">Total Errors Logged</h3>
                                    <div className="text-4xl font-black text-slate-900 dark:text-white">{errataData.length}</div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">Factual Repairs</h3>
                                    <div className="text-4xl font-black text-google-red">{errataData.reduce((acc, curr) => acc + (curr.stats?.factual || 0), 0)}</div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">Pedagogical Updates</h3>
                                    <div className="text-4xl font-black text-google-yellow">{errataData.reduce((acc, curr) => acc + (curr.stats?.pedagogical || 0), 0)}</div>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <h3 className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">Editorial Fixes</h3>
                                    <div className="text-4xl font-black text-google-blue">{errataData.reduce((acc, curr) => acc + (curr.stats?.editorial || 0), 0)}</div>
                                </div>
                            </div>
                        )}

                        {/* Show Content (Grid or Detail) if we have drilled down to Subject */}
                        {(stakeholder && selectedClass && selectedSubject) && renderBrowseContent()}
                    </>
                )}

            </div>
        </div>
    );
};

export default ErrataViewer;
