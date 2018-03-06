import { resource } from "service/api";
import session = resource.session;
import { Request } from "../index";

export default function(request: Request) {
  if (request.request.method === "get") {
    serviceClient.query().then(data => {
      request.responseData(data);
    });
  }
}

class ServiceClient implements session.Service {
  query(): Promise<session.QueryResponse> {
    return Promise.resolve({ uid: "1", username: "jimmy" });
  }
  create(args: session.CreateRequest): Promise<session.CreateResponse> {
    return Promise.resolve({ uid: "1", username: "jimmy" });
  }
}

const serviceClient = new ServiceClient();
