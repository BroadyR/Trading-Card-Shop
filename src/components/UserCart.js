import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import './UserCart.css';

function UserCart() {
    const { email } = useContext(UserContext);  // Get user's email from context
    const [cart, setCart] = useState({ items: [] });  // Initialize cart with items array
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (email) {
            axios.get(`http://localhost:8000/cart/${email}`)  // Fetch user's cart
                .then((res) => {
                    setCart(res.data);  // Set the entire cart object
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching cart:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [email]);

    // Quantity editing has to be done locally before refetching data or else page locks-up

    const handleUpdateQuantity = (cardId, quantity) => {
        // Update the quantity in the local state instead of re-fetching the entire cart
        const updatedCart = {
            ...cart,
            items: cart.items.map(item =>
                item.cardId._id === cardId ? { ...item, quantity: parseInt(quantity) } : item
            ),
        };
        setCart(updatedCart);

        // Send the updated quantity to the backend
        axios.put('http://localhost:8000/cart/update', { email, cardId, quantity })
            .then((res) => {
                console.log('Quantity updated successfully');
            })
            .catch((error) => {
                console.error('Error updating quantity:', error);
            });
    };

    const handleRemoveFromCart = (cardId) => {
         // Remove the item locally before making the server request
         const updatedCart = {
            ...cart,
            items: cart.items.filter(item => item.cardId._id !== cardId),
        };
        setCart(updatedCart);

        // Send the request to remove the item from the backend
        axios.delete('http://localhost:8000/cart/remove', { data: { email, cardId } })
            .then((res) => {
                console.log('Item removed successfully');
            })
            .catch((error) => {
                console.error('Error removing from cart:', error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const totalAmount = cart.items ? cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0;

    return (
        <div className="cart-container">
            <h1 className="cart-title">Your Cart</h1>
            <div className="cart-items">
                {cart.items && cart.items.length > 0 ? (
                    cart.items.map((item) => (
                        <div key={item.cardId._id} className="cart-item">
                            <img src={`http://localhost:8000${item.cardId.imageUrl}`} alt={item.cardId.description} className="cart-item-image" />
                            <div className="cart-item-info">
                                <h3>{item.cardId.description}</h3>
                                <p>Price: ${item.price}</p>
                                <p>
                                    Quantity:
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleUpdateQuantity(item.cardId._id, e.target.value)}
                                        min="1"
                                        className="quantity-input"
                                    />
                                </p>
                                <button onClick={() => handleRemoveFromCart(item.cardId._id)} className="remove-button">Remove</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="empty-cart">Your cart is empty.</p>
                )}
            </div>
            <div className="cart-footer">
                <button className="goHome" onClick={() => navigate('/home')}>Go Home</button>
                <h2 className="cart-total">Total: ${totalAmount.toFixed(2)}</h2>
            </div>
        </div>
    );   
}

export default UserCart;
