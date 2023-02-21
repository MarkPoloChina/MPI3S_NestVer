import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IllustDto } from 'src/illust/dto/illust.dto';
import { Meta } from 'src/illust/entities/meta.entities';
import { Repository } from 'typeorm';
import { PixivIllustObjectDto } from './dto/pixiv-meta.dto';
import { PixivAPI } from './plugins/pixiv-api';
@Injectable()
export class PixivApiService {
  @InjectRepository(Meta)
  private readonly metaRepository: Repository<Meta>;

  async getPixivBlob(pid: number, page: number, type: string) {
    if (!['square_medium', 'medium', 'original'].includes(type))
      throw new HttpException('illegal type.', HttpStatus.BAD_REQUEST);
    const detail: { illust: PixivIllustObjectDto } =
      await PixivAPI.getIllustInfoById(pid);
    if (!detail || page >= detail.illust.page_count || !detail.illust.visible)
      throw new HttpException('pid or page no found', HttpStatus.NOT_FOUND);
    if (detail.illust.page_count == 1) {
      if (type == 'original')
        return await PixivAPI.downloadFile(
          detail.illust.meta_single_page.original_image_url,
        );
      else return await PixivAPI.downloadFile(detail.illust.image_urls[type]);
    } else
      return await PixivAPI.downloadFile(
        detail.illust.meta_pages[page].image_urls[type],
      );
  }

  async getPixivUrl(pid: number, page: number, type: string) {
    if (!['square_medium', 'medium', 'original'].includes(type))
      throw new HttpException('illegal type.', HttpStatus.BAD_REQUEST);
    const detail: { illust: PixivIllustObjectDto } =
      await PixivAPI.getIllustInfoById(pid);
    if (!detail || page >= detail.illust.page_count || !detail.illust.visible)
      throw new HttpException('pid or page no found', HttpStatus.NOT_FOUND);
    const url =
      detail.illust.page_count == 1
        ? type == 'original'
          ? detail.illust.meta_single_page.original_image_url
          : detail.illust.image_urls[type]
        : detail.illust.meta_pages[page].image_urls[type];
    return url.replace('i.pximg.net', 'i-cf.pximg.net');
  }

  async getPixivBlobByProxy(url: string) {
    return await PixivAPI.downloadFile(url);
  }

  async getLatestIllusts(isPrivate: boolean) {
    const list = [];
    const queryAsync = (pid: number, index: number) => {
      return new Promise((resolve, reject) => {
        this.metaRepository
          .findOne({ where: { pid: pid } })
          .then((data) => resolve({ data: data, index: index }))
          .catch((err) => reject(err));
      });
    };
    const check = async (url?: string) => {
      let flag = false;
      const json: { illusts: Array<PixivIllustObjectDto>; next_url: string } =
        await PixivAPI.getBookmarksFromUrl(url, isPrivate);
      const promises = [];
      json.illusts.forEach((illust, index) => {
        promises.push(queryAsync(illust.id, index));
      });
      const values = await Promise.all(promises);
      values.forEach((value) => {
        if (!value.data) {
          list.push({ ...json.illusts[value.index], caption: null });
          flag = true;
        }
      });
      if (flag) return await check(json.next_url);
      else {
        return list;
      }
    };
    return await check();
  }

  async updateMeta(illusts: IllustDto[]) {
    const limitMap = {
      0: 'normal',
      1: 'R-18',
      2: 'R-18G',
    };
    for (const illust of illusts) {
      this.metaRepository
        .findBy({
          pid: illust.meta.pid,
        })
        .then(async (targetMeta) => {
          if (!targetMeta) return;
          const detail: { illust: PixivIllustObjectDto } =
            await PixivAPI.getIllustInfoById(illust.meta.pid);
          if (!detail || !detail.illust.visible) return;
          targetMeta.forEach((meta) => {
            meta.author = detail.illust.user.name;
            meta.author_id = detail.illust.user.id;
            meta.book_cnt = detail.illust.total_bookmarks;
            meta.limit = limitMap[detail.illust.x_restrict];
          });
          this.metaRepository.save(targetMeta);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}
