
const Header = ({ onReset }) => {
    return (
        <header className="animate-fade-in" style={{ textAlign: 'center' }}>
            <h1 className="title" onClick={onReset} style={{ cursor: 'pointer' }}>
                Errata Of Smart Education
            </h1>
        </header>
    );
};

export default Header;
