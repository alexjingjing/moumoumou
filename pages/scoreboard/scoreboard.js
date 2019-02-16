//logs.js
const AV = require('../../utils/av-live-query-weapp-min');
const util = require('../../utils/util.js')
const UserScore = require('../../model/user-score');

Page({
  data: {
    scoreboard: [],
    logs: [],
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['今天', '近一周', '近一月', '全部'],//下拉列表的数据
    index: 0//选择的下拉列表下标
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
    this.getScoreBoard();
  },
  onLoad: function () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winWidth: res.windowWidth,
          winheight: res.windowHeight
        });
      }
    });
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    this.getScoreBoard();
  },
  getScoreBoard: function() {
    const query = new AV.Query(UserScore).include(['user']).greaterThan('score', 0).descending('score');
    if (this.data.selectData[this.data.index] == '近一周') {
      query.greaterThan('updatedAt', new Date(util.getQueryDate(7, new Date())));
    } else if (this.data.selectData[this.data.index] == '近一月') {
      query.greaterThan('updatedAt', new Date(util.getQueryDate(30, new Date())));
    } else if (this.data.selectData[this.data.index] == '今天') {
      query.greaterThan('updatedAt', new Date(util.getQueryDate(1, new Date())));
    }
    query.limit(10);
    query.find().then(result => {
      console.log(result);
      this.setData({
        scoreboard: result
      })
    });
  }
})
