import React from 'react';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-white text-lg font-bold">CallBridge</div>
      <div>
        <Link to="/login" className="text-white mr-4">
          <i className="fa fa-sign-in" aria-hidden="true"></i> Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
