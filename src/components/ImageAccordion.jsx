import { useState } from 'react';
import { ChevronRight, ChevronDown, XCircle, Lightbulb, FileText, AlertTriangle } from 'lucide-react';

const ErrorContent = ({ image, type, color }) => {
    const classStr = `Class${image.id.split('_')[0].replace('Class', '')}`;
    // We need to reconstruct the path logic. 
    // format: Class6_Algebra_96.png -> Class6, Algebra
    // But wait, the previous logic used props. Let's use the image object if it has what we need or pass props.
    // The image object has `fileName`. We can infer Class/Subject from the parent context or passed props.
    // Actually, passing `grade` and `subject` strings is safer.

    // However, simpler: we passed `grade` and `subject` to ImageAccordion. We can pass imagePath directly.
    return (
        <div className="animate-fade-in" style={{
            marginTop: '1rem',
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '12px',
            borderLeft: `4px solid ${color}`
        }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', maxHeight: '400px' }}>
                    <img
                        src={image.src} // We will construct src in the parent
                        alt={image.fileName}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }}
                    />
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                    <h3 style={{ marginTop: 0, color: color, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {type === 'factual' && <XCircle size={20} />}
                        {type === 'pedagogical' && <Lightbulb size={20} />}
                        {type === 'editorial' && <FileText size={20} />}
                        {type.charAt(0).toUpperCase() + type.slice(1)} Errors
                    </h3>

                    {image.errors[type] && image.errors[type].length > 0 ? (
                        image.errors[type].map((err, idx) => (
                            <div key={idx} style={{ marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <p
                                    style={{ margin: 0, lineHeight: 1.6, fontSize: '0.95rem' }}
                                    dangerouslySetInnerHTML={{
                                        __html: err
                                            .replace(/\*\*(.*?)\*\*/g, '<strong style="color:white">$1</strong>')
                                            .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.1); padding: 2px 4px; border-radius: 4px;">$1</code>')
                                    }}
                                />
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No errors listed in this category.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const ImageRow = ({ image, grade, subject, activeImageId, activeErrorType, onToggleImage, onSelectError }) => {
    const isExpanded = activeImageId === image.id;

    const classStr = `Class${grade.replace('Grade ', '')}`;
    const imagePath = `/images/${classStr}/${subject}/${image.fileName}`;
    const imageObjWithSrc = { ...image, src: imagePath };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Main Image Button */}
                <button
                    onClick={() => onToggleImage(image.id)}
                    className="glass-panel"
                    style={{
                        padding: '1rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        flex: '0 0 auto', // Don't shrink
                        minWidth: '250px',
                        background: isExpanded ? 'rgba(56, 189, 248, 0.15)' : 'var(--glass-bg)',
                        borderColor: isExpanded ? 'var(--accent-color)' : 'var(--glass-border)',
                        color: isExpanded ? 'white' : 'var(--text-primary)'
                    }}
                >
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <span style={{ fontWeight: 600 }}>{image.fileName}</span>
                    {image.pageNumber && image.pageNumber !== 'N/A' && (
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: 'var(--text-secondary)'
                        }}>
                            Page {image.pageNumber}
                        </span>
                    )}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#f87171' }}>
                        <AlertTriangle size={14} />
                        {image.totalErrors}
                    </div>
                </button>

                {/* Inline Error Buttons - Show ONLY if this image is expanded */}
                {isExpanded && (
                    <div className="animate-fade-in" style={{ display: 'flex', gap: '0.8rem' }}>
                        <button
                            onClick={() => onSelectError('factual')}
                            className="glass-panel"
                            style={{
                                padding: '0.8rem 1.2rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                borderColor: activeErrorType === 'factual' ? '#ef4444' : 'var(--glass-border)',
                                background: activeErrorType === 'factual' ? 'rgba(239, 68, 68, 0.2)' : 'var(--glass-bg)'
                            }}
                        >
                            <XCircle size={18} color="#ef4444" /> Factual
                        </button>
                        <button
                            onClick={() => onSelectError('pedagogical')}
                            className="glass-panel"
                            style={{
                                padding: '0.8rem 1.2rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                borderColor: activeErrorType === 'pedagogical' ? '#eab308' : 'var(--glass-border)',
                                background: activeErrorType === 'pedagogical' ? 'rgba(234, 179, 8, 0.2)' : 'var(--glass-bg)'
                            }}
                        >
                            <Lightbulb size={18} color="#eab308" /> Pedagogical
                        </button>
                        <button
                            onClick={() => onSelectError('editorial')}
                            className="glass-panel"
                            style={{
                                padding: '0.8rem 1.2rem',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                borderColor: activeErrorType === 'editorial' ? '#3b82f6' : 'var(--glass-border)',
                                background: activeErrorType === 'editorial' ? 'rgba(59, 130, 246, 0.2)' : 'var(--glass-bg)'
                            }}
                        >
                            <FileText size={18} color="#3b82f6" /> Editorial
                        </button>
                    </div>
                )}
            </div>

            {/* Expanded Content Area */}
            {isExpanded && activeErrorType && (
                <ErrorContent
                    image={imageObjWithSrc}
                    type={activeErrorType}
                    color={
                        activeErrorType === 'factual' ? '#ef4444' :
                            activeErrorType === 'pedagogical' ? '#eab308' : '#3b82f6'
                    }
                />
            )}
        </div>
    );
};

const ImageAccordion = ({ images, grade, subject }) => {
    const [activeImageId, setActiveImageId] = useState(null);
    const [activeErrorType, setActiveErrorType] = useState(null); // 'factual', 'pedagogical', 'editorial'

    const handleToggleImage = (id) => {
        if (activeImageId === id) {
            // Collapse if clicking same
            setActiveImageId(null);
            setActiveErrorType(null);
        } else {
            setActiveImageId(id);
            setActiveErrorType(null); // Reset detail view when switching images
        }
    };

    const handleSelectError = (type) => {
        // Toggle logic for error type? Or just set?
        // User said "Jis Button Pr Click Krain ... Errors Display Hon".
        // Let's assume just set.
        if (activeErrorType === type) {
            setActiveErrorType(null); // allow toggle off
        } else {
            setActiveErrorType(type);
        }
    };

    if (!images || images.length === 0) return <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No images found.</p>;

    return (
        <div className="animate-fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginTop: '2rem',
            maxWidth: '1000px',
            marginLeft: 'auto',
            marginRight: 'auto'
        }}>
            {images.map(img => (
                <ImageRow
                    key={img.id}
                    image={img}
                    grade={grade}
                    subject={subject}
                    activeImageId={activeImageId}
                    activeErrorType={activeErrorType}
                    onToggleImage={handleToggleImage}
                    onSelectError={handleSelectError}
                />
            ))}
        </div>
    );
};

export default ImageAccordion;
