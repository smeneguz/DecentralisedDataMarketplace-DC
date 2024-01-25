import { Col, Row, Container, Button, Table } from "react-bootstrap";
import "../App.css";
import { useState, useEffect } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'
import { default as Back } from '../assets/back.svg';
import { getPublicLicenses } from "../hooks/useMMmarket";
import PurchaseModal from "./ModalPurchase";

function MarketLicenses(props) {

  const [licenses, setLicenses] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { setErrorMessage, wallet } = useMetaMask();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPublicLicenses(wallet.accounts[0], props.nftAddress);
        setLicenses(result);
      } catch (error) {
        setErrorMessage(`${error.message}`);
      }
    };
    fetchData();
    return () => { };
  }, [wallet.accounts, setErrorMessage]);

  return (
    <Container fluid className="mt-5 pt-5 profile home  ">

      {showModal && <PurchaseModal setShowModal={setShowModal} showModal={showModal} selectedLicense={selectedLicense} setMessage={props.setMessage} nftAddress={props.nftAddress} />}

      <Row className='mx-5 mt-3 mb-5'>
        <Col md={3} className="mb-2">
          <Button className="exit back " onClick={() => props.setNftAddress("")}><img src={Back} alt="back" />
            <h5 className="h5-back ">Back</h5>
          </Button>
        </Col>
        <Col md={6} className="inline-box market-line mb-2">
          <h6 className="inline2 me-3 "> Reference dataset: </h6>
          <h6 className="inline2 subtitle"> {props.nftAddress}</h6>
        </Col>
      </Row>
      <Row className='mx-5 inline-box mb-4'>
        <h4 className="inline2 ">
          {props.authState ? "Press the BUY button and purchase licenses using your DataCellar tokens." : "Sign up and Sign in to Data Cellar in order to purchase these licenses."} </h4>
      </Row>
      <Row className="mx-5 mt-5">
        <Table responsive striped bordered hover className="table-border" >
          <thead >
            <tr >
              <th className="table-header">Address</th>
              <th className="table-header">Name</th>
              <th className="table-header">Symbol</th>
              <th className="table-header">Type</th>
              <th className="table-header">Period</th>
              <th className="table-header">Price</th>
              <th className="table-header">Purchase</th>
            </tr>
          </thead>
          <tbody>
            {licenses.length > 0 ? (
              licenses.map((license, index) => (
                <tr key={index}>
                  <td className=" align-middle text-center">{license.licenseAddress}</td>
                  <td className=" align-middle text-center">{license.name}</td>
                  <td className=" align-middle text-center">{license.symbol}</td>
                  {(license.type === "usage") ?
                    <td colSpan={2} className=" align-middle text-center">Single Usage</td> :
                    <td className=" align-middle text-center">{license.type}</td>
                  }
                  {(license.type === "usage") ? "" :
                    <td className=" align-middle text-center">{`${license.period} months`}</td>
                  }
                  <td className=" align-middle text-center">{license.price}</td>
                  <td className=" align-middle text-center">
                    <Button className="buy-btn" disabled={!props.authState} onClick={() => { setShowModal(true); setSelectedLicense(license); }}> Buy Now! </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className=" align-middle text-center" colSpan="7">There are no licenses available for purchase for this dataset at the moment.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}

export default MarketLicenses;