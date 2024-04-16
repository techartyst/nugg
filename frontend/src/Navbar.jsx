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
    navigateTo(from.replace('/', ''), { replace: true });
  };



  return (



    <div >
      <div className='header'>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}></div> {/* Left column (blank) */}
          <div className='logo' style={{ flex: 1, textAlign: 'center' }}> {/* Middle column */}
          <h2 className='logo'>nugg</h2>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}> {/* Right column */}
            <div class="dropdown">
              <button><i class="fa fa-neuter" aria-hidden="true"></i>
              </button>
              <div class="dropdown-options">

              <Link title="FAQ" className='ico' to="/about">About & FAQ</Link>

                <Link title="Logout" className='ico' to="/" onClick={handleLogout}>Logout</Link>
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className='menu'>
        <center>
          <Link title="random nugget" className='ico' to="/home"><i class="fa fa-lightbulb-o"></i></Link>
          <Link title="list all" className='ico' to="/list"><i class="fa fa-bars "></i></Link>

          <Link title="add new" className='ico' to="/add"><i class="fa fa-plus"></i></Link>

        </center>
      </div>
    </div>


  );
};

export default Navbar;
