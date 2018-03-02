import request from "core/request";
import { api } from "./api";
import UserService = api.UserService;
import UserServiceMetadata = api.UserServiceMetadata;

class ServiceClient implements UserService {
  GetCurrentUser(): Promise<api.user.GetCurrentUserResponse> {
    const meta = UserServiceMetadata.GetCurrentUser;
    return request(meta.path, meta.method);
  }

  Login(args: api.user.LoginRequest): Promise<api.user.LoginResponse> {
    const meta = UserServiceMetadata.login;
    return request(meta.path, meta.method, args);
  }
}

export default new ServiceClient();
