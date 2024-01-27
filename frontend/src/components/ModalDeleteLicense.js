import { Button, Modal } from "react-bootstrap";
import "../App.css";
import { useMetaMask } from '../hooks/useMetaMask'
import { deleteLicense } from '../hooks/useMMlicense'

function DeleteLicenseModal(props) {

  const { setIsConnecting, setErrorMessage, isConnecting, wallet, nftAddress } = useMetaMask();

  const handleDelete = async () => {
    setIsConnecting(true);
    try {
      await deleteLicense(wallet.accounts[0], nftAddress, props.selectedLicense);
      props.setMessage(`The license saved at address ${props.selectedLicense} was deleted.`);
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
        <h6>Are you sure you want to delete the dataset saved at: {props.selectedLicense} ? </h6>
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

export default DeleteLicenseModal;