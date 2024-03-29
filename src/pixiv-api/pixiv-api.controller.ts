import { Body, Controller, Get, Put, Query, Res } from '@nestjs/common';
import { PixivApiService } from './pixiv-api.service';
import { Response } from 'express';
import { IllustBatchDto } from 'src/illust/dto/illust_batch.dto';

@Controller('pixiv-api')
export class PixivApiController {
  constructor(private readonly pixivApiService: PixivApiService) {}

  @Get('blob')
  async getBlob(
    @Query('pid') pid: number,
    @Query('page') page: number,
    @Query('type') type: string,
    @Res() response: Response,
  ) {
    response.setHeader('Cache-Control', 'public,max-age=' + 60 * 60 * 24 * 365);
    response.end(await this.pixivApiService.getPixivBlob(pid, page, type));
  }

  @Get('url')
  async getUrl(
    @Query('pid') pid: number,
    @Query('page') page: number,
    @Query('type') type: string,
  ) {
    return this.pixivApiService.getPixivUrl(pid, page, type);
  }

  @Get('pixiv-json/latest')
  async getJsonLatest(
    @Res() response: Response,
    @Query('isPrivate') isPrivate: string,
  ) {
    const json = await this.pixivApiService.getLatestIllusts(
      !!parseInt(isPrivate),
    );
    response.json(json);
  }

  @Put('pixiv-json/list')
  async updateMetas(@Body() illusts: IllustBatchDto) {
    return this.pixivApiService.updateMetas(illusts);
  }

  @Get('pixiv-json')
  async getJson(@Query('pid') pid: number) {
    return this.pixivApiService.getPixivJson(pid);
  }

  @Get('blob/proxy')
  async getBlobProxy(@Query('url') url: string, @Res() response: Response) {
    const blob = await this.pixivApiService.getPixivBlobByProxy(url);
    if (blob) response.end(blob);
  }
}
