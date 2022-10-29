import { Test, TestingModule } from '@nestjs/testing';
import { IllustController } from './illust.controller';

describe('IllustController', () => {
  let controller: IllustController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IllustController],
    }).compile();

    controller = module.get<IllustController>(IllustController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
