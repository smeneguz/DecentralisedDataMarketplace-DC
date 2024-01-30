import { Col, Row, Container, Button, Form } from "react-bootstrap";
import "../App.css";
import { useState, useEffect } from 'react';
import { convertDataCellarToken, getBalance, getGasBalance } from '../hooks/useMMbalance'
import { validateInteger } from "../hooks/utils";
import { useMetaMask } from '../hooks/useMetaMask'

function ProfileBalance(props) {

  const { wallet, setErrorMessage, isConnecting, setIsConnecting } = useMetaMask();

  const [token, setToken] = useState();
  const [eth, setEth] = useState();
  const [value, setValue] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await getBalance(wallet.accounts[0]);
        setToken(res1);
        const res2 = await getGasBalance(wallet.accounts[0]);
        setEth(res2);
      } catch (error) {
        setErrorMessage(`${error.message}`);
      }
    }
    fetchData();
    return () => { };
  }, [wallet, setErrorMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsConnecting(true)
    if (validateInteger(value)) {
      if (value < eth) {
        try {
          const res = await convertDataCellarToken(wallet.accounts[0], value);
          props.setMessage(`You have now ${res} DataCellar tokens.`);
        } catch (error) {
          setErrorMessage(`${error.message}`);
        }
      } else {
        setErrorMessage("Not enough Ether in your account.");
      }
    } else {
      setErrorMessage("Invalid input: Please enter a number less than or equal to your Ether");
    }
    setIsConnecting(false)
  }

  return (
    <Container>
      <Row className='mx-2 mt-3 mb-4'>
        <h2 className='formText'> Manage Balance </h2>
      </Row>
      <Row className='mx-2'>
        <h4> This is your balance sheet: </h4>
      </Row>
      <Row className="box-center mt-5">
        <Col md={{ offset: 1, span: 5 }} className="mb-4">
          <h6 className="inline mx-3"> DataCellar Tokens: </h6>
          <h5 className="value-box inline p-3"> {token} </h5>
        </Col>
        <Col md={6} className="mb-4">
          <h6 className="inline mx-3"> Ethereum: </h6>
          <h5 className="value-box inline p-3" > {eth} </h5>
        </Col>
      </Row>
      <Row className="mt-5 mx-2">
        <Col md={12}>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Form.Group >
                <Form.Label><h4 className="inline "> Do you want to convert new ETH to DataCellar tokens?</h4></Form.Label>
                <Form.Control type="value" placeholder="Insert ETH amount" className="value-form mx-4" required value={value} onChange={ev => setValue(ev.target.value)} />
              </Form.Group>
            </Row>
            <Row>
              <h5 className="mt-4"> The price of a single DataCellar token is 0.0005 ETH, at the moment. </h5>
            </Row>
            <Row className='box-center mb-3 pb-2 '>
              <Button className="signup-btn mt-4" disabled={isConnecting} type="submit" >
                {isConnecting ? "Loading" : "Convert Token"}
              </Button>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfileBalance;