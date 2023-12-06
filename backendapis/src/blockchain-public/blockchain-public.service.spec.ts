import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainPublicService } from './blockchain-public.service';

describe('BlockchainPublicService', () => {
  let service: BlockchainPublicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockchainPublicService],
    }).compile();

    service = module.get<BlockchainPublicService>(BlockchainPublicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
