import { Test, TestingModule } from '@nestjs/testing';
import { IllustService } from './illust.service';

describe('IllustService', () => {
  let service: IllustService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IllustService],
    }).compile();

    service = module.get<IllustService>(IllustService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
