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
 * @route POST /api/signin
 * @description Some operations as follows:
 *                - Check the right association between username and password;
 *                - Creation of Bearer Token for the user requesting login.
 * @access Public
 * @param {string} req.body.username - The username inserted by the user
 * @param {string} req.body.password - The password associated to the new user account
 * @returns {string} Bearer Token associated to user for this session.
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
        const data = await logIn(fields["username"], fields["password"]);
        if(data == true){
            const userId = fields["username"]; // Sostituisci con l'ID dell'utente autenticato

            // Genera il JWT
            const token = generateJwtToken(userId);
            
            // Imposta il JWT come cookie nel set di risposta
            res.setHeader('Set-Cookie', `jwt=${token}; HttpOnly; Max-Age=3600; Path=/home/${fields["username"]}`);
            return res.status(200).json({message: "Log in success", token});
        } else {
            return res.status(400).json({error: 'Bad Request', message: "Password or username wrong"});
        }
    })
}
