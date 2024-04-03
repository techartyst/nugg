import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchRandomNugget } from '../feature/nuroSlice';
import { useDispatch, useSelector } from "react-redux";
import Button from '@mui/material/Button'; // Import Button component from Material-UI

function App() {
  const dispatch = useDispatch();
  const [nugget, setTopic] = useState(null);

  const handleClick = (e) => {
    loadRandomItem();
   // handleClickSnackbar();    
  };

  useEffect(() => {
    loadRandomItem();

  }, []);

  function loadRandomItem(){
    const fetchRandomItem = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/items/random');
        setTopic(response.data);

      } catch (error) {
        console.error('Error fetching random item:', error);
      }
    };

    fetchRandomItem();
  }
  
  return (
    <div>
      <h1></h1>
      {nugget ? (
        <div class="rand">
          <p>{nugget.position}</p>
          <p>&nbsp;</p>
          <p><Button style={{ backgroundColor: "blue" }} variant="contained" color="primary" onClick={(e) => {
                handleClick(e);
              }}>
                Try another
            </Button></p>
          {/* Display other item details here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
