import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { verifyJwtToken } from '@/auth/auth';
import web3Init from '../../core/web3.core'
import ncrypt from "ncrypt-js";
import { AddressAndKey } from '@/queries/newuser';
import * as dotenv from 'dotenv'
import LicensePeriod from '@/interfaces/licensePeriod';
import template721 from "../../../smartcontracts/build/contracts/ERC721template.json"

dotenv.config();

export const config = {
	api: {
		bodyParser: false,
	},
}

/**
 * @route POST /api/uploadLicensePeriod
 * @description Publish a new "period" license (ERC20 contract) associated to a specific NFT (dataset or service - no differences at this implementation point).
 * @access Private (Valid Bearer Token is needed) - You need to be logged in to have a valid Bearer Token.
 * @param {string} req.body.username - The username of the user
 * @param {string} req.body.nftAddress - The address of the NFT you want to create a new period license
 * @param {number} req.body.price - The price of the new period license
 * @param {string} req.body.name - The name of the new period license
 * @param {string} req.body.symbol - The symbol of the new period license
 * @param {string[]} req.body.minters - Addresses of users who have minters role (length: 3, consider at the moment you should only insert the address of the owner of the nft 3 times) - TODO: We need more analysis here
 * @param {number} req.body.cap - Maximum amount of ERC20 token mintable 
 * @param {number} req.body.period - Duration of the licence from the time of purchase
 * @returns {Object}:
 * @returns {boolean} success - True: Operation succeded; False: Operation Failed
 * @returns {string} name - The same as input
 * @returns {string} symbol - The same as input
 * @returns {string} type - Type of license -> always "period"
 * @returns {number} period - The same as input
 * @returns {string[]} minters - The same as input
 * @returns {number} cap - The same as input
 * @returns {number} price - The same as input
 * @returns {string} licenseAddress - Address of the new license (ERC20 contract) created
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'POST') {
        return res.status(405).end()
    }
    const form = new formidable.IncomingForm();
    form.parse(req, async (err: any, fields: any) => {
        const token = req.headers.authorization!.split(' ')[1] as string;
        const validation = verifyJwtToken(token, fields["username"]);
        if(validation == false){
            return res.status(400).json({ error: 'Invalid Token' });
        }

        if (err) {
			console.error('Error', err)
			return res.status(400).json({ error: 'Bad Request', message: err.message })
		}
        try{
            const licensePeriod: LicensePeriod = {
                usernameOwner: fields["username"],
                nftAddress: fields["nftAddress"],
                price: fields["price"],
                name: fields["name"], 
                symbol: fields["symbol"],
                minters: fields["minters"], //Così non funziona. Bisogna separare i valori su 3 differenti campi e poi unirli dopo
                cap: fields["cap"],
                period: fields["period"]
            }
            const credentials: any = await AddressAndKey(licensePeriod.usernameOwner);
            const chainObj = web3Init();    
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(credentials.privatekey));
            const erc721 = new chainObj.web3.eth.Contract(template721.abi as any, licensePeriod.nftAddress)
            await erc721.methods.
                createERC20([licensePeriod.name, licensePeriod.symbol], licensePeriod.minters, licensePeriod.cap, "period", licensePeriod.price, licensePeriod.period)
                .send({from: credentials.address, gas: 5000000})
                .on('transactionHash', async (hash: string) => {
                    //potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
                    //per ora non lo gestiamo e lo vado a stampare in console
                    console.log(hash)
                })
                .on('receipt', async (receipt: any) => {
                    //tutti i dati sulla transazione, se arrivo qua è andata a buon fine
                    console.log(receipt)
                    return res
                            .status(200)
                            .json({ success: true, data: { name: licensePeriod.name, symbol: licensePeriod.symbol,  minters: licensePeriod.minters, cap: licensePeriod.cap, type: "period", price: licensePeriod.price, period: licensePeriod.period, licenseAddress: receipt.events.licenseERC20Created.returnValues.licenseErc20} })
                })
                .on('error', async (error: any) => {
                    return res.status(500).json({ error: 'Internal Server Error', message: error.reason })
                })
        } catch(error: any){
            res.status(500).json({error: "Bad request", message: error.message})
        }
    })
}