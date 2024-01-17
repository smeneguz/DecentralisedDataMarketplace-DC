import { Controller, Post, Body, UseGuards, Request  } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PublishDataDto } from './dto/publish-data.dto';
import { BlockchainService } from './blockchain.service';
import { LicensePeriodDto, LicenseUsageDto } from './dto/license-upload.dto';
import { LicensePeriodPurchaseDto, LicenseUsagePurchaseDto } from './dto/license-purchase.dto';
import { ConsumeNftDto } from './dto/consume-nft.dto';
import { ErrorDto } from './dto/error.dto';

@Controller('marketing')
export class BlockchainController {
    constructor(private readonly blockchainService: BlockchainService){
    }

    @UseGuards(AuthGuard)
    @Post('/registerDataset')
    async uploadData(@Body() publishDataDto: PublishDataDto, @Request() req: any): Promise<boolean>{
        return await this.blockchainService.publishData(publishDataDto, req.user.publicAddress);
    }

    @UseGuards(AuthGuard)
    @Post('/registerLicensePeriod')
    async uploadLicensePeriod(@Body() publishLicensePeriod: LicensePeriodDto, @Request() req: any): Promise<boolean>{
        return await this.blockchainService.publishLicensePeriod(publishLicensePeriod, req.user.publicAddress)
    }

    @UseGuards(AuthGuard)
    @Post('/registerDatasetOneTimeLicence')
    async uploadLicenseUsage(@Body() publishLicenseUsage: LicenseUsageDto, @Request() req: any): Promise<boolean>{
        return await this.blockchainService.publishLicenseUsage(publishLicenseUsage, req.user.publicAddress)
    }

    @UseGuards(AuthGuard)
    @Post('/purchaseDatasetOneTimeLicence')
    async purchaseLicenseUsage(@Body() purchaseLicenseUsage: LicenseUsagePurchaseDto, @Request() req: any): Promise<boolean>{
        return await this.blockchainService.purchaseLicenseUsage(purchaseLicenseUsage, req.user.publicAddress)
    }

    @UseGuards(AuthGuard)
    @Post('/purchaseLicensePeriod')
    async purchaseLicensePeriod(@Body() purchaseLicensePeriod: LicensePeriodPurchaseDto, @Request() req: any): Promise<boolean>{
        return await this.blockchainService.purchaseLicensePeriod(purchaseLicensePeriod, req.user.publicAddress)
    }

    @UseGuards(AuthGuard)
    @Post('/consumeDataLicense')
    async consumeNFT(@Body() consumeNft: ConsumeNftDto, @Request() req: any): Promise<boolean>{
        return await this.blockchainService.consumeNft(consumeNft, req.user.publicAddress);
    }
}
