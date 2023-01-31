import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { PixivApiService } from './pixiv-api.service';
import { Response } from 'express';

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
    if (!['square_medium', 'medium', 'original'].includes(type))
      throw new HttpException('bad param', HttpStatus.BAD_REQUEST);
    const blob = await this.pixivApiService.getPixivBlob(pid, page, type);
    if (blob) {
      response.setHeader(
        'Cache-Control',
        'public,max-age=' + 60 * 60 * 24 * 365,
      );
      response.end(blob);
    } else
      throw new HttpException('pid or page no found', HttpStatus.NOT_FOUND);
  }

  @Get('url')
  async getUrl(
    @Query('pid') pid: number,
    @Query('page') page: number,
    @Query('type') type: string,
  ) {
    if (!['square_medium', 'medium', 'original'].includes(type))
      throw new HttpException('bad param', HttpStatus.BAD_REQUEST);
    const url = await this.pixivApiService.getPixivUrl(pid, page, type);
    if (!url)
      throw new HttpException('pid or page no found', HttpStatus.NOT_FOUND);
    return url;
  }

  @Get('pixiv-json/latest')
  async getJsonLatest(@Res() response: Response) {
    const json = await this.pixivApiService.getLatestIllusts();
    response.json(json);
  }

  @Get('blob/proxy')
  async getBlobProxy(@Query('url') url: string, @Res() response: Response) {
    const blob = await this.pixivApiService.getPixivBlobByProxy(url);
    if (blob) response.end(blob);
  }
}
