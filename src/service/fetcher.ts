const baseUrl = `https://wx-test.fushuhealth.com/recovery-wx`;
const fetcher = (params, a) => {
  return fetch({ ...params, url: `${baseUrl}${params.url}` }).then((res) => res.json());
};

export default fetcher;
