// Type definitions for pixiv-api.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

export declare namespace PixivAPI {
  declare function getAuth(): any;

  /**
   *
   * @param url
   * @param isPrivate
   * @return
   */
  declare function getBookmarksFromUrl(url: any, isPrivate: boolean): promise;

  /**
   *
   * @param url
   */
  declare function downloadFile(url: any): promise;

  /**
   *
   * @param pid
   */
  declare function getIllustInfoById(pid: any): promise;
}
