import { Row, Container, Button, Table } from "react-bootstrap";
import "../App.css";
import { useState, useEffect } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'
import { default as Back } from '../assets/back.svg';
import { getPurchasedLicenses, consumeNFT } from "../hooks/useMMpurchased";

function ProfilePurchasedLicenses(props) {

  const [licenses, setLicenses] = useState([]);

  const { isConnecting, setErrorMessage, wallet, setIsConnecting, setNftAddress, nftAddress } = useMetaMask();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPurchasedLicenses(wallet.accounts[0], nftAddress);
        setLicenses(result);
      } catch (error) {
        setErrorMessage(`${error.message}`);
      }
    };

    fetchData();

    return () => { };
  }, [wallet.accounts, setErrorMessage, nftAddress]);

  const handleConsume = async (licenseAddress, licenseType) => {
    setIsConnecting(true);
    try {
      await consumeNFT(wallet.accounts[0], nftAddress, licenseAddress);
      if (licenseType === "usage")
        props.setMessage(`You have consumed a token for your single-use license.`);
      else {
        props.setMessage(`You have used your periodic license.`);
      }
    } catch (error) {
      setErrorMessage(`${error.message}`);
    }
    setIsConnecting(false);

  }

  return (
    <Container className="table-container">
      <Row className='mx-2 mt-3 mb-4'>
        <Button className="exit back" onClick={() => setNftAddress("")}><img src={Back} alt="back" />
          <h5 className="h5-back ">Back </h5>
        </Button>
      </Row>
      <Row className='mx-2 inline-box'>
        <h4 className="inline2"> All purchased licenses for the dataset at address: </h4>
        <h5 className="inline2"> {nftAddress}</h5>
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
              <th className="table-header">Validity</th>
              <th className="table-header">Consume</th>
            </tr>
          </thead>
          <tbody>
            {licenses.length > 0 ? (
              licenses.map((license, index) => (
                <tr key={index}>
                  <td className="table-value align-middle text-center">{license.address}</td>
                  <td className="table-value align-middle text-center">{license.name}</td>
                  <td className="table-value align-middle text-center">{license.symbol}</td>
                  {(license.type === "usage") ?
                    <td colSpan={2} className=" align-middle table-value  text-center">Single Usage</td> :
                    <td className=" align-middle table-value  text-center">{license.type}</td>
                  }
                  {(license.type === "usage") ? "" :
                    <td className=" align-middle table-value  text-center">{`${license.period} months`}</td>
                  }
                  <td className="table-value text-center align-middle">{(license.type === "period") ? `${license.startDate} - ${license.endDate}` : `${license.balance} tokens`}</td>
                  <td className=" text-center">
                    <Button className="use-btn" disabled={isConnecting} onClick={() => handleConsume(license.address, license.type)}> {isConnecting ? "Loading" : ((license.type === "usage") ? "Use One" : "Use")} </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className=" text-center" colSpan="7">You have no purchased licenses for this dataset.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}

export default ProfilePurchasedLicenses;