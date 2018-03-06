// generated from server side, e.g. https://localhost:8443/_sys/api
export namespace resource.session {
  export interface Service {
    query(): Promise<QueryResponse>;
    create(request: CreateRequest): Promise<CreateResponse>;
  }
  export const metadata = {
    query: { method: "GET", path: "/api/session" },
    create: { method: "PUT", path: "/api/session" }
  };
  export interface QueryResponse {
    uid: string;
    username: string;
  }
  export interface CreateRequest {
    username: string;
    password: string;
  }
  export interface CreateResponse {
    uid: string;
    username: string;
  }
}
export namespace resource.settings {
  export interface Service {
    query(): Promise<QueryResponse>;
  }
  export const metadata = {
    query: { method: "GET", path: "/api/settings" }
  };
  export interface QueryResponse {
    title: string;
  }
}
