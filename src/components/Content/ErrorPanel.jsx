import React from 'react';
import errorData from '../../data.json';
import { AlertCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const ErrorPanel = ({ imageIds, grade, topic, onClose }) => {
    // 1. Resolve Data Path: data.json structure is ClassX -> Subject -> Array of Objects
    const classKey = `Class${grade}`;
    const subjectKey = topic; // Assuming Topic name matches Subject key in data.json (e.g. "Algebra")

    // 2. Find Errors
    let relevantErrors = [];

    if (errorData[classKey] && errorData[classKey][subjectKey]) {
        const subjectErrors = errorData[classKey][subjectKey];

        // Filter errors that match the concept's images
        // Note: concept.images usually has extension .png, data.json IDs usually don't.
        // We will try to match loosely.
        relevantErrors = subjectErrors.filter(errItem => {
            return imageIds.some(img => img.includes(errItem.id));
        });
    }

    if (relevantErrors.length === 0) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
                <div className="w-full md:w-1/3 bg-white h-full shadow-2xl p-6 overflow-y-auto animate-slide-in-right">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <CheckCircle className="text-green-500 mr-2" />
                            No Reported Errors
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">Close</button>
                    </div>
                    <p className="text-gray-600">Great news! No known errors have been reported for the content on this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="w-full md:w-1/2 lg:w-1/3 bg-white h-full shadow-2xl p-6 overflow-y-auto animate-fade-in-right">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-red-600 flex items-center">
                        <AlertCircle className="mr-2" />
                        Audit Report
                    </h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <span className="sr-only">Close</span>
                        ✕
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <p className="text-sm text-yellow-700">
                            The following issues were identified during the automated and manual audit of the legacy content.
                        </p>
                    </div>

                    {relevantErrors.map((item, idx) => (
                        <div key={idx} className="bg-white border rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">ID: {item.id}</span>
                                <span className="text-xs font-bold text-red-500">{item.totalErrors} Issues</span>
                            </div>

                            {/* Image Preview if available */}
                            <div className="mb-4 bg-gray-100 rounded flex justify-center p-2">
                                <img
                                    src={`/images/${classKey}/${subjectKey}/${item.fileName}`}
                                    alt={`Audit content for ${item.id}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                    }}
                                    className="max-h-40 object-contain"
                                />
                            </div>

                            {item.errors.editorial.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="font-semibold text-sm text-blue-700 mb-1 flex items-center"><AlertTriangle size={14} className="mr-1" /> Editorial</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                                        {item.errors.editorial.map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                            )}

                            {item.errors.factual.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="font-semibold text-sm text-red-700 mb-1 flex items-center"><XCircle size={14} className="mr-1" /> Factual</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                                        {item.errors.factual.map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                            )}

                            {item.errors.pedagogical.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="font-semibold text-sm text-orange-700 mb-1 flex items-center"><AlertCircle size={14} className="mr-1" /> Pedagogical</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
                                        {item.errors.pedagogical.map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ErrorPanel;
