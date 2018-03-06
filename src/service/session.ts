import request from "core/request";
import { resource } from "./api";
import session = resource.session;

class ServiceClient implements session.Service {
  query(): Promise<session.QueryResponse> {
    const meta = session.metadata.query;
    return request(meta.path, meta.method);
  }
  create(args: session.CreateRequest): Promise<session.CreateResponse> {
    const meta = session.metadata.create;
    return request(meta.path, meta.method, args);
  }
}

export default new ServiceClient();
