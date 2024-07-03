import React from 'react'
import './about.css'
import {Container,Row,Col} from 'reactstrap';
import about from "../../src/assets/images/about.jpg";
import CountUp from "react-countup"

const Aboutus = () => {
  return <section>
    <Container>
      <Row>
        <Col lg='6' md='6'>
          <div className='about_img'>
            <img src={about} alt="" className='w-100'/>
          </div>
        </Col>
        <Col lg='6' md='6'>
          <div className='about_content'>
            <h2>About Us</h2>
            <p>srbfj wefhjb wugfubu wefubu
            efh jhfj wefg yu erfugubfi erfug
            hgrfgu efgug uwefgugwef uygfuy
            yurgfjg rfgug efgugu wefhjbkj
            kjerfjg </p>

            <div className='about_counter'>
              <div className='d-flex gap-5 align-items-center'>
                <div className='single_counter'>
                  <span className='counter'>
                     {/* <CountUp start={0} end={25} duration={80} suffix='M'/> */}
                  </span>

                  {/* <p className='counter_title'>Completed Project</p> */}
                </div>


                <div className='single_counter'>
                  <span className='counter'>
                     {/* <CountUp start={0} end={12} duration={80} suffix='M'/> */}
                  </span>

                  {/* <p className='counter_title'>Patient Around World</p> */}
                </div>

                
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </section>
}

export default Aboutus