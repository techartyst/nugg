import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchNugget } from "../feature/nuroSlice";
import { useUserIdFromToken } from "../utils/jwtUtils";
import { renderTextWithLinks } from '../utils/renderLinks';

export default function Home() {
  const dispatch = useDispatch();
  const { loading, nuggetList, response } = useSelector((state) => state.nuggetKey);
  const [displaySingle, setDisplaySingle] = useState(true);
  const [singleNuggetIndex, setSingleNuggetIndex] = useState(null); // State to hold the index of the currently displayed single nugget
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const userId = useUserIdFromToken();

  useEffect(() => {
    if (userId) {
      dispatch(fetchNugget(userId));
    }
    
    // Initialize single nugget index with a random value on component mount
    if (displaySingle && nuggetList.length > 0 && singleNuggetIndex === null) {
      const randomIndex = Math.floor(Math.random() * nuggetList.length);
      setSingleNuggetIndex(randomIndex);
    }
  }, [userId, dispatch, displaySingle, nuggetList, singleNuggetIndex]);

  const handleToggleDisplayMode = (event, newDisplaySingle) => {
    if (newDisplaySingle) {
      // Select a random nugget index when switching to single view
      const randomIndex = Math.floor(Math.random() * nuggetList.length);
      setSingleNuggetIndex(randomIndex);
    }
    setDisplaySingle(newDisplaySingle);
  };

  const handleRefreshNugget = () => {
    // Select a new random nugget index
    const randomIndex = Math.floor(Math.random() * nuggetList.length);
    setSingleNuggetIndex(randomIndex);
  };

  return (
    <div className="content">
      <Box mt={5} display="flex" justifyContent="space-between" alignItems="center">
        <div className="full-width">
         
        </div>
        <ToggleButtonGroup
          value={displaySingle}
          exclusive
          onChange={handleToggleDisplayMode}
          aria-label="display mode"
        >
          <ToggleButton value={true} aria-label="single nugget"  style={{ height: "30px", paddingTop: "0", paddingBottom: "0", fontSize: "0.7rem" }}>
            Single
          </ToggleButton>
          <ToggleButton value={false} aria-label="all nuggets"  style={{ height: "30px", paddingTop: "0", paddingBottom: "0", fontSize: "0.7rem" }}>
            All
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <div> {/* Assuming "paper" is the class for the box */}
        <Box mt={2}>
        {loading ? (
            <Typography>Loading...</Typography>
          ) : nuggetList.length === 0 ? (
            <Typography>Uh oh! It seems like there are no nuggets here yet. Why not be the pioneer and <a href='/add'>add the very first nugget?</a> Go ahead, share your wisdom! </Typography>
          ) : displaySingle ? (
            singleNuggetIndex !== null && ( // Render only if singleNuggetIndex is not null
              <Box className="nugget-box paper" sx={{ mb: 2 }}>
                              <div className="papercontent">

                <Typography>{renderTextWithLinks(nuggetList[singleNuggetIndex].content)}</Typography>
                <Typography>#{nuggetList[singleNuggetIndex].topic}</Typography>
                { nuggetList[singleNuggetIndex].fileName1 && nuggetList[singleNuggetIndex].fileName1.trim() !== "" && (
  <div>
    <a
      href={`resources/${nuggetList[singleNuggetIndex].fileName1}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open document
    </a>
  </div>
)}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}> <Button onClick={handleRefreshNugget} sx={{ mt: 2 }}>
    
    Refresh
  </Button>
</div>
</div>
              </Box>
            )
            
          ) : (
            nuggetList.map((nugget, index) => (
              <Box key={index} className="nugget-box paper" sx={{ mb: 2 }}> {/* Assuming "paper" class adds paper styling */}
              <div className="papercontent">
                                <Typography>{renderTextWithLinks(nugget.content)}</Typography>
                <Typography>#{nugget.topic}</Typography>
                </div>
                { nugget.fileName1 && nugget.fileName1.trim() !== "" && (
  <div>
    <a
      href={`resources/${nugget.fileName1}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open document
    </a>
  </div>
)}
              </Box>
            ))
          )}
        
                </Box>
      </div>
    </div>
  );
}
