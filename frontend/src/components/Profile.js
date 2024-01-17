
import { Col, Row, Container, Button, Alert } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";
import { default as User } from '../assets/user.svg';
import DeleteUserModal from './DeleteUserModal';
import { useState, useEffect } from 'react';

import ProfileBalance from "./ProfileBalance";
import ProfileData from "./ProfileData";
import ProfileDelete from "./ProfileDelete";
import ProfileLicenses from "./ProfileLicenses";
import ProfileInfo from "./ProfileInfo";
import ProfileNFTs from "./ProfileNFTs";

function Profile(props) {


  
   const [message, setMessage] = useState("");
 
   useEffect(() => {
    const timeId = setTimeout(() => {
      setMessage("");
    }, 10000)

    return () => {
      clearTimeout(timeId)
    }
  }, [message]);


  return (

    <Container fluid className="mt-4 pt-5 profile ">

    {message &&
    <Row >
      <Col md={12} className="box-center">

      
            <Alert variant="success" className="err-alert" onClose={() => setMessage("")} dismissible >
              <Alert.Heading>Operation successfully concluded!</Alert.Heading>
              <p> { message } </p>
            </Alert>
            </Col>
            </Row>
          }

      <Row>
        <Col md={2} className="profile-sidebar">
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 1 ? '-active' : ''}`} onClick={() => props.setProfilePage(1)}> General Information </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 2 ? '-active' : ''}`} onClick={() => props.setProfilePage(2)}> Manage Balance </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 3 ? '-active' : ''}`} onClick={() => props.setProfilePage(3)}> Manage Data </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 4 ? '-active' : ''}`} onClick={() => props.setProfilePage(4)}> Manage Licenses </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 5 ? '-active' : ''}`} onClick={() => props.setProfilePage(5)}> Manage NFTs </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 6 ? '-active' : ''}`} onClick={() => props.setProfilePage(6)}> Delete Account </h6>
          </Row>
        </Col>
        <Col md={10} >
          {(props.profilePage === 1) && <ProfileInfo authState={props.authState}/>}
          {(props.profilePage === 2) && <ProfileBalance message={message} setMessage={setMessage}/>}
          {(props.profilePage === 3) && <ProfileData/>}
          {(props.profilePage === 4) && <ProfileLicenses/>}
          {(props.profilePage === 5) && <ProfileNFTs/>}
          {(props.profilePage === 6) && <ProfileDelete handleLoggedOut={props.handleLoggedOut} />}
          </Col>
          </Row>
    </Container>
  );

}

export default Profile;