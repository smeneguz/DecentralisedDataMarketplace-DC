import { HttpException, Injectable, HttpStatus  } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import web3Init from 'src/utils/web.core';
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
import { PrismaService } from 'src/prisma/prisma.service';
var ncrypt = require("ncrypt-js")

@Injectable()
export class BlockchainService {
    constructor(@InjectQueue('transactions') private queue: Queue, /*@InjectRepository(User) private readonly userRepository: Repository<User>*/private readonly prisma: PrismaService){}

    async newUserOnBlockchain(user: any){ 
        return this.queue.add(
            'New_User_on_blockchain',
            user
        )
    }

    async publishData(publishData: PublishDataDto, credentials: any){
        try{
            this.queue.add(
                'Publish_DataSet',
                {publishData, credentials}
            )
            return true;
        } catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async publishLicensePeriod(publishLicensePeriod: LicensePeriodDto, credentials: any){
        try{
            this.queue.add(
                'Publish_License_Period',
                {publishLicensePeriod, credentials}
            )
            return true
        } catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async publishLicenseUsage(publishLicenseUsage: LicenseUsageDto, credentials: any){
        try{
            this.queue.add(
                'Publish_License_Usage',
                {publishLicenseUsage, credentials}
            )
            return true;
        }catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async purchaseLicensePeriod(purchaseLicensePeriod: LicensePeriodPurchaseDto, credentials: any){
        try{
            this.queue.add(
                'Purchase_License_Period',
                {purchaseLicensePeriod, credentials}
            )
            return true
        }catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async purchaseLicenseUsage(purchaseLicenseUsage: LicenseUsagePurchaseDto, credentials: any){
        try{
            this.queue.add(
                'Purchase_License_Usage',
                {purchaseLicenseUsage, credentials}
            )
            return true
        }catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateNft(address: string, privateKey: string, nftAddress: string, updateData: UpdateDataDto){
        try{
            this.queue.add(
                'Update_NFT',
                {address, privateKey, nftAddress, updateData}
            )
            return true
        } catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateLicense(address: string, privateKey: string, nftAddress: string, licenseAddress: string, updateDataLicense: UpdateLicenseDto){
        try{
            this.queue.add(
                'Update_License_Nft',
                {address, privateKey, nftAddress, licenseAddress, updateDataLicense}
            )
            return true
        }catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteNft(address: string, privateKey: string, nftAddress: string){
        try{
            this.queue.add(
                'Delete_Nft',
                {address, privateKey, nftAddress}
            )
            return true
        }catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteLicense(address: string, privateKey: string, nftAddress: string, licenseAddress: string){
        try{
            this.queue.add(
                'Delete_License',
                {address, privateKey, nftAddress, licenseAddress}
            )
            return true;
        }catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async consumeNft(consumeNft: ConsumeNftDto, credentials: any){
        try{
            this.queue.add(
                'Consume_NFT',
                {consumeNft, credentials}
            )
            return true
        }catch(err: any){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


    async getPersonalData(address: string, privateKey: string): Promise<GetDatasetServiceUploaded[]>{
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(privateKey));
            const response = await chainObj.factory721.methods.geterc721array().call()

            const NFTlist = await Promise.all(response.map(async (nftAddress: string) =>{
                const erc721template = new chainObj.web3.eth.Contract(template721.abi as any, nftAddress);
                const transferable = await erc721template.methods.transferable().call({from: address});
                const ownerAddress = await erc721template.methods.ownerAddress().call({from: address});
                if(address == ownerAddress){
                    const name = await erc721template.methods.name().call({from: address});
                    const symbol = await erc721template.methods.symbol().call({from: address});
                    const getTokenUri = await erc721template.methods.getTokenUri().call({from: address});
                    return {name, symbol, ownerAddress, getTokenUri, nftAddress, transferable}
                }
            }))
            const NFTlistFiltered = NFTlist.filter((nft: any) => nft !== undefined);

            return NFTlistFiltered;
        } catch(err: any){
            console.log(err)
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async personalDataLicenses(address: string, privateKey: string, nftAddress: string): Promise<DatasetLicenseDto[]>{
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(privateKey));

            const response = await chainObj.factory721.methods.geterc721array().call()
            const erc721contract = new chainObj.web3.eth.Contract(template721.abi as any, nftAddress);
            const owner = await erc721contract.methods.ownerAddress().call();
            if(owner != address){ 
                throw Error("You are not the owner of the NFT")
            }
            const licensesList = await chainObj.factory721.methods.geterc20array(nftAddress).call();
            const erc20list = await Promise.all(licensesList.map(async (erc20: string) =>{
                const erc20template = new chainObj.web3.eth.Contract(template20.abi as any, erc20);
                const name = await erc20template.methods.name().call();
                const symbol = await erc20template.methods.symbol().call();
                const type = await erc20template.methods.getlicenseType().call();
                const price = await erc20template.methods.price().call();
                if(type == "period"){
                    const periodMonth = await erc20template.methods.getLicensePeriod().call();
                    return {name, symbol, type, periodMonth, price, address: erc20}
                }
                return {name, symbol, type, price, address: erc20}
            }))
            const erc20listFiltered = erc20list.filter((erc20) => erc20 !== undefined);
            return erc20listFiltered;
        } catch(err: any){
            console.log(err)
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //Ho notato che un utente che compra una periodica per un dataset/servizio, può tranquillamente comprarne un'altra subito dopo per lo stesso dataset.
    //non c'è una logica che permetta di aumentare la durata della periodica.
    //in questo modo l'utente avrebbe due licenze per lo stesso periodo di tempo che non sono necessarie. Potrebbe avere senso inserire un controllo da questo punto di vista?

    async getPurchasedData(address: string, privateKey: string): Promise<any[]>{
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(privateKey));
            const erc721arr = await chainObj.factory721.methods.geterc721array().call()
            let nft_DataLicenses = [];
            for(let i = 0; i < erc721arr.length; i++){
                //informazioni sull'nft da riportare, nel caso in cui l'utente abbia acquistato una sua licenza
                const erc721template = new chainObj.web3.eth.Contract(template721.abi as any, erc721arr[i]);
                const owner = await erc721template.methods.ownerAddress().call();
                if(owner == address){ //if you are the owner, don't care and don't show here
                    continue;
                }
                const namenft = await erc721template.methods.name().call();
                const symbolnft = await erc721template.methods.symbol().call();
                const tokenUrinft = await erc721template.methods.getTokenUri().call();
                //licenze associate a un certo nft
                const erc20arr = await chainObj.factory721.methods.geterc20array(erc721arr[i]).call();
                //sto visionando le singole licenze di uno specifico nft per vedere se l'utente le ha comprate
                const dataToken = await Promise.all(erc20arr.map(async (erc20: string) =>{
                    const erc20template = new chainObj.web3.eth.Contract(template20.abi as any, erc20);
                    const balance = await erc20template.methods.balanceOf(address).call();
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

    async getPurchasedDataLicenses(address: string, privateKey: string, nftAddress: string): Promise<any[]>{
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(privateKey));
            const erc721arr: Array<string> = await chainObj.factory721.methods.geterc721array().call()
            if(erc721arr.indexOf(nftAddress) == -1){
                throw new Error('nftAddress is not a valid Address');
            }

            let nft_DataLicenses = [];
            //licenze associate a un certo nft
            const erc20arr = await chainObj.factory721.methods.geterc20array(nftAddress).call();
            //sto visionando le singole licenze di uno specifico nft per vedere se l'utente le ha comprate
            const dataToken = await Promise.all(erc20arr.map(async (erc20: string) =>{
                const erc20template = new chainObj.web3.eth.Contract(template20.abi as any, erc20);
                const balance = await erc20template.methods.balanceOf(address).call();
                if(balance > 0){
                    //vuol dire che l'utente ha a disposizione la licenza
                    const name = await erc20template.methods.name().call();
                    const symbol = await erc20template.methods.symbol().call();
                    const type = await erc20template.methods.getlicenseType().call();
                    if(type == "period"){
                        const periodMonth = await erc20template.methods.getLicensePeriod().call();
                        const startLicense = await erc20template.methods.getStartLicenseDate(address).call();
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

    async verifyLicense(address: string, privateKey: string, nftAddress: string, licenseAddress: string){
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(privateKey));

            const erc721contract = new chainObj.web3.eth.Contract(template721.abi as any, nftAddress);
            const existLicense = await erc721contract.methods.isDeployed(licenseAddress).call();
            if(existLicense == false){ 
                throw Error("License address doesn't match with nft address")
            }
            const erc20contract = new chainObj.web3.eth.Contract(template20.abi as any, licenseAddress);
            const balance = await erc20contract.methods.balanceOf(address).call();
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


    async getBalance(address: string, privateKey: string): Promise<number>{
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(privateKey));
            const balance = await chainObj.DataCellarToken.methods.balanceOf(address).call({from: address})
            return parseInt(balance)
        }catch(error: any){
            console.log(error)
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getGasBalance(address: string, privateKey: string): Promise<number>{
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(privateKey));
            const balance = await chainObj.web3.eth.getBalance(address)
            return parseInt(balance)
        }catch(error: any){
            return error
        }
    }



    async getAddressAndKey(username: string){
        //const user = await this.userRepository.findOne({where: {username}})
        const user = await this.prisma.user.findUnique({where: {username}})
        if (!user){
          throw Error('Header Error!')
        }
        return {
          address: user.address, key: user.privateKey
        }
     }
}
