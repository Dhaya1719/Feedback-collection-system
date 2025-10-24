import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormAnalytics from './FormAnalytics';

function AdminDashboard() {
  const [newForm, setNewForm] = useState({ title: '', description: '', questions: [] });
  const [forms, setForms] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminForms();
  }, []);

  const getAuthHeader = () => ({
    headers: { 'x-auth-token': localStorage.getItem('token') }
  });

  const fetchAdminForms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/forms/admin/myforms', getAuthHeader());
      setForms(res.data);
    } catch (err) {
      console.error(err.response.data);
      if (err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin/login');
      }
    }
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/forms', newForm, getAuthHeader());
      alert('Form created successfully!');
      setNewForm({ title: '', description: '', questions: [] });
      fetchAdminForms();
    } catch (err) {
      console.error(err.response.data);
      alert('Failed to create form.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const handleAddQuestion = () => {
    setNewForm({
      ...newForm,
      questions: [
        ...newForm.questions,
        { questionText: '', questionType: 'text', options: [] }
      ]
    });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const questions = [...newForm.questions];
    questions[index][name] = value;
    
    // Clear options if type is text/rating
    if (name === 'questionType' && (value === 'text' || value === 'rating')) {
        questions[index].options = [];
    }
    
    setNewForm({ ...newForm, questions });
  };

  /* NEW HANDLERS FOR INDIVIDUAL OPTIONS */
  const handleAddOption = (qIndex) => {
    const questions = [...newForm.questions];
    questions[qIndex].options.push(`Option ${questions[qIndex].options.length + 1}`);
    setNewForm({ ...newForm, questions });
  };

  const handleOptionTextChange = (qIndex, oIndex, e) => {
    const questions = [...newForm.questions];
    questions[qIndex].options[oIndex] = e.target.value;
    setNewForm({ ...newForm, questions });
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const questions = [...newForm.questions];
    questions[qIndex].options.splice(oIndex, 1);
    setNewForm({ ...newForm, questions });
  };
  /* END NEW HANDLERS */

  const handleRemoveQuestion = (index) => {
    const questions = newForm.questions.filter((_, i) => i !== index);
    setNewForm({ ...newForm, questions });
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div><button onClick={handleLogout} className="btn btn-secondary">Logout</button></div>
      </div>

      <div className="dashboard-section">
        <h3>Create New Form</h3>
        <form onSubmit={handleCreateForm} className="form-creation-form">
          <div className="form-group"><label>Title</label><input type="text" value={newForm.title} onChange={e => setNewForm({ ...newForm, title: e.target.value })} required /></div>
          <div className="form-group"><label>Description</label><textarea value={newForm.description} onChange={e => setNewForm({ ...newForm, description: e.target.value })} /></div>
          
          <h4>Questions</h4>
          {newForm.questions.map((q, index) => (
            <div key={index} className="question-item">
              <div className="form-group">
                <input type="text" name="questionText" placeholder="Question Text" value={q.questionText} onChange={e => handleQuestionChange(index, e)} required />
              </div>

              <div className="form-group type-options-group">
                <select name="questionType" value={q.questionType} onChange={e => handleQuestionChange(index, e)}>
                  <option value="text">Text Input (Short Answer)</option>
                  <option value="rating">Rating (1-5 Stars)</option>
                  <option value="radio">Multiple Choice (Radio)</option>
                  <option value="checkbox">Checkboxes</option>
                </select>
                
                {/* DYNAMIC OPTIONS RENDERING */}
                {(q.questionType === 'radio' || q.questionType === 'checkbox') && (
                    <div className="options-editor-container">
                        {q.options.map((option, oIndex) => (
                            <div key={oIndex} className="option-row">
                                {/* Visually show the type icon */}
                                <span className="option-icon">
                                    {q.questionType === 'radio' ? '●' : '☐'}
                                </span>
                                <input
                                    type="text"
                                    placeholder={`Option ${oIndex + 1}`}
                                    value={option}
                                    onChange={(e) => handleOptionTextChange(index, oIndex, e)}
                                    required
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleRemoveOption(index, oIndex)} 
                                    className="btn btn-sm btn-secondary option-remove-btn"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button 
                            type="button" 
                            onClick={() => handleAddOption(index)} 
                            className="btn btn-sm btn-secondary btn-add-option-sm"
                        >
                            + Add Option
                        </button>
                    </div>
                )}
                {/* END DYNAMIC OPTIONS RENDERING */}
                
                <button type="button" onClick={() => handleRemoveQuestion(index)} className="btn btn-secondary btn-sm option-remove-btn">
                    REMOVE
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddQuestion} className="btn btn-add-question">Add Question</button>
          <button type="submit" className="btn btn-primary">Save Form</button>
        </form>
      </div>

      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />

      <div className="dashboard-section">
        <h3>My Forms</h3>
        <ul className="admin-forms-list">
          {forms.map(form => (
            <li key={form._id}>
              <span>{form.title}</span> 
              <button onClick={() => setSelectedFormId(form._id)} className="btn btn-analytics">View Analytics</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedFormId && <FormAnalytics formId={selectedFormId} />}
    </div>
  );
}

export default AdminDashboard;