import './index.scss';
import api from 'api/api';
import demoImg from 'assets/images/santa_claus.png';
import 'assets/fonts/iconfont.css';
import 'styles/index.scss';

import 'utils/windowOnError';
import 'utils/flexable';

import store from 'utils/store';

store.setToken('212');
store.setUserInfo('21');

const imgDemo = document.getElementById('imgDemo');
imgDemo.src = demoImg;

const envDev = document.getElementById('env');
envDev.innerHTML = JSON.stringify(process.env);

api.getSinglePoetry(null, { 'My-Timeout': '2003', Token: '456' }).then(res => {
  if (res.code === 200) {
    console.log(res, 'success12');
  }
});
