// generated from server side, e.g. https://localhost:8443/_sys/api
export namespace api.user {
  export interface GetCurrentUserResponse {
    uid: string;
    username: string;
  }
  export interface LoginRequest {
    username: string;
    password: string;
  }
  export interface LoginResponse {
    uid: string;
    username: string;
  }
}
export namespace api.config {
  export interface GetSettingsResponse {
    title: string;
  }
}
export namespace api.app {
  export interface CurrentUserResponse {
    uid: string;
    username: string;
  }
  export interface LoginRequest {
    username: string;
    password: string;
  }
  export interface LoginResponse {
    uid: string;
    username: string;
  }
}
export namespace api {
  export const UserServiceMetadata = {
    GetCurrentUser: { method: "GET", path: "/ajax/getCurrentUser" },
    login: { method: "PUT", path: "/ajax/login" }
  };

  export interface UserService {
    GetCurrentUser(): Promise<user.GetCurrentUserResponse>;
    Login(request: user.LoginRequest): Promise<user.LoginResponse>;
  }

  export const ConfigServiceMetadata = {
    GetSettings: { method: "GET", path: "/ajax/getSettings" }
  };

  export interface ConfigService {
    GetSettings(): Promise<config.GetSettingsResponse>;
  }
}
