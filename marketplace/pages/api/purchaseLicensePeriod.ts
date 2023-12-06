import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { logIn, AddressAndKey, KeyFromAddress } from '@/queries/newuser';
import { generateJwtToken, verifyJwtToken } from '@/auth/auth';
import web3Init from '../../core/web3.core'
import ncrypt from "ncrypt-js";
import * as dotenv from 'dotenv'
import erc20template from '../../../smartcontracts/build/contracts/ERC20template.json'
import erc721template from '../../../smartcontracts/build/contracts/ERC721template.json'

dotenv.config();

export const config = {
	api: {
		bodyParser: false,
	},
}

/**
 * @route POST /api/purchaseLicensePeriod
 * @description User purchases a license "period" (ERC20 datatoken) associated to a specific NFT (dataset or service - ERC721 contract)
 * @access Private (Valid Bearer Token is needed) - You need to be logged in to have a valid Bearer Token.
 * @param {string} req.body.username - The username of the user
 * @param {string} req.body.nftAddress - The address of the nft whose licence user wants to buy 
 * @param {string} req.body.licenseAddress - The address of the license user wants to buy
 * @returns {boolean} success - True: Operation succeded; False: Operation Failed
 * @returns {string} data - "License correctly buyed" (to decide if this field is useful -> personally i think no)
 * @returns {string} balance - The user balance of DataCellarToken 
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
            const credentials: any = await AddressAndKey(fields["username"]);
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(credentials.privatekey));
            
            //calculate total amount of DCT needed to buy the license & nftOwnerAddress
            const erc20 = new chainObj.web3.eth.Contract(erc20template.abi as any, fields["licenseAddress"])
            const price = await erc20.methods.price().call();
            const period = await erc20.methods.getlicenseType().call();
            if(period != "period"){
                return res.status(400).json({ error: 'Bad Request: license '+ fields["licenseAddress"]+" doesn't exist"})
            }
            const erc721 = new chainObj.web3.eth.Contract(erc721template.abi as any, fields["nftAddress"])
            const nftOwner = await erc721.methods.ownerAddress().call({from: credentials.address})
            const privateKeyOwner: any = await KeyFromAddress(nftOwner);
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(privateKeyOwner.privatekey));
            
            //we need to make contract allowances to manage user money to permit exchange of third party
            await chainObj.DataCellarToken.methods
                .approve(await chainObj.factory721.methods.paymentManager().call(), parseInt(price))
                .send({from: credentials.address, gas: 50000})

            await erc20.methods
                .approve(await chainObj.factory721.methods.paymentManager().call(), 1)
                .send({from: nftOwner, gas: 50000})

            await chainObj.factory721.methods.buyNFTlicensePeriod(fields["nftAddress"], fields["licenseAddress"])
                .send({from: credentials.address, gas: 5000000})
                .on('transactionHash', async (hash: string) => {
                    //potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
                    //per ora non lo gestiamo e lo vado a stampare in console
                    console.log(hash)
                })
                .on('receipt', async (receipt: any) => {
                    //tutti i dati sulla transazione, se arrivo qua è andata a buon fine
                    console.log(receipt)
                    const balance = await chainObj.DataCellarToken.methods.balanceOf(credentials.address).call({from: credentials.address})
                    return res
                        .status(200)
                        .json({ success: true, data: "License correctly buyed", balance})
                })
                .on('error', async (error: any) => {
                    console.log(error)
                    return res.status(500).json({ error: 'Internal Server Error', message: error.reason })
                })
        } catch(error: any){
            res.status(500).json({error: "Bad request", message: error.message})
        }
    })
}