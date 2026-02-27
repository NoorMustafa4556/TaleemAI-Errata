import { BookOpen, GraduationCap, School } from 'lucide-react';

const GradeCard = ({ grade, color, icon: Icon, onClick, isActive }) => (
    <div
        onClick={() => onClick(grade)}
        className="glass-panel"
        style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
            transition: 'transform 0.2s, background 0.2s',
            borderTop: `4px solid ${color}`,
            background: isActive ? `${color}20` : 'var(--glass-bg)',
            borderColor: isActive ? color : 'var(--glass-border)',
            transform: isActive ? 'scale(1.02)' : 'scale(1)'
        }}
        onMouseEnter={(e) => !isActive && (e.currentTarget.style.transform = 'translateY(-5px)')}
        onMouseLeave={(e) => !isActive && (e.currentTarget.style.transform = 'translateY(0)')}
    >
        <div style={{
            background: isActive ? color : `${color}20`,
            padding: '1rem',
            borderRadius: '50%',
            color: isActive ? '#0f172a' : color
        }}>
            <Icon size={48} />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{grade}</h2>
        <span style={{ color: 'var(--text-secondary)' }}>{isActive ? 'Active' : 'View Analysis'}</span>
    </div>
);

const GradeSelector = ({ onSelect, selectedGrade }) => {
    return (
        <div className="animate-fade-in" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
        }}>
            <GradeCard
                grade="Grade 6"
                color="var(--grade-6-color)"
                icon={School}
                onClick={onSelect}
                isActive={selectedGrade === "Grade 6"}
            />
            <GradeCard
                grade="Grade 7"
                color="var(--grade-7-color)"
                icon={BookOpen}
                onClick={onSelect}
                isActive={selectedGrade === "Grade 7"}
            />
            <GradeCard
                grade="Grade 8"
                color="var(--grade-8-color)"
                icon={GraduationCap}
                onClick={onSelect}
                isActive={selectedGrade === "Grade 8"}
            />
        </div>
    );
};

export default GradeSelector;
