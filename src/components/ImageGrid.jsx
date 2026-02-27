import { AlertTriangle } from 'lucide-react';

const ImageCard = ({ image, grade, subject, onClick }) => {
    // src path: standard vite public folder access
    // /images/Class6/Algebra/filename.png
    // grade string is "Grade 6", we need "Class6"
    const classStr = `Class${grade.replace('Grade ', '')}`;
    const imagePath = `/images/${classStr}/${subject}/${image.fileName}`;

    return (
        <div
            className="glass-panel"
            onClick={() => onClick(image)}
            style={{
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.3s',
                position: 'relative'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.borderColor = 'var(--accent-color)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
            }}
        >
            <div style={{ height: '200px', overflow: 'hidden', background: '#000' }}>
                <img
                    src={imagePath}
                    alt={image.fileName}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </div>
            <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {image.fileName}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171' }}>
                    <AlertTriangle size={16} />
                    <span style={{ fontWeight: 'bold' }}>{image.totalErrors} Errors</span>
                </div>
            </div>
        </div>
    );
};

const ImageGrid = ({ images, grade, subject, onSelect }) => {
    if (images.length === 0) {
        return <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No data found for this selection.</p>;
    }

    return (
        <div className="animate-fade-in" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem'
        }}>
            {images.map(img => (
                <ImageCard
                    key={img.id}
                    image={img}
                    grade={grade}
                    subject={subject}
                    onClick={onSelect}
                />
            ))}
        </div>
    );
};

export default ImageGrid;
