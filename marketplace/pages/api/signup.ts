import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { newUser } from '@/queries/newuser';
import ncrypt from "ncrypt-js";
import Web3 from 'web3';
import * as dotenv from 'dotenv'
import web3Init from '../../core/web3.core'

dotenv.config();
const ganache = require("ganache");

export const config = {
	api: {
		bodyParser: false,
	},
}

//At the moment of the signup we create a wallet for the user and we send an amount of money to enable transactions
//10 ETH to pay gas (we need to think a way to give other money in case it finishes), 20.000 DCT (big amount, we need to consider in future an appropriate conversion rate)

/**
 * @route POST /api/signup
 * @description Some operations as follows:
 *                - Add new user to local db (Identity provider for testing --> In production we will take this information from outside);
 *                - Association between User Identity and User Blockchain Identity;
 *                - Initial remuneration in user's wallet: 10 ETH to pay gas (we need to think a way to give other money in case it finishes), 20.000 DCT (big amount, we need to consider in future an appropriate conversion rate);
 * @access Public
 * @param {string} req.body.username - The username inserted by the user
 * @param {string} req.body.password - The password associated to the new user account
 * @returns {Object} 2 fields: 
 * @returns {boolean} true if everything is ok!
 * @returns {number} DataCellarToken balance of the new user added to DB (it should be 20k)
 */

export default function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'POST') {
		return res.status(405).end()
	}
    const form = new formidable.IncomingForm();
    form.parse(req, async (err: any, fields: any) => {
        if (err) {
			console.error('Error', err)
			return res.status(400).json({ error: 'Bad Request', message: err.message })
		}
        // TODO : add new controls
        if(!fields["username"] || !fields["password"]){
            return res.status(400).json({ error: 'Bad Request', message: "username or password empty" })
        }

        try{
            const chainObj = web3Init();
            const info = chainObj.web3.eth.accounts.create();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            await newUser(fields["username"], fields["password"], info["address"], ncryptObject.encrypt(info["privateKey"]));
            chainObj.web3.eth.accounts.wallet.add(process.env.privateKEY!)
            chainObj.web3.eth.accounts.wallet.add(info["privateKey"])
            await chainObj.web3.eth.sendTransaction({to: info["address"], from: process.env.owner_ADDRESS!, value: chainObj.web3.utils.toWei("110", "ether"), gas: 50000})
            await chainObj.DataCellarToken.methods
                .convertEtherToTokens()
                .send({from: info["address"], value: chainObj.web3.utils.toWei('100', 'ether'), gas: 500000})
                .on('transactionHash', async (hash: string) => {
                    //potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
                    //per ora non lo gestiamo e lo vado a stampare in console
                })
                .on('receipt', async (receipt: any) => {
                    //tutti i dati sulla transazione, se arrivo qua è andata a buon fine
                    console.log(receipt)
                    const value = await chainObj.DataCellarToken.methods.balanceOf(info["address"]).call({from: info["address"]})
                    //console.log(value)
                    return res
                        .status(200)
                        .json({ success: true, value})
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