import React from 'react';
import { Link } from 'react-router-dom';
import { Book, ChevronRight, GraduationCap, ArrowLeft, Layers, Sparkles } from 'lucide-react';

const GradeCard = ({ grade, description, to, color, delay }) => (
    <Link
        to={to}
        className={`group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-${color}-500/50 dark:hover:border-${color}-400/50 animate-fade-in-up`}
        style={{ animationDelay: delay }}
    >
        {/* Background Gradient Blob */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-${color}-500/10 to-transparent rounded-full -mr-32 -mt-32 blur-3xl group-hover:from-${color}-500/20 transition-all duration-500`} />

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
                <div className={`p-4 bg-${color}-50 dark:bg-${color}-500/10 rounded-2xl text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                    <GraduationCap size={40} strokeWidth={1.5} />
                </div>
                <span className={`text-6xl font-black text-slate-100 dark:text-slate-800 group-hover:text-${color}-500/10 transition-colors duration-500 select-none`}>
                    {grade}
                </span>
            </div>

            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 font-display">Grade {grade}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 font-google-sans leading-relaxed text-lg">{description}</p>

            <div className={`flex items-center text-${color}-600 dark:text-${color}-400 font-bold group-hover:gap-3 transition-all duration-300`}>
                <span className="uppercase tracking-wider text-sm">Explore Curriculum</span>
                <ChevronRight size={20} className={`transform group-hover:translate-x-1`} />
            </div>
        </div>
    </Link>
);

const SyllabusOverview = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            {/* Header Section */}
            <div className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pb-20 pt-16 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <Link to="/" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-google-blue dark:hover:text-google-blue mb-8 transition-colors group">
                        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-google-blue/10 text-google-blue text-xs font-bold uppercase tracking-wider mb-4 border border-google-blue/20">
                                <Sparkles size={14} />
                                <span>Curriculum 2026</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                Refined <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue to-google-purple">Syllabus</span>
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-light">
                                Navigate through the modernized Single National Curriculum, structured for conceptual depth and clarity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grades Grid */}
            <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20 pb-24">
                <div className="grid md:grid-cols-3 gap-8">
                    <GradeCard
                        grade="6"
                        description="Foundations of Algebra, Geometry, and Scientific Inquiry."
                        to="/grade/6"
                        color="google-blue"
                        delay="0.1s"
                    />
                    <GradeCard
                        grade="7"
                        description="Advanced Algebraic Concepts, Sets, and Biology Basics."
                        to="/grade/7"
                        color="google-red"
                        delay="0.2s"
                    />
                    <GradeCard
                        grade="8"
                        description="Pre-Secondary Physics, Complex Algebra, and History."
                        to="/grade/8"
                        color="google-yellow"
                        delay="0.3s"
                    />
                </div>
            </div>
        </div>
    );
};

export default SyllabusOverview;
