import { Col, Row, Container, Button } from "react-bootstrap";
import "../App.css";
import ProfileCreateDataset from "./ProfileCreateDataset";
import ProfileCreateLicenses from "./ProfileCreateLicense";

function ProfileCreateNew(props) {

  return (
    <Container>
      <Row className='mx-2 mt-3 mb-4'>
        <h2 className='formText'> Create New Dataset and Licenses </h2>
      </Row>
      <Row className='mx-2 pb-4'>
        <h4> Create a new dataset or new licenses associated with an existing dataset.  </h4>
      </Row>
      <Row className="box-center mt-1">
        <Button className={`switch-btn1 switch-btn${(props.createType === 1) ? '-active' : ''}`} onClick={() => props.setCreateType(1)}>
          Create New Dataset
        </Button>
        <Button className={`switch-btn2 switch-btn${(props.createType === 2) ? '-active' : ''}`} onClick={() => props.setCreateType(2)}>
          Create New License
        </Button>
      </Row>
      <Row className="box-center mt-5 mb-3 ">
        {(props.createType === 1) ? <ProfileCreateDataset setMessage={props.setMessage} /> : <ProfileCreateLicenses setMessage={props.setMessage} />}
      </Row>
    </Container>
  );
}

export default ProfileCreateNew;