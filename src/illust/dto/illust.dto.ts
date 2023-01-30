export interface IllustDto {
  id: number | null;
  type: string | null;
  star: number | null;
  date: Date | null;
  meta: {
    pid: number;
    page: number;
    title: string | null;
    limit: string | null;
  };
  remote_info: {
    remote_type: string;
    remote_base_id: number;
    remote_endpoint: string;
    thum_base_id: number;
    thum_endpoint: string;
  };
  bid: number | string;
}
