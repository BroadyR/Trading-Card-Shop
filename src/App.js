// import './App.css'
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CardCreator from "./components/CardCreator";
import Gallery from "./components/Gallery";
import UserCart from './components/UserCart';
import Profile from "./components/Profile";
import { UserProvider } from './UserContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react';

function App() {

  return (
    <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cardcreator" element={<CardCreator />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/cart" element={<UserCart />} />
          </Routes>
        </Router>
    </UserProvider>
  );
}

export default App;