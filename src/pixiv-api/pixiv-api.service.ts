import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meta } from 'src/illust/entities/meta.entities';
import { Repository } from 'typeorm';
import { PixivAPI } from './plugins/pixiv-api';
@Injectable()
export class PixivApiService {
  @InjectRepository(Meta)
  private readonly metaRepository: Repository<Meta>;

  async getPixivBlob(pid: number, page: number, type: string) {
    const detail = await PixivAPI.getIllustInfoById(pid);
    if (!detail || page >= detail.illust.page_count || !detail.illust.visible)
      return null;
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
    const detail = await PixivAPI.getIllustInfoById(pid);
    if (!detail || page >= detail.illust.page_count || !detail.illust.visible)
      return null;
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

  async getLatestIllusts(isPrivate: number) {
    const list = [];
    const queryAsync = (pid, index) => {
      return new Promise((resolve, reject) => {
        this.metaRepository
          .findOne({ where: { pid: pid } })
          .then((data) => resolve({ data: data, index: index }))
          .catch((err) => reject(err));
      });
    };
    const check = async (url?: string) => {
      let flag = false;
      const json = await PixivAPI.getBookmarksFromUrl(url, isPrivate != 0);
      if (json) {
        return json;
      }
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
}
