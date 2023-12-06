import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainPublicController } from './blockchain-public.controller';

describe('BlockchainPublicController', () => {
  let controller: BlockchainPublicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlockchainPublicController],
    }).compile();

    controller = module.get<BlockchainPublicController>(BlockchainPublicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
