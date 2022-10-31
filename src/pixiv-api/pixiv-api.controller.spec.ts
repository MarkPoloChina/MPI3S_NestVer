import { Test, TestingModule } from '@nestjs/testing';
import { PixivApiController } from './pixiv-api.controller';

describe('PixivApiController', () => {
  let controller: PixivApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PixivApiController],
    }).compile();

    controller = module.get<PixivApiController>(PixivApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
