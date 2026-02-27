import { useState } from 'react';
import { AlertCircle, FileText, Lightbulb, XCircle } from 'lucide-react';

const ErrorDetails = ({ image, grade, subject, onBack }) => {
    const [activeTab, setActiveTab] = useState(null);

    const classStr = `Class${grade.replace('Grade ', '')}`;
    const imagePath = `/images/${classStr}/${subject}/${image.fileName}`;

    const tabs = [
        { id: 'factual', label: 'Factual Errors', color: '#ef4444', icon: XCircle },
        { id: 'pedagogical', label: 'Pedagogical Errors', color: '#eab308', icon: Lightbulb },
        { id: 'editorial', label: 'Editorial Errors', color: '#3b82f6', icon: FileText },
    ];

    return (
        <div className="animate-fade-in" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem',
            boxSizing: 'border-box'
        }}>
            <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <button
                    onClick={onBack}
                    style={{
                        alignSelf: 'flex-start',
                        background: 'transparent',
                        color: 'white',
                        border: '1px solid var(--glass-border)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    ← Back
                </button>

                <div style={{ display: 'flex', gap: '2rem', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
                    {/* Split View for Desktop */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '2rem',
                        height: '100%',
                        overflow: 'hidden'
                    }}>

                        {/* Left: Image */}
                        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '1rem' }}>
                            <img
                                src={imagePath}
                                alt={image.fileName}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    borderRadius: '8px'
                                }}
                            />
                        </div>

                        {/* Right: Controls & Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '1rem'
                            }}>
                                {tabs.map(tab => {
                                    const Icon = tab.icon;
                                    const count = image.errors[tab.id]?.length || 0;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className="glass-panel"
                                            style={{
                                                padding: '1rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: isActive ? `${tab.color}30` : 'var(--glass-bg)',
                                                borderColor: isActive ? tab.color : 'var(--glass-border)',
                                                color: isActive ? 'white' : 'var(--text-secondary)'
                                            }}
                                        >
                                            <Icon color={tab.color} size={24} />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{tab.label}</span>
                                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{count} found</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', minHeight: '300px' }}>
                                {!activeTab && (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', flexDirection: 'column', gap: '1rem' }}>
                                        <AlertCircle size={48} opacity={0.5} />
                                        <p>Select an error category above to see details.</p>
                                    </div>
                                )}

                                {activeTab && (
                                    <div className="animate-fade-in">
                                        <h3 style={{
                                            marginTop: 0,
                                            borderBottom: `2px solid ${tabs.find(t => t.id === activeTab).color}`,
                                            display: 'inline-block',
                                            paddingBottom: '0.5rem'
                                        }}>
                                            {tabs.find(t => t.id === activeTab).label}
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                            {image.errors[activeTab] && image.errors[activeTab].length > 0 ? (
                                                image.errors[activeTab].map((err, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            background: 'rgba(0,0,0,0.2)',
                                                            padding: '1rem',
                                                            borderRadius: '8px',
                                                            borderLeft: `4px solid ${tabs.find(t => t.id === activeTab).color}`
                                                        }}
                                                    >
                                                        <p
                                                            style={{ margin: 0, lineHeight: 1.6 }}
                                                            dangerouslySetInnerHTML={{
                                                                __html: err
                                                                    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:white">$1</strong>')
                                                                    .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px;">$1</code>')
                                                            }}
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No errors found in this category.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorDetails;
