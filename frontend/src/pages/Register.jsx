import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from "../feature/nuroSlice";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    isRegistered: false // Flag to track registration status
  });
  const [error, setError] = useState(null); // State to hold error message

  const { username, password, fullname, isRegistered } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    

    try {
      const response = await dispatch(registerUser({ username, password, fullname }));
      console.log("Response:", response);
  
      if (response && response.payload !== undefined) {
          if (response.payload === "User exists") {
              setFormData({ ...formData, isRegistered: false, username: '', password: '' });
              document.getElementById('errorMessage').style.display = 'block';

          } else {
              setFormData({ ...formData, isRegistered: true });
          }
      } else {
          console.error("Invalid response format");
      }
  } catch (error) {
      // If the error is from Axios
      if (error.isAxiosError) {
          console.error("Axios error:", error.message);
          console.error("Request configuration:", error.config);
          console.error("Status code:", error.response.status);
          console.error("Response message:", error.response.data.message);
          // Handle the Axios error
      } else {
          // If something else went wrong
          console.error("Error:", error.message);
      }
  }
  
  
  
};

  return (
    <div>

<div className='logo'>nugg</div>

    <div className="container">
      &nbsp;
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
                <p>If you have an account, <a href="/Login">sign in</a> here.</p>
              </div>
              {error && <div style={{ color: 'red', paddingBottom: 10 }}>{error}</div>}
              <div id="errorMessage" style={{ color: 'red', display: 'none', paddingBottom: 10 }}>Email already in use. Please try another.</div>

              <div>
                <input
                  type='text'
                  className="textbox" 
                  placeholder='Fullname'
                  name='fullname'
                  value={fullname}
                  minLength='4'
                  onChange={e => onChange(e)}
                  required
                />
              </div>
              <div>
                <input
                  type='email'
                  className="textbox" 
                  placeholder='Email address'
                  name='username'
                  value={username}
                  onChange={e => onChange(e)}
                  required
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" // Specify email pattern for additional validation
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
                  minLength='8'
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
    </div>

  );
};

export default RegisterPage;
