import { Notify } from 'react-vant';

const baseUrl = `https://platform-test.fushuhealth.com/recovery-web`; // 测试
// const baseUrl = `https://ybsyapp.enzemed.com:8501/recovery-wx`;

type httpType = {
  url: string;
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT';
  data?: any;
  needLogin?: boolean;
  [key: string]: any;
};

const handleOps = ({
  url,
  method = 'GET',
  data,
  needLogin = true,
  ...options
}: httpType) => {
  const token = localStorage.token;
  if (method === 'GET') {
    const list = [];
    for (const key in data) {
      let str = `${key}=${data[key]}`;
      list.push(str);
    }
    const query = list.join('&');
    const allUrl = `${baseUrl}${url}?${query}`;
    const ops = {
      ...options,
      headers: {
        'recovery-token': token ?? '',
      },
    };
    return {
      url: allUrl,
      options: ops,
      needLogin,
    };
  }
  if (['DELETE', 'POST', 'PUT'].includes(method)) {
    const allUrl = `${baseUrl}${url}`;
    const ops = {
      ...options,
      method,
      headers: {
        'Content-Type': 'application/json',
        'recovery-token': token ?? '',
      },
      body: JSON.stringify(data),
    };
    return {
      url: allUrl,
      options: ops,
      needLogin,
    };
  }
};

const request = async (params: httpType) => {
  const { url, options, needLogin = true } = handleOps(params);

  const res = await fetch(url, options);
  const data = await res.json();
  if (data && !data.success) {
    if (data.code === 2 && needLogin) {
      localStorage.token = '';
      localStorage.user = '';
      // window.location.href = `/?returnUrl=${encodeURIComponent(window.location.href)}`;
    }
    Notify.show({ type: 'danger', message: data.message });
  }
  return data;
};

export default request;
