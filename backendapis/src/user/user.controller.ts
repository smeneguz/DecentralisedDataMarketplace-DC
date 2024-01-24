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



}
