import axios from "axios";
import { Toast } from "antd-mobile";

let request = axios.create({
  timeout: 60000,
});

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    if (response.status !== 200) {
      Toast.fail("Internal Server Error");
    }
    return response?.data;
  },
  function (error) {
    Toast.fail("Internal Server Error");
    return Promise.reject(error);
  }
);

export default request;
