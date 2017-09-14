import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
      <div className="container">
        <div className="notfound">
          <div className="notfound__header">page not found</div>
          <div className="notfound__text">Sorry, there's nothing here!</div>
          <div className="notfound__text">Want to go <Link to='/' className="notfound__link">home</Link>?</div>
        </div>
      </div>
    );

export default NotFound;