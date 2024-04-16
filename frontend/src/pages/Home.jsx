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
import { renderTextWithLinks } from "../utils/renderLinks";

export default function Home() {
  const dispatch = useDispatch();
  const { loading, nuggetList, response } = useSelector(
    (state) => state.nuggetKey
  );
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
      <Box
        mt={0}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <div className="full-width">Find wisdom in every nugg!</div>
        <ToggleButtonGroup
          value={displaySingle}
          exclusive
          onChange={handleToggleDisplayMode}
          aria-label="display mode"
        >
          <ToggleButton
            value={true}
            aria-label="single nugget"
            style={{
              height: "30px",
              paddingTop: "0",
              paddingBottom: "0",
              fontSize: "0.7rem",
            }}
          >
            Single
          </ToggleButton>
          <ToggleButton
            value={false}
            aria-label="all nuggets"
            style={{
              height: "30px",
              paddingTop: "0",
              paddingBottom: "0",
              fontSize: "0.7rem",
            }}
          >
            All
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <div>
        <Box mt={0}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : nuggetList.length === 0 ? (
            <Typography style={{ marginTop: "10px" }}>
              Uh oh! It seems like there are no nuggs here yet. Why not{" "}
              <a href="/add">add your very first nugget?</a> Go ahead, share
              your wisdom!{" "}
            </Typography>
          ) : displaySingle ? (
            singleNuggetIndex !== null && ( // Render only if singleNuggetIndex is not null
              <Box className="nugget-box paper" sx={{ mb: 2 }}>
                <div className="papercontent">
                  
                  <Typography>
                    {renderTextWithLinks(nuggetList[singleNuggetIndex].content)}
                  </Typography>
                  <div className="topicHome">
                    <i class="fa fa-bookmark" aria-hidden="true"></i>

                    <Typography>
                      {nuggetList[singleNuggetIndex].topic}
                    </Typography>&nbsp;&nbsp;&nbsp;&nbsp;
                    {nuggetList[singleNuggetIndex].fileName1 &&
                    nuggetList[singleNuggetIndex].fileName1.trim() !== "" && (
                      <div>
                        <a
                          href={`resources/${nuggetList[singleNuggetIndex].fileName1}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
<i class="fa fa-external-link" aria-hidden="true"></i>
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      class="refresh"
                      onClick={handleRefreshNugget}
                      sx={{ mt: 2 }}
                      title="Refresh for a random nugg"
                    >
                      <i class="fa fa-refresh" aria-hidden="true"></i>
                    </Button>
                  </div>
                </div>
              </Box>
            )
          ) : (
            nuggetList.map((nugget, index) => (
              <Box key={index} className="nugget-box paper" sx={{ mb: 2 }}>
                {" "}
                {/* Assuming "paper" class adds paper styling */}
                <div className="papercontent">
                  
                  <Typography>{renderTextWithLinks(nugget.content)}</Typography>
                  <div className="topicHome">
                    <i class="fa fa-bookmark" aria-hidden="true"></i>

                    <Typography>
                      {nugget.topic}
                    </Typography> &nbsp;&nbsp;&nbsp;&nbsp;
                    {nugget.fileName1 && nugget.fileName1.trim() !== "" && (
                  <div>
                    <a
                      href={`resources/${nugget.fileName1}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open attachment"
                    >
<i class="fa fa-external-link" aria-hidden="true"></i>
                      </a>
                  </div>
                )}
                  </div>
                </div>
                
              </Box>
            ))
          )}
        </Box>
      </div>
    </div>
  );
}
