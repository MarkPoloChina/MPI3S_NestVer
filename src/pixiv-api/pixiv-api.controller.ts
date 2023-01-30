import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { PixivApiService } from './pixiv-api.service';
import { Request, Response } from 'express';

@Controller('pixiv-api')
export class PixivApiController {
  constructor(private readonly pixivApiService: PixivApiService) {}

  @Get('blob-s')
  async getBlob(
    @Query('pid') pid: number,
    @Query('page') page: number,
    @Query('type') type: string,
    @Res() response: Response,
  ) {
    if (!['square_medium', 'medium', 'original'].includes(type))
      throw new HttpException('bad param', HttpStatus.BAD_REQUEST);
    const blob = await this.pixivApiService.getPixivBlob(pid, page, type);
    if (blob) response.end(blob);
    else throw new HttpException('pid or page no found', HttpStatus.NOT_FOUND);
  }

  @Get('blob')
  @Redirect()
  async getBlobByRedirect(
    @Query('pid') pid: number,
    @Query('page') page: number,
    @Query('type') type: string,
    @Req() request: Request,
  ) {
    if (!['square_medium', 'medium', 'original'].includes(type))
      throw new HttpException('bad param', HttpStatus.BAD_REQUEST);
    const url = await this.pixivApiService.getPixivUrl(pid, page, type);
    if (!url)
      throw new HttpException('pid or page no found', HttpStatus.NOT_FOUND);
    if (url == '403') return { url: request.url.replace('blob', 'blob-s') };
    else return { url: url };
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
}
