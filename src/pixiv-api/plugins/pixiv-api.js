const Pixiv = require('./pixiv-api-client-mod');
const config = require('../../config').default;
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
  static getBookmarksFromUrl = async (url = null, isPrivate = false) => {
    if (!ready) {
      console.log('Token Expired!! Try Refresh.'.yellow);
      await this.refreshToken();
    }
    let json;
    try {
      if (url) json = await api.requestUrl(url);
      else
        json = await api.userBookmarksIllust(
          api.authInfo().user.id,
          isPrivate ? { restrict: 'private' } : {},
        );
      return json;
    } catch (err) {
      return await this.processException(err, this.getBookmarksFromUrl, [
        url,
        isPrivate,
      ]);
    }
  };

  static downloadFile = async (url) => {
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
    if (!ready) {
      console.log('Token Expired!! Try Refresh.'.yellow);
      await this.refreshToken();
    }
    try {
      return await api.illustDetail(pid);
    } catch (err) {
      return await this.processException(err, this.getIllustInfoById, [pid]);
    }
  };

  static processException = async (err, nextPromise, param) => {
    try {
      if (
        JSON.parse(err).error.message.startsWith(
          'Error occurred at the OAuth process.',
        )
      ) {
        ready = false;
        return await nextPromise(...param);
      }
      if (
        JSON.parse(err).error.user_message.startsWith(
          'The creator has limited who can view this content',
        )
      )
        return null;
    } catch (_err) {
      throw err;
    }
    throw err;
  };
}
PixivAPI.refreshToken();
