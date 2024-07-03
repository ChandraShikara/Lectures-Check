import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import "./mix.css";
import Navbar from './Navbar';


const Login = () => {
    const [inpval, setInpval] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const setVal = (e) => {
        const { name, value } = e.target;
        setInpval((prev) => ({ ...prev, [name]: value }));
    };

    const loginuser = async (e) => {
        e.preventDefault();

        const { email, password } = inpval;

        if (email === "" || !email.includes("@") || password === "") {
            toast.error("Invalid credentials!", { position: "top-center" });
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/login", {
                email, password
            });

            if (res.status === 200) {
                localStorage.setItem("usersdatatoken", res.data.token);
                navigate("/home");
            } else {
                toast.error(res.data.error || 'Login failed', { position: "top-center" });
                navigate("/") 
           }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.error || 'Login failed', { position: "top-center" });

        }
    };

    return (
        <>
            <Navbar/>
            <section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Welcome Back, Log In</h1>
                        <p>Hi, we are glad you are back. Please login.</p>
                    </div>

                    <form>
                        <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                value={inpval.email} 
                                onChange={setVal} 
                                name="email" 
                                id="email" 
                                placeholder='Enter Your Email Address' 
                                required 
                            />
                        </div>
                        <div className="form_input">
                            <label htmlFor="password">Password</label>
                            <div className="two">
                                <input 
                                    type="password" 
                                    value={inpval.password} 
                                    onChange={setVal} 
                                    name="password" 
                                    id="password" 
                                    placeholder='Enter Your Password' 
                                    required 
                                />
                            </div>
                        </div>

                        <button className='btn' onClick={loginuser}>Login</button>
                        <p>Don't have an Account? <NavLink to="/register">Sign Up</NavLink> </p>
                    </form>
                    <ToastContainer />
                </div>
            </section>
        </>
    );
};

export default Login;
