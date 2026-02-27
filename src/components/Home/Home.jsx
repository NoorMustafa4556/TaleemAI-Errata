import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Calculator } from 'lucide-react';

const GradeCard = ({ grade, icon: Icon, color }) => (
    <Link
        to={`/grade/${grade}`}
        className={`block p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-l-4 ${color}`}
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('border-', 'bg-').replace('-500', '-100')} text-gray-700`}>
                <Icon size={32} />
            </div>
            <span className="text-4xl font-bold text-gray-200">0{grade}</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Grade {grade}</h3>
        <p className="text-gray-600">Explore Mathematics curriculum including Algebra and Sets.</p>
    </Link>
);

const Home = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Welcome to <span className="text-emerald-600">Taleem Ai</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Your interactive gateway to mastering Grade 6, 7, and 8 Mathematics.
                    Explore concepts in English and Urdu simultaneously.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <GradeCard grade="6" icon={BookOpen} color="border-blue-500" />
                <GradeCard grade="7" icon={Calculator} color="border-purple-500" />
                <GradeCard grade="8" icon={GraduationCap} color="border-orange-500" />
            </div>

            <div className="mt-20 bg-emerald-50 rounded-2xl p-8 border border-emerald-100 text-center">
                <h2 className="text-2xl font-bold text-emerald-800 mb-4">Why use this platform?</h2>
                <div className="grid md:grid-cols-3 gap-8 text-left mt-8">
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-emerald-900">Dual Language</h4>
                        <p className="text-emerald-700">Learn concepts in both English and Urdu side-by-side to ensure complete understanding.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-emerald-900">Quality Assured</h4>
                        <p className="text-emerald-700">Review identified content improvements and errata directly within the learning flow.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-emerald-900">Interactive</h4>
                        <p className="text-emerald-700">Navigate easily through complex topics like Algebra and Sets with a structured knowledge graph.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
