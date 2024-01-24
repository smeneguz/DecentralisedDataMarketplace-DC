import { Col, Row, Container, Button, Form } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";
import { default as User } from '../assets/user.svg';
import DeleteUserModal from './ModalDeleteUser';
import { useState, useEffect  } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'
import { createDataset } from '../hooks/useMMdataset'
import { validateSymbol, validateDatasetName, validateEthereumAddress } from "../hooks/utils";
import ProfileCreateDataset from "./ProfileCreateDataset";
import ProfileCreateLicenses from "./ProfileCreateLicense";

function ProfileCreateNew(props) {
  
  const [createType, setCreateType] = useState(1);

  useEffect(() => {
    const storedCreateType = localStorage.getItem('createType');
    if (storedCreateType) {
     setCreateType(Number(storedCreateType));
    }
  }, []);

  const handleCreateType = (type) => {
    localStorage.setItem('createType', type); 
    setCreateType(type);
  }

  return (
    
    <Container> 
        <Row className='mx-2 mt-3 mb-4'>
          <h2 className='formText'> Create New Dataset and Licenses </h2>
        </Row>
        <Row className='mx-2 pb-4'>
          <h4> Create a new dataset or new licenses associated with an existing dataset.  </h4>
          </Row>
          <Row className="box-center mt-1">
            <Button className={`switch-btn1 switch-btn${(createType===1) ? '-active' : ''}`} onClick={() => handleCreateType(1)}>
              Create New Dataset
            </Button>
            <Button className={`switch-btn2 switch-btn${(createType===2) ? '-active' : ''}`} onClick={() => handleCreateType(2)}>
              Create New License
            </Button>
          </Row>
          <Row className="box-center mt-5 mb-3 ">
            {(createType===1) ? <ProfileCreateDataset setMessage={props.setMessage}/> : <ProfileCreateLicenses setMessage={props.setMessage}/> }
          </Row>
          </Container>);
}

export default ProfileCreateNew;