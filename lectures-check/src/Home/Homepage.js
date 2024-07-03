import React from 'react'
import Header from '../components/header/Header'
// import './header.css'
import '../components/header/header.css'
import Herosection from '../components/Hero-section/Herosection'
import Company from '../components/Company-section/Company'
import Aboutus from '../About/Aboutus'
import Features from '../components/features-secton/Features'
const Homepage = () => {
  return (
    <div>
      <Header/>
      <Herosection/>
      <Aboutus/>
      <Company/>
      <Features/>
    </div>
  )
}

export default Homepage
