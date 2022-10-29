import { Controller, Get } from '@nestjs/common';
import { IllustService } from './illust.service';

@Controller('illust')
export class IllustController {
  constructor(private readonly illustService: IllustService) {}

  @Get('test')
  test() {
    return this.illustService.test();
  }
}
