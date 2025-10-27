// LandingPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LandingPage() {
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // *** MODIFIED AXIOS CALL: Use ENV variable ***
    axios.get(`${process.env.REACT_APP_API_URL}/forms`)
      .then(response => {
        setForms(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the forms!", error);
      });
  }, []);

// ... rest of the component

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Available Feedback Forms</h2>
      <input
        type="text"
        placeholder="Search for a form..."
        className="search-bar"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <ul className="form-list">
        {filteredForms.map(form => (
          <li key={form._id} className="form-item">
            <Link to={`/form/${form._id}`}>{form.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LandingPage;