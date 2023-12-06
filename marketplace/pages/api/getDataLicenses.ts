import { NextApiRequest, NextApiResponse } from 'next';
import { AddressAndKey } from '@/queries/newuser';
import { verifyJwtToken } from '@/auth/auth';
import web3Init from '../../core/web3.core'
import ncrypt from "ncrypt-js";
import * as dotenv from 'dotenv'
import template721 from "../../../smartcontracts/build/contracts/ERC721template.json"
import template20 from "../../../smartcontracts/build/contracts/ERC20template.json"

dotenv.config();

export const config = {
	api: {
		bodyParser: false,
	},
}

/**
 * @route GET /api/getDataLicenses
 * @description Retrieve all Licenses (ERC20 contracts) associated to a specific NFT (Dataset or tool - ERC721)
 * @access Private (Valid Bearer Token is needed) - You need to be logged in to have a valid Bearer Token.
 * @param {string} req.query.username - The username of the user
 * @param {string} req.query.nftAddress - The address of the NFT you want to visualize licenses (ERC20 contracts)
 * @returns {Object[]} licensesList - List of all licenses associated to a specific NFT
 * @returns {string} name - name of the license
 * @returns {string} symbol - symbol of the license
 * @returns {string} licenseType - "usage" or "period"
 * @returns {number=} licensePeriod - If the licenseType is "period" you will have this field specifying duration of license (optional)
 * @returns {number} price - price of the license
 * @returns {string} licenseAddress - address of the license (ERC20 contract)
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
            const data = await getAllDataLicenses(req.query.username as string, req.query.nftAddress as string)
            res.status(200).json({data})
        } catch(error: any){
            res.status(500).json({error: "Bad request", message: error.message})
        }
    } else {
        return res.status(405).end()
    }
}

async function getAllDataLicenses(username: string, nftAddress: string){
    //prendo le informazioni sull'indirizzo e chiave privata dell'utente che vuole collegarsi
    const credentials: any = await AddressAndKey(username);
    //ora reperiamo le informazioni riguardo agli NFT disponibili che possono essere acquistati
    const chainObj = web3Init();
    const ncryptObject = new ncrypt(process.env.encryption_KEY!)
    chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(credentials.privatekey));
    //prendo gli indirizzi di tutti i contratti che rappresentano un singolo NFT
    const erc721template = new chainObj.web3.eth.Contract(template721.abi as any, nftAddress);

    const response = await erc721template.methods.getTokensList()
        .call({from: credentials.address})
    const licensesList = await Promise.all(response.map(async (licenseAddress: string) =>{
        const erc20template = new chainObj.web3.eth.Contract(template20.abi as any, licenseAddress);
        const name = await erc20template.methods.name().call({from: credentials.address});
        const symbol = await erc20template.methods.symbol().call({from: credentials.address});
        const licenseType = await erc20template.methods.getlicenseType().call({from: credentials.address});
        const price = await erc20template.methods.price().call({from: credentials.address});
        if(licenseType == "period"){
            const licensePeriod = await erc20template.methods.getLicensePeriod().call({from: credentials.address});
            return {name, symbol, licenseType, licensePeriod, price, licenseAddress}
        } else {
            return {name, symbol, licenseType, price, licenseAddress}
        }
    }))
    
    return licensesList;
}