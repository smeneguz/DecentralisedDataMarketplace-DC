import Web3 from 'web3';
import DCT from '../contract/DataCellarToken.json';
import factory from '../contract/FactoryERC721.json';

export default function web3Init() {
  if (window.ethereum) {
    const instance = new Web3(window.ethereum); 
    const DataCellarToken = new instance.eth.Contract(DCT.abi, "0xefbF81372aBC3723463746a89CEb42080563684C");
    const factory721 = new instance.eth.Contract(factory.abi, "0xD5D7f7bF241812A3Cc2508A2Fb177EFA4A573e5C");
    return { web3: instance, DataCellarToken, factory721 }
  } else {
    throw new Error('MetaMask not detected. Please install MetaMask to use this feature.');
  }
}