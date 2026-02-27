import { Sigma, Braces } from 'lucide-react';

const SubjectCard = ({ subject, onClick, isActive }) => (
    <div
        onClick={() => onClick(subject)}
        className="glass-panel"
        style={{
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            height: '100px',
            background: isActive ? 'var(--accent-glow)' : 'var(--glass-bg)',
            borderColor: isActive ? 'var(--accent-color)' : 'var(--glass-border)'
        }}
        onMouseEnter={(e) => {
            !isActive && (e.currentTarget.style.transform = 'translateY(-3px)');
            !isActive && (e.currentTarget.style.background = 'var(--card-hover)');
        }}
        onMouseLeave={(e) => {
            !isActive && (e.currentTarget.style.transform = 'translateY(0)');
            !isActive && (e.currentTarget.style.background = 'var(--glass-bg)');
        }}
    >
        {subject === 'Algebra' ? <Sigma size={32} color={isActive ? 'white' : 'var(--accent-color)'} /> : <Braces size={32} color={isActive ? 'white' : 'var(--accent-color)'} />}
        <h2 style={{ margin: 0, fontSize: '1.8rem', color: isActive ? 'white' : 'var(--text-primary)' }}>{subject}</h2>
    </div>
);

const SubjectSelector = ({ grade, onSelect, selectedSubject }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <SubjectCard subject="Sets" onClick={onSelect} isActive={selectedSubject === 'Sets'} />
            <SubjectCard subject="Algebra" onClick={onSelect} isActive={selectedSubject === 'Algebra'} />
        </div>
    );
};

export default SubjectSelector;
