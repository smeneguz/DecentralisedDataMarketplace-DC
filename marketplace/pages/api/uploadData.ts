import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { logIn } from '@/queries/newuser';
import { verifyJwtToken } from '@/auth/auth';
import web3Init from '../../core/web3.core'
import ncrypt from "ncrypt-js";
import { AddressAndKey } from '@/queries/newuser';
import * as dotenv from 'dotenv'

dotenv.config();

export const config = {
	api: {
		bodyParser: false,
	},
}

/**
 * @route POST /api/uploadData
 * @description Publish a new Dataset or Service (ERC721 standard) on Blockchain (not the raw data but a digitalization of it).
 * @access Private (Valid Bearer Token is needed) - You need to be logged in to have a valid Bearer Token.
 * @param {string} req.body.username - The username of the user
 * @param {string} req.body.name - The name of the NFT you want to Publish
 * @param {string} req.body.symbol - The Symbol associated to the NFT you want to publish
 * @param {string} req.body.tokenURI - The Token URI associated to the NFT you want to publish
 * @param {boolean} req.body.transferable - True: NFT saleable; False: NFT not saleable
 * @returns {Object}:
 * @returns {boolean} success - True: Operation succeded; False: Operation Failed
 * @returns {string} name - The same as input
 * @returns {string} ownerAddress - The same as input
 * @returns {string} getTokenUri - The same as input
 * @returns {string} nftAddress - The same as input
 * @returns {boolean} transferable - The same as input
 * @returns {string} nftAddress - Address of the new NFT created (ERC721 contract)
 */

export default function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method !== 'POST') {
		return res.status(405).end()
	}

    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err: any, fields: any) => {
		//verify if jwt token is valid
        const token = req.headers.authorization!.split(' ')[1] as string;
        const validation = verifyJwtToken(token, fields["username"] as string);
        if(validation == false){
            return res.status(400).json({ error: 'Invalid Token' });
        }

        if (err) {
			console.error('Error', err)
			return res.status(400).json({ error: 'Bad Request', message: err.message })
		}
        //in fields avrò i campi per la creazione del nuovo nft
		//con anche la licenza associata
		try {
		const credentials: any = await AddressAndKey(fields["username"]);
		const chainObj = web3Init();
		const ncryptObject = new ncrypt(process.env.encryption_KEY!)
        chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(credentials.privatekey));
		//console.log(await chainObj.web3.eth.getBalance(credentials.address))
		await chainObj.factory721.methods
			.ERC721deploy(fields["name"], fields["symbol"], fields["tokenURI"], fields["transferable"] as boolean)
			.send({from: credentials.address, gas: 5000000})
			.on('transactionHash', async (hash: string) => {
				//potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
				//per ora non lo gestiamo e lo vado a stampare in console
				//console.log(hash)
			})
			.on('receipt', async (receipt: any) => {
				//tutti i dati sulla transazione
				console.log(receipt.events.createERC721.returnValues.nftAddress)
				return res
						.status(200)
						.json({ success: true, data: { name: fields["name"], symbol: fields["symbol"], tokenURI: fields["tokenURI"], transferable: fields["transferable"], nftAddress: receipt.events.createERC721.returnValues.newTokenAddress } })
			})
			.on('error', async (error: any) => {
				return res.status(500).json({ error: 'Internal Server Error', message: error.reason })
			})

		}catch(err: any){
			return res.status(400).json({ error: 'Bad Request', message: err.message })
		}
    })

}

