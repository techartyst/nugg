// Login.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    loginUser
} from "../feature/nuroSlice";
import { BoyTwoTone } from '@mui/icons-material';

const Login = () => {
    const navigateTo = useNavigate();

    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        try {

            console.log("entered");
            const response = await dispatch(loginUser({ username, password }));

            // Assuming your login API returns a JWT token in response.data.token
            //console.log(response.data.token);
            // Store the token in localStorage or sessionStorage

            if (response.type !== "auth/login/rejected") {
                const token = response.payload.token;
                sessionStorage.setItem('nuroapp', token); // You can also use sessionStorage if you want the token to be cleared when the browser is closed
                // If login successful, redirect to dashboard or do something else
                navigateTo("/home");
                console.log('Login successful');
            }else{
                console.log('Login unsuccessful');
                document.getElementById('errorMessage').style.display = 'block';
            }

        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div>
<div className='logo'>nugg</div>


        <div class="container">
        &nbsp;

  <div class="login-box">
            <h2>Sign in to your account</h2>
            <div id="errorMessage" style={{ color: 'red', display: 'none', paddingBottom: 10 }}>Signin failed! Please check your credentials.</div>

            <form onSubmit={e => onSubmit(e)}>
                <input
                    type='email'
                    placeholder='Email address'
                    name='username'
                    className='textbox'
                    value={username}
                    onChange={e => onChange(e)}
                    required
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" // Specify email pattern for additional validation

                />
                <input
                    type='password'
                    placeholder='Password'
                    className='textbox'

                    name='password'
                    value={password}
                    onChange={e => onChange(e)}
                    required
                />
                <button className='btn' type='submit'>Login</button>
            </form>
            <div class="register-message">
      <p>If you are not a user, <a href="/Register">register</a> here.</p>
    </div>
    <a href="#" class="forgot-password">Forgot Password?</a>
            </div>
</div>
</div>

    );
};

export default Login;
