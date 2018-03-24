import { delayPromise } from "react-coat";
export interface GetSettingsResponse {
  title: string;
}

export class API {
  // mock一个耗时3秒的异步请求
  @delayPromise(3)
  getSettings(): Promise<GetSettingsResponse> {
    return Promise.resolve({ title: "Hello world" });
  }
}

export const api = new API();
