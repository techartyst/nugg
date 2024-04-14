import React from 'react';
import { getUserFromToken } from "../utils/jwtUtils";

function App() {
  const userfullname = getUserFromToken();

  return (
    <div class="hcontainer">
      <h2>Simplify your learning journey.</h2>
      <p>
        <img class="landing-image" src="../src/assets/nuro-landing.png" alt="Landing Image"/>
      </p>
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
