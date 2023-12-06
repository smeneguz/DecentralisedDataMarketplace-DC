import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv'

dotenv.config();

const generateJwtToken = (userId: string) => {
  const secret = process.env.JWT_SECRET; // Sostituisci con una chiave segreta più sicura
  const token = jwt.sign({ userId }, secret!, { expiresIn: '1h' });
  return token;
};

export function verifyJwtToken(token: string, username: string){

  try {
    // Verifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    // Se il token è valido, restituisci i dati dell'utente o qualsiasi altra informazione necessaria
    if(decoded.userId == username){
      return true;
    } else {
      return false;
    }
  } catch (error) {
    // Se il token non è valido, lancia un'eccezione o restituisci un errore
    return false;
  }
};

export { generateJwtToken };