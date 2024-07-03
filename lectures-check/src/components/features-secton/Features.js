import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import './features.css';

const FeatureData = [
  {
    title: 'Quick Learning',
    desc: "erfg wefg effug ergu erfg bfgu urgfug rfgug errugef ecghu e uygcbug erfugu eruygu gfuvgui uregfug erfgu rfgugg uguvg ugudfg.",
    icon: "ri-draft-line"
  },
  {
    title: 'All Time Support',
    desc: "hgvfv ugfug ugrfuges qkuyvgb urgfugih jhbfvb ugufvug fugoug fuygbb duguyu hfdh ufbuwc  uyuerfub vuugv ufgjf bfjbref uhugudfvug eurgfug ehuhugb bugugfc.",
    icon: "ri-discuss-line"
  }
];

const Features = () => {
  return (
    <section>
      <Container>
        <Row>
          {FeatureData.map((item, index) => (
            <Col lg='4' key={index}>
              <div className='single_feature text-center'>
                <h2>
                  <i className={item.icon}></i>
                </h2>
                <h6>{item.title}</h6>
                <p>{item.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Features;
