import React from 'react';
import { Box, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';



import Home from "./pages/Home";
import List from "./pages/List";
import About from "./pages/About";
import Add from "./pages/Add";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Index from "./pages/index";

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

// Navbar component
const NavbarWrapper = () => {
  const location = useLocation();

  // Function to determine if Navbar should be displayed based on current route
  const showNavbar = () => {
    const { pathname } = location;
    return !['/login', '/index' , '/register'].includes(pathname);
  };

  return showNavbar() ? <Navbar /> : null;
};


const App = () => {

 
   return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        
      </Box>
        <Router>
        <NavbarWrapper />
        <div>
          <Routes>
            <Route path="/" element={<Protected element={<Home />} />} />
            <Route path="/list" element={<Protected element={<List />} />} />
            <Route path="/add" element={<Protected element={<Add />} />} />
            <Route path="/about" element={<Protected element={<About />} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/index" element={<Index />} />

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
