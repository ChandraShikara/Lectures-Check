import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import hero from '../../assets/images/hero.jpg';
import './Herosection.css';

const Herosection = () => {
  return (
    <section>
      <Container>
        <Row>
          <Col lg='6' md='6'>
            <div className='hero_content'>
              <h2 className='mb-4'>
                Anytime Anywhere <br />
                Learn on your Suitable Schedule
              </h2>
              <p className='mb-4'>
              Dune State University would like all their Professors to record the lectures and upload them to <br/>
               their Learning Management System so that the lectures are available for students to watch anytime. 
              With each video a PDF file too is uploaded. The system needs to validate the video for topic wise 
              coverage. It also needs to match the video content and PDF and show its analysis.
              </p>
              <div className='search'>
                <input type="text" placeholder="Search" />
                <button className='btn'>Search</button>
              </div>
            </div>
          </Col>
          <Col lg='6' md='6'>
            <img src={hero} alt="" className="w-100" />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Herosection;
