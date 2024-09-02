import React from 'react';
import { useLocation } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import Header from '../components/header/Header';

const Analysis = () => {
  const location = useLocation();
  const { similarityScore } = location.state || { similarityScore: 0 };

  const data = {
    labels: ['Similarity', 'Difference'],
    datasets: [
      {
        data: [similarityScore, 100 - similarityScore],
        backgroundColor: ['green', 'red'],
        hoverBackgroundColor: ['green', 'red'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div>
      <Header />
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: '#1D232A', color: '#fff' }}
      >
        <div className="container text-center">
          <h1 className="display-4 mb-4" style={{ fontWeight: 'bold' }}>Analysis Report</h1>
          <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
            <Pie data={data} options={options} />
          </div>
          <p className="mt-4" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            Score of Relevance: {similarityScore}%
          </p>
          {similarityScore < 75 ? (
            <p className="mt-2 text-danger" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
              The video and PDF are poorly matched with a similarity score less than 75%.
            </p>
          ) : (
            <p className="mt-2 text-success" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
              The condition is satisfied, and the PDF and video are well-matched.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
