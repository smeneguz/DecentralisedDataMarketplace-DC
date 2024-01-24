import {Processor, Process} from '@nestjs/bull'
import { InjectRepository } from '@nestjs/typeorm'
import {Job} from 'bull'
import { User } from '../user/entities/user.entity'
import web3Init from '../utils/web.core'
import { Repository } from 'typeorm'
import * as dotenv from 'dotenv'
import template721 from '../utils/misc/ERC721template.json'
import template20 from '../utils/misc/ERC20template.json'
import { LoggerCustom } from '../logger/logger'
import { HttpException, HttpStatus } from '@nestjs/common'
import { UpdateDataDto } from './dto/dataset-update.dto'
import { UpdateLicenseDto } from './dto/license-update.dto'
import { PrismaService } from '../prisma/prisma.service'
var ncrypt = require("ncrypt-js")

dotenv.config();

//IMPORTANT: we consider only one static template for NFT and for dataToken. Users are not able to choose a specific template!!!

@Processor('transactions')
export class ReportQueueConsumer{
    constructor(
        //@InjectRepository(User) private readonly userRepository: Repository<User>
        private readonly prisma: PrismaService
      ) {}

    private readonly logger = LoggerCustom();

    @Process('Purchase_License_Usage')
    async buyLicenseUsage(job: Job<any>){
        try{
            const chainObj = web3Init();
            const amount: number = parseInt(job.data.purchaseLicenseUsage["usage"] as string)
            
            //calculate total amount of DCT needed to buy the license & nftOwnerAddress
            const erc20 = new chainObj.web3.eth.Contract(template20.abi as any, job.data.purchaseLicenseUsage["licenseAddress"])
            const price = await erc20.methods.price().call({from: job.data.address});
            const period = await erc20.methods.getlicenseType().call({from: job.data.address});
            if(period != "usage"){
                /*return res.status(400).json({ error: 'Bad Request: license '+ fields["licenseAddress"]+" doesn't exist"})*/
            }
            const totalNeed: number = price*amount;
            const erc721 = new chainObj.web3.eth.Contract(template721.abi as any, job.data.purchaseLicenseUsage["nftAddress"])
            const nftOwner = await erc721.methods.ownerAddress().call({from: job.data.address})       
            //we need to make contract allowances to manage user money to permit exchange of third party
            await chainObj.DataCellarToken.methods
                .approve(await chainObj.factory721.methods.paymentManager().call({from: job.data.address}), totalNeed)
                .send({from: job.data.address, gas: 50000})

            await erc20.methods
                .approve(await chainObj.factory721.methods.paymentManager().call({from: job.data.address}), amount)
                .send({from: nftOwner, gas: 50000})

            await chainObj.factory721.methods.buyNFTlicenseUsage(job.data.purchaseLicenseUsage["nftAddress"], job.data.purchaseLicenseUsage["licenseAddress"], amount)
                .send({from: job.data.address, gas: 5000000})
                .on('transactionHash', async (hash: string) => {
                    //potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
                    //per ora non lo gestiamo e lo vado a stampare in console
                    //console.log(hash)
                })
                .on('receipt', async (receipt: any) => {
                    //tutti i dati sulla transazione, se arrivo qua è andata a buon fine
                    //console.log(receipt)
                    //const balance = await chainObj.DataCellarToken.methods.balanceOf(job.data.address).call({from: job.data.address})
                    this.logger.log("License Usage correctly purchased. Transansaction Hash: "+receipt.transactionHash)
                    /*return res
                        .status(200)
                        .json({ success: true, data: "License correctly buyed", balance})*/
                })
                .on('error', async (error: any) => {
                    this.logger.error("Error: Not able to purchase License usage. Message: "+error.message)
                    console.log(error)
                    /*return res.status(500).json({ error: 'Internal Server Error', message: error.reason })*/
                })
        } catch(error: any){
            this.logger.error(error)
            return error;
            /*res.status(500).json({error: "Bad request", message: error.message})*/
        }

    }

    @Process('Purchase_License_Period')
    async buyLicensePeriod(job: Job<any>){
        try{
            const chainObj = web3Init();
            
            //calculate total amount of DCT needed to buy the license & nftOwnerAddress
            const erc20 = new chainObj.web3.eth.Contract(template20.abi as any, job.data.purchaseLicensePeriod["licenseAddress"])
            const price = await erc20.methods.price().call({from: job.data.address});
            const period = await erc20.methods.getlicenseType().call({from: job.data.address});
            if(period != "period"){
                /*return res.status(400).json({ error: 'Bad Request: license '+ job.data.purchaseLicenseperiod["licenseAddress"]+" doesn't exist"})*/
            }
            const erc721 = new chainObj.web3.eth.Contract(template721.abi as any, job.data.purchaseLicensePeriod["nftAddress"])
            const nftOwner = await erc721.methods.ownerAddress().call({from: job.data.address})          
            //we need to make contract allowances to manage user money to permit exchange of third party
            await chainObj.DataCellarToken.methods
                .approve(await chainObj.factory721.methods.paymentManager().call({from: job.data.address}), parseInt(price))
                .send({from: job.data.address, gas: 50000})

            await erc20.methods
                .approve(await chainObj.factory721.methods.paymentManager().call({from: job.data.address}), 1)
                .send({from: nftOwner, gas: 50000})

            await chainObj.factory721.methods.buyNFTlicensePeriod(job.data.purchaseLicensePeriod["nftAddress"], job.data.purchaseLicensePeriod["licenseAddress"])
                .send({from: job.data.address, gas: 5000000})
                .on('transactionHash', async (hash: string) => {
                    //potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
                    //per ora non lo gestiamo e lo vado a stampare in console
                    console.log(hash)
                })
                .on('receipt', async (receipt: any) => {
                    //tutti i dati sulla transazione, se arrivo qua è andata a buon fine
                    //console.log(receipt)
                    //const balance = await chainObj.DataCellarToken.methods.balanceOf(job.data.address).call({from: job.data.address})
                    /*return res
                        .status(200)
                        .json({ success: true, data: "License correctly buyed", balance})*/
                    this.logger.log("License Period correctly purchased. Transaction Hash: "+receipt.transactionHash)
                })
                .on('error', async (error: any) => {
                    this.logger.error("Error: Not able to purchase License usage. Message: "+error.message)
                    console.log(error)
                    /*return res.status(500).json({ error: 'Internal Server Error', message: error.reason })*/
                })
        } catch(error: any){
            this.logger.error(error)
            return error;
            /*res.status(500).json({error: "Bad request", message: error.message})*/
        }

    }



    @Process('Update_License_Nft')
    async updateNftLicense(job: Job<any>){
        try{
            const chainObj = web3Init();

            const erc20 = new chainObj.web3.eth.Contract(template20.abi as any, job.data.licenseAddress);
            const erc721address = await erc20.methods.getERC721Address().call({from: job.data.address})

            if(erc721address != job.data.nftAddress){
                throw new Error("License not associated to "+job.data.nftAddress+" nft address");
            }

            //defining a mapping between functions and property to update in the object received
            const propertyToFunctionMap: Record<keyof UpdateLicenseDto, (value: any) => Promise<void>> = {
                name: async (value) =>{
                    await erc20.methods.setName(value).send({from: job.data.address, gas: 50000});
                },
                symbol: async (value) =>{
                    await erc20.methods.setSymbol(value).send({from: job.data.address, gas: 50000});
                },
                price: async (value) =>{
                    await erc20.methods.setPrice(value).send({from: job.data.address, gas: 50000});
                },
                cap: async (value) =>{
                    await erc20.methods.setCap(value).send({from: job.data.address, gas: 50000});
                },
                period: async(value) =>{
                    await erc20.methods.setPeriod(value).send({from: job.data.address, gas: 50000});
                }
            }

            for(const key in job.data.updateDataLicense){
                await propertyToFunctionMap[key](job.data.updateDataLicense[key]);
            }
            this.logger.log("Data License "+job.data.licenseAddress+" updated");
        } catch(err: any){
            this.logger.error(err)
            return err;
        }
    }

    @Process("Delete_License")
    async deleteLicense(job: Job<any>){
        try{
            const chainObj = web3Init();

            const erc721 = new chainObj.web3.eth.Contract(template721.abi as any, job.data.nftAddress)

            const existLicense = await erc721.methods.isDeployed(job.data.licenseAddress).call({from: job.data.address});
            console.log(existLicense)
            if(existLicense == false){
                throw Error("License address doesn't match with nft address")
            }
            const erc20 = new chainObj.web3.eth.Contract(template20.abi as any, job.data.licenseAddress);
            let erc20ArrayFrom721Template: Array<string> = await erc721.methods.getTokensList().call({from: job.data.address});
            let erc20ArrayFromFactory: Array<string> = await chainObj.factory721.methods.geterc20array(job.data.nftAddress).call({from: job.data.address});
            const indexFromFactory = erc20ArrayFromFactory.indexOf(job.data.licenseAddress);
            const indexFrom721Template = erc20ArrayFrom721Template.indexOf(job.data.licenseAddress);
            if(indexFromFactory == -1 || indexFrom721Template == -1){
                throw Error("License not found")
            }
            const newErc20ArrayFrom721Template = erc20ArrayFrom721Template.filter((item, i) =>{
                if(i !== indexFrom721Template){
                    return item;
                }
            })
            const newErc20ArrayFromFactory = erc20ArrayFromFactory.filter((item, i) =>{
                if(i !== indexFrom721Template){
                    return item;
                }
            })

            await erc20.methods.deleteLicense(job.data.nftAddress, newErc20ArrayFrom721Template, newErc20ArrayFromFactory)
                .send({from: job.data.address, gas: 5000000})
                .on('receipt', async (receipt: any) => {
                    this.logger.log("License correctly deleted");
                })
        }catch(err: any){
            console.log(err)
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Process('Consume_NFT')
    async consumeNft(job: Job<any>){
        try{
            const chainObj = web3Init();
            
            const erc721 = new chainObj.web3.eth.Contract(template721.abi as any, job.data.consumeNft["nftAddress"])
            const erc20 = new chainObj.web3.eth.Contract(template20.abi as any, job.data.consumeNft["licenseAddress"])
            //nft owner
            const owner = await erc721.methods.ownerAddress().call({from: job.data.address});
            //da verificare l'allowance del proprietario dell'nft e il tizio che ha comprato la licenza
            const allowanceOwner = await erc20.methods.allowance(owner, job.data.consumeNft["nftAddress"]).call({from: job.data.address});
            //da verificare l'allowance di fare erase della licenza nel caso sia usage o il periodo sia finito
            const allowanceConsumer = await erc20.methods.allowance(job.data.address, job.data.consumeNft["nftAddress"]).call({from: job.data.address});
         
            //approve to permit contract to manage users funds
            if(allowanceConsumer == 0){
                await erc20.methods
                .approve(job.data.consumeNft["nftAddress"], 1 )
                .send({from: job.data.address, gas: 50000})
            }

            if(allowanceOwner == 0){
                await erc20.methods
                .approve(job.data.consumeNft["nftAddress"], 1)
                .send({from: owner, gas: 50000})
            }
    
            //non viene fatta alcuna distinzione tra le periodiche e le usage. Usi la stessa funzioni per entrambi
            await erc721.methods.requestConsumeNFT(job.data.consumeNft["licenseAddress"])
                .send({from: job.data.address, gas: 5000000})
                .on('transactionHash', async (hash: string) => {
                    //potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
                    //per ora non lo gestiamo e lo vado a stampare in console
                    console.log(hash)
                })
                .on('receipt', async (receipt: any) => {
                    //tutti i dati sulla transazione, se arrivo qua è andata a buon fine
                    //console.log(receipt)
                    //const dataToken = await erc20.methods.balanceOf(job.data.address).call({from: job.data.address});
                    /*return res
                        .status(200)
                        .json({ success: true, data: "NFT license consumed", dataToken})*/
                    this.logger.log("NFT correctly consumed! Transaction Hash: "+receipt.transactionHash)
                })
                .on('error', async (error: any) => {
                    this.logger.error("Error: Not able to consume NFT. Message: "+error.message)
                    console.log(error)
                    //console.log(error)
                    //return res.status(500).json({ error: 'License erased. You should buy new licenses to consume NFT', message: error.reason})
                })
        } catch(error: any){
            this.logger.error(error)
            return error;
            //res.status(500).json({error: "Bad request", message: error.message})
            
        }

    }

}