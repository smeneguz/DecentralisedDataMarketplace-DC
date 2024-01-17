import { Controller, Get, Body, Delete, UseGuards, Request, Query, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';
import { BlockchainService } from '../blockchain/blockchain.service';
import {GetDatasetServiceUploaded} from '../blockchain/dto/dataset-get.dto'
import { DatasetLicenseDto } from '../blockchain/dto/dataset-licenses.dto';
import { UpdateDataDto } from '../blockchain/dto/dataset-update.dto';
import { UpdateLicenseDto } from '../blockchain/dto/license-update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @UseGuards(AuthGuard)
  @Get('/balance')
  async getBalance(@Request() req: any){
    const balance = await this.blockchainService.getBalance(req.user.publicAddress);
    return balance;
  }

  @UseGuards(AuthGuard)
  @Get('/gasBalance')
  async getGasBalance(@Request() req: any){
    const gasBalance = await this.blockchainService.getGasBalance(req.user.publicAddress);
    return gasBalance;
  }

  @UseGuards(AuthGuard)
  @Get('/viewOwnedData')
  async getPersonalData(@Request() req: any): Promise<GetDatasetServiceUploaded[]>{
    const personalData = await this.blockchainService.getPersonalData(req.user.publicAddress)
    return personalData;
  } 

  @UseGuards(AuthGuard)
  @Get('/viewOwnedDatasetLicences')
  async getPersonalDataLicenses(@Query('nftAddress') nftAddress: string, @Request() req: any): Promise<DatasetLicenseDto[]>{
    const personalData = await this.blockchainService.personalDataLicenses(req.user.publicAddress, nftAddress)
    return personalData;
  }

  @UseGuards(AuthGuard)
  @Get('/viewPurchasedData')
  async getPurchasedData(@Request() req: any): Promise<any[]>{
    const purchasedData = await this.blockchainService.getPurchasedData(req.user.publicAddress)
    return purchasedData;
  }

  @UseGuards(AuthGuard)
  @Get('/viewPurchasedDatasetLicences')
  async getPurchasedDataLicenses(@Request() req: any, @Query('nftAddress') nftAddress: string): Promise<any[]>{
    const purchasedDataLicenses = await this.blockchainService.getPurchasedDataLicenses(req.user.publicAddress, nftAddress)
    return purchasedDataLicenses;
  }

  @UseGuards(AuthGuard)
  @Get('/verifyDataLicense')
  async verifyLicense(@Query('nftAddress') nftAddress: string, @Query('licenseAddress') licenseAddress: string, @Request() req: any): Promise<boolean>{
    const verification = await this.blockchainService.verifyLicense(req.user.publicAddress, nftAddress, licenseAddress)
    return verification;
  }


  @UseGuards(AuthGuard)
  @Put('/updateData')
  async updateData(@Query('nftAddress') nftAddress: string, @Body() updateData: UpdateDataDto, @Request() req: any){
    return await this.blockchainService.updateNft(req.user.publicAddress, nftAddress, updateData);
  }

  @UseGuards(AuthGuard)
  @Put('/updateDataLicense')
  async updateDataLicense(@Query('nftAddress') nftAddress: string, @Query('licenseAddress') licenseAddress: string, @Body() updateLicenseData: UpdateLicenseDto, @Request() req: any){
    return await this.blockchainService.updateLicense(req.user.publicAddress, nftAddress, licenseAddress, updateLicenseData);
  }

  @UseGuards(AuthGuard)
  @Delete('/deleteDataLicense')
  async deleteLicense(@Query('nftAddress') nftAddress: string, @Query('licenseAddress') licenseAddress: string, @Request() req: any): Promise<boolean>{
    return await this.blockchainService.deleteLicense(req.user.publicAddress, nftAddress, licenseAddress);
  }

  @UseGuards(AuthGuard)
  @Delete('/deleteData')
  async deleteNft(@Query('nftAddress') nftAddress: string, @Request() req: any): Promise<boolean>{
    return await this.blockchainService.deleteNft(req.user.publicAddress, nftAddress);
  }
}
