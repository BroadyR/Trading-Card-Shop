import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import './Gallery.css';  // Reuse the same styling as the gallery

function Profile() {
    const { email } = useContext(UserContext);  // Get the logged-in user's email
    const [cards, setCards] = useState([]);

    useEffect(() => {
        if (email) {
            axios.get(`http://localhost:8000/profile/cards/${email}`)
                .then((res) => {
                    setCards(res.data);
                })
                .catch((error) => {
                    console.error('Error fetching user cards:', error);
                });
        }
    }, [email]);

    return (
        <div className="gallery-container">
            <h1 className="gallery-title">Your Created Cards</h1>
            <button className="home-button" onClick={() => window.location.href = '/home'}>
                Home
            </button>
            <div className="gallery-grid">
                {cards.length > 0 ? (
                    cards.map((card) => (
                        <div key={card._id} className="card">
                            <img 
                                src={`http://localhost:8000${card.imageUrl}`} 
                                alt={card.description} 
                                className="card-image" 
                            />
                            <div className="card-info">
                                <h3>{card.description}</h3>
                                <p>Price: ${card.price}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="empty-cart">You haven't created any cards yet.</p>
                )}
            </div>
        </div>
    );
}

export default Profile;
