export interface GetCurUserResponse {
  uid: string;
  username: string;
}
export interface LoginResponse {
  uid: string;
  username: string;
}
export async function getCurUser(): Promise<GetCurUserResponse> {
  return Promise.resolve({ uid: "0", username: "guest" });
}
export async function login(username: string, password: string): Promise<LoginResponse> {
  return Promise.resolve({ uid: "1", username: "jimmy" });
}
