import { setLoading } from "react-coat";
import client from "service/user";
import namespace from "../namespace";

export interface QueryResult {
  uid: string;
  username: string;
}
export interface CreateResult {
  uid: string;
  username: string;
}
export async function query(): Promise<QueryResult> {
  return setLoading(client.GetCurrentUser());
}
export async function create(username: string, password: string): Promise<CreateResult> {
  return setLoading(client.Login({ username, password }), namespace, "login");
}
