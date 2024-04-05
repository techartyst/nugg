// Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Hide navigation bar on registration and login pages
  const showNavbar = !['/register', '/login'].includes(location.pathname);

  return (
    <>
      {showNavbar && (
        <div className='menu'>
          <center><Link to="/">random nugget</Link> | <Link to="/add">add</Link> | <Link to="/list">list</Link> |  <Link to="/about">about</Link></center>
        </div>
      )}
    </>
  );
};

export default Navbar;
