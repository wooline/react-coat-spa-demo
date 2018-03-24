import { delayPromise } from "react-coat";

export interface GetMessageListResponse {
  list: string[];
}

export class API {
  // mock一个耗时3秒的异步请求
  @delayPromise(3)
  getMessageList(): Promise<GetMessageListResponse> {
    return Promise.resolve({ list: ["message1", "message2"] });
  }
}

export const api = new API();
