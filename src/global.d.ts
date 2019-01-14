declare module "rc-form";
declare module "deep-extend";
declare function getInitEnv(): {
  clientPublicPath: string;
  apiServerPath: {[key: string]: string};
};
declare const InitEnv: {
  clientPublicPath: string;
  apiServerPath: {[key: string]: string};
};
