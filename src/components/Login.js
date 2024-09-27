import "./Login.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from '../UserContext';
import React, { useState, useContext } from "react";

function Login() {
    const navigate = useNavigate();
    const { saveEmail } = useContext(UserContext);
    const [inputEmail, setInputEmail] = useState('');
    const [password, setPassword] = useState('');

    async function submit(e) {
        e.preventDefault();

        try {
            await axios.post("http://localhost:8080/", {
                email: inputEmail,
                password
            })
            .then(res => {
                if (res.data === "exist") {
                    saveEmail(inputEmail);  // Save email to context and localStorage
                    navigate("/home");
                } else if (res.data === "notexist") {
                    alert("User does not exist");
                } else if (res.data === "wrongPassword") {
                    alert("Wrong Password");
                }
            })
            .catch(e => {
                alert("Login Failed");
                console.log(e);
            });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <form action="POST">
                <input type="email" onChange={(e) => setInputEmail(e.target.value)} placeholder="Email" />
                <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <input type="submit" onClick={submit} />
            </form>
            <br />
            <p>OR</p>
            <br />
            <Link to="/signup">Signup Page</Link>
        </div>
    );
}

export default Login;
