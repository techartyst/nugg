import { Autocomplete } from '@mui/material';

import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,

} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNugget,
  fetchNugget,
  modifiedNugget,
  changeStateTrue,
  changeStateFalse,
} from "../feature/nuroSlice";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const { updateState, response } = useSelector(
    (state) => state.nuggetKey
  );
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [value, setValue] = useState(null); // Change initial state to null

  const fetchNuggets = async () => {
    try {
      const action = await dispatch(fetchNugget());
      const response = action.payload;
      if (Array.isArray(response)) {
        const uniqueNames = [...new Set(response.map((nugget) => nugget.name))];
        setSuggestions(uniqueNames);
      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error fetching nuggets:', error);
    }
  };


  useEffect(() => {
    dispatch(fetchNugget());
  }, [dispatch]);

  const handleInputChange = (event, inputValue) => {
    const filteredSuggestions = suggestions.filter((name) =>
      name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestions(filteredSuggestions);

    if (!inputValue.trim()) {
      fetchNuggets();
    }

    try {
      setName(event.target.value);

    } catch (error) {

    }
  };


  const handleClick = (e) => {
    e.preventDefault();
    let newval = "";

console.log(value);
if(name == '')
  {
    console.log("name not set yet");
    newval = value;    
  }else{
    newval = name;
  }
  
console.log(newval);

// Check if both topic and nugget fields are filled

    if (name !== '' && position !== '') {
      dispatch(
        addNugget({
  
          name: newval,
          position: position,
        })
      );
      handleClickSnackbar();
      setName("");
      setPosition("");
    } else {
      alert('Please fill out both topic and nugget fields');
    }
    setValue('');

  };

  const updateForm = () => {
    dispatch(modifiedNugget({ id: id, name: name, position: position }));
    dispatch(changeStateFalse());
    handleClickSnackbar();
    setId("");
    setName("");
    setPosition("");
  };

  const getOptionLabel = (option) => {
    // Handle case when option is null or undefined
    if (!option) {
      return ''; // Provide a default label for null or undefined value
    }
    return option.toString(); // Convert the option to a string
  };

  const [open, setOpen] = useState(false);
  const handleClickSnackbar = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (

    <div className="add">
      {/* First box */}
      <p className="light">Add your topic of interest and study cues (nuggets) to your study arsenal! To get started, simply fill out the required fields below:</p>
      <Box
        sx={{
          margin: '0 auto', // Center the box horizontally
          display: 'flex', // Use flexbox layout
          flexDirection: 'column', // Arrange children in a column
          //height: '100vh', // Set height to 100% of viewport height
        }}
      >

        {/* First row */}
        <Box
          sx={{
            flex: '1', // Take up remaining vertical space
            border: '0px solid black', // Example border for visualization
            paddingTop:2
          }}
        >

<Autocomplete
      value={value} // Update value to accept only one value
      onChange={(event, newValue) => setValue(newValue)}
      freeSolo
      options={suggestions || []}
      getOptionLabel={getOptionLabel} // Provide getOptionLabel method
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField {...params} label="Topic" variant="outlined" />
      )}
    />
    
        </Box>

        {/* Second row */}
        <Box
          sx={{
            flex: '1', // Take up remaining vertical space
            border: '0px solid black', // Example border for visualization

          }}
        >
          <TextField
            sx={{ color: "white", width: "100%", paddingTop:1}}

            variant="outlined"
            size="large"
            placeholder="Nugget"
            rows={6} cols={10}
            multiline
            value={position}
            onChange={(e) => {
              setPosition(e.target.value);
            }}
          />      </Box>
        {/* Third row */}
        <Box
          sx={{
            flex: '1', // Take up remaining vertical space
            border: '0px solid black', // Example border for visualization
            paddingTop:1          }}
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
          )}      </Box>
      </Box>

      {/* First box ends here */}

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
  );
}