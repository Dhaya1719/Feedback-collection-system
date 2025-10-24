import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function FeedbackForm() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the specific form structure from the backend
    axios.get(`http://localhost:5000/api/forms/${formId}`)
      .then(response => {
        setForm(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching form:", error);
        setLoading(false);
      });
  }, [formId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prevData => {
      // Handle Checkboxes (multiple selections)
      if (type === 'checkbox') {
        const currentArray = prevData[name] || [];
        return {
          ...prevData,
          [name]: checked 
            ? [...currentArray, value] // Add value if checked
            : currentArray.filter(v => v !== value) // Remove value if unchecked
        };
      }
      
      // Handle Text, Radio, Email, Name (single value inputs)
      return { ...prevData, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Structure submission data for the backend API
    try {
      await axios.post(`http://localhost:5000/api/submissions/${formId}`, {
          // Name and Email are sent at the top level
          name: formData.name,
          email: formData.email,
          // All other responses are mapped by question ID
          ...Object.keys(formData).reduce((acc, key) => {
            // Filter out the 'name' and 'email' keys
            if (key !== 'name' && key !== 'email') {
              acc[key] = formData[key];
            }
            return acc;
          }, {})
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert('Submission failed. Please try again.');
    }
  };

  if (loading) return <div className="container text-center">Loading form...</div>;
  if (!form) return <div className="container text-center">Form not found.</div>;
  if (submitted) return <div className="container text-center"><h2>Thank you for your feedback!</h2><p>Your response has been recorded.</p></div>;

  return (
    <div className="container">
      <h2>{form.title}</h2>
      <p>{form.description}</p>
      <form onSubmit={handleSubmit} className="feedback-form">
        
        {/* Universal fields: Name and Email (uses fixed keys) */}
        <div className="form-group">
          <label>Name (Optional)</label>
          <input type="text" name="name" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email (Optional)</label>
          <input type="email" name="email" onChange={handleChange} />
        </div>

        {/* Dynamic Questions Rendering */}
        {form.questions.map((q) => {
          // Use the question's MongoDB _id as the unique key for form data tracking
          const questionKey = q._id.toString(); 
          return (
            <div key={questionKey} className="form-group">
              <label>{q.questionText}</label>
              
              {/* Text Input */}
              {q.questionType === 'text' && (
                <textarea name={questionKey} onChange={handleChange} required />
              )}
              
              {/* Rating (Radio 1-5) */}
              {q.questionType === 'rating' && (
                <div className="options rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <label key={star}>
                      <input
                        type="radio"
                        name={questionKey}
                        value={star}
                        onChange={handleChange}
                        required
                      /> 
                      {/* Using a span allows styling the text when the input is checked */}
                      <span>{star}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {/* Radio (Multiple Choice) & Checkbox */}
              {(q.questionType === 'radio' || q.questionType === 'checkbox') && (
                <div className="options">
                  {q.options.map((option, optIndex) => (
                    <label key={optIndex} className={q.questionType}>
                      <input
                        type={q.questionType}
                        name={questionKey}
                        value={option}
                        onChange={handleChange}
                        required={q.questionType === 'radio'} // Radio buttons are typically required
                      /> 
                      {/* Using a span allows styling the text when the input is checked */}
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <button type="submit" className="btn btn-primary">Submit Feedback</button>
      </form>
    </div>
  );
}

export default FeedbackForm;