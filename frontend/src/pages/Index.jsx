import React from 'react';

function App() {
  return (
    <div className="indx-container">
      <h1>NURO</h1>
      <p>Capture Study Cues Effortlessly</p>
      <div className="indx-image-container">
        <img src="nuro-logo.png" alt="NURO Logo" />
      </div>
      <a href="login" className="indx-link">Login</a>
      <a href="register" className="indx-link">Register</a>
      <div className="indx-icon-container">
        <div className="indx-icon">
          <img src="mind-icon.png" alt="Mind Icon" />
          <p>Built for the Mind</p>
        </div>
        <div className="indx-icon">
          <img src="brain-icon.png" alt="Brain Icon" />
          <p>Built for the Brain</p>
        </div>
        <div className="indx-icon">
          <img src="heart-icon.png" alt="Heart Icon" />
          <p>Built for the Heart</p>
        </div>
      </div>
    </div>
  );
}

export default App;
