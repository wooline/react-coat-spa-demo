import request from "core/request";
import { api } from "./api";
import ConfigService = api.ConfigService;
import ConfigServiceMetadata = api.ConfigServiceMetadata;

class ServiceClient implements ConfigService {
  GetSettings(): Promise<api.config.GetSettingsResponse> {
    const meta = ConfigServiceMetadata.GetSettings;
    return request(meta.path, meta.method);
  }
}

export default new ServiceClient();
