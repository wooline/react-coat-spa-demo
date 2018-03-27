import { delayPromise } from "react-coat-pkg";

export interface GetSettingsResponse {
  title: string;
}

export class API {
  // mock一个耗时3秒的异步请求
  @delayPromise(3)
  getSettings(): Promise<GetSettingsResponse> {
    return Promise.resolve({ title: "Hello world" });
  }
  reportError(error: any): Promise<boolean> {
    return Promise.resolve(true);
  }
}

export const api = new API();
