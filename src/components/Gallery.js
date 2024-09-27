import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from 'axios';
import './Gallery.css';
import './Toast.css';


function Gallery() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const { email } = useContext(UserContext);
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        // Fetch all cards from the backend
        axios.get('http://localhost:8000/cards')
            .then((res) => {
                setCards(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching cards:', error);
                setLoading(false);
            });
    }, []);

    // Pain in the a** adding this d**n cart because I didn't make the created cards user specific at first
    const handleAddToCart = (card) => {
        console.log("Email:", email);  // Log the email before making the request
        axios.post('http://localhost:8000/cart/add', {
            email,
            cardId: card._id,
            price: card.price
        })
            .then((res) => {
                setToastMessage('Added to cart!');  // Set the toast message
                setTimeout(() => setToastMessage(null), 3000);
            })
            .catch((error) => {
                console.error('Error adding to cart:', error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (

        <div className="gallery-container">
            <h1 className="gallery-title">Gallery</h1>
            {<button className="goHome" onClick={() => navigate('/home', { state: { id: email } })}>Go Home</button>}
            <div className="gallery-grid">
                {cards.map((card) => (
                    <div key={card._id} className="card">
                        <img
                            src={`http://localhost:8000${card.imageUrl}`}
                            alt={card.description}
                            className="card-image"
                        />
                        <div className="card-info">
                            <h3>{card.description}</h3>
                            <p>Price: ${card.price}</p>
                            <button onClick={() => handleAddToCart(card)}>Add to Cart</button>
                        </div>
                    </div>
                ))}
            </div>
            {toastMessage && <div className="toast">{toastMessage}</div>}
        </div>
    );
}


export default Gallery;

