import { Col, Row, Container, Button, Table, Tooltip, OverlayTrigger } from "react-bootstrap";
import { default as Logo } from "../assets/logo.png"
import "../App.css";
import { default as User } from '../assets/user.svg';
import DeleteUserModal from './ModalDeleteUser';
import { useState, useEffect } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'
import { getOwnDatasets } from '../hooks/useMMdataset'
import { default as Delete } from '../assets/delete.svg';
import { default as Update } from '../assets/update.svg';
import DeleteDatasetModal from './ModalDeleteDataset';
import UpdateDatasetModal from "./ModalUpdateDataset";
import { truncateString } from "../hooks/utils";
import { default as License } from '../assets/license.svg';
import ProfileLicenses from "./ProfileLicenses";

function ProfileDataset(props) {

  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const { isConnecting, setErrorMessage, wallet, setIsConnecting } = useMetaMask();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getOwnDatasets(wallet.accounts[0]);
        setDatasets(result);
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

  const renderTooltip3 = (props) => (
    <Tooltip className="ind" id="button-tooltip" {...props}>
      View Licenses
    </Tooltip>
  );


  return (
    <Container>

      {showUpdateModal && <UpdateDatasetModal setShowUpdateModal={setShowUpdateModal} showUpdateModal={showUpdateModal} selectedDataset={selectedDataset} setMessage={props.setMessage} />}
      {showDeleteModal && <DeleteDatasetModal setShowDeleteModal={setShowDeleteModal} showDeleteModal={showDeleteModal} selectedDataset={selectedDataset} setMessage={props.setMessage} />}

      
      {props.nftAddress ? <ProfileLicenses nftAddress={props.nftAddress} setNftAddress={props.setNftAddress} setMessage={props.setMessage} /> :
        <Container className="table-container">
          <Row className='mx-2 mt-3 mb-4'>
        <h2 className='formText'> Your Dataset and Licenses </h2>
      </Row>
          <Row className='mx-2'>
            <h4> Here are all your datasets. You can edit them, delete them, and see their licenses.  </h4>
          </Row>
          <Row className="mx-2 mt-4">
            <Table responsive striped bordered hover className="table-border" >
              <thead >
                <tr >
                  <th className="table-header">NFTaddress</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Symbol</th>
                  <th className="table-header">TokenURI</th>
                  <th className="table-header">Transferable</th>
                  <th className="table-header">Licenses</th>
                  <th className="table-header">Manage</th>
                </tr>
              </thead>
              <tbody>
              {datasets.length > 0 ? (
                datasets?.map((dataset, index) => (
                  <tr key={index}>
                    <td className="table-value text-center">{dataset.nftAddress}</td>
                    <td className="table-value text-center">{dataset.name}</td>
                    <td className="table-value text-center">{dataset.symbol}</td>
                    <td className="table-value text-center">
                      <p className="uri" onClick={() => { window.open(dataset.getTokenUri, '_blank') }}> {truncateString(dataset.getTokenUri)} </p>
                    </td>
                    <td className="table-value text-center">{dataset.transferable ? 'Yes' : 'No'}</td>
                    {<td className=" text-center">
                      <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip3} >
                        <img src={License} alt="license" className="select" onClick={() => props.setNftAddress(dataset.nftAddress)} />
                      </OverlayTrigger>
                    </td>
                    }
                    {<td className=" text-center">
                      <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip1} >
                        <img src={Update} alt="update" className="select me-2" onClick={() => { setShowUpdateModal(true); setSelectedDataset(dataset); }} />
                      </OverlayTrigger>
                      <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip2} >
                        <img src={Delete} alt="delete" className="select" onClick={() => { setShowDeleteModal(true); setSelectedDataset(dataset.nftAddress); }} />
                      </OverlayTrigger>
                    </td>
                    }
                  </tr>
                ))
                ) : (
                  <tr>
                    <td className="text-center" colSpan="7">You have no Datasets.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Row>
        </Container>
      }
    </Container>
  );
}

export default ProfileDataset;