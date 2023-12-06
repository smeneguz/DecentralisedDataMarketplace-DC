import { Controller, Post, Body, UseGuards, Request  } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PublishDataDto } from './dto/publish-data.dto';
import { BlockchainService } from './blockchain.service';
import { LicensePeriodDto, LicenseUsageDto } from './dto/license-upload.dto';
import { LicensePeriodPurchaseDto, LicenseUsagePurchaseDto } from './dto/license-purchase.dto';
import { ConsumeNftDto } from './dto/consume-nft.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorDto } from './dto/error.dto';

@ApiTags('marketing')
@Controller('marketing')
export class BlockchainController {
    constructor(private readonly blockchainService: BlockchainService){
    }

    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
    @ApiOperation({ summary: 'Upload Datasets or Service to the Marketplace' })
    @ApiBody({type: PublishDataDto, required: true})
    @ApiResponse({status: 201, description: 'Ok: Job added to queue', type: Boolean})
    @ApiResponse({status: 500, description: "Error: Internal Server Error", type: ErrorDto})
    @UseGuards(AuthGuard)
    @Post('/registerDataset')
    async uploadData(@Body() publishDataDto: PublishDataDto, @Request() req: any): Promise<boolean>{
        const credentials = await this.blockchainService.getAddressAndKey(req.user.username)
        return await this.blockchainService.publishData(publishDataDto, credentials);
    }

    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
    @ApiOperation({ summary: 'Upload License Usage for a Dataset or Service' })
    @ApiBody({type: LicenseUsageDto, required: true})
    @ApiResponse({status: 201, description: 'Ok: Job added to queue', type: Boolean})
    @ApiResponse({status: 500, description: "Error: Internal Server Error", type: ErrorDto})
    @UseGuards(AuthGuard)
    @Post('/registerDatasetOneTimeLicence')
    async uploadLicenseUsage(@Body() publishLicenseUsage: LicenseUsageDto, @Request() req: any): Promise<boolean>{
        const credentials = await this.blockchainService.getAddressAndKey(req.user.username)
        return await this.blockchainService.publishLicenseUsage(publishLicenseUsage, credentials)
    }

    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Unauthorised Access' })
    @ApiOperation({ summary: 'Purchase License Usage for a Dataset or Service' })
    @ApiBody({type: LicenseUsagePurchaseDto, required: true})
    @ApiResponse({status: 201, description: 'Ok: Job added to queue', type: Boolean})
    @ApiResponse({status: 500, description: "Error: Internal Server Error", type: ErrorDto})
    @UseGuards(AuthGuard)
    @Post('/purchaseDatasetOneTimeLicence')
    async purchaseLicenseUsage(@Body() purchaseLicenseUsage: LicenseUsagePurchaseDto, @Request() req: any): Promise<boolean>{
        const credentials = await this.blockchainService.getAddressAndKey(req.user.username)
        return await this.blockchainService.purchaseLicenseUsage(purchaseLicenseUsage, credentials)
    }
}
