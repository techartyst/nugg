import React from 'react';
import { getUserFromToken } from "../utils/jwtUtils";
import imgUrl from "../assets/nuro-landing.png";

function App() {
  const userfullname = getUserFromToken();

  return (
    <div class="hcontainer">
      <h2>Simplify your learning journey.</h2>
      <p>
        <img class="landing-image" src={imgUrl} alt="Landing Image"/>
      </p>
      <p>nugg is a simple app designed to help you capture and revise concise study notes effortlessly.</p>
      <br></br>
      {(!userfullname || userfullname.trim() === '') ? (
        <div>
          <p>
            <a href="/Login" class="btn-signup">Sign In</a>
          </p>
          <p class="register-text">If you are not a user, <a href="/Register" class="register-link">register here</a>.</p>
        </div>
      ) : (
        <p>Hello, {userfullname}! Keep on with your <a href='/home'>learning journey</a> </p>
      )}
    </div>
  );
}

export default App;
