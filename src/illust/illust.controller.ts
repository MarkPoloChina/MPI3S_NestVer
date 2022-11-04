import {
  // Body,
  Controller,
  Get,
  // Post,
  Query,
  // Res,
  // UploadedFile,
  // UseInterceptors,
} from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { IllustDto } from './dto/illust.dto';
import { IllustService } from './illust.service';
// import { Response } from 'express';

@Controller('illust')
export class IllustController {
  constructor(private readonly illustService: IllustService) {}

  @Get('enum')
  pixivEnumDate(
    @Query('row') row: string,
    @Query('desc') desc: boolean,
    @Query('requiredType') requiredType?: string,
  ) {
    return this.illustService.getIllustEnum(row, desc, requiredType);
  }

  @Get('list')
  illustList(
    @Query('conditionJson') conditionJson: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('orderAs') orderAs?: string,
    @Query('orderDesc') orderDesc?: boolean,
  ) {
    return this.illustService.getIllustListByStdQuery(
      conditionJson,
      limit,
      offset,
      orderAs,
      orderDesc,
    );
  }

  @Get('list/count')
  async illustListCount(@Query('conditionJson') conditionJson: string) {
    return this.illustService.getIllustListCountByStdQuery(conditionJson);
  }

  @Get('poly/list')
  async illustPolyList(
    @Query('withIllust') withIllust?: string,
    @Query('type') type?: string,
  ) {
    return this.illustService.getPolyList(withIllust == 'true', type);
  }

  @Get('test')
  test() {
    this.illustService.newIllust();
    return '';
  }

  // @Post('test')
  // @UseInterceptors(FileInterceptor('file'))
  // testP(@UploadedFile() file: Express.Multer.File, @Body() illust: IllustDto) {
  //   console.log(illust.name);
  //   console.log(file.originalname);
  //   return this.illustService.test(illust.name);
  // }
}
