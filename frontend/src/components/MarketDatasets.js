import { Row, Container, Table, Tooltip, OverlayTrigger } from "react-bootstrap";
import "../App.css";
import { useState, useEffect } from 'react';
import { useMetaMask } from '../hooks/useMetaMask'
import { truncateString2 } from "../hooks/utils";
import { default as License } from '../assets/license.svg';
import MarketLicenses from "./MarketLicenses";
import { getPublicDatasets } from "../hooks/useMMmarket";

function MarketDatasets(props) {

  const [datasets, setDatasets] = useState([]);

  const { setErrorMessage, wallet, setNftAddress, nftAddress, wrongNetwork } = useMetaMask();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPublicDatasets(wallet.accounts[0]);
        setDatasets(result);
      } catch (error) {
        if (wrongNetwork) {
          setErrorMessage(`This network is not available at the moment. Please, change your network to Ganache.`);
        } else {
          setErrorMessage(`${error.message}`);
        }
      }
    };
    fetchData();
    return () => { };
  }, [wallet.accounts, setErrorMessage, props.message, props]);

  const renderTooltip = (props) => (
    <Tooltip className="ind" id="button-tooltip" {...props}>
      View Licenses
    </Tooltip>
  );

  return (
    <Container>
      {nftAddress ?
        <MarketLicenses setMessage={props.setMessage} authState={props.authState} /> :
        <Container fluid className="mt-5 pt-5 profile home  ">
          <Row className="box-center mb-4">
            <h1 className='formText inline2' > Data Cellar Marketplace </h1>
          </Row>
          <Row className='mx-5'>
            <h4 > Here are all the transferable datasets loaded into Data Cellar. Check out their available licenses! </h4>
          </Row>
          <Row className="mx-5 mt-4 mb-3 ">
            <Container className="table-container">
              <Table responsive striped bordered hover className="table-border " >
                <thead >
                  <tr >
                    <th className="table-header">Owner Address</th>
                    <th className="table-header">NFTaddress</th>
                    <th className="table-header">Name</th>
                    <th className="table-header">Symbol</th>
                    <th className="table-header">TokenURI</th>
                    <th className="table-header">Licenses</th>
                  </tr>
                </thead>
                <tbody className="">
                  {datasets.length > 0 ? (
                    datasets?.map((dataset, index) => (
                      <tr key={index}>
                        <td className="table-value text-center">{dataset.ownerAddress}</td>
                        <td className="table-value text-center">{dataset.nftAddress}</td>
                        <td className="table-value text-center">{dataset.name}</td>
                        <td className="table-value text-center">{dataset.symbol}</td>
                        <td className="table-value text-center">
                          <p className="uri" onClick={() => { window.open(dataset.getTokenUri, '_blank') }}> {truncateString2(dataset.getTokenUri)} </p>
                        </td>
                        <td className=" text-center">
                          <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip} >
                            <img src={License} alt="license" className="select" onClick={() => setNftAddress(dataset.nftAddress)} />
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className=" text-center" colSpan="6">There are no Datasets available in Data Cellar at the moment.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Container>
          </Row>
        </Container>
      }
    </Container>
  );
}

export default MarketDatasets;