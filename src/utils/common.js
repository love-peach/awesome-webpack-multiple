/**
 * @desc 获取h5页面打开浏览器的环境 区分 微信 支付宝
 * @return {String} 返回浏览器环境渠道 H5 zfb_sxfqb wx_sxfqb
 */
const getBrowserChannel = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  let channel = 'H5';
  if (ua.indexOf('alipay') > -1) {
    channel = 'alipay';
  } else if (ua.indexOf('micromessenger') > -1) {
    channel = 'wechat';
  } else {
    channel = 'browser';
  }
  return channel;
};

export {
  getBrowserChannel,
};
