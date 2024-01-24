
import { Col, Row, Container, Button, Alert } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";
import { default as User } from '../assets/user.svg';
import DeleteUserModal from './ModalDeleteUser';
import { useState, useEffect } from 'react';

import ProfileBalance from "./ProfileBalance";
import ProfileDatasets from "./ProfileDatasets";
import ProfileDelete from "./ProfileDelete";
import ProfileLicenses from "./ProfileLicenses";
import ProfileInfo from "./ProfileInfo";
import ProfileCreateLicense from "./ProfileCreateLicense"
import ProfileCreateDataset from "./ProfileCreateDataset";
import ProfilePurchased from "./ProfilePurchased";
import ProfileCreateNew from "./ProfileCreateNew";

function Profile(props) {



  return (

    <Container fluid className="mt-4 pt-5 profile ">
      <Row>
        <Col md={2} className="profile-sidebar">
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 1 ? '-active' : ''}`} onClick={() => props.setProfilePage(1)}> General Information </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 2 ? '-active' : ''}`} onClick={() => props.setProfilePage(2)}> Manage Balance </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 3 ? '-active' : ''}`} onClick={() => props.setProfilePage(3)}> Datasets and Licenses </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 4 ? '-active' : ''}`} onClick={() => props.setProfilePage(4)}> Create New Ones </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 7 ? '-active' : ''}`} onClick={() => props.setProfilePage(5)}> Purchased Licenses </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 8 ? '-active' : ''}`} onClick={() => props.setProfilePage(6)}> Delete Account </h6>
          </Row>
        </Col>
        <Col md={10} >
          {(props.profilePage === 1) && <ProfileInfo authState={props.authState}/>}
          {(props.profilePage === 2) && <ProfileBalance setMessage={props.setMessage}/>}
          {(props.profilePage === 3) && <ProfileDatasets setMessage={props.setMessage} nftAddress={props.nftAddress} setNftAddress={props.setNftAddress} />}
          {(props.profilePage === 4) && <ProfileCreateNew setMessage={props.setMessage}/>}
          {(props.profilePage === 5) && <ProfilePurchased/>}
          {(props.profilePage === 6) && <ProfileDelete handleLoggedOut={props.handleLoggedOut} />}
          </Col>
          </Row>
    </Container>
  );

}

export default Profile;