import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PixivApiController } from './pixiv-api.controller';
import { PixivApiService } from './pixiv-api.service';
import { Meta } from '../illust/entities/meta.entities';
import { Illust } from 'src/illust/entities/illust.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Meta, Illust])],
  providers: [PixivApiService, Meta, Illust],
  controllers: [PixivApiController],
})
export class PixivApiModule {}
