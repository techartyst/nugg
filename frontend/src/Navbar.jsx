// Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigateTo = useNavigate();

  const handleLogout = () => {
    // Remove the token from sessionStorage
    sessionStorage.removeItem('nuroapp');
    console.log("s");
    // Redirect to the login page
    navigateTo(from.replace('/index', '') , { replace: true });
  };

  

  return (
    
      
        <div className='menu'>
     
          <center>
          <Link title="random nugget" className='ico'  to="/"><i class="fa fa-lightbulb-o"></i></Link> 
          <Link title="add new"  className='ico' to="/add"><i class="fa fa-plus"></i></Link>
          <Link title="list all"  className='ico'  to="/list"><i class="fa fa-bars "></i></Link>
          <Link title="about"  className='ico'  to="/about"><i class="fa fa-code"></i></Link>
          <Link title="logout"  className='ico'  to="#" onClick={handleLogout}><i class="fa fa-times "></i></Link>

          </center>
        </div>
      
    
  );
};

export default Navbar;
