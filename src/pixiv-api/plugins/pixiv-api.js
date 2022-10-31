const Pixiv = require('./pixiv-api-client-mod');
const config = require('../../config');
const { Agent } = require('https');
const Axios = require('axios');

let api = new Pixiv();
let ready = false;

global.p_direct = true;

Pixiv.setAgent(
  new Agent({
    rejectUnauthorized: false,
    servername: '',
  }),
);

api.refreshAccessToken(config.api.token).then(() => {
  ready = true;
});

export class PixivAPI {
  static getAuth = () => {
    if (!ready) {
      console.log('Waiting for Network......');
      return 'not ready';
    } else {
      return api.authInfo();
    }
  };
  static getBookmarksOfFirstPages = async (page = 1, url = null) => {
    let json;
    if (url) json = await api.requestUrl(url);
    else json = await api.userBookmarksIllust(api.authInfo().user.id);
    if (page == 1) return json;
    else {
      let next = json.next_url;
      for (let i = 0; i < page - 1; i++) {
        if (!next || next == '') break;
        let cur = await api.requestUrl(next);
        json.illusts.push(...cur.illusts);
        next = cur.next_url;
      }
      json.next_url = next;
      return json;
    }
  };

  static downloadFile = async (url) => {
    const axiosOption = {
      headers: {
        referer: 'https://www.pixiv.net/',
      },
      responseType: 'arraybuffer',
    };
    if (config.api.useDirectForFile) {
      const Url = new URL(url);
      axiosOption.headers.Host = Url.host;
      Url.hostname = config.api.HOST;
      let res = await Axios.get(Url.href, axiosOption);
      return res.data;
    } else if (config.api.useCfForFile) {
      let res = await Axios.get(
        url.replace('i.pximg.net', 'i-cf.pximg.net'),
        axiosOption,
      );
      return res.data;
    } else {
      let res = await Axios.get(url, axiosOption);
      return res.data;
    }
  };

  static getIllustInfoById = async (pid) => {
    let json = await api.illustDetail(pid);
    return json;
  };
}
