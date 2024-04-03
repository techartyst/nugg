import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNugget,
  fetchNugget,
  removeNugget,
  modifiedNugget,
  changeStateTrue,
  changeStateFalse,
} from "../feature/nuroSlice";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const { loading, nuggetList, error, updateState, response } = useSelector(
    (state) => state.nuggetKey
  );
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    dispatch(fetchNugget());
  }, [dispatch]);

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(
      addNugget({
        name: name,
        position: position,
      })
    );
    handleClickSnackbar();
    setName("");
    setPosition("");
  };

  const updateNugget = (item) => {
    setId(item._id);
    setName(item.name);
    setPosition(item.position);
    dispatch(changeStateTrue());
  };

  const updateForm = () => {
    dispatch(modifiedNugget({ id: id, name: name, position: position }));
    dispatch(changeStateFalse());
    handleClickSnackbar();
    setId("");
    setName("");
    setPosition("");
  };

  const deleteNugget = (id) => {
    dispatch(removeNugget(id));
    handleClickSnackbar();
  };

  const [open, setOpen] = useState(false);
  const handleClickSnackbar = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (

    <div class="add">
      {/* First box */}
      <p class="light">Add your topic of interest and study cues (nuggets) to your study arsenal! To get started, simply fill out the required fields below:</p>
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
            width: '100vh', // Set width to 95% of the screen

          }}
        >

          <TextField
            sx={{ color: "white", padding: 1 }}
            variant="outlined"
            size="large"
            placeholder="Topic"
            autoComplete="on"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
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
            sx={{ color: "white", width: "99%", padding: 1 }}

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
            padding: 1
          }}
        >
          {updateState ? (
            <Button
              classname="custom-button"
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



            <box>

            </box>

          </Box>
          <TableContainer component={Paper} sx={{ marginTop: "16px" }}>
            <Table sx={{ minWidth: 659 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#4b4d5c" }}>
                  <TableCell align="left">
                    <Typography sx={{ fontWeight: 600, color: "white" }}>
                      No
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontWeight: 600, color: "white" }}>
                      Nugget
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography sx={{ fontWeight: 600, color: "white" }}>
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? <TableCell> Loading... </TableCell> : null}
                {!loading && nuggetList.length == 0 ? (
                  <TableCell> No Records </TableCell>
                ) : null}
                {!loading && error ? <TableCell> {error} </TableCell> : null}
                {nuggetList &&
                  nuggetList.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="left">
                        <Typography> {index + 1} </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography> {item.position} <br />#{item.name} </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Box sx={{ display: "flex", cursor: "pointer" }}>
                          <Box
                            sx={{ color: "#707cd4", mr: 1 }}
                            onClick={() => updateNugget(item)}
                          >
                            <EditIcon />
                          </Box>
                          <Box
                            sx={{ color: "red" }}
                            onClick={() => deleteNugget(item._id)}
                          >
                            <DeleteIcon />
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
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