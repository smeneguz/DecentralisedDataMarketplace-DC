import { Controller, Get, Post, Body, Patch, Param, Delete, Header, UseGuards, Request, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '../auth/auth.guard';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import {GetDatasetServiceUploaded} from '../blockchain/dto/dataset-get.dto'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiTags,
  ApiBody
} from '@nestjs/swagger';
import { DatasetLicenseDto } from 'src/blockchain/dto/dataset-licenses.dto';
import { ErrorDto } from 'src/blockchain/dto/error.dto';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly blockchainService: BlockchainService) {}

  @ApiOperation({ summary: 'New user registration on the platform' })
  @ApiBody({type: CreateUserDto, required: true})
  @ApiResponse({status: 201, description: 'New user registration added to queue'})
  @Post('/signup')
  async create(@Body() createUserDto: CreateUserDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);
    const res = await this.userService.signup(createUserDto.username, hashedPassword);
    return res;
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
  @ApiOperation({ summary: 'Get user balance of Data Cellar Token' })
  @ApiResponse({status: 200, description: 'User Data Cellar Token Balance', type: Number})
  @UseGuards(AuthGuard)
  @Get('/balance')
  async getBalance(@Request() req: any){
    const info = await this.userService.getAddressAndKey(req.user.username);
    const balance = await this.blockchainService.getBalance(info.address, info.key);
    return balance;
  }


  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
  @ApiOperation({ summary: 'Get User data uploaded to the Data Cellar marketplace' })
  @ApiResponse({status: 200, description: 'User DataSets or Services', type: [GetDatasetServiceUploaded]})
  @UseGuards(AuthGuard)
  @Get('/viewOwnedData')
  async getPersonalData(@Request() req: any): Promise<GetDatasetServiceUploaded[]>{
    const info = await this.userService.getAddressAndKey(req.user.username);
    const personalData = await this.blockchainService.getPersonalData(info.address, info.key)
    return personalData;
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
  @ApiOperation({ summary: 'Get User data Licenses uploaded to the Data Cellar marketplace' })
  @ApiResponse({status: 200, description: 'User DataSets or Services Licenses', type: [DatasetLicenseDto]})
  @UseGuards(AuthGuard)
  @Get('/viewOwnedDatasetLicences')
  async getPersonalDataLicenses(@Query('nftAddress') nftAddress: string, @Request() req: any): Promise<DatasetLicenseDto[]>{
    const info = await this.userService.getAddressAndKey(req.user.username);
    const personalData = await this.blockchainService.personalDataLicenses(info.address, info.key, nftAddress)
    return personalData;
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
  @ApiOperation({ summary: 'Get Dataset purchased through the Data Cellar marketplace' })
  @UseGuards(AuthGuard)
  @Get('/viewPurchasedData')
  async getPurchasedData(@Request() req: any): Promise<any[]>{
    const info = await this.userService.getAddressAndKey(req.user.username);
    const purchasedData = await this.blockchainService.getPurchasedData(info.address, info.key)
    return purchasedData;
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
  @ApiOperation({ summary: 'Get Licenses of a specific Dataset purchased through the Data Cellar marketplace' })
  @UseGuards(AuthGuard)
  @Get('/viewPurchasedDatasetLicences')
  async getPurchasedDataLicenses(@Request() req: any, @Query('nftAddress') nftAddress: string): Promise<any[]>{
    const info = await this.userService.getAddressAndKey(req.user.username);
    const purchasedDataLicenses = await this.blockchainService.getPurchasedDataLicenses(info.address, info.key, nftAddress)
    return purchasedDataLicenses;
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
  @ApiOperation({ summary: 'Delete License associated to Dataset or Service' })
  @ApiResponse({status: 200, description: 'Ok: License deleted', type: Boolean})
  @ApiResponse({status: 500, description: "Error: Internal Server Error", type: ErrorDto})
  @UseGuards(AuthGuard)
  @Delete('/deleteLicense')
  async deleteLicense(@Query('nftAddress') nftAddress: string, @Query('licenseAddress') licenseAddress: string, @Request() req: any): Promise<boolean>{
    const info = await this.userService.getAddressAndKey(req.user.username);
    return await this.blockchainService.deleteLicense(info.address, info.key, nftAddress, licenseAddress);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
  @ApiOperation({ summary: 'Delete Dataset or Service' })
  @ApiResponse({status: 200, description: 'Ok: Nft deleted', type: Boolean})
  @ApiResponse({status: 500, description: "Error: Internal Server Error", type: ErrorDto})
  @UseGuards(AuthGuard)
  @Delete('/deleteNft')
  async deleteNft(@Query('nftAddress') nftAddress: string, @Request() req: any): Promise<boolean>{
    const info = await this.userService.getAddressAndKey(req.user.username);
    return await this.blockchainService.deleteNft(info.address, info.key, nftAddress);
  }

}
