export interface GetSettingsResponse {
  title: string;
}
export async function getSettings(): Promise<GetSettingsResponse> {
  return Promise.resolve({ title: "Hello world" });
}
