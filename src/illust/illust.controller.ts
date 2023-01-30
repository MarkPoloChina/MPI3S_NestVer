import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  // Res,
  // UploadedFile,
  // UseInterceptors,
} from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import { IllustDto } from './dto/illust.dto';
import { IllustService } from './illust.service';
// import { Response } from 'express';

@Controller('illust')
export class IllustController {
  constructor(private readonly illustService: IllustService) {}

  @Get('enum')
  illustEnum(
    @Query('row') row: string,
    @Query('desc') desc: number,
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
    @Query('orderDesc') orderDesc?: number,
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

  @Post('list')
  newIllusts(@Body() illusts: IllustDto[]) {
    return this.illustService.newIllusts(illusts);
  }

  @Put('list')
  updateIllusts(
    @Body() illusts: IllustDto[],
    @Query('byMatch') byMatch: number,
    @Query('addIfNotFound') addIfNotFound: number,
  ) {
    return this.illustService.updateIllusts(illusts, addIfNotFound, byMatch);
  }

  @Get('poly/list')
  async illustPolyList(
    @Query('withIllust') withIllust?: number,
    @Query('type') type?: string,
  ) {
    return this.illustService.getPolyList(withIllust, type);
  }

  @Post('poly/list')
  async updatePoly(
    @Body() illusts: IllustDto[],
    @Query('byMatch') byMatch: number,
    @Query('type') type: string,
    @Query('parent') parent: string,
    @Query('name') name: string,
    @Query('conditionJson') conditionJson: string,
    @Query('byCondition') byCondition: number,
  ) {
    return byCondition
      ? this.illustService.updatePolyByCondition(
          conditionJson,
          type,
          parent,
          name,
        )
      : this.illustService.updatePoly(illusts, type, parent, name, byMatch);
  }

  @Delete('poly/list')
  async removeFromPoly(
    @Query('polyId') polyId: number,
    @Query('illustList') ids: number[],
  ) {
    return this.illustService.removeIllustsFromPoly(polyId, ids);
  }

  @Delete('poly')
  async deletePoly(@Query('polyId') polyId: number) {
    return this.illustService.deletePoly(polyId);
  }

  @Get('poly/enum')
  async illustPolyEnum(
    @Query('row') row: string,
    @Query('desc') desc: number,
    @Query('requiredType') requiredType?: string,
  ) {
    return this.illustService.getPolyEnum(row, desc, requiredType);
  }

  @Get('remote-base/list')
  async remoteBase(@Query('withIllust') withIllust: number) {
    return this.illustService.getRemoteBaseList(withIllust);
  }

  // @Get('test')
  // test() {
  //   this.illustService.newIllust();
  //   return '';
  // }

  // @Post('test')
  // @UseInterceptors(FileInterceptor('file'))
  // testP(@UploadedFile() file: Express.Multer.File, @Body() illust: IllustDto) {
  //   console.log(illust.name);
  //   console.log(file.originalname);
  //   return this.illustService.test(illust.name);
  // }
}
