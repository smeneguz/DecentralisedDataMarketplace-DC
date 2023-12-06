import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { BlockchainPublicService } from './blockchain-public.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PublicDatasetDto } from './dto/publicDataset-get.dto';
import { PublicLicenseDto } from './dto/publicLicense-get.dto';

@ApiTags('public')
@Controller('public')
export class BlockchainPublicController {
    constructor(
        private readonly blockchainPublicService: BlockchainPublicService
        ){}

    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
    @ApiOperation({ summary: 'Get all Datasets and Services available on Marketplace' })
    @ApiResponse({status: 200, description: 'DataSets and Services digitalised', type: [PublicDatasetDto]})
    @UseGuards(AuthGuard)
    @Get('viewAllMrktplaceData')
    async getPublicData(@Request() req: any): Promise<PublicDatasetDto[]>{
        const credentials = await this.blockchainPublicService.getAddressAndKey(req.user.username);
        const res = await this.blockchainPublicService.getAllPublicData(credentials);
        return res;
    }

    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
    @ApiOperation({ summary: 'Get all Licenses of a specific Dataset or Service available on Marketplace' })
    @ApiResponse({status: 200, description: 'DataSets and Services digitalised', type: [PublicLicenseDto]})
    @UseGuards(AuthGuard)
    @Get('/viewMrktDatasetLicences')
    async getPublicDataLicenses(@Query('nftAddress') nftAddress: string, @Request() req: any): Promise<PublicLicenseDto[]>{
        const credentials = await this.blockchainPublicService.getAddressAndKey(req.user.username);
        const res = await this.blockchainPublicService.getNftDataLicenses(credentials, nftAddress);
        return res;
    }
}
