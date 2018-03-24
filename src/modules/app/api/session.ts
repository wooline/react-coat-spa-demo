import { delayPromise } from "react-coat";

export interface GetCurUserResponse {
  uid: string;
  username: string;
  hasLogin: boolean;
}
export interface LoginResponse {
  uid: string;
  username: string;
  hasLogin: boolean;
}

export class API {
  // mock一个耗时3秒的异步请求
  @delayPromise(3)
  getCurUser(): Promise<GetCurUserResponse> {
    return Promise.resolve({ uid: "0", username: "guest", hasLogin: false });
  }
  // mock一个耗时3秒的异步请求
  @delayPromise(3)
  login(username: string, password: string): Promise<LoginResponse> {
    return Promise.resolve({ uid: "1", username: "jimmy", hasLogin: true });
  }
}

export const api = new API();
