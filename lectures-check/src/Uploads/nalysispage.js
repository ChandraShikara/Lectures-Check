import React from 'react'
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/header/Header';
import Analysis from './Analysis';

const nalysispage = () => {
  return (
    <div>
        <Header/>
        <Analysis/>
    </div>
  )
}

export default nalysispage;