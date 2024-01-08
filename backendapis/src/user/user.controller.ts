import { Controller, Get, Post, Body, Patch, Param, Delete, Header, UseGuards, Request, Query, Put } from '@nestjs/common';
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
import { UpdateDataDto } from 'src/blockchain/dto/dataset-update.dto';
import { UpdateLicenseDto } from 'src/blockchain/dto/license-update.dto';


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
  @ApiOperation({ summary: 'Modify user password' })
  @ApiBody({type: UpdatePasswordDto, required: true})
  @ApiResponse({status: 201, description: 'Password correctly changed', type: Boolean})
  @UseGuards(AuthGuard)
  @Post('/changePassword')
  async changePassword(@Body() updatePassword: UpdatePasswordDto, @Request() req: any){
    const res = await this.userService.updatePassword(updatePassword, req.user.username);
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
  @ApiOperation({ summary: 'Get user gas balance in wei' })
  @ApiResponse({status: 200, description: 'User Gas Balance', type: Number})
  @UseGuards(AuthGuard)
  @Get('/gasBalance')
  async getGasBalance(@Request() req: any){
    const info = await this.userService.getAddressAndKey(req.user.username);
    const gasBalance = await this.blockchainService.getGasBalance(info.address, info.key);
    return gasBalance;
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
  @ApiOperation({ summary: 'Get Licenses of a specific Dataset purchased through the Data Cellar marketplace' })
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
  @ApiOperation({ summary: 'Verify User has purchased a License of specific Dataset or Service' })
  @ApiResponse({status: 200, description: 'Ok: User has purchased the license', type: Boolean})
  @ApiResponse({status: 500, description: "Error: Internal Server Error", type: ErrorDto})
  @UseGuards(AuthGuard)
  @Get('/verifyDataLicense')
  async verifyLicense(@Query('nftAddress') nftAddress: string, @Query('licenseAddress') licenseAddress: string, @Request() req: any): Promise<boolean>{
    const info = await this.userService.getAddressAndKey(req.user.username);
    const verification = await this.blockchainService.verifyLicense(info.address, info.key, nftAddress, licenseAddress)
    return verification;
  }


  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
  @ApiOperation({ summary: 'Update Data or Service' })
  @ApiResponse({status: 200, description: 'Ok: Dataset Updated', type: Boolean})
  @ApiResponse({status: 500, description: "Error: Internal Server Error", type: ErrorDto})
  @UseGuards(AuthGuard)
  @Put('/updateData')
  async updateData(@Query('nftAddress') nftAddress: string, @Body() updateData: UpdateDataDto, @Request() req: any){
    const info = await this.userService.getAddressAndKey(req.user.username);
    return await this.blockchainService.updateNft(info.address, info.key, nftAddress, updateData);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
  @ApiOperation({ summary: 'Update Dataset or Service License' })
  @ApiResponse({status: 200, description: 'Ok: Dataset License Updated', type: Boolean})
  @ApiResponse({status: 500, description: "Error: Internal Server Error", type: ErrorDto})
  @UseGuards(AuthGuard)
  @Put('/updateDataLicense')
  async updateDataLicense(@Query('nftAddress') nftAddress: string, @Query('licenseAddress') licenseAddress: string, @Body() updateLicenseData: UpdateLicenseDto, @Request() req: any){
    const info = await this.userService.getAddressAndKey(req.user.username);
    return await this.blockchainService.updateLicense(info.address, info.key, nftAddress, licenseAddress, updateLicenseData);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
  @ApiOperation({ summary: 'Delete License associated to Dataset or Service' })
  @ApiResponse({status: 200, description: 'Ok: License deleted', type: Boolean})
  @ApiResponse({status: 500, description: "Error: Internal Server Error", type: ErrorDto})
  @UseGuards(AuthGuard)
  @Delete('/deleteDataLicense')
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
  @Delete('/deleteData')
  async deleteNft(@Query('nftAddress') nftAddress: string, @Request() req: any): Promise<boolean>{
    const info = await this.userService.getAddressAndKey(req.user.username);
    return await this.blockchainService.deleteNft(info.address, info.key, nftAddress);
  }
}
