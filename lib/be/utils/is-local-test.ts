export function isLocalTest(ip: string) {
  const isDev = process.env.NODE_ENV === "development";
  return isDev && ["::1", "127.0.0.1"].includes(ip);
}
