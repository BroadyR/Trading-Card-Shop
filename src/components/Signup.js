import "./Signup.css";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


function Login() {
    const navigate=useNavigate();

    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")

    async function submit(e){
        e.preventDefault();
        console.log("button")

        try{

            await axios.post("http://localhost:8080/signup",{
                email,password
            })
            .then(res=>{
                if(res.data==="exist"){
                    alert("User already exists")
                }
                else if(res.data==="notexist"){
                    navigate("/")
                }
            })
            .catch(e=>{
                alert("wrong details")
                console.log(e);
            })

        }
        catch(e){
            console.log(e);

        }

    }


    return (
        <div className="login">

            <h1>Signup</h1>

            <form action="POST">
                <input type="email" onChange={(e) => { setEmail(e.target.value) }} placeholder="Email"  />
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
                <input type="submit" onClick={submit} />

            </form>

            <br />
            <p>OR</p>
            <br />

            <Link to="/">Login Page</Link>

        </div>
    )
}

export default Login