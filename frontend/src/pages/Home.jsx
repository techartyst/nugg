import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useUserIdFromToken } from "../utils/jwtUtils";
import {renderTextWithLinks} from '../utils/renderLinks';


function App() {
  const [nuggets, setNuggets] = useState([]);
  const [displaySingle, setDisplaySingle] = useState(true); // State to toggle between single and multiple display
  const userId = useUserIdFromToken();

  useEffect(() => {
    if (userId) {
      if (displaySingle) {
        fetchRandomNugget(userId);
      } else {
        fetchRandomNuggets(userId);
      }
    }
  }, [userId, displaySingle]);

  const fetchRandomNugget = (userId) => {
    axios.get(`http://localhost:8000/api/items/random/${userId}`)
      .then(response => {
        setNuggets([response.data.response]);
      })
      .catch(error => {
        console.error('Error fetching nugget:', error);
      });
  };

  const fetchRandomNuggets = (userId) => {
    axios.get(`http://localhost:8000/api/items/${userId}`)
      .then(response => {
        const randomizedNuggets = response.data.response.sort(() => Math.random() - 0.5);
        setNuggets(randomizedNuggets);
      })
      .catch(error => {
        console.error('Error fetching nuggets:', error);
      });
  };

  const handleRefreshNuggets = () => {
    if (displaySingle) {
      fetchRandomNugget(userId);
    } else {
      fetchRandomNuggets(userId);
    }
  };

  const toggleDisplayMode = () => {
    setDisplaySingle(!displaySingle);
  };

  
  return (
    <div className="content">
      <div class="toggle">
        <ToggleButtonGroup
          value={displaySingle}
          exclusive
          onChange={toggleDisplayMode}
        >
          <ToggleButton value={true} style={{height: "30px",paddingTop:"0",paddingBottom:"0",fontSize: "0.7rem" }}>
            Single
          </ToggleButton>
          <ToggleButton value={false} style={{height: "30px",paddingTop:"0",paddingBottom:"0",fontSize: "0.7rem" }}>
            Multiple
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div>
        {nuggets.length > 0 ? (
          <div>
            {nuggets.map((nugget, index) => (
              <div className="paper" key={index}>

                <div class="papercontent">
                <p>
                <i class="fa fa-lightbulb-o" aria-hidden="true"></i>
                &nbsp;&nbsp;<strong>{nugget.topic} nugget</strong></p>

                  <p>{renderTextWithLinks(nugget.content)}</p></div>
                  {nugget.fileName1 !== "" && (
  <div>
    <a href={`resources${nugget.fileName1}`}  target="_blank" rel="noopener noreferrer">Open file</a>
  </div>
)}
              </div>
            ))}

          </div>
        ) : (
          <p><center><br /><br />No nuggets yet!</center></p>
        )}
      </div>
      <div style={{ textAlign: "right", marginTop: "1rem" }}>

        <Button onClick={handleRefreshNuggets}  style={{height: "30px",paddingTop:"0",paddingBottom:"0",fontSize: "0.8rem", color:"#333" }}>
        <i class="fa fa-random" aria-hidden="true"></i>&nbsp; Try another
        </Button>
        </div>

    </div>
  );
}

export default App;
