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
 * @route POST /api/consumeNft
 * @description User uses the NFT associated to a license previously purchased by him.
 * @access Private (Valid Bearer Token is needed) - You need to be logged in to have a valid Bearer Token.
 * @param {string} req.body.username - The username of the user
 * @param {string} req.body.nftAddress - The address of the nft user wants to use
 * @param {string} req.body.licenseAddress - The address of the license user has acquired previously associated to NFT
 * @returns {boolean} success - True: Operation succeded; False: Operation Failed
 * @returns {string} data - "NFT license consumed" (to decide if this field is useful -> personally i think no)
 * @returns {number} dataToken - The user balance of dataToken associated to a specific license
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
            
            const erc721 = new chainObj.web3.eth.Contract(erc721template.abi as any, fields["nftAddress"])
            const erc20 = new chainObj.web3.eth.Contract(erc20template.abi as any, fields["licenseAddress"])
            //nft owner
            const owner = await erc721.methods.ownerAddress().call();
            const privateKeyOwner: any = await KeyFromAddress(owner);
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(privateKeyOwner.privatekey));
            //da verificare l'allowance del proprietario dell'nft e il tizio che ha comprato la licenza
            const allowanceOwner = await erc20.methods.allowance(owner, fields["nftAddress"]).call();
            //da verificare l'allowance di fare erase della licenza nel caso sia usage o il periodo sia finito
            const allowanceConsumer = await erc20.methods.allowance(credentials.address, fields["nftAddress"]).call();
         
            //approve to permit contract to manage users funds
            if(allowanceConsumer == 0){
                await erc20.methods
                .approve(fields["nftAddress"], 1 )
                .send({from: credentials.address, gas: 50000})
            }

            if(allowanceOwner == 0){
                await erc20.methods
                .approve(fields["nftAddress"], 1)
                .send({from: owner, gas: 50000})
            }
    
            //non viene fatta alcuna distinzione tra le periodiche e le usage. Usi la stessa funzioni per entrambi
            await erc721.methods.requestConsumeNFT(fields["licenseAddress"])
                .send({from: credentials.address, gas: 5000000})
                .on('transactionHash', async (hash: string) => {
                    //potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
                    //per ora non lo gestiamo e lo vado a stampare in console
                    console.log(hash)
                })
                .on('receipt', async (receipt: any) => {
                    //tutti i dati sulla transazione, se arrivo qua è andata a buon fine
                    console.log(receipt)
                    const dataToken = await erc20.methods.balanceOf(credentials.address).call();
                    return res
                        .status(200)
                        .json({ success: true, data: "NFT license consumed", dataToken})
                })
                .on('error', async (error: any) => {
                    //console.log(error)
                    return res.status(500).json({ error: 'License erased. You should buy new licenses to consume NFT', message: error.reason})
                })
        } catch(error: any){
            //res.status(500).json({error: "Bad request", message: error.message})
            console.log("error: "+ error.message)
        }
    })
}