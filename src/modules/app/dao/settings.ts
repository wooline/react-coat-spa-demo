import { setLoading } from "react-coat";
import client from "service/config";

export interface QueryResult {
  title: string;
}
export async function query(): Promise<QueryResult> {
  return setLoading(client.GetSettings());
}
