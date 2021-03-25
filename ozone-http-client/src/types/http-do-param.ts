export interface HttpDoParam {
  verb?: "get" | "post" | "delete" | "put" | "patch";
  url: string;
  certs?: {
    ca?: string;
    cert?: string;
    key?: string;
  };
  query?: {
    [k: string]: unknown;
  };
  headers?: {
    [k: string]: unknown;
  };
  body?: any
  fields?: {
    [k: string]: unknown;
  };
  maxRedirects?: number;
  parseJson?: boolean;
  logLevel?: "silent" | "info" | "debug" | "error";
}