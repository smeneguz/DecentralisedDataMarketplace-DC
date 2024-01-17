import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import ncrypt from 'ncrypt-js';
import web3Init from '../utils/web.core';
import template721 from '../utils/misc/ERC721template.json'
import template20 from '../utils/misc/ERC20template.json'
import * as dotenv from 'dotenv'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { PrismaService } from '../prisma/prisma.service';

dotenv.config()

@Injectable()
export class BlockchainPublicService {
    constructor(/*@InjectRepository(User) private readonly userRepository: Repository<User>*/
        private readonly prisma: PrismaService
    ){
    }

    async getAllPublicData(address: string){
        //ora reperiamo le informazioni riguardo agli NFT disponibili che possono essere acquistati
        try{
            const chainObj = web3Init();
            //prendo gli indirizzi di tutti i contratti che rappresentano un singolo NFT
            const response = await chainObj.factory721.methods.geterc721array()
                .call({from: address})
            const NFTlist = await Promise.all(response.map(async (nftAddress: string) =>{
                const erc721template = new chainObj.web3.eth.Contract(template721.abi as any, nftAddress);
                const transferable = await erc721template.methods.transferable();
                const ownerAddress = await erc721template.methods.ownerAddress().call({from: address});
                if(transferable && address != ownerAddress){
                const name = await erc721template.methods.name().call({from: address});
                const symbol = await erc721template.methods.symbol().call({from: address});
                const getTokenUri = await erc721template.methods.getTokenUri().call({from: address});
                return {name, symbol, ownerAddress, getTokenUri, nftAddress}
                }
            }))
            const NFTlistFiltered = NFTlist.filter((nft) => nft !== undefined);
            
            return NFTlistFiltered;
        } catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getNftDataLicenses(address: string, nftAddress: string){
    //ora reperiamo le informazioni riguardo agli NFT disponibili che possono essere acquistati
        try{
            const chainObj = web3Init();
            //prendo gli indirizzi di tutti i contratti che rappresentano un singolo NFT
            const erc721template = new chainObj.web3.eth.Contract(template721.abi as any, nftAddress);

            const response = await erc721template.methods.getTokensList()
                .call({from: address})
            const licensesList = await Promise.all(response.map(async (licenseAddress: string) =>{
                const erc20template = new chainObj.web3.eth.Contract(template20.abi as any, licenseAddress);
                const name = await erc20template.methods.name().call({from: address});
                const symbol = await erc20template.methods.symbol().call({from: address});
                const licenseType = await erc20template.methods.getlicenseType().call({from: address});
                const price = await erc20template.methods.price().call({from: address});
                if(licenseType == "period"){
                    const licensePeriod = await erc20template.methods.getLicensePeriod().call({from: address});
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
