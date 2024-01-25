import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as eth_utils from 'ethereumjs-util';
import * as eth_sign_utils from 'eth-sig-util';
import * as ethr_did from 'ethr-did';
import * as did_jwt_vc from 'did-jwt-vc';
import { Credentials } from './credentials.interface';
import { Issuer, JwtCredentialPayload } from 'did-jwt-vc';

@Injectable()
export class AuthService {

  constructor(private jwtService: JwtService) { }

  async generateJwtToken(signature: string, publicAddress: string, nonce: string, credentials: Credentials): Promise<any> {
    if (!signature || !publicAddress || !nonce || !credentials) {
      throw new UnauthorizedException('Request should have signature, publicAddress, nonce and credentials.');
    }

    const msg = `I am signing a one-time nonce: ${nonce}`;
    const msgBufferHex = eth_utils.bufferToHex(Buffer.from(msg, 'utf8'));
    const address = eth_sign_utils.recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    if (address.toLowerCase() === publicAddress.toLowerCase()) {
      try {
        const payload = await this.generatePayload(credentials, publicAddress);
        const accessToken = await this.jwtService.signAsync(payload);
        return accessToken;
      } catch (error) {
        throw new UnauthorizedException('Error generating token.');
      }
    } else {
      throw new UnauthorizedException('Signature verification failed.');
    }
  }

  private async generatePayload(credentials: Credentials, publicAddress: string): Promise<any> {
    const payload = {
      publicAddress: publicAddress,
      name: credentials.name,
      surname: credentials.surname,
      email: credentials.email,
      profession: credentials.profession,
      country: credentials.country,
      region: credentials.region,
    }
    return payload;
  }

  async generateVerifiableCredential(publicAddress: string, credentials: Credentials): Promise<any> {
    if (!credentials || !publicAddress) {
      throw new UnauthorizedException('Request should have publicAddress and credentials.');
    }

    try {
      const issuer = new ethr_did.EthrDID({
        identifier: process.env.OWN_ADDRESS,
        privateKey: process.env.PRIV_KEY,
        alg: 'ES256K-R',
        chainNameOrId: 1337,
      }) as Issuer;

      const holder = new ethr_did.EthrDID({
        identifier: publicAddress,
        alg: 'ES256K-R',
        chainNameOrId: 1337,
      });

      const payload = await this.generateVcPayload(credentials, holder.did);
      const vc = await did_jwt_vc.createVerifiableCredentialJwt(payload, issuer);
      return vc;
    } catch (error) {
      throw new Error('Verifiable Credential creation failed.');
    }
  }

  private async generateVcPayload(credentials: Credentials, did: string): Promise<any> {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    const vcPayload: JwtCredentialPayload = {
      sub: did,
      nbf: timestamp,
      vc: {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        credentialSubject: {
          name: credentials.name,
          surname: credentials.surname,
          email: credentials.email,
          profession: credentials.profession,
          country: credentials.country,
          region: credentials.region
        }
      }
    }
    return vcPayload;
  }

}