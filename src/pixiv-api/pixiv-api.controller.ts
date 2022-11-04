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

  @Get('blob/origin')
  async getBlobOrigin(
    @Query('pid') pid: number,
    @Query('page') page: number,
    @Res() response: Response,
  ) {
    const blob = await this.pixivApiService.getPixivBlob(pid, page, 'original');
    if (blob) response.end(blob);
    else throw new HttpException('pid or page no found', HttpStatus.NOT_FOUND);
  }

  @Get('blob/thum')
  async getBlobThum(
    @Query('pid') pid: number,
    @Query('page') page: number,
    @Res() response: Response,
  ) {
    const blob = await this.pixivApiService.getPixivBlob(pid, page, 'medium');
    if (blob) response.end(blob);
    else throw new HttpException('pid or page no found', HttpStatus.NOT_FOUND);
  }

  @Get('blob/square')
  async getBlobThumSquare(
    @Query('pid') pid: number,
    @Query('page') page: number,
    @Res() response: Response,
  ) {
    const blob = await this.pixivApiService.getPixivBlob(
      pid,
      page,
      'square_medium',
    );
    if (blob) response.end(blob);
    else throw new HttpException('pid or page no found', HttpStatus.NOT_FOUND);
  }

  @Get('pixiv-json/latest')
  async getJsonLatest(@Res() response: Response) {
    const json = await this.pixivApiService.getLatestIllusts();
    response.json(json);
  }
}
