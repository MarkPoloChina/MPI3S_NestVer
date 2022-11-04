import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meta } from 'src/illust/entities/meta.entities';
import { Repository } from 'typeorm';
import { PixivAPI } from './plugins/pixiv-api';
@Injectable()
export class PixivApiService {
  @InjectRepository(Meta)
  private readonly metaRepository: Repository<Meta>;

  async getPixivBlob(
    pid: number,
    page: number,
    type: 'square_medium' | 'medium' | 'large' | 'original',
  ) {
    try {
      const detail = await PixivAPI.getIllustInfoById(pid);
      if (page >= detail.illust.page_count) return null;
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
    } catch (err) {
      console.log(err);
      try {
        if (
          JSON.parse(err).error &&
          JSON.parse(err).error.user_message ==
            'The creator has limited who can view this content'
        )
          return null;
        else throw Error('HTTP ERROR');
      } catch {
        throw Error('HTTP ERROR');
      }
    }
  }

  async getLatestIllusts() {
    const list = [];
    let flag = true;
    const queryAsync = (pid, index) => {
      return new Promise((resolve, reject) => {
        this.metaRepository
          .findOne({ where: { pid: pid } })
          .then((data) => resolve({ data: data, index: index }))
          .catch((err) => reject(err));
      });
    };
    const check = async (url?: string) => {
      const json = await PixivAPI.getBookmarksOfFirstPages(1, url);
      const promises = [];
      json.illusts.forEach((illust, index) => {
        promises.push(queryAsync(illust.id, index));
      });
      const values = await Promise.all(promises);
      values.forEach((value) => {
        if (!value.data)
          list.push({ ...json.illusts[value.index], caption: null });
        else flag = false;
      });
      if (flag) return await check(json.next_url);
      else {
        return json.illusts;
      }
    };
    return await check();
  }
}
