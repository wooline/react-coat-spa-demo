import { setLoading } from "react-coat";
import client from "service/session";
import namespace from "../namespace";

export interface GetCurUserResponse {
  uid: string;
  username: string;
}
export interface LoginResponse {
  uid: string;
  username: string;
}
export async function getCurUser(): Promise<GetCurUserResponse> {
  return setLoading(client.query());
}
export async function login(username: string, password: string): Promise<LoginResponse> {
  return setLoading(client.create({ username, password }), namespace, "login");
}
