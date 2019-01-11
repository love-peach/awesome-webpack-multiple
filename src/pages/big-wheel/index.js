import 'utils/flexable';

import './style.scss';
import thumb1 from 'assets/images/big-wheel/thumb_interest_free_oupons_15.png';
import thumb2 from 'assets/images/big-wheel/thumb_interest_free_oupons_30.png';
import thumb3 from 'assets/images/big-wheel/thumb_jindong_100.png';
import thumb4 from 'assets/images/big-wheel/thumb_phone_30.png';
import thumb5 from 'assets/images/big-wheel/thumb_reg_package.png';
import thumb6 from 'assets/images/big-wheel/thumb_thank.png';
import thumb7 from 'assets/images/big-wheel/thumb_voucher_coupon_100.png';
import thumb8 from 'assets/images/big-wheel/thumb_watch.png';

const prizeListMock = [
  {
    id: 1,
    index: 0,
    name: '奖品一',
    thumb: thumb1,
    probability: 1 / 8,
  },
  {
    id: 2,
    index: 1,
    name: '奖品二',
    thumb: thumb2,
    probability: 1 / 8,
  },
  {
    id: 3,
    index: 2,
    name: '奖品三',
    thumb: thumb3,
    probability: 1 / 8,
  },
  {
    id: 4,
    index: 3,
    name: '奖品四',
    thumb: thumb4,
    probability: 1 / 8,
  },
  {
    id: 5,
    index: 4,
    name: '奖品五',
    thumb: thumb5,
    probability: 1 / 8,
  },
  {
    id: 6,
    index: 4,
    name: '奖品六',
    thumb: thumb6,
    probability: 1 / 8,
  },
  {
    id: 7,
    index: 4,
    name: '奖品七',
    thumb: thumb7,
    probability: 1 / 8,
  },
  {
    id: 8,
    index: 4,
    name: '奖品八',
    thumb: thumb8,
    probability: 1 / 8,
  },

];

// eslint-disable-next-line no-unused-vars
const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    isShowResultModal: false,
    lightNum: 28, // 彩灯数量
    runNum: 10, // 转盘至少转 n 圈
    prizeList: [], // 奖池
    animationData: {}, // 动画
    chance: 0, // 剩余抽奖机会
    btnDisabled: '', // 按钮是否可点
  },
  mounted() {
    this.getPrizeList();
    this.getChance();
  },
  methods: {
    /**
     * 获取奖品列表
     */
    getPrizeList() {
      this.prizeList = prizeListMock;
    },

    /**
     * 获取抽奖机会
     */
    getChance() {
      this.chance = 3;
    },

    /**
     * 点击抽奖
     */
    handleClickLottery() {
      const { chance, btnDisabled } = this;
      if (btnDisabled) {
        return;
      }
      if (chance) {
        const prizeIndex = this.getPrizeIndex();
        this.handleTurnWheel(prizeIndex);
        this.btnDisabled = true;
        this.chance = chance - 1;
      } else {
        alert('没有机会了！');
      }
    },

    /**
     * 转动转盘
     */
    handleTurnWheel(prizeIndex) {
      const { runNum, prizeList } = this;

      const prizeLength = prizeList.length;
      const runDegs = this.runDegs || 0;
      this.runDegs = runDegs + 360 - (runDegs % 360) + (360 * runNum - prizeIndex * (360 / prizeLength));

      this.animationData = {
        transform: `rotate(${this.runDegs}deg)`,
        '-webkit-transform': `rotate(${this.runDegs}deg)`,
      };
      this.btnDisabled = 'disabled';
      const that = this;
      setTimeout(() => {
        alert(`您获得了${prizeList[prizeIndex].name}`);
        that.btnDisabled = false;
      }, 10000);
    },

    /**
     * 获取中奖奖品 可以从后台获取，也可以前台自己算
     */
    getPrizeIndex() {
      // 生成随机数 0 - 1000
      const range = this.getPrizeProbabilityRange();
      const random = Math.random() * 1000;
      const prizeIndex = range.filter(item => random > item).length;
      console.log(random, range, prizeIndex);
      return prizeIndex;
    },

    /**
     * 生成奖品概率对应的区间范围 在1000的区间段。如果觉得不够 可适当调整精度。也跟奖品列表的 probability 的位数有关。
     */
    getPrizeProbabilityRange() {
      const { prizeList } = this;
      const range = [];
      prizeList.reduce((prev, next) => {
        let prevValue = '';
        if (prev.probability) {
          prevValue = prev.probability;
        } else if (prev.probability === 0) {
          prevValue = 0;
        } else {
          prevValue = prev;
        }
        range.push(parseInt(prevValue * 10, 10));
        return prevValue + next.probability;
      });
      return range;
    },

    handleShowResultModal() {
      this.isShowResultModal = true;
    },

    handleHideResultModal() {
      this.isShowResultModal = false;
    },
  },
});
