import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PixivApiController } from './pixiv-api.controller';
import { PixivApiService } from './pixiv-api.service';
import { Meta } from '../illust/entities/meta.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Meta])],
  providers: [PixivApiService, Meta],
  controllers: [PixivApiController],
})
export class PixivApiModule {}
