import { HttpException, Injectable, HttpStatus  } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import web3Init from '../utils/web.core';
import { Repository } from 'typeorm';
import template721 from '../utils/misc/ERC721template.json'
import template20 from '../utils/misc/ERC20template.json'
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PublishDataDto } from './dto/publish-data.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LicensePeriodDto, LicenseUsageDto } from './dto/license-upload.dto';
import { LicensePeriodPurchaseDto, LicenseUsagePurchaseDto } from './dto/license-purchase.dto';
import { ConsumeNftDto } from './dto/consume-nft.dto';
import { GetDatasetServiceUploaded } from './dto/dataset-get.dto';
import { DatasetLicenseDto } from './dto/dataset-licenses.dto';
import { UpdateDataDto } from './dto/dataset-update.dto';
import { UpdateLicenseDto } from './dto/license-update.dto';
import { PrismaService } from '../prisma/prisma.service';
var ncrypt = require("ncrypt-js")

@Injectable()
export class BlockchainService {
    constructor(@InjectQueue('transactions') private queue: Queue, private readonly prisma: PrismaService){}

 
    async purchaseLicensePeriod(purchaseLicensePeriod: LicensePeriodPurchaseDto, address: string){
        try{
            this.queue.add(
                'Purchase_License_Period',
                {purchaseLicensePeriod, address}
            )
            return true
        }catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async purchaseLicenseUsage(purchaseLicenseUsage: LicenseUsagePurchaseDto, address: string){
        try{
            this.queue.add(
                'Purchase_License_Usage',
                {purchaseLicenseUsage, address}
            )
            return true
        }catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async consumeNft(consumeNft: ConsumeNftDto, address: string){
        try{
            this.queue.add(
                'Consume_NFT',
                {consumeNft, address}
            )
            return true
        }catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getPurchasedData(address: string): Promise<any[]>{
        try{
            const chainObj = web3Init();
            const erc721arr = await chainObj.factory721.methods.geterc721array().call({from: address})
            let nft_DataLicenses = [];
            for(let i = 0; i < erc721arr.length; i++){
                //informazioni sull'nft da riportare, nel caso in cui l'utente abbia acquistato una sua licenza
                const erc721template = new chainObj.web3.eth.Contract(template721.abi as any, erc721arr[i]);
                const owner = await erc721template.methods.ownerAddress().call({from: address});
                if(owner == address){ //if you are the owner, don't care and don't show here
                    continue;
                }
                const namenft = await erc721template.methods.name().call({from: address});
                const symbolnft = await erc721template.methods.symbol().call({from: address});
                const tokenUrinft = await erc721template.methods.getTokenUri().call({from: address});
                //licenze associate a un certo nft
                const erc20arr = await chainObj.factory721.methods.geterc20array(erc721arr[i]).call({from: address});
                //sto visionando le singole licenze di uno specifico nft per vedere se l'utente le ha comprate
                const dataToken = await Promise.all(erc20arr.map(async (erc20: string) =>{
                    const erc20template = new chainObj.web3.eth.Contract(template20.abi as any, erc20);
                    const balance = await erc20template.methods.balanceOf(address).call({from: address});
                    if(balance > 0){
                        return true;
                    }
                }))
                const dataTokenFiltered = dataToken.filter((datatoken) => datatoken != undefined)

                if(dataTokenFiltered.length > 0){
                    nft_DataLicenses.push({namenft, symbolnft, tokenUrinft, address: erc721arr[i]})
                }
            }
            return nft_DataLicenses;
        } catch(err: any){
            console.log(err);
            return err;
        }
    }

    async getPurchasedDataLicenses(address: string, nftAddress: string): Promise<any[]>{
        try{
            const chainObj = web3Init();
            const erc721arr: Array<string> = await chainObj.factory721.methods.geterc721array().call({from: address})
            if(erc721arr.indexOf(nftAddress) == -1){
                throw new Error('nftAddress is not a valid Address');
            }

            let nft_DataLicenses = [];
            //licenze associate a un certo nft
            const erc20arr = await chainObj.factory721.methods.geterc20array(nftAddress).call({from: address});
            //sto visionando le singole licenze di uno specifico nft per vedere se l'utente le ha comprate
            const dataToken = await Promise.all(erc20arr.map(async (erc20: string) =>{
                const erc20template = new chainObj.web3.eth.Contract(template20.abi as any, erc20);
                const balance = await erc20template.methods.balanceOf(address).call({from: address});
                if(balance > 0){
                    //vuol dire che l'utente ha a disposizione la licenza
                    const name = await erc20template.methods.name().call({from: address});
                    const symbol = await erc20template.methods.symbol().call({from: address});
                    const type = await erc20template.methods.getlicenseType().call({from: address});
                    if(type == "period"){
                        const periodMonth = await erc20template.methods.getLicensePeriod().call({from: address});
                        const startLicense = await erc20template.methods.getStartLicenseDate(address).call({from: address});
                        //vorrei calcolare quando termina, ma non ricordo l'unità di misura di startLicense
                        const startDate = new Date(startLicense * 1000)
                        const endLicenseDate = new Date(startDate)
                        endLicenseDate.setMonth(endLicenseDate.getMonth() + periodMonth)
                        return {name, symbol, type, periodMonth, startDate, endLicenseDate, balance, address: erc20}
                    }
                    return { name, symbol, type, balance, address: erc20 }
                }
            }))
            const dataTokenFiltered = dataToken.filter((datatoken) => datatoken != undefined)

            if(dataTokenFiltered.length > 0){
                nft_DataLicenses.push(dataTokenFiltered)
            }
    
            return nft_DataLicenses;
        } catch(err: any){
            console.log(err);
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async verifyLicense(address: string, nftAddress: string, licenseAddress: string){
        try{
            const chainObj = web3Init();

            const erc721contract = new chainObj.web3.eth.Contract(template721.abi as any, nftAddress);
            const existLicense = await erc721contract.methods.isDeployed(licenseAddress).call({from: address});
            if(existLicense == false){ 
                throw Error("License address doesn't match with nft address")
            }
            const erc20contract = new chainObj.web3.eth.Contract(template20.abi as any, licenseAddress);
            const balance = await erc20contract.methods.balanceOf(address).call({from: address});
            if(balance > 0){
                return true
            } else {
                throw Error("License not purchased")
            }
        } catch(err: any){
            console.log(err)
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }



}
