import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  registerUser
} from "../feature/nuroSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    isRegistered: false // Flag to track registration status
  });

  const { username, password, fullname, isRegistered } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(username)) {
      alert('Please enter a valid email address');
      return;
    }

    dispatch(registerUser({ username, password,fullname }));

    // Update registration status
    setFormData({ ...formData, isRegistered: true });
  };

  return (
    <div className="container">
      <div className="login-box">
        {isRegistered ? (
          <div>
            <h2>Welcome! We're here to create your study cues effortless. Let's succeed together! </h2>
            <p>Click <a href="/Login">here</a> to sign in.</p>
          </div>
        ) : (
          <>
            <h2>Create an account</h2>
            <form onSubmit={e => onSubmit(e)}>
              <div className="register-message">
                <p>If you have an account, <a href="/login">sign in</a> here.</p>
              </div>
              <div>
                <input
                  type='text'
                  className="textbox" 
                  placeholder='Fullname'
                  name='fullname'
                  value={fullname}
                  onChange={e => onChange(e)}
                  required
                />
              </div>
              <div>
                <input
                  type='text'
                  className="textbox" 
                  placeholder='Email address'
                  name='username'
                  value={username}
                  onChange={e => onChange(e)}
                  required
                />
              </div>
              <div>
                <input
                  type='password'
                  name='password'
                  placeholder='Password'
                  className="textbox" 
                  value={password}
                  onChange={e => onChange(e)}
                  minLength='6'
                  required
                />
              </div>
              <button type='submit' className="btn">Register</button>
            </form>
            <div className="register-message">
              <p>By signing up, I agree to the <a href="#">terms and conditions</a>.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
