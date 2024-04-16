import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {renderTextWithLinks} from '../utils/renderLinks';

import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useUserIdFromToken } from "../utils/jwtUtils" ; 

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
  const [rowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredNuggets, setFilteredNuggets] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const userId = useUserIdFromToken();

  useEffect(() => {
    if (userId) {
      dispatch(fetchNugget(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    setFilteredNuggets(
      nuggetList.filter((nugget) =>
        nugget.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setPage(1);
  }, [nuggetList, searchTerm]);

  useEffect(() => {
    if (selectedHashtags.length > 0) {
      setFilteredNuggets(
        nuggetList.filter((nugget) =>
          selectedHashtags.includes(nugget.topic)
        )
      );
    } else {
      setFilteredNuggets(
        nuggetList.filter((nugget) =>
          nugget.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setPage(1);
  }, [selectedHashtags, nuggetList, searchTerm]);

  const updateNugget = (item) => {
    setEditedNugget(item);
    dispatch(changeStateTrue());
  };

  const saveNugget = () => {
    dispatch(
      modifiedNugget({
        id: editedNugget._id,
        name: editedNugget.topic,
        position: editedNugget.content,
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

  const uniqueNames = [...new Set(nuggetList.map(nugget => nugget.topic))];

  const totalPages = Math.ceil(filteredNuggets.length / rowsPerPage);

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredNuggets.slice(indexOfFirstRow, indexOfLastRow);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
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

  const filteredNuggetsByHashtags = selectedHashtags.length > 0
    ? filteredNuggets.filter(nugget => selectedHashtags.includes(nugget.topic))
    : currentRows;

  return (
    <div className="content">
      <p>Nuggs streamline your study review process! Easily search, filter, and customize your nuggs for efficient revision.</p>
      <div>
        <Box mt={2}>
          <div className="full-width">
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%",marginBottom: "1" }}
            />
          </div>
          <div className="full-width" >
            <Box className="hash" style={{ overflowY: "auto", whiteSpace: "nowrap"}}>
              {uniqueNames.map((name) => (
                <Button
                  key={name}
                  variant={selectedHashtags.includes(name) ? "contained" : "outlined"}
                  onClick={() => handleHashtagClick(name)}
                  style={{ 
                    margin: 1, 
                    backgroundColor: selectedHashtags.includes(name) ? "black" : "transparent", 
                    height: "30px",
                    fontSize: "0.9rem", 
                    color: selectedHashtags.includes(name) ? "white" : "#333", // Change font color to white when selected
                    borderColor:"#999" 
                  }}                >
                  #{name}
                </Button>
              ))}
            </Box>
          </div>
          <div className="full-width">
            <Box  component={Paper}>
              {loading ? (
                <Box>Loading...</Box>
              ) : filteredNuggetsByHashtags.length === 0 ? (
                <Box>No Records</Box>
              ) : error ? (
                <Box>{error}</Box>
              ) : (
                filteredNuggetsByHashtags.map((item, index) => (
                  <Box 
                    key={index}
                    style={{
                      "&:last-child": { border: 0 },
                    }}
                  >
                    {editedNugget && editedNugget._id === item._id ? (
                      <TextField
                        multiline
                        style={{
                          width: "100%",
                        }}
                        value= {editedNugget.content}
                        onChange={(e) =>
                          setEditedNugget({
                            ...editedNugget,
                            content: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="paper" >
                        {renderTextWithLinks(item.content)}
                        <br />
                        #{item.topic}
                        <Box   style={{ display: "flex", cursor: "pointer" }}>
                          <Box
                            style={{ color: "#E0E0E0", marginRight: 1 }}
                            onClick={() => updateNugget(item)}
                          >
                            <EditIcon />
                          </Box>
                          <Box
                            style={{ color: "#E0E0E0" }}
                            onClick={() => deleteNuggetItem(item._id)}
                          >
                            <DeleteIcon />
                          </Box>
                        </Box>
                      </div>
                    )}
                    {editedNugget && editedNugget._id === item._id && (
                      <Button
                        variant="contained"
                        className="btn"
                        color="primary"
                        size="small"
                        onClick={saveNugget}
                      >
                        Save
                      </Button>
                    )}
                  </Box> 
                ))
              )}
            </Box>
            
          </div>
          <div className="full-width">
            <Box mt={2} style={{ display: "flex", justifyContent: "center" }}>
              {getPageNumbers().map((pageNumber, index) => (
                <span
                  key={index}
                  onClick={() =>
                    typeof pageNumber === "number" && setPage(pageNumber)
                  }
                  style={{
                    padding: "0 8px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    color: page === pageNumber ? "primary.main" : "inherit"
                  }}
                >
                  {pageNumber}
                </span>
              ))}
            </Box>
          </div>
          <div className="full-width">
            <Snackbar
              open={open}
              autoHideDuration={5000}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Alert onClose={handleClose} severity="info" style={{ width: "100%" }}>
                {response === "add"
                  ? "Nugget added successfully"
                  : response === "delete"
                  ? "Nugget deleted successfully"
                  : response === "update"
                  ? "Nugget updated successfully"
                  : null}
              </Alert>
            </Snackbar>
          </div>
        </Box>
      </div>
    </div>
  );
}
