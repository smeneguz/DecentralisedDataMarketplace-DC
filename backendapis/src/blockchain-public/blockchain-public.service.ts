import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import ncrypt from 'ncrypt-js';
import web3Init from 'src/utils/web.core';
import template721 from '../utils/ERC721template.json'
import template20 from '../utils/ERC20template.json'
import * as dotenv from 'dotenv'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

dotenv.config()

@Injectable()
export class BlockchainPublicService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){
    }

    async getAddressAndKey(username: string){
        const user = await this.userRepository.findOne({where: {username}})
        if (!user){
          throw Error('Header Error!')
        }
        return {
          address: user.address, key: user.privateKey
        }
     }

    async getAllPublicData(credentials: any){
        //ora reperiamo le informazioni riguardo agli NFT disponibili che possono essere acquistati
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(credentials.key));
            //prendo gli indirizzi di tutti i contratti che rappresentano un singolo NFT
            const response = await chainObj.factory721.methods.geterc721array()
                .call({from: credentials.address})
            const NFTlist = await Promise.all(response.map(async (nftAddress: string) =>{
                const erc721template = new chainObj.web3.eth.Contract(template721.abi as any, nftAddress);
                const transferable = await erc721template.methods.transferable();
                const ownerAddress = await erc721template.methods.ownerAddress().call({from: credentials.address});
                if(transferable && credentials.address != ownerAddress){
                const name = await erc721template.methods.name().call({from: credentials.address});
                const symbol = await erc721template.methods.symbol().call({from: credentials.address});
                const getTokenUri = await erc721template.methods.getTokenUri().call({from: credentials.address});
                return {name, symbol, ownerAddress, getTokenUri, nftAddress}
                }
            }))
            const NFTlistFiltered = NFTlist.filter((nft) => nft !== undefined);
            
            return NFTlistFiltered;
        } catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getNftDataLicenses(credentials: any, nftAddress: string){
    //ora reperiamo le informazioni riguardo agli NFT disponibili che possono essere acquistati
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(credentials.key));
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
        }catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
