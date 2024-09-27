import React, { createContext, useState, useEffect } from 'react';

// Create UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [email, setEmail] = useState(null);

    // On component mount, retrieve email from localStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    // Save email to localStorage when setEmail is called
    const saveEmail = (userEmail) => {
        setEmail(userEmail);
        localStorage.setItem('email', userEmail); // Save email to localStorage
    };

    return (
        <UserContext.Provider value={{ email, saveEmail }}>
            {children}
        </UserContext.Provider>
    );
};
