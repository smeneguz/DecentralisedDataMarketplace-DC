import { Button, Modal } from "react-bootstrap";
import "../App.css";
import { useMetaMask } from '../hooks/useMetaMask'
import { deleteDataset } from '../hooks/useMMdataset'

function DeleteDatasetModal(props) {

  const { setIsConnecting, setErrorMessage, isConnecting, wallet } = useMetaMask();

  const handleDelete = async () => {
    setIsConnecting(true);
    try {
        await deleteDataset(wallet.accounts[0], props.selectedDataset);
        props.setMessage(`The dataset saved at address ${props.selectedDataset} was deleted.`);
    } catch (error) {
      setErrorMessage(`${error.message}`);
    }
    setIsConnecting(false);
  }

  return (
    <Modal size="md" className="vc-modal " aria-labelledby="contained-modal-title-vcenter" show={props.showDeleteModal} >
      <Modal.Header className='modalHeaderBorder' >
        <Modal.Title className='modalTitle'>Confirm elimination </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBodyBorder'>
        <h6>Are you sure you want to delete the dataset saved at: {props.selectedDataset} ? </h6>
      </Modal.Body>
      <Modal.Footer className='modalFooterBorder'>
        <Button className='undo' onClick={() => props.setShowDeleteModal(false)}>
          Undo
        </Button>
        <Button className='exit' onClick={() => handleDelete()} disabled={isConnecting} >
          {isConnecting ? "Loading" : "Delete"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteDatasetModal;