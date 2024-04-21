import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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
  const [singleNuggetIndex, setSingleNuggetIndex] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const userId = useUserIdFromToken();
  const [selectedTopics, setSelectedTopics] = useState([]); // State to hold selected topics

  useEffect(() => {
    if (userId) {
      dispatch(fetchNugget(userId));
    }

    if (displaySingle && nuggetList.length > 0 && singleNuggetIndex === null) {
      const randomIndex = Math.floor(Math.random() * nuggetList.length);
      setSingleNuggetIndex(randomIndex);
    }
  }, [userId, dispatch, displaySingle, nuggetList, singleNuggetIndex]);

  const sortedNuggetList = [...nuggetList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleToggleDisplayMode = (event, newDisplaySingle) => {
    setDisplaySingle(newDisplaySingle);
  };

  const handleTopicSelection = (event) => {
    setSelectedTopics(event.target.value);
  };

  const handleRefreshNugget = () => {
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
<div className="full-width">Nuggs of wisdom!</div>       <div classname="selectTopic">
       
       </div>
        <ToggleButtonGroup
          value={displaySingle}
          exclusive
          onChange={handleToggleDisplayMode}
          aria-label="display mode"
        >
          <div>
{!displaySingle && (
          <Select
            multiple
            value={selectedTopics}
            style={{ backgroundColor: '#ddd',  fontSize: '0.8rem', padding:'0', height:'30px' }}

            onChange={handleTopicSelection}
            displayEmpty
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <em>Topic(s)</em>;
              }
              return selected.join(", ");
            }}
          >
            <MenuItem value="All" key="all">
              All Topics
            </MenuItem>
            <MenuItem disabled>Select topic(s)</MenuItem>
            {Array.from(new Set(nuggetList.map((nugget) => nugget.topic))).map((topic) => (
              <MenuItem key={topic} value={topic}>
                {topic}
              </MenuItem>
            ))}
          </Select>
        )}

          </div>
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
            Random
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
            singleNuggetIndex !== null && (
              <Box  className="nugget-box paper" sx={{ mb: 2 }}>
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
            selectedTopics.length === 0 || selectedTopics.includes("All") ? (
              sortedNuggetList.map((nugget) => (
                <Box key={nugget.id} className="nugget-box paper" sx={{ mb: 2 }}>
                  <div className="papercontent">
                    <Typography>{renderTextWithLinks(nugget.content)}</Typography>
                    <div className="topicHome">
                      <i class="fa fa-bookmark" aria-hidden="true"></i>
                      <Typography>{nugget.topic}</Typography>&nbsp;&nbsp;&nbsp;&nbsp;
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
            ) : (
              sortedNuggetList
                .filter((nugget) => selectedTopics.includes(nugget.topic))
                .map((nugget) => (
                  <Box key={nugget.id} className="nugget-box paper" sx={{ mb: 2 }}>
                    <div className="papercontent">
                      <Typography>{renderTextWithLinks(nugget.content)}</Typography>
                      <div className="topicHome">
                        <i class="fa fa-bookmark" aria-hidden="true"></i>
                        <Typography>{nugget.topic}</Typography>&nbsp;&nbsp;&nbsp;&nbsp;
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
            )
          )}
        </Box>
      </div>
    </div>
  );
}
