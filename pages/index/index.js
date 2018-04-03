//index.js
//获取应用实例
const AV = require('../../utils/av-live-query-weapp-min');
const util = require('../../utils/util.js');
const UserInfo = require('../../model/user-info');
const UserScore = require('../../model/user-score');
const app = getApp()
var context;
const innerAudioList = [];
const LENGTH = 8;
var flag = true;
var timer;
for (var i = 0; i < LENGTH; i++) {
  const innerAudioContext = wx.createInnerAudioContext()
  innerAudioContext.autoplay = false
  innerAudioContext.onEnded((res) => {
    innerAudioList.push(innerAudioContext);
    console.log(innerAudioList.length);
  })
  innerAudioList.push(innerAudioContext);
}


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    soundUrl: '',
    score: 0
  },
  //事件处理函数
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
    context = this;
    this.cancel();
    this.start();
    this.setData({
      score: this.data.score + 1
    })
    if (innerAudioList.length > 0) {
      innerAudioList.pop().play();
    }
    flag = false;
  },
  countdown: function () {
    timer = setTimeout(function () {
      console.log("----Countdown----");
      clearTimeout(timer);
      context.uploadScore(context.data.score);
      context.setData({
        score: 0
      })
    }, 2500);
  },
  uploadScore: function (score) {
    console.log(score)
    var user = AV.User.current()
    if (util.isObjectEmpty(user)) {
      this.login().then(user => this.saveUserInfo(user, score)).catch(error => console.error(error.message));
    }
    var acl = new AV.ACL();
    acl.setPublicReadAccess(false);
    acl.setPublicWriteAccess(false);
    acl.setReadAccess(user, true);
    acl.setWriteAccess(user, true);
    const query = new AV.Query(UserScore)
      .equalTo('user', AV.Object.createWithoutData('User', user.id));
    query.find().then(result => {
      if (result.length > 0) {
        console.log(result);
        // 第一个参数是 className，第二个参数是 objectId
        var userScore = AV.Object.createWithoutData('UserScore', result[0].id);
        // 修改属性
        userScore.set('score', score);
        // 保存到云端
        userScore.save();
      } else {
        new UserScore({
          user: user,
          score: score
        }).setACL(acl).save().then((result) => {
          console.log(result);
        }).catch(error => this.showNetworkError());
      }
    })
  },
  // 自定义的开始按钮
  start: function () {
    this.countdown();
  },
  cancel: function () {
    clearTimeout(timer);
  },
  login: function () {
    // AV.User.loginWithWeapp().then(user => {
    //   console.log(user.toJSON());
    // }).catch(console.error);
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp()).catch(error => console.error(error.message));
  },
  onReady: function () {
    console.log('page ready');
    this.login().then(user => this.saveUserInfo(user, this.data.userInfo)).catch(error => console.error(error.message));
  },
  onLoad: function () {
    console.log('page load');
    wx.downloadFile({
      url: "https://lc-hemv1boJ.cn-n1.lcfile.com/4c0e011c174cf249befa.mp3",
      success: res => {
        console.log(res);
        this.setData({
          soundUrl: res.tempFilePath
        })
        for (var i = 0; i < LENGTH; i++) {
          innerAudioList[i].src = res.tempFilePath;
        }
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.saveUserInfo(AV.User.current(), res.userInfo);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          this.saveUserInfo(AV.User.current(), res.userInfo);
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    this.saveUserInfo(AV.User.current(), e.detail.userInfo);
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  saveUserInfo: function (user, userInfo) {
    if (!util.isObjectEmpty(user) && !util.isObjectEmpty(userInfo)) {
      const query = new AV.Query(UserInfo)
        .equalTo('user', AV.Object.createWithoutData('User', user.id));
      query.find().then(result => {
        if (result.length == 0) {
          // 没有相关数据
          // 可以添加
          var acl = new AV.ACL();
          acl.setPublicReadAccess(false);
          acl.setPublicWriteAccess(false);
          acl.setReadAccess(user, true);
          acl.setWriteAccess(user, true);
          new UserInfo({
            user: user,
            info: userInfo
          }).setACL(acl).save().then((result) => {
            console.log(result);
          }).catch(error => this.showNetworkError());
        }
      });
    }
  },
  showNetworkError: function () {
    wx.showModal({
      title: '网络请求错误',
      content: '请稍后重试',
      showCancel: false,
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
