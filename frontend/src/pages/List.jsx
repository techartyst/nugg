import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNugget,
  removeNugget,
  modifiedNugget,
  changeStateTrue,
  changeStateFalse,
} from "../feature/nuroSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { loading, nuggetList, error, updateState, response } = useSelector(
    (state) => state.nuggetKey
  );
  const [editedNugget, setEditedNugget] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(2);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNuggets, setFilteredNuggets] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);

  useEffect(() => {
    dispatch(fetchNugget());
  }, [dispatch]);

  useEffect(() => {
    setFilteredNuggets(
      nuggetList.filter((nugget) =>
        nugget.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setPage(1); // Reset page when filtering
  }, [nuggetList, searchTerm]);

  useEffect(() => {
    if (selectedHashtags.length > 0) {
      setFilteredNuggets(
        nuggetList.filter((nugget) =>
          selectedHashtags.includes(nugget.name)
        )
      );
    } else {
      setFilteredNuggets(
        nuggetList.filter((nugget) =>
          nugget.position.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setPage(1); // Reset page when filtering
  }, [selectedHashtags, nuggetList, searchTerm]);

  const updateNugget = (item) => {
    setEditedNugget(item);
    dispatch(changeStateTrue());
  };

  const saveNugget = () => {
    dispatch(
      modifiedNugget({
        id: editedNugget._id,
        name: editedNugget.name,
        position: editedNugget.position,
      })
    );
    dispatch(changeStateFalse());
    setEditedNugget(null);
    handleClickSnackbar();
  };

  const deleteNuggetItem = (id) => {
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

  const handleHashtagClick = (name) => {
    if (selectedHashtags.includes(name)) {
      setSelectedHashtags(selectedHashtags.filter(tag => tag !== name));
    } else {
      setSelectedHashtags([...selectedHashtags, name]);
    }
  };

  // Filter out duplicate names
  const uniqueNames = [...new Set(nuggetList.map(nugget => nugget.name))];

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredNuggets.length / rowsPerPage);

  // Calculate index of the first and last row based on pagination
  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredNuggets.slice(indexOfFirstRow, indexOfLastRow);

  // Generate page numbers for pagination with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Maximum number of pages to show in pagination
    const middlePage = Math.ceil(maxPagesToShow / 2);
    let startPage = Math.max(1, page - middlePage + 1);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else if (page <= middlePage) {
      endPage = maxPagesToShow;
    } else if (page > totalPages - middlePage) {
      startPage = totalPages - maxPagesToShow + 1;
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Filtered nuggets based on selected hashtags
  const filteredNuggetsByHashtags = selectedHashtags.length > 0
    ? filteredNuggets.filter(nugget => selectedHashtags.includes(nugget.name))
    : currentRows;

  return (
    <Box sx={{ mt: 5 }}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} md={8}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Box sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
            {uniqueNames.map((name) => (
              <Button
                key={name}
                variant={selectedHashtags.includes(name) ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleHashtagClick(name)}
                sx={{ margin: 1, backgroundColor: selectedHashtags.includes(name) ? "lightgray" : "transparent" }}
              >
                #{name}
              </Button>
            ))}
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 659 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#4b4d5c" }}>
                  <TableCell align="left">
                    <Typography sx={{ fontWeight: 600, color: "white" }}>
                      Nugget
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2}>Loading...</TableCell>
                  </TableRow>
                ) : filteredNuggetsByHashtags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2}>No Records</TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={2}>{error}</TableCell>
                  </TableRow>
                ) : (
                  filteredNuggetsByHashtags.map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="left">
                        {editedNugget && editedNugget._id === item._id ? (
                          <TextField
                            multiline
                            style={{
                              width: "100%",
                            }}
                            value={editedNugget.position}
                            onChange={(e) =>
                              setEditedNugget({
                                ...editedNugget,
                                position: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <Typography>
                            {item.position}
                            <br />
                            #{item.name}
                            <Box sx={{ display: "flex", cursor: "pointer" }}>
                              <Box
                                sx={{ color: "#707cd4", mr: 1 }}
                                onClick={() => updateNugget(item)}
                              >
                                <EditIcon />
                              </Box>
                              <Box
                                sx={{ color: "red" }}
                                onClick={() => deleteNuggetItem(item._id)}
                              >
                                <DeleteIcon />
                              </Box>
                            </Box>
                          </Typography>
                        )}
                        {editedNugget && editedNugget._id === item._id && (
                          <Button
                            variant="contained"
                            class="btn"
                            color="primary"
                            size="small"
                            onClick={saveNugget}
                          >
                            Save
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2} display="flex" justifyContent="center">
            {getPageNumbers().map((pageNumber, index) => (
              <Typography
                key={index}
                variant="button"
                component="button"
                onClick={() =>
                  typeof pageNumber === "number" && setPage(pageNumber)
                }
                sx={{
                  padding: "0 8px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                color={page === pageNumber ? "primary.main" : "inherit"}
              >
                {pageNumber}
              </Typography>
            ))}
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
          {response === "add"
            ? "Nugget added successfully"
            : response === "delete"
            ? "Nugget deleted successfully"
            : response === "update"
            ? "Nugget updated successfully"
            : null}
        </Alert>
      </Snackbar>
    </Box>
  );
}
