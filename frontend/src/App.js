import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import FeedbackForm from './components/FeedbackForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminRegister from './components/AdminRegister';
import PrivateRoute from './components/PrivateRoute';
import './App.css'; // Make sure this import is here!

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Feedback App</h1>
          <nav>
            {/* APPLYING THE nav-button CLASS HERE */}
            <Link to="/" className="nav-button">Home</Link>
            <Link to="/admin/login" className="nav-button">Admin Login</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/form/:formId" element={<FeedbackForm />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route 
              path="/admin/dashboard" 
              element={<PrivateRoute component={AdminDashboard} />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;