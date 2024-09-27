import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CardCreator.css';
import { UserContext } from '../UserContext';


function CardCreator() {
    const { email } = useContext(UserContext);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [cardSaved, setCardSaved] = useState(false);
    const navigate = useNavigate();

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));  // Preview the selected image
        }
    };

    // Handle form submission (image upload, description, and price)
    const handleSaveCard = async () => {
        const formData = new FormData();
        formData.append('image', image); 
        formData.append('description', description);
        formData.append('price', price);
        formData.append('creatorEmail', email);

        try {
            await axios.post('http://localhost:8000/card', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setCardSaved(true);  // Indicate that the card has been saved
            alert('Card saved successfully!');
        } catch (error) {
            console.error('Error saving card:', error);
            alert('Error saving card.');
        }
    };

    return (
        <div className="card-creator">
            <h1>Card Creator</h1>

            <div className="form">
                {!cardSaved && (
                    
                    <>
                        <label>Upload Image</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />

                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write your card description"
                        />

                        <label>Price ($)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Set a price for your card"
                        />

                        <button onClick={handleSaveCard}>Save Card</button>
                    </>
                )}
                
                {<button className="goHome" onClick={() => navigate('/home', { state: { id: email } })}>Go Home</button>}
            
            </div>

            {/* Display the card preview only if an image is selected */}
            {previewImage && (
                <div className="card-preview">
                    <h2>Card Preview</h2>
                    <div className="card">
                        <h3>${price}</h3>
                        <img src={previewImage} alt="Card" />
                        <p>{description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CardCreator;
