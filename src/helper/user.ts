export function hasLogin(user: { uid: string }) {
  return user.uid !== "0";
}
