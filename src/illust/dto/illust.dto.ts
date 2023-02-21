export interface IllustDto {
  id: number | null;
  star: number | null;
  date: Date | null;
  tag: Array<string> | null;
  remote_endpoint: string;
  meta: {
    pid: number;
    page: number;
    title: string | null;
    limit: string | null;
  };
  remote_base: {
    id: number | null;
    name: string | null;
  };
}
