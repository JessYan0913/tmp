export const getHost = (targetUrl: string) => targetUrl.match(/\/\/([^/]+)/)?.[1];
export const isSameDomain = (targetUrl = '', source = globalThis.location.host) => {
  const isHttpUrl = /^(http[s]?:)?\/\//.test(targetUrl);

  if (!isHttpUrl) return true;

  return getHost(targetUrl) === source;
};
