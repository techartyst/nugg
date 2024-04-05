import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useDispatch } from "react-redux";
import Button from '@mui/material/Button'; // Import Button component from Material-UI

function App() {
  const dispatch = useDispatch();
  const [nugget, setNugget] = useState(null);

  useEffect(() => {
    loadRandomItem();
  }, []);

  const loadRandomItem = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/items/random');
      setNugget(response.data);
    } catch (error) {
      console.error('Error fetching random item:', error);
    }
  };

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
    <div>
      <h1></h1>
      {nugget ? (
        <div className="rand">
          {/* Render nugget.position with links and line breaks */}
          <div>{renderTextWithLinks(nugget.position)}</div>
          <p>&nbsp;</p>
          <p>
            <Button 
              class='btn'
              onClick={loadRandomItem}
            >
              Try another
            </Button>
          </p>
          {/* Display other item details here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
