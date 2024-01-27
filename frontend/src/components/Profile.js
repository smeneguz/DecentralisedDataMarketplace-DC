
import { Col, Row, Container } from "react-bootstrap";
import "../App.css";
import ProfileBalance from "./ProfileBalance";
import ProfileDatasets from "./ProfileDatasets";
import ProfileDelete from "./ProfileDelete";
import ProfileInfo from "./ProfileInfo";
import ProfilePurchasedDataset from "./ProfilePurchasedDataset";
import ProfileCreateNew from "./ProfileCreateNew";
import { useMetaMask } from '../hooks/useMetaMask'

function Profile(props) {

  const { setNftAddress } = useMetaMask()

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
            <h6 className={`side-bar-text${props.profilePage === 3 ? '-active' : ''}`} onClick={() => { setNftAddress(""); props.setProfilePage(3); }}> Datasets and Licenses </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 4 ? '-active' : ''}`} onClick={() => props.setProfilePage(4)}> Create New Ones </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 7 ? '-active' : ''}`} onClick={() => { setNftAddress(""); props.setProfilePage(5) }}> Purchased Licenses </h6>
          </Row>
          <Row className="side-bar-button">
            <h6 className={`side-bar-text${props.profilePage === 8 ? '-active' : ''}`} onClick={() => props.setProfilePage(6)}> Delete Account </h6>
          </Row>
        </Col>
        <Col md={10} >
          {(props.profilePage === 1) && <ProfileInfo authState={props.authState} />}
          {(props.profilePage === 2) && <ProfileBalance setMessage={props.setMessage} />}
          {(props.profilePage === 3) && <ProfileDatasets setMessage={props.setMessage} />}
          {(props.profilePage === 4) && <ProfileCreateNew setMessage={props.setMessage} createType={props.createType} setCreateType={props.setCreateType} />}
          {(props.profilePage === 5) && <ProfilePurchasedDataset setMessage={props.setMessage} />}
          {(props.profilePage === 6) && <ProfileDelete handleLoggedOut={props.handleLoggedOut} />}
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;