import React from 'react';
import { Box, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';



import Home from "./pages/Home";
import List from "./pages/List";
import About from "./pages/About";
import Add from "./pages/Add";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./Navbar";

// Function to check if user is authenticated
const isAuthenticated = () => {
  // Check if token is present in localStorage
  return sessionStorage.getItem('nuroapp') !== null;
};



// Protected component to conditionally render protected routes
const Protected = ({ element, ...rest }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/login" replace />
  );
};



const App = () => {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Typography variant="h4">
          nuro
        </Typography>
      </Box>
        <Router>
        <Navbar />

        <div>
          <Routes>
            <Route path="/" element={<Protected element={<Home />} />} />
            <Route path="/list" element={<Protected element={<List />} />} />
            <Route path="/add" element={<Protected element={<Add />} />} />
            <Route path="/about" element={<Protected element={<About />} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        </Router>

     
      <footer>
        <center>
          <h3>nuro</h3>
          <p>Capture concise study cues effortlessly.</p>
          <p>&nbsp;</p>
          <p className="light">Nuro is free to use. If you'd like, feel free to support us with a coffee! <a href=".">Donate</a></p>
          <p className="light">&copy; Nuro. All rights reserved.</p>
        </center>
      </footer>
    </Box>
  );
};

export default App;
