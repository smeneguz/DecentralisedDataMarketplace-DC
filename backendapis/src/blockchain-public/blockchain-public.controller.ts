import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { BlockchainPublicService } from './blockchain-public.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PublicDatasetDto } from './dto/publicDataset-get.dto';
import { PublicLicenseDto } from './dto/publicLicense-get.dto';

@ApiTags('public')
@Controller('public')
export class BlockchainPublicController {
    constructor(
        private readonly blockchainPublicService: BlockchainPublicService
        ){}



}
