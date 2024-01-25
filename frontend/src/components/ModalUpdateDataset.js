import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import "../App.css";
import { useMetaMask } from '../hooks/useMetaMask'
import { updateDataset } from '../hooks/useMMdataset'
import { validateSymbol, validateDatasetName, validateEthereumAddress } from "../hooks/utils";
import { useState } from 'react';

function UpdateDatasetModal(props) {

  const { setIsConnecting, setErrorMessage, isConnecting, wallet } = useMetaMask();

  const [name, setName] = useState(props.selectedDataset.name);
  const [symbol, setSymbol] = useState(props.selectedDataset.symbol);
  const [tokenURI, setTokenURI] = useState(props.selectedDataset.getTokenUri);
  const [transferable, setTransferable] = useState(props.selectedDataset.transferable);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsConnecting(true);
    if (validateDatasetName(name)) {
      if (validateSymbol(symbol)) {
        if (validateEthereumAddress(tokenURI)) {
          try {
            const updateData = {};
            if (name !== props.selectedDataset.name) { updateData.name = name; }
            if (symbol !== props.selectedDataset.symbol) { updateData.symbol = symbol; }
            if (tokenURI !== props.selectedDataset.getTokenUri) { updateData.tokenURI = tokenURI; }
            if (transferable !== props.selectedDataset.transferable) { updateData.transferable = transferable; }
            await updateDataset(wallet.accounts[0], props.selectedDataset.nftAddress, updateData);
            props.setMessage(`The dataset has been updated. Check out the new changes in this section.`);
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
    <Modal size="xl" className="vc-modal " aria-labelledby="contained-modal-title-vcenter" show={props.showUpdateModal} >
      <Modal.Header className='modalHeaderBorder' >
        <Modal.Title className='modalTitle'>Update your Dataset </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className='modalBodyBorder'>
          <h6>Edit the stored dataset at address {props.selectedDataset.nftAddress} and press the Save button. </h6>
          <Row className='mx-2 mt-3 mb-3'>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 className=" "> Name</h5></Form.Label>
                <Form.Control type="value" className="value-form2  " required value={name} onChange={ev => setName(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 className=" "> Symbol</h5></Form.Label>
                <Form.Control type="value" className="value-form2 " required value={symbol} onChange={ev => setSymbol(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 className=" "> TokenURI </h5></Form.Label>
                <Form.Control type="value" className="value-form2 " required value={tokenURI} onChange={ev => setTokenURI(ev.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group >
                <Form.Label><h5 className=" "> Transferable </h5></Form.Label>
                <Form.Check aria-label="option 1" className="mx-5 check-box mt-2" isValid checked={transferable} onChange={ev => setTransferable(ev.target.checked)} />
              </Form.Group>
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

export default UpdateDatasetModal;