// Type definitions for pixiv-api.js
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

export declare namespace PixivAPI {
  declare function getAuth(): void;

  /**
   *
   * @param page
   * @param url
   * @return
   */
  declare function getBookmarksOfFirstPages(page: any, url: any): Ret;

  /**
   *
   * @param url
   */
  declare function downloadFile(url: any): void;

  /**
   *
   * @param pid
   */
  declare function getIllustInfoById(pid: any): void;
}
