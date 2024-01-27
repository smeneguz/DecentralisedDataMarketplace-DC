import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import "../App.css";
import { useMetaMask } from '../hooks/useMetaMask'
import { updateLicense } from '../hooks/useMMlicense'
import { validateSymbol, validateDatasetName, validateNumber } from "../hooks/utils";
import { useState } from 'react';

function UpdateLicenseModal(props) {

  const [period, setPeriod] = useState(props.selectedLicense.period);
  const [price, setPrice] = useState(props.selectedLicense.price);
  const [cap, setCap] = useState(props.selectedLicense.cap);
  const [name, setName] = useState(props.selectedLicense.name.split('_')[1]);
  const [symbol, setSymbol] = useState(props.selectedLicense.symbol.split('_')[1]);

  const { isConnecting, setErrorMessage, wallet, setIsConnecting, nftAddress } = useMetaMask();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsConnecting(true);
    if (validateDatasetName(name)) {
      if (validateSymbol(symbol)) {
        if (validateNumber(period) || (props.selectedLicense.type !== "period")) {
          if (validateNumber(price)) {
            try {
              const updateDataLicense = {};
              if (name !== props.selectedLicense.name.split('_')[1]) { updateDataLicense.name = props.selectedLicense.name.split('_')[0] + "_" + name; }
              if (symbol !== props.selectedLicense.symbol.split('_')[1]) { updateDataLicense.symbol = props.selectedLicense.symbol.split('_')[0] + "_" + symbol; }
              if (price !== props.selectedLicense.price) { updateDataLicense.price = price; }
              if (period !== props.selectedLicense.period) { updateDataLicense.period = period; }
              await updateLicense(wallet.accounts[0], nftAddress, props.selectedLicense.address, updateDataLicense);
              props.setMessage(`The license has been updated. Check out the new changes in this section.`);
            } catch (error) {
              setErrorMessage(`${error.message}`);
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
    setIsConnecting(false);
  }

  return (
    <Modal size="xl" className="vc-modal " aria-labelledby="contained-modal-title-vcenter" show={props.showUpdateModal} >
      <Modal.Header className='modalHeaderBorder' >
        <Modal.Title className='modalTitle'>Update your License </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className='modalBodyBorder'>
          <h6>Edit the stored license at address {props.selectedLicense.address} and press the Save button. </h6>
          <Row className='mx-2 mt-3 mb-3'>
            <Col md={(props.selectedLicense.type === "period") ? 3 : 4}>
              <Form.Group >
                <Form.Label><h5 className=" "> Name</h5></Form.Label>
                <Form.Control type="value" placeholder="Insert Name" className="value-form3  " required value={name} onChange={ev => setName(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={(props.selectedLicense.type === "period") ? 3 : 4}>
              <Form.Group >
                <Form.Label><h5 className=" "> Symbol</h5></Form.Label>
                <Form.Control type="value" placeholder="Insert Symbol" className="value-form3 " required value={symbol} onChange={ev => setSymbol(ev.target.value)} />
              </Form.Group>
            </Col>
            {(props.selectedLicense.type !== "period") ? "" :
              <Col md={2}>
                <Form.Group >
                  <Form.Label><h5 className=" "> Period </h5></Form.Label>
                  <Form.Control type="value" placeholder="Insert period" className="value-form3 " required value={period} onChange={ev => setPeriod(ev.target.value)} />
                </Form.Group>
              </Col>
            }
            <Col md={2}>
              <Form.Group >
                <Form.Label><h5 className=" "> Price </h5></Form.Label>
                <Form.Control type="value" placeholder="Insert price" className="value-form3 " required value={price} onChange={ev => setPrice(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group >
                <Form.Label><h5 className=" "> Cap </h5></Form.Label>
                <Form.Control type="value" placeholder="n" className="value-form3 " disabled value={cap} onChange={ev => setCap(ev.target.value)} />              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className='modalFooterBorder'>
          <Button className='exit' onClick={() => props.setShowUpdateModal(false)}>
            Undo
          </Button>
          <Button className='undo' disabled={isConnecting} type="submit" >
            {isConnecting ? "Loading" : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateLicenseModal;