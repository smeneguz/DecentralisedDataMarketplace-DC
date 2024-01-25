import { Row, Container, Table, Tooltip, OverlayTrigger } from "react-bootstrap";
import "../App.css";
import { useState, useEffect } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'
import { default as License } from '../assets/license.svg';
import ProfilePurchasedLicense from "./ProfilePurchasedLicense";
import { getPurchasedDatasets } from "../hooks/useMMpurchased";

function ProfilePurchasedDataset(props) {

  const [datasets, setDatasets] = useState([]);

  const { setErrorMessage, wallet } = useMetaMask();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPurchasedDatasets(wallet.accounts[0]);
        setDatasets(result);
      } catch (error) {
        setErrorMessage(`${error.message}`);
      }
    };
    fetchData();
    return () => { };
  }, [wallet.accounts, setErrorMessage]);

  const renderTooltip3 = (props) => (
    <Tooltip className="ind" id="button-tooltip" {...props}>
      View Licenses
    </Tooltip>
  );

  return (
    <Container>
      {props.nftAddress ? <ProfilePurchasedLicense nftAddress={props.nftAddress} setNftAddress={props.setNftAddress} setMessage={props.setMessage} /> :
        <Container className="table-container">
          <Row className='mx-2 mt-3 mb-4'>
        <h2 className='formText'> Purchased Licenses </h2>
      </Row>
          <Row className='mx-2'>
            <h4> Here are all datasets for which you purchased licenses, look at them now.  </h4>
          </Row>
          <Row className="mx-2 mt-4">
            <Table responsive striped bordered hover className="table-border" >
              <thead >
                <tr >
                  <th className="table-header">NFTaddress</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Symbol</th>
                  <th className="table-header">TokenURI</th>
                  <th className="table-header">Licenses</th>
                </tr>
              </thead>
              <tbody>
              {datasets.length > 0 ? (
                datasets?.map((dataset, index) => (
                  <tr key={index}>
                    <td className="table-value text-center">{dataset.address}</td>
                    <td className="table-value text-center">{dataset.name}</td>
                    <td className="table-value text-center">{dataset.symbol}</td>
                    <td className="table-value text-center">
                      <p className="uri" onClick={() => { window.open(dataset.tokenURI, '_blank') }}> {dataset.tokenURI} </p>
                    </td>
                    <td className=" text-center">
                      <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip3} >
                        <img src={License} alt="license" className="select" onClick={() => props.setNftAddress(dataset.address)} />
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))
                ) : (
                  <tr>
                    <td className="text-center" colSpan="5">There are no datasets for which you purchased licenses</td>
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

export default ProfilePurchasedDataset;