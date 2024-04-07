import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import Material-UI components
import Button from '@mui/material/Button';

// Import custom hook for getting userId from token
import { useUserIdFromToken } from "../utils/jwtUtils";

function App() {
  const [nugget, setNugget] = useState(null);
  const userId = useUserIdFromToken(); // Get userId using custom hook

  useEffect(() => {
    if (userId) {
      fetchRandomNugget(userId); // Fetch random nugget when userId changes
    }
  }, [userId]);

  const fetchRandomNugget = (userId) => {
    axios.get(`http://localhost:8000/api/items/random/${userId}`)
      .then(response => {
        setNugget(response.data.response);
      })
      .catch(error => {
        console.error('Error fetching nugget:', error);
      });
  };

  const handleRefreshNugget = () => {
    fetchRandomNugget(userId); // Fetch new random nugget
  };

  // Function to render text with links
  const renderTextWithLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>
        );
      } else {
        return part.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ));
      }
    });
  };

  return (
    
    <div class="content">
      <h1></h1>
      {nugget ? (
        <div className="rand">
          {/* Render nugget content with links */}
          <div>{renderTextWithLinks(nugget.content)}</div>
          <p>&nbsp;</p>
          <p>
            <Button 
              class='btn'
              onClick={handleRefreshNugget} // Call handleRefreshNugget when button is clicked
            >
              Try another
            </Button>
          </p>
        </div>
      ) : (
        <p><center><br></br><br></br>No nuggets yet!</center>></p>
      )}
    </div>
  );
}

export default App;
