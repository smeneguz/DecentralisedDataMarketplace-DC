import { Col, Row, Container, Button, Form } from "react-bootstrap";
import "../App.css";
import { useState } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'
import { createLicense } from '../hooks/useMMlicense'
import { validateNumber, validateEthereumAddress, validateDatasetName, validateSymbol } from "../hooks/utils";

function ProfileCreateLicenses(props) {

  const [type, setType] = useState("1");
  const [period, setPeriod] = useState('');
  const [NFTaddress, setNFTaddress] = useState('');
  const [price, setPrice] = useState('');
  const [cap, setCap] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');

  const { isConnecting, setErrorMessage, wallet, setIsConnecting } = useMetaMask();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsConnecting(true);
    if (validateEthereumAddress(NFTaddress)) {
      if (validateDatasetName(name)) {
        if (validateSymbol(symbol)) {
          if (validateNumber(period) || period === "") {
            if (validateNumber(price)) {
              if (validateNumber(cap)) {
                try {
                  await createLicense(wallet.accounts[0], NFTaddress, name, symbol, type, period, price, cap);
                  props.setMessage(`The license has been created. You can see your new license in the "Manage your Licenses" section.`);
                } catch (error) {
                  setErrorMessage(`${error.message}`);
                }
              } else {
                setErrorMessage('Invalid cap.');
              }
            } else {
              setErrorMessage("Invalid price.");
            }
          } else {
            setErrorMessage("Invalid period.");
          }
        } else {
          setErrorMessage("Invalid symbol.");
        }
      } else {
        setErrorMessage("Invalid name.");
      }
    } else {
      setErrorMessage("Invalid NFT address.");
    }
    setIsConnecting(false);
  }

  return (
    <Container>
      <Row className="box-center mb-3 ">
        <Form onSubmit={handleSubmit}>
          <Row className='mx-2'>
            <Col md={4}>
              <Form.Group >
                <Form.Label><h5 className=" "> NFT Address</h5></Form.Label>
                <Form.Control type="value" placeholder="Insert NFTaddress" className="value-form3  " required value={NFTaddress} onChange={ev => setNFTaddress(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group >
                <Form.Label><h5 className=" "> Name</h5></Form.Label>
                <Form.Control type="value" placeholder="Insert Name" className="value-form3  " required value={name} onChange={ev => setName(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group >
                <Form.Label><h5 className=" "> Symbol</h5></Form.Label>
                <Form.Control type="value" placeholder="Insert Symbol" className="value-form3 " required value={symbol} onChange={ev => setSymbol(ev.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row className='mx-2 mt-3'>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 > Type </h5></Form.Label>
                <Form.Select aria-label="Default select example" className="value-form3 " value={type} onChange={(ev) => setType(ev.target.value)}>
                  <option value="1">One Time</option>
                  <option value="2">Period</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 className=" "> Period Month </h5></Form.Label>
                <Form.Control type="value" disabled={type === "1"} placeholder={type === "1" ? "" : "Insert period"} className="value-form3 " required value={period} onChange={ev => setPeriod(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 className=" "> Price </h5></Form.Label>
                <Form.Control type="value" placeholder="Insert price" className="value-form3 " required value={price} onChange={ev => setPrice(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 className=" "> Cap </h5></Form.Label>
                <Form.Control type="value" placeholder="Insert cap" className="value-form3 " required value={cap} onChange={ev => setCap(ev.target.value)} />              </Form.Group>
            </Col>
          </Row>
          <Row className='box-center mb-3 pb-2 mt-2'>
            <Button className="signup-btn mt-5" disabled={isConnecting} type="submit">
              {isConnecting ? "Loading" : "Create New Licenses"}
            </Button>
          </Row>
        </Form>
      </Row>
      <Row className="mt-4 mx-2 mb-3">
        <p className="p-signup"> NOTE: You can enter and change the Cap value, but for now it is set automatically in the backend. </p>
      </Row>
    </Container>
  );
}

export default ProfileCreateLicenses;