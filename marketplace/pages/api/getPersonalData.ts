import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { logIn, AddressAndKey } from '@/queries/newuser';
import { generateJwtToken, verifyJwtToken } from '@/auth/auth';
import web3Init from '../../core/web3.core'
import ncrypt from "ncrypt-js";
import * as dotenv from 'dotenv'
import template721 from "../../../smartcontracts/build/contracts/ERC721template.json"

dotenv.config();

export const config = {
	api: {
		bodyParser: false,
	},
}

/**
 * @route GET /api/getPersonalData
 * @description Retrieve all yours NFTs (dataset and services) available on Blockchain (Marketplace).
 * @access Private (Valid Bearer Token is needed) - You need to be logged in to have a valid Bearer Token.
 * @param {string} req.query.username - The username of the user
 * @returns {Object[]} NFTlistFiltered - List of all NFTs published on blockchain
 * @returns {string} name - name of the NFT
 * @returns {string} symbol - symbol of the NFT
 * @returns {string} ownerAddress - Address of the NFT owner
 * @returns {string} getTokenUri - Token Uri of the NFT
 * @returns {string} nftAddress - Address of the NFT
 * @returns {boolean} transferable:
 *                      - true: NFT is transferable;
 *                      - false: NFT is not transferable
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method === 'GET') {
        //console.log(req.query);
        const token = req.headers.authorization!.split(' ')[1] as string;
        const validation = verifyJwtToken(token, req.query.username as string);
        //console.log(validation.userId)
        if(validation == false){
            return res.status(500).json({error: "Invalid Token"});
        }
        try{
        const data = await getPersonalNFT(req.query.username as string)
            res.status(200).json({data})
        }catch(error: any){
            res.status(500).json({error: "Bad request", message: error.message})
        }
    } else {
        return res.status(405).end()
    }
}

async function getPersonalNFT(username: string){
    //prendo le informazioni sull'indirizzo e chiave privata dell'utente che vuole collegarsi
    const credentials: any = await AddressAndKey(username);
    //ora reperiamo le informazioni riguardo agli NFT disponibili che possono essere acquistati
    const chainObj = web3Init();
    const ncryptObject = new ncrypt(process.env.encryption_KEY!)
    chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(credentials.privatekey));
    //prendo gli indirizzi di tutti i contratti che rappresentano un singolo NFT
    const response = await chainObj.factory721.methods.geterc721array()
        .call({from: credentials.address})

    const NFTlist = await Promise.all(response.map(async (nftAddress: string) =>{
        const erc721template = new chainObj.web3.eth.Contract(template721.abi as any, nftAddress);
        const transferable = await erc721template.methods.transferable().call({from: credentials.address});;
        const ownerAddress = await erc721template.methods.ownerAddress().call({from: credentials.address});
        if(credentials.address == ownerAddress){
        const name = await erc721template.methods.name().call({from: credentials.address});
        const symbol = await erc721template.methods.symbol().call({from: credentials.address});
        const getTokenUri = await erc721template.methods.getTokenUri().call({from: credentials.address});
        return {name, symbol, ownerAddress, getTokenUri, nftAddress, transferable}
        }
    }))
    const NFTlistFiltered = NFTlist.filter((nft) => nft !== undefined);

    return NFTlistFiltered;
}