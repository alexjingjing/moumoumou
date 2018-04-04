//logs.js
const AV = require('../../utils/av-live-query-weapp-min');
const util = require('../../utils/util.js')
const UserScore = require('../../model/user-score');

Page({
  data: {
    scoreboard: [],
    logs: []
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
    const query = new AV.Query(UserScore).include(['user'])
      .greaterThan('score', 0).descending('score');
    query.limit(10);
    query.find().then(result => {
      console.log(result);
      this.setData({
        scoreboard: result
      })
    });
  }
})
