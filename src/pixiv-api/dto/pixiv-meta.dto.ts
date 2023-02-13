export interface PixivIllustObjectDto {
  id: number;
  title: string;
  type: string;
  image_urls: {
    square_medium: string;
    medium: string;
    large: string;
  };
  caption: null;
  restrict: number;
  user: {
    id: number;
    name: string;
    account: string;
    profile_image_urls: {
      medium: string;
    };
    is_followed: boolean;
  };
  tags: Array<{ name: string; translated_name: string }>;
  tools: Array<string>;
  create_date: Date;
  page_count: number;
  width: number;
  height: number;
  sanity_level: number;
  x_restrict: number;
  series: null;
  meta_single_page: { original_image_url: string };
  meta_pages: Array<{
    image_urls: {
      square_medium: string;
      medium: string;
      large: string;
      original: string;
    };
  }>;
  total_view: number;
  total_bookmarks: number;
  is_bookmarked: boolean;
  visible: boolean;
  is_muted: boolean;
  illust_ai_type: number;
  illust_book_style: number;
}
