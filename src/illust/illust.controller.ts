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
import { IllustBatchDto } from './dto/illust_batch.dto';
import { RemoteBaseDto } from './dto/remote_base.dto';
import { IllustService } from './illust.service';
// import { Response } from 'express';

@Controller('illust')
export class IllustController {
  constructor(private readonly illustService: IllustService) {}

  @Get('base/enum')
  illustEnum(@Query('row') row: string, @Query('desc') desc: string) {
    return this.illustService.getIllustEnum(row, !!parseInt(desc));
  }

  @Get('base/list')
  illustList(
    @Query('conditionJson') conditionJson: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('orderAs') orderJson?: string,
  ) {
    return this.illustService.getIllustListByQuery(
      JSON.parse(conditionJson),
      limit,
      offset,
      orderJson ? JSON.parse(orderJson) : undefined,
    );
  }

  @Get('base/count')
  illustListCount(@Query('conditionJson') conditionJson: string) {
    return this.illustService.getIllustListCountByQuery(
      JSON.parse(conditionJson),
    );
  }

  @Post('bases')
  newIllusts(@Body() illusts: IllustBatchDto) {
    return this.illustService.newIllusts(illusts);
  }

  @Put('bases')
  updateIllusts(@Body() illusts: IllustBatchDto) {
    return this.illustService.updateIllusts(illusts);
  }

  @Put('base')
  updateIllust(
    @Body() illusts: IllustDto,
    @Query('addIfNotFound') addIfNotFound: string,
  ) {
    return this.illustService.updateIllust(illusts, !!parseInt(addIfNotFound));
  }

  @Delete('bases')
  deleteIllusts(@Query('illustIds') illustIds: number[]) {
    return this.illustService.deleteIllusts(illustIds);
  }

  @Get('poly/list')
  illustPolyList(
    @Query('withIllust') withIllust?: string,
    @Query('type') type?: string,
    @Query('orderAs') orderJson?: string,
  ) {
    return this.illustService.getPolyList(
      !!parseInt(withIllust),
      type,
      orderJson ? JSON.parse(orderJson) : undefined,
    );
  }

  @Post('poly/bases')
  updatePoly(@Body() illusts: IllustBatchDto) {
    return this.illustService.updatePoly(illusts);
  }

  @Delete('poly/bases')
  removeFromPoly(
    @Query('polyId') polyId: number,
    @Query('illustList') ids: number[],
  ) {
    return this.illustService.removeIllustsFromPoly(polyId, ids);
  }

  @Delete('poly')
  deletePoly(@Query('polyId') polyId: string) {
    return this.illustService.deletePoly(parseInt(polyId));
  }

  @Get('poly/enum')
  illustPolyEnum(
    @Query('row') row: string,
    @Query('desc') desc: string,
    @Query('requiredType') requiredType?: string,
  ) {
    return this.illustService.getPolyEnum(row, !!parseInt(desc), requiredType);
  }

  @Get('remote-base/list')
  remoteBase(@Query('withIllust') withIllust: string) {
    return this.illustService.getRemoteBaseList(!!parseInt(withIllust));
  }

  @Post('remote-base')
  updateRemoteBase(@Body() remoteBase: RemoteBaseDto) {
    return this.illustService.coverRemoteBase(remoteBase);
  }

  @Get('illust-today')
  illustToday(@Query('date') date: string) {
    return this.illustService.getIllustToday(new Date(date));
  }

  @Put('illust-today')
  coverIllustToday(
    @Query('date') date: string,
    @Query('illustId') illustId: string,
  ) {
    return this.illustService.coverIllustToday(
      new Date(date),
      parseInt(illustId),
    );
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
