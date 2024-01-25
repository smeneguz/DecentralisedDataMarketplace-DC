import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import "../App.css";
import { useMetaMask } from '../hooks/useMetaMask'
import { validateNumber } from "../hooks/utils";
import { useState } from 'react';
import { buyLicense } from "../hooks/useMMmarket";

function PurchaseModal(props) {

  const [amount, setAmount] = useState(1);

  const { isConnecting, setErrorMessage, wallet, setIsConnecting } = useMetaMask();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsConnecting(true);
    if (validateNumber(amount) || (props.selectedLicense.type === "period")) {
      try {
        const purchaseLicense = { licenseAddress: props.selectedLicense.licenseAddress, nftAddress: props.nftAddress };
        if (props.selectedLicense.type !== "period") { purchaseLicense.amount = amount; }
        await buyLicense(wallet.accounts[0], purchaseLicense);
        props.setMessage(`The license has been bought. You can see this licenses in the "Purchased Licenses" section in your profile.`);
      } catch (error) {
        setErrorMessage(`${error.message}`);
      }
    } else {
      setErrorMessage("Invalid amount.");
    }
    setIsConnecting(false);
  }

  return (
    <Modal size="lg" className="vc-modal " aria-labelledby="contained-modal-title-vcenter" show={props.showModal} >
      <Modal.Header className='modalHeaderBorder' >
        <Modal.Title className='modalTitle'>Purchase a License </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className='modalBodyBorder'>
          {(props.selectedLicense.type === "period") ?
            <h5>
              You are purchasing the license{' '}
              <span className="subtitle">{props.selectedLicense.name}</span>, for a period of{' '}
              <span className="subtitle">{props.selectedLicense.period} months</span>, related to the dataset stored at address{' '}
              <span className="subtitle">{props.nftAddress}</span>, at a cost of  {' '}
              <span className="subtitle">{props.selectedLicense.price} DataCellar </span> tokens.
            </h5> :
            <h5>
              You are purchasing the single usage license{' '}
              <span className="subtitle">{props.selectedLicense.name}</span>, related to the dataset stored at address{' '}
              <span className="subtitle">{props.nftAddress}</span>, at a cost of  {' '}
              <span className="subtitle">{props.selectedLicense.price} DataCellar  </span> tokens each.
            </h5>
          }
          {(props.selectedLicense.type === "period") ? "" :
            <Row className='mx-2 mt-3 mb-3'>
              <Col md={2}> <h5 className="inline"> Amount: </h5></Col>
              <Col md={4}> <Form.Control type="value" placeholder="Insert period" className="value-form3 " required value={amount} onChange={ev => setAmount(ev.target.value)} />  </Col>
              <Col md={2}> <h5 className="inline"> Total cost: </h5></Col>
              <Col md={4}> <Form.Control type="value" placeholder={amount * props.selectedLicense.price} className="value-form3 " required disabled />  </Col>
            </Row>
          }
        </Modal.Body>
        <Modal.Footer className='modalFooterBorder'>
          <Button className='exit' onClick={() => props.setShowModal(false)}>
            Undo
          </Button>
          <Button className='undo' disabled={isConnecting} type="submit" >
            {isConnecting ? "Loading" : "Buy Now"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default PurchaseModal;