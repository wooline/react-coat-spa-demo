import request from "core/request";
import { resource } from "./api";
import settings = resource.settings;

class ServiceClient implements settings.Service {
  query(): Promise<settings.QueryResponse> {
    const meta = settings.metadata.query;
    return request(meta.path, meta.method);
  }
}

export default new ServiceClient();
