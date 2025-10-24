import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function FormAnalytics({ formId }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/submissions/analytics/${formId}`, {
          headers: { 'x-auth-token': token }
        });
        setAnalyticsData(res.data.analytics);
        setFormTitle(res.data.formTitle);
      } catch (err) {
        console.error("Error fetching analytics:", err.response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [formId]);

  if (loading) return <div className="analytics-section">Loading analytics...</div>;
  if (!analyticsData) return <div className="analytics-section">Error loading analytics.</div>;

  const totalSubmissions = analyticsData[Object.keys(analyticsData)[0]]?.totalResponses || 0;

  const generateChartData = (type, data) => {
    const labels = type === 'rating' ? ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'] : Object.keys(data.counts);
    const chartData = type === 'rating' ? Object.values(data.distribution) : Object.values(data.counts);
    
    return {
      labels: labels,
      datasets: [
        {
          label: type === 'rating' ? 'Rating Distribution' : 'Response Count',
          data: chartData,
          backgroundColor: [
              '#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', 
              '#ff9f40', '#9966ff', '#ffcd56', '#c9cbcf', '#a3e4d7'
          ],
        },
      ],
    };
  };

  return (
    <div className="analytics-section">
      <h3>Analytics for "{formTitle}"</h3>
      <p className="summary-stat">Total Submissions: <strong>{totalSubmissions}</strong></p>

      {Object.keys(analyticsData).map(key => {
        const q = analyticsData[key];
        const isChartable = q.questionType === 'rating' || q.questionType === 'radio' || q.questionType === 'checkbox';

        return (
          <div key={key} className="question-analysis-card">
            <h4>{q.questionText}</h4>

            {q.questionType === 'rating' && (
              <>
                <p className="summary-stat">Average Rating: <strong>{q.data.average} / 5</strong></p>
                <div className="chart-container"><Bar data={generateChartData('rating', q.data)} /></div>
              </>
            )}
            
            {(q.questionType === 'radio' || q.questionType === 'checkbox') && (
              <div className="chart-container-half">
                <Pie data={generateChartData(q.questionType, q.data)} />
              </div>
            )}
            
            {q.questionType === 'text' && (
              <>
                <p className="summary-stat">Total Comments: <strong>{q.data.comments.length}</strong></p>
                <div className="comments-list">
                  {q.data.comments.length > 0 ? (
                    q.data.comments.map((comment, i) => <p key={i} className="comment-item">"{comment}"</p>)
                  ) : (
                    <p>No text responses recorded.</p>
                  )}
                </div>
              </>
            )}
            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default FormAnalytics;