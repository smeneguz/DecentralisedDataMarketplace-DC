import {Processor, Process} from '@nestjs/bull'
import { InjectRepository } from '@nestjs/typeorm'
import {Job} from 'bull'
import { User } from 'src/user/entities/user.entity'
import web3Init from 'src/utils/web.core'
import { Repository } from 'typeorm'
import * as dotenv from 'dotenv'
import template721 from '../utils/ERC721template.json'
import template20 from '../utils/ERC20template.json'
import { LoggerCustom } from 'src/logger/logger'
import { HttpException, HttpStatus } from '@nestjs/common'

var ncrypt = require("ncrypt-js")

dotenv.config();

@Processor('transactions')
export class ReportQueueConsumer{
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
      ) {}

    private readonly logger = LoggerCustom();

    @Process('New_User_on_blockchain')
    async registrationOnChain(job: Job<User>){
        const chainObj = web3Init();
        const info = chainObj.web3.eth.accounts.create();
        job.data.address = info["address"];
        const ncryptObject = new ncrypt(process.env.encryption_KEY!)
        //encrypt key
        job.data.privateKey = ncryptObject.encrypt(info["privateKey"]);
        //save user information on db
        chainObj.web3.eth.accounts.wallet.add(process.env.privateKEY!)
        chainObj.web3.eth.accounts.wallet.add(info["privateKey"])
        console.log(job.data)
        await chainObj.web3.eth.sendTransaction({to: info["address"], from: process.env.owner_ADDRESS!, value: chainObj.web3.utils.toWei("110", "ether"), gas: 50000})
        await chainObj.DataCellarToken.methods
            .convertEtherToTokens()
            .send({from: info["address"], value: chainObj.web3.utils.toWei('100', 'ether'), gas: 500000})
            .on('transactionHash', async (hash: string) => {
                //potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
                //per ora non lo gestiamo e lo vado a stampare in console
            })
            .on('receipt', async (receipt: any) => {
                //tutti i dati sulla transazione, se arrivo qua è andata a buon fine
                //console.log(receipt)
                //const value = await chainObj.DataCellarToken.methods.balanceOf(info["address"]).call({from: info["address"]})
                //console.log(value)
                await this.userRepository.save(job.data)
                this.logger.log("New User added. Address: " + info["address"]);
            })
            .on('error', async (error: any) => {
                this.logger.error("Error: Impossible to add a new User! " + error)
                return error;
            })
        const value = await chainObj.DataCellarToken.methods.balanceOf(info["address"]).call({from: info["address"]})
        console.log(value)
    }

    @Process('Publish_DataSet')
    async dataPublicationOnChain(job: Job<any>){
        try {
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(job.data.credentials.key));
            //console.log(await chainObj.web3.eth.getBalance(credentials.address))
            await chainObj.factory721.methods
                .ERC721deploy(job.data.publishData["name"], job.data.publishData["symbol"], job.data.publishData["tokenURI"], job.data.publishData["transferable"] as boolean)
                .send({from: job.data.credentials.address, gas: 5000000})
                .on('transactionHash', async (hash: string) => {
                    //potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
                    //per ora non lo gestiamo e lo vado a stampare in console
                    //console.log(hash)
                })
                .on('receipt', async (receipt: any) => {
                    //tutti i dati sulla transazione
                    //console.log(receipt.events.createERC721.returnValues.nftAddress)
                    /*
                    return res
                            .status(200)
                            .json({ success: true, data: { name: fields["name"], symbol: fields["symbol"], tokenURI: fields["tokenURI"], transferable: fields["transferable"], nftAddress: receipt.events.createERC721.returnValues.newTokenAddress } })
                        */
                    this.logger.log("New data or Service correctly added. Receipt: ", receipt)
                })
                .on('error', async (error: any) => {
                    this.logger.error("Error: Not able to add new Data or Service. "+error)
                    /*
                    return res.status(500).json({ error: 'Internal Server Error', message: error.reason })*/
                })
    
            }catch(err: any){
                this.logger.error(err)
                console.log(err)
                return err
                /*
                return res.status(400).json({ error: 'Bad Request', message: err.message })*/
            }

    }

    @Process('Publish_License_Usage')
    async publishLicenseUsage(job: Job<any>){
        try{
            const chainObj = web3Init();    
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(job.data.credentials.key));
            const erc721 = new chainObj.web3.eth.Contract(template721.abi as any, job.data.publishLicenseUsage.nftAddress)
            await erc721.methods.
                createERC20([job.data.publishLicenseUsage.name, job.data.publishLicenseUsage.symbol], job.data.publishLicenseUsage.minters, job.data.publishLicenseUsage.cap, "usage", job.data.publishLicenseUsage.price, 0)
                    .send({from: job.data.credentials.address, gas: 5000000})
                    .on('transactionHash', async (hash: string) => {
                        //potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
                        //per ora non lo gestiamo e lo vado a stampare in console
                        //console.log(hash)
                    })
                    .on('receipt', async (receipt: any) => {
                        //tutti i dati sulla transazione, se arrivo qua è andata a buon fine
                        //console.log(receipt.events.licenseERC20Created.returnValues)
                        /*return res
                                .status(200)
                                .json({ success: true, data: { name: job.data.publishLicenseUsage.name, symbol: job.data.publishLicenseUsage.symbol,  minters: job.data.publishLicenseUsage.minters, cap: job.data.publishLicenseUsage.cap, type: "usage", price: job.data.publishLicenseUsage.price, licenseAddress: receipt.events.licenseERC20Created.returnValues.licenseErc20} })
                            */
                           this.logger.log("New License Usage Created! Receipt: "+receipt)
                    })
                    .on('error', async (error: any) => {
                        this.logger.error("Error: Not able to add License Usage. "+error)
                        /*return res.status(500).json({ error: 'Internal Server Error', message: error.reason })*/
                    })
        } catch(error: any){
            this.logger.error(error)
            return error;
            /*res.status(500).json({error: "Bad request", message: error.message})*/
        }
    }

    @Process('Purchase_License_Usage')
    async buyLicenseUsage(job: Job<any>){
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(job.data.credentials.key));
            const amount: number = parseInt(job.data.purchaseLicenseUsage["usage"] as string)
            
            //calculate total amount of DCT needed to buy the license & nftOwnerAddress
            const erc20 = new chainObj.web3.eth.Contract(template20.abi as any, job.data.purchaseLicenseUsage["licenseAddress"])
            const price = await erc20.methods.price().call();
            const period = await erc20.methods.getlicenseType().call();
            if(period != "usage"){
                /*return res.status(400).json({ error: 'Bad Request: license '+ fields["licenseAddress"]+" doesn't exist"})*/
            }
            const totalNeed: number = price*amount;
            const erc721 = new chainObj.web3.eth.Contract(template721.abi as any, job.data.purchaseLicenseUsage["nftAddress"])
            const nftOwner = await erc721.methods.ownerAddress().call({from: job.data.credentials.address})
            const privateKeyOwner: any = await this.userRepository.findOneBy({address: nftOwner});
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(privateKeyOwner.privateKey));
            
            //we need to make contract allowances to manage user money to permit exchange of third party
            await chainObj.DataCellarToken.methods
                .approve(await chainObj.factory721.methods.paymentManager().call(), totalNeed)
                .send({from: job.data.credentials.address, gas: 50000})

            await erc20.methods
                .approve(await chainObj.factory721.methods.paymentManager().call(), amount)
                .send({from: nftOwner, gas: 50000})

            await chainObj.factory721.methods.buyNFTlicenseUsage(job.data.purchaseLicenseUsage["nftAddress"], job.data.purchaseLicenseUsage["licenseAddress"], amount)
                .send({from: job.data.credentials.address, gas: 5000000})
                .on('transactionHash', async (hash: string) => {
                    //potrebbe essere utile salvare da qualche parte l'hash di tutte le transazioni!!
                    //per ora non lo gestiamo e lo vado a stampare in console
                    //console.log(hash)
                })
                .on('receipt', async (receipt: any) => {
                    //tutti i dati sulla transazione, se arrivo qua è andata a buon fine
                    //console.log(receipt)
                    //const balance = await chainObj.DataCellarToken.methods.balanceOf(job.data.credentials.address).call({from: job.data.credentials.address})
                    this.logger.log("License Usage correctly purchased. "+receipt)
                    /*return res
                        .status(200)
                        .json({ success: true, data: "License correctly buyed", balance})*/
                })
                .on('error', async (error: any) => {
                    this.logger.error("Error: Not able to purchase License usage. "+error)
                    console.log(error)
                    /*return res.status(500).json({ error: 'Internal Server Error', message: error.reason })*/
                })
        } catch(error: any){
            this.logger.error(error)
            return error;
            /*res.status(500).json({error: "Bad request", message: error.message})*/
        }

    }

    @Process("Delete_License")
    async deleteLicense(job: Job<any>){
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(job.data.privateKey));

            const erc721 = new chainObj.web3.eth.Contract(template721.abi as any, job.data.nftAddress)

            const existLicense = await erc721.methods.isDeployed(job.data.licenseAddress).call();
            console.log(existLicense)
            if(existLicense == false){
                throw Error("License address doesn't match with nft address")
            }
            const erc20 = new chainObj.web3.eth.Contract(template20.abi as any, job.data.licenseAddress);
            let erc20ArrayFrom721Template: Array<string> = await erc721.methods.getTokensList().call();
            let erc20ArrayFromFactory: Array<string> = await chainObj.factory721.methods.geterc20array(job.data.nftAddress).call();
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

    @Process("Delete_Nft")
    async deleteNft(job: Job<any>){ 
        try{
            const chainObj = web3Init();
            const ncryptObject = new ncrypt(process.env.encryption_KEY!)
            chainObj.web3.eth.accounts.wallet.add(ncryptObject.decrypt(job.data.privateKey));

            const erc721 = new chainObj.web3.eth.Contract(template721.abi as any, job.data.nftAddress)
            let nftList: Array<string> = await chainObj.factory721.methods.geterc721array().call();
            const index = nftList.indexOf(job.data.nftAddress);
            const newNftList = nftList.filter((item, i) => {
                if(index !== i){
                    return item;
                }
            })
            //nftList.splice(index, 1);
            
            await erc721.methods.deleteNft(newNftList)
                .send({from: job.data.address, gas: 5000000})
                .on('receipt', async (receipt: any) => {
                    //console.log("licenza distrutta")
                    this.logger.log("nft correctly deleted");
                })
        }catch(err: any){
            console.log(err)
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}