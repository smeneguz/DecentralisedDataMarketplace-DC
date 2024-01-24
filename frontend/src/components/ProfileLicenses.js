import { Col, Row, Container, Button, Table, Tooltip, OverlayTrigger } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";
import { default as User } from '../assets/user.svg';
import DeleteUserModal from './ModalDeleteUser';
import { useState, useEffect } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'
import { getOwnLicenses } from '../hooks/useMMlicense'
import { default as Delete } from '../assets/delete.svg';
import { default as Update } from '../assets/update.svg';
import { default as Back } from '../assets/back.svg';
import DeleteLicenseModal from "./ModalDeleteLicense";
import UpdateLicenseModal from "./ModalUpdateLicense";

function ProfileLicenses(props) {
  
  const [licenses, setLicenses] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { isConnecting, setErrorMessage, wallet, setIsConnecting } = useMetaMask();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getOwnLicenses(wallet.accounts[0], props.nftAddress);
        setLicenses(result);
      } catch (error) {
        setErrorMessage(`${error.message}`);
      } 
    };

    fetchData();

    return () => { };
  }, [wallet.accounts, setErrorMessage]);

  const renderTooltip1 = (props) => (
    <Tooltip className="ind" id="button-tooltip" {...props}>
      Update
    </Tooltip>
  );

  const renderTooltip2 = (props) => (
    <Tooltip className="ind" id="button-tooltip" {...props}>
      Delete
    </Tooltip>
  );

  return (
  <Container className="table-container">

{showUpdateModal && <UpdateLicenseModal setShowUpdateModal={setShowUpdateModal} showUpdateModal={showUpdateModal} selectedLicense={selectedLicense} setMessage={props.setMessage} nftAddress={props.nftAddress}/>}
{showDeleteModal && <DeleteLicenseModal setShowDeleteModal={setShowDeleteModal} showDeleteModal={showDeleteModal} selectedLicense={selectedLicense} setMessage={props.setMessage} nftAddress={props.nftAddress}/>}

<Row className='mx-2 mt-3 mb-4'>
        <Button className="exit back" onClick={() => props.setNftAddress("")}><img src={Back} alt="back" /> 
        <h5 className="h5-back ">Back </h5> 
        </Button>
      </Row>
        <Row className='mx-2 inline-box'>
          <h4 className="inline2"> All your licenses associated with dataset at address: </h4>
          <h5 className="inline3"> {props.nftAddress}</h5>    
          </Row>
          <Row className="mx-2 mt-4">

         
 <Table responsive striped bordered hover className="table-border" >
      <thead >
        <tr >
          <th className="table-header">Address</th>
          <th className="table-header">Name</th>
          <th className="table-header">Symbol</th>
          <th className="table-header">Type</th>
          <th className="table-header">Period</th>
          <th className="table-header">Price</th>
          <th className="table-header">Cap</th>
          <th className="table-header">Manage</th>
        </tr>
      </thead>
      <tbody>
      {licenses.length > 0 ? (
      licenses.map((license, index) => (
        <tr key={index}>
          <td className="table-value text-center">{license.address}</td>
          <td className="table-value text-center">{license.name}</td>
          <td className="table-value text-center">{license.symbol}</td>
          <td className="table-value text-center">{license.type}</td>
          <td className="table-value text-center">{(license.period===0) ? "—" : license.period}</td>
          <td className="table-value text-center">{license.price}</td>
          <td className="table-value text-center">n</td>
          <td className=" text-center">
            <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip1}>
              <img src={Update} alt="update" className="select me-2" onClick={() => { setShowUpdateModal(true); setSelectedLicense(license); }} />
            </OverlayTrigger>
            <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip2}>
              <img src={Delete} alt="delete" className="select" onClick={() => { setShowDeleteModal(true); setSelectedLicense(license.address); }} />
            </OverlayTrigger>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td className=" text-center" colSpan="8">You have no Licenses.</td>
      </tr>
    )}
          </tbody>
    </Table>
    </Row>
    <Row className="mt-4 mx-2 mb-3">
            <p className="p-signup"> NOTE: You can enter and change the Cap value, but for now it is set automatically in the backend. </p>
          </Row>
  </Container>
  );
}

export default ProfileLicenses;