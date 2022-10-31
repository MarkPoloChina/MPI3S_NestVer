import { Test, TestingModule } from '@nestjs/testing';
import { PixivApiService } from './pixiv-api.service';

describe('PixivApiService', () => {
  let service: PixivApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PixivApiService],
    }).compile();

    service = module.get<PixivApiService>(PixivApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
