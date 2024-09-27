import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import './Home.css';

function Home() {
    const { email } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSignOut = () => {
        // Navigate back to the login page on sign out
        navigate('/');
    };

    return (
        <div className="home-wrapper">
            <header className="home-header">
                <h1>Welcome to Your Dashboard, {email}</h1>
            </header>
            <div className="options-grid">
                <div className="option-card" onClick={() => navigate('/gallery')}>
                    <h2>Gallery</h2>
                    <p>Browse and purchase all custom cards</p>
                </div>
                <div className="option-card" onClick={() => navigate('/profile')}>
                    <h2>Profile</h2>
                    <p>Browse your own custom cards</p>
                </div>
                <div className="option-card" onClick={() => navigate('/cardcreator')}>
                    <h2>Card Creator</h2>
                    <p>Create and customize your own trading cards</p>
                </div>
                <div className="option-card" onClick={() => navigate('/cart')}>
                    <h2>Cart</h2>
                    <p>Review items in your cart</p>
                </div>
                <div className="option-card signout-card" onClick={handleSignOut}>
                    <h2>Sign Out</h2>
                    <p>Log out of your account</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
