import { Controller, Get } from '@nestjs/common';

@Controller('pixiv-api')
export class PixivApiController {
  // @Get('blob/origin')
  // async getBlobOrigin() {
  //   try {
  //     let detail = await PixivAPI.getIllustInfoById(req.query.pid);
  //     PixivAPI.downloadFile(
  //       detail.illust.meta_pages[req.query.page].image_urls.original,
  //     ).then((data) => {
  //       res.end(data);
  //     });
  //   } catch (error) {}
  // }
  // router.get("/api/blob/thum", async (req, res) => {
  //   try {
  //     let detail = await PixivAPI.getIllustInfoById(req.query.pid);
  //     PixivAPI.downloadFile(detail.illust.image_urls.medium).then(
  //       (data) => {
  //         res.end(data);
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error)
  //     res.sendStatus(404);
  //   }
  // });
  // router.get("/api/blob/sqare", async (req, res) => {
  //   try {
  //     let detail = await PixivAPI.getIllustInfoById(req.query.pid);
  //     PixivAPI.downloadFile(detail.illust.image_urls.square_medium).then(
  //       (data) => {
  //         res.end(data);
  //       }
  //     );
  //   } catch (error) {
  //     res.sendStatus(404);
  //   }
  // });
}
