import React from 'react'
import {Container,Row,Col} from 'reactstrap';

const Company = () => {
  return <section>
    <Row>
      <Col lg='3' md='3'>
        <h3 className='d-flec align-items-center gap-1'>
        <i class="ri-youtube-fill">Youtube</i>
        </h3>
      </Col>
      <Col lg='3' md='3'>
        <h3 className='d-flex align-items-center'>
        <i class="ri-whatsapp-fill">Whatsapp</i>
        </h3>
      </Col>
      <Col lg='3' md='3'>
        <h3 className='d-flex align-items-center'>
        <i class="ri-google-fill">Google</i>
        </h3>
      </Col>

      <Col lg='2' md='3'>
        <h3 className='d-flex align-items-center'>
        <i class="ri-facebook-fill">Facebook</i>
        </h3>
      </Col>

    </Row>
  </section>
}

export default Company
