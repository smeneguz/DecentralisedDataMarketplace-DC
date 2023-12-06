import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { logIn, AddressAndKey } from '@/queries/newuser';
import { generateJwtToken, verifyJwtToken } from '@/auth/auth';
import web3Init from '../../core/web3.core'
import ncrypt from "ncrypt-js";
import * as dotenv from 'dotenv'

dotenv.config();

export const config = {
	api: {
		bodyParser: false,
	},
}

/**
 * @route GET /api/getBalance
 * @description Retrieve DataCellarToken Balance of a specific user.
 * @access Private (Valid Bearer Token is needed) - You need to be logged in to have a valid Bearer Token.
 * @param {string} req.query.username - The username you want to know the balance (YOUR - the one you used to logged in)
 * @returns {string} balance - User Balance.
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
            const credentials: any = await AddressAndKey(req.query.username as string);
            //ora reperiamo le informazioni riguardo agli NFT disponibili che possono essere acquistati
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(credentials.privatekey));
            const balance = await chainObj.DataCellarToken.methods.balanceOf(credentials.address).call({from: credentials.address})
            res.status(200).json({balance})
        }catch(error: any){
            res.status(500).json({error: "Bad request", message: error.message})
        }
    } else {
        return res.status(405).end()
    }
}