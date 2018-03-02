export default function request(url: string, method: string, args?: any): Promise<any> {
  // options = { ...options, withCredentials: true };
  // namespace: string = "app", group: string = "global"
  // const promise = new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(options);
  //   }, 1000 * 1);
  // });
  // axios(options)
  // return setLoading(promise, namespace, group);
  return Promise.resolve("");
}
