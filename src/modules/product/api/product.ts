import { delayPromise, setLoading } from "react-coat-pkg";

import { NAMESPACE } from "../actionNames";

export interface GetProductListResponse {
  list: string[];
}

export class AJAX {
  /// mock一个耗时3秒的异步请求
  @delayPromise(3)
  getProductList(): Promise<GetProductListResponse> {
    return setLoading(Promise.resolve({ list: ["product1", "product2"] }));
  }
}

const ajax = new AJAX();

export class API {
  getProductList(): Promise<GetProductListResponse> {
    return setLoading(ajax.getProductList(), NAMESPACE);
  }
}

export const api = new API();
