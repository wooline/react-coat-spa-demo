import { setLoading } from "react-coat";
import client from "service/settings";

export interface GetSettingsResponse {
  title: string;
}
export async function getSettings(): Promise<GetSettingsResponse> {
  return setLoading(client.query());
}
