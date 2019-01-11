import request from './request';

const prefix = '/api'; // 接口前缀
const api = {};

const apiUrlGet = {
  getSinglePoetry: '/singlePoetry', // 随机单句诗词推荐
};

const apiUrlPost = {
  postLogin: '/login', // 登录
};

// 批量生成 get 请求函数
const aipFactory = (urls, type) => {
  Object.entries(urls).forEach(item => {
    api[item[0]] = (params, options) => request[type](`${prefix}${item[1]}`, params, options);
  });
};

aipFactory(apiUrlGet, 'get');
aipFactory(apiUrlPost, 'post');

export default {
  ...api,
};
