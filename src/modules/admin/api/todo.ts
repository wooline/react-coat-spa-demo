export interface GetTodosResponse {
  list: string[];
}
export async function getTodos(): Promise<GetTodosResponse> {
  return Promise.resolve({ list: ["todo1", "todo2"] });
}
