import { useEffect } from "react";

import { Autocomplete } from '@mui/material';
import { Alert, Box, Button, Snackbar, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUserIdFromToken } from "../utils/jwtUtils" ; // Import the custom hook

import {
  addNugget,
  fetchNugget,
  modifiedNugget,
  changeStateTrue,
  changeStateFalse,
} from "../feature/nuroSlice";
import { ContactSupportOutlined } from "@mui/icons-material";

/**
 * Add component for adding and updating nuggets.
 */
export default function Home() {
  const dispatch = useDispatch();
  const { updateState, response } = useSelector((state) => state.nuggetKey);
  const [id, setId] = useState(""); // ID of the nugget for updating
  const [topic, setTopic] = useState(""); // Topic input value
  const [content, setContent] = useState(""); // Nugget content input value
  const [suggestions, setSuggestions] = useState([]); // Suggestions for Autocomplete
  const [value, setValue] = useState(null); // Autocomplete value
  const userId = useUserIdFromToken();

// Fetch nuggets a 
useEffect(() => {
  if (userId) {
    dispatch(fetchNugget(userId)); // Pass userId when dispatching fetchNugget action
  }
}, [userId, dispatch]);

  // Fetch nuggets and update the suggestions list
const fetchNuggets = async (userId) => {
  try {
    const action = await dispatch(fetchNugget(userId)); // Pass userId to fetchNugget
    const response = action.payload;
    if (Array.isArray(response)) {
      // Extract unique topic names from the nuggets
      const uniqueTopics = [...new Set(response.map((nugget) => nugget.topic))];
      setSuggestions(uniqueTopics);
    } else {
      console.error('Invalid response format:', response);
    }
  } catch (error) {
    console.error('Error fetching nuggets:', error);
  }
};

  // Handle input change in the Autocomplete component
  const handleInputChange = (event, inputValue) => {
    const filteredSuggestions = suggestions.filter((name) =>
      name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filteredSuggestions);

    if (!inputValue.trim()) {
      fetchNuggets(userId);
    }

    try {
      setTopic(inputValue); // Set the topic to the input value
    } catch (error) {
      console.error('Error handling input change:', error);
    }
  };

  // Handle click on the Add button
  // Setting values based on custom addition or pick from drop down
  const handleClick = (e) => {
    e.preventDefault();
    let newval = "";

    if(topic === '') {
      newval = value;    
    } else {
      newval = topic;
    }

    if (topic !== '' && content !== '') {
      dispatch(
        addNugget({
          name: newval,
          position: content,
          sessionUser: userId,
        })
      );
      handleClickSnackbar();
      setTopic("");
      setContent("");
    } else {
      alert('Please fill out both topic and nugget fields');
    }
    setValue('');
  };

  // Handle updating the form
  const updateForm = () => {
    dispatch(modifiedNugget({ id: id, name: topic, position: content }));
    dispatch(changeStateFalse());
    handleClickSnackbar();
    setId("");
    setTopic("");
    setContent("");
  };

  // Get the label for the Autocomplete options
  const getOptionLabel = (option) => {
    if (!option) {
      return '';
    }
    return option.toString();
  };

  // State for Snackbar
  const [open, setOpen] = useState(false);
  const handleClickSnackbar = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div class="content" >
    <div className="add">
      <h4>Add your topic of interest and study cues (nuggets) to your study arsenal! </h4>
      <p className="light">To get started, simply fill out the required fields below:</p>
      <Box
        sx={{
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flex: '1',
            border: '0px solid black',
            paddingTop:2
          }}
        >
          <Autocomplete
            value={value}
            onChange={(event, newValue) => setValue(newValue)}
            freeSolo
            options={suggestions || []}
            getOptionLabel={getOptionLabel}
            onInputChange={handleInputChange}
            renderInput={(params) => (
              <TextField {...params} label="Topic" variant="outlined" />
            )}
          />
        </Box>
        <Box
          sx={{
            flex: '1',
            border: '0px solid black',
          }}
        >
          <TextField
            sx={{ color: "white", width: "100%", paddingTop:1}}
            variant="outlined"
            size="large"
            placeholder="Nugget"
            rows={6} cols={10}
            multiline
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </Box>
        <Box
          sx={{
            flex: '1',
            border: '0px solid black',
            paddingTop:1
          }}
        >
          {updateState ? (
            <Button
              classname="btn"
              variant="contained"
              color="primary"
              size="small"
              onClick={(e) => {
                updateForm(e);
              }}
            >
              Update
            </Button>
          ) : (
            <Button
              variant="contained"
              class="btn"
              color="primary"
              size="small"
              onClick={(e) => {
                handleClick(e);
              }}
            >
              Add
            </Button>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 5,
          color: "red",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: "8px",
            }}
          >
          </Box>
        </Box>
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
            {response === "add"
              ? "nugget added successfully"
              : response === "delete"
                ? "nugget delete successfully"
                : response === "update"
                  ? "nugget update successfully"
                  : null}
          </Alert>
        </Snackbar>
      </Box>
    </div>
    </div>
  );
}
