import { Col, Row, Container, Button } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";
import { default as User } from '../assets/user.svg';
import DeleteUserModal from './ModalDeleteUser';
import { useState } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'

function ProfileDelete(props) {

  const [showDelete, setShowDelete] = useState(false);

  const { isConnecting } = useMetaMask();
  
  return (<Container> 

{showDelete && <DeleteUserModal setShowDelete={setShowDelete} showDelete={showDelete} handleLoggedOut={props.handleLoggedOut} />}

    <Row className='mx-2 mt-3 mb-4'>
      <h2 className='formText'> Delete account </h2>
    </Row>
    <Row className='mx-2'>
      <h4> Are you sure you want to delete your registration from Data Cellar?  </h4>
      <h6> You will not lose Data Cellar Tokens uploaded to your ethereum account, but you will have to repay a transaction in order to re-register and access Data Cellar. </h6>
      </Row>
      <Row className="box-center mt-5 mb-3 ">
      <Button className='exit delete' onClick={() => setShowDelete(true)} disabled={isConnecting} >
                {isConnecting ? "Loading" : "Delete Account"}
              </Button>
      </Row>
      </Container>

      
      );
}

export default ProfileDelete;
