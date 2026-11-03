import { Link } from 'react-router-dom';
import { useState } from 'react';
import ContactModal from './ContactModal';

const Header = () => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    return (
        <>
            <header className="app-header">
                <h1>The Daily Harvest</h1>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/cart">Cart</Link>
                    <button type="button" className="nav-link-button" onClick={() => setIsContactModalOpen(true)}>
                        Contact Us
                    </button>
                    <Link to="/login">
                        <button>Admin Login</button>
                    </Link>
                </nav>
            </header>
            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
        </>
    );
};

export default Header;
