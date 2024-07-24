import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/header/Header';
import SimilarityAnalyzer from './SimilarityAnalyzer'; // Import the SimilarityAnalyzer component
const Anlayzepage = () => {
  return (
    <div>
        <Header/>
        <SimilarityAnalyzer/>
    </div>
  )
}

export default Anlayzepage
