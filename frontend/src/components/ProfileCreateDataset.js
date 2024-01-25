import { Col, Row, Container, Button, Form } from "react-bootstrap";
import "../App.css";
import { useState } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'
import { createDataset } from '../hooks/useMMdataset'
import { validateSymbol, validateDatasetName, validateEthereumAddress } from "../hooks/utils";

function ProfileCreateDataset(props) {

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [transferable, setTransferable] = useState(true);

  const { isConnecting, setErrorMessage, wallet, setIsConnecting } = useMetaMask();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsConnecting(true);
    if (validateDatasetName(name)) {
      if (validateSymbol(symbol)) {
        if (validateEthereumAddress(tokenURI)) {
          try {
            await createDataset(wallet.accounts[0], name, symbol, tokenURI, transferable)
            props.setMessage(`The dataset has been created. You can see your new dataset in the "Manage your Datasets" section.`);
          } catch (error) {
            setErrorMessage(`${error.message}`);
          }
        } else {
          setErrorMessage("Invalid tokeURI.");
        }
      } else {
        setErrorMessage("Invalid symbol.");
      }
    } else {
      setErrorMessage("Invalid name.");
    }
    setIsConnecting(false);
  }

  return (
    <Container>
      <Row className="box-center mb-3">
        <Form onSubmit={handleSubmit}>
          <Row className='mx-2'>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 className=" "> Name</h5></Form.Label>
                <Form.Control type="value" placeholder="Insert Name" className="value-form2  " required value={name} onChange={ev => setName(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 className=" "> Symbol</h5></Form.Label>
                <Form.Control type="value" placeholder="Insert Symbol" className="value-form2 " required value={symbol} onChange={ev => setSymbol(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 className=" "> TokenURI </h5></Form.Label>
                <Form.Control type="value" placeholder="Insert TokeURI" className="value-form2 " required value={tokenURI} onChange={ev => setTokenURI(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 className=" "> Transferable </h5></Form.Label>
                <Form.Check aria-label="option 1" className="mx-5 check-box mt-2" isValid checked={transferable} onChange={ev => setTransferable(ev.target.checked)} />
              </Form.Group>
            </Col>
          </Row>
          <Row className='box-center mb-3 pb-2 mt-2'>
            <Button className="signup-btn mt-5" disabled={isConnecting} type="submit" >
              {isConnecting ? "Loading" : "Create New Dataset"}
            </Button>
          </Row>
        </Form>
      </Row>
    </Container>
  );
}

export default ProfileCreateDataset;