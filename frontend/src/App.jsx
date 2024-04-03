import React from 'react';
import { Box, Typography } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from "./pages/Home";
import List from "./pages/List";
import About from "./pages/About";
import Add from "./pages/Add";

const App = () => {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Typography variant="h4">
          nuro
        </Typography>
      </Box>
      <Router>
        <div className='menu'>
          <center><Link to="/">random nugget</Link> | <Link to="/add">add</Link> | <Link to="/list">list</Link> |  <Link to="/about">about</Link></center>
        </div>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<List />} />
            <Route path="/add" element={<Add />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>

      <footer>
        <center>
          <h3>nuro</h3>
          <p>Capture concise study cues effortlessly.</p>
          <p>&nbsp;</p>

          <p class="light">Nuro is free to use. If you'd like, feel free to support us with a coffee! <a href=".">Donate</a></p>
          <p class="light">&copy; Nuro. All rights reserved.</p>
        </center>
      </footer>
    </Box>

  );
};

export default App;
