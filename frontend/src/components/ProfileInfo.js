import { Col, Row, Container, Button } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";
import { default as User } from '../assets/user.svg';
import DeleteUserModal from './DeleteUserModal';
import { useState } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'

function ProfileInfo(props) {
  
  return (
  <Container> 

          <Row className='mx-2 mt-3 mb-4'>
            <h2 className='formText'> General Information </h2>
          </Row>
          <Row>
            <Col md={3} className="ms-3">
              <img src={User} alt="user" className="profile-img" />
            </Col>
            <Col md={7}>
              <Row className="mb-2">
                <Col md={3}>
                  <h5 className="h4-profile"> Address:</h5>
                </Col>
                <Col md={8}>
                  <h6 className="h5-profile"> {props.authState?.publicAddress} </h6>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h5 className="h4-profile"> Name:</h5>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState?.name} </h5>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h5 className="h4-profile"> Surname:</h5>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState?.surname} </h5>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h5 className="h4-profile"> Email:</h5>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState?.email} </h5>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h5 className="h4-profile"> Profession:</h5>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState?.profession} </h5>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h5 className="h4-profile"> Country:</h5>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState?.country} </h5>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={3}>
                  <h5 className="h4-profile"> Region:</h5>
                </Col>
                <Col md={8}>
                  <h5 className="h5-profile"> {props.authState?.region} </h5>
                </Col>
              </Row>
            </Col>
            
          </Row>
          <Row className="mt-4 mb-3">
            <p className="p-signup"> NOTE: This information is taken from your session cookie. Data Cellar does not store any of your information. </p>
          </Row>
  </Container>
  );
}

export default ProfileInfo;