const Pixiv = require('./pixiv-api-client-mod');
const config = require('../../config');
const { Agent } = require('https');
const Axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

let api = new Pixiv();
let ready = false;
let retry = 0;

global.p_direct = config.api.useDirectForApi;

if (config.api.useDirectForApi)
  Pixiv.setAgent(
    new Agent({
      rejectUnauthorized: false,
      servername: '',
    }),
  );
else if (config.api.useAgent) {
  Pixiv.setAgent(new HttpsProxyAgent(config.api.agent));
}
export class PixivAPI {
  static refreshToken = async () => {
    try {
      await api.refreshAccessToken(config.api.token);
      ready = true;
      console.log('Token Passed! Now can use pixiv API.'.green);
    } catch (err) {
      if (retry >= 3) throw Error('Token Auth failed after serveral retries.');
      console.log('Token Auth failed. Retry...');
      retry++;
      await this.refreshToken();
    }
  };
  static getAuth = () => {
    if (!ready) {
      console.log('Waiting for Network......');
      return 'not ready';
    } else {
      return api.authInfo();
    }
  };
  static getBookmarksOfFirstPages = async (page = 1, url = null) => {
    if (!ready) throw Error('Token Waiting Status');
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
    if (!ready) throw Error('Token Waiting Status');
    const axiosOption = {
      headers: {
        referer: 'https://www.pixiv.net/',
      },
      responseType: 'arraybuffer',
    };
    if (config.api.useCfForFile) {
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
    if (!ready) throw Error('Token Waiting Status');
    try {
      let json = await api.illustDetail(pid);
      return json;
    } catch (err) {
      try {
        if (
          JSON.parse(err).error.message.startsWith(
            'Error occurred at the OAuth process.',
          )
        ) {
          ready = false;
          console.log('Token Expired!! Try Refresh.'.yellow);
          await this.refreshToken();
          return this.getIllustInfoById(pid);
        } else throw err;
      } catch (_err) {
        throw err;
      }
    }
  };
}
PixivAPI.refreshToken();
