import {
  // Body,
  Controller,
  Get,
  // Post,
  Query,
  // UploadedFile,
  // UseInterceptors,
} from '@nestjs/common';
import { Illust } from './entities/illust.entities';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { IllustDto } from './dto/illust.dto';
import { IllustService } from './illust.service';
import { PixivAPI } from '../pixiv-api/plugins/pixiv-api.js';

@Controller('illust')
export class IllustController {
  constructor(private readonly illustService: IllustService) {}

  @Get('pixiv/enum/date')
  pixivEnumDate() {
    return this.illustService.getPixivEnumDate();
  }

  @Get('pixiv/list')
  pixivList(@Query() query: Record<string, any>) {
    return this.illustService.getPixivList(query);
  }

  @Get('test')
  test() {
    return PixivAPI.getAuth();
  }
  // @Post('test')
  // @UseInterceptors(FileInterceptor('file'))
  // testP(@UploadedFile() file: Express.Multer.File, @Body() illust: IllustDto) {
  //   console.log(illust.name);
  //   console.log(file.originalname);
  //   return this.illustService.test(illust.name);
  // }
}
