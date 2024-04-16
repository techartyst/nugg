import { useEffect } from "react";
import axios from 'axios';

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
  const [fileurl, setFile] = useState(null); // Uploaded file
  const [firstFocus, setFirstFocus] = useState(false);

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
    // Filter suggestions based on the input value
    const filteredSuggestions = suggestions.filter((name) =>
        name.toLowerCase().includes(inputValue.toLowerCase())
    );
    // Update the suggestions state
    setSuggestions(filteredSuggestions);

    // If the input value is empty or contains only whitespace characters
    fetchNuggets(userId);


    try {
        // Set the topic to the input value
        setTopic(inputValue);
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
          position: content.replace(/^\s+|\s+$/g, '').replace(/^(?:\r\n|\r|\n)+|(?:\r\n|\r|\n)+$/g, ''),
          sessionUser: userId,
          fileName1: fileurl,
        })
      );
      handleClickSnackbar();
      setTopic("");
      setContent("");
      setFile("");
      setSelectedFile(null); // Clear selected file
      setUploadMessage(null); // Clear upload message
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

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:8000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setFile(response.data.url);
        // Display success message
        setUploadMessage(`File uploaded successfully. URL: ${response.data.url}`);
      } catch (error) {
        // Display error message in red
        if (error.response) {
          setUploadMessage(<span style={{ color: 'red' }}>Upload failed: {error.response.data}</span>);
        } else {
          setUploadMessage(<span style={{ color: 'red' }}>Upload failed: Network Error</span>);
          console.error(error);
        }
      }
    }
  };


  // State for Snackbar
  const [open, setOpen] = useState(false);
  const handleClickSnackbar = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleFocus = () => {
    if (!firstFocus) {
        // Trigger handleInputChange only on the first focus
        handleInputChange(value);
        setFirstFocus(true);
    }
};

  
  return (
    <div class="content" >
    <div className="add">
      <p>Expand your repository of knowledge with a fresh addition – introduce a new nugget of information and topic to explore!</p>
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
            onFocus={handleFocus}


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
            placeholder="Nugg"
            rows={10} cols={10}
            multiline
            
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </Box>
        <Box>
  <div class="fileupl">
    <p>Attach a file (accepted formats: PDF, JPG, PNG, GIF; max size: 5MB) by clicking 'Choose File'."
</p>
<p>&nbsp;</p>
    <input
      type="file"
      accept="image/jpeg, image/png, image/gif, application/pdf"
      onChange={handleFileChange}
    />
    {selectedFile ? (
      <div style={{ marginTop: '8px' }}>{selectedFile.name}</div>
    ) : (
      <div style={{ marginTop: '8px' }}></div>
    )}
    {uploadMessage && <div style={{ marginTop: '8px' }}>{uploadMessage}</div>}
  </div>
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
