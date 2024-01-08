import Web3 from 'web3';
import DCT from '../utils/misc/DataCellarToken.json';
import factory from '../utils/misc/FactoryERC721.json';

export default function web3Init(){
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    const instance = new Web3(provider);
    const DataCellarToken = new instance.eth.Contract(DCT.abi as any, process.env.dct_ADDRESS!);
    const factory721 = new instance.eth.Contract(factory.abi as any, process.env.factory_ADDRESS!);
    return {web3: instance, DataCellarToken, factory721}
}
