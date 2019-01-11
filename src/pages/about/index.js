import './index.css';
import './index.scss';
import 'styles/demo.css';
import 'styles/index.scss';
import { getBrowserChannel } from 'utils/common';

console.log(getBrowserChannel(), 'getBrowserChannel');
const a = 1;
let b = '2';
if (a === '2') {
  b = 3;
}

console.log(2);
