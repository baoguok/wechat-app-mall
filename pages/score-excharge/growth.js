const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    uid: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.initData()
      } else {
        getApp().loginOK = () => {
          this.initData()
        }
      }
    })
  },
  onShow: function () {
  },
  async initData(){
    const token = wx.getStorageSync('token')
    const res1 = await WXAPI.userAmount(token)
    if (res1.code == 0) {
      this.data.score = res1.data.score
    }
    const res2 = await WXAPI.scoreDeductionRules(1);
    if (res2.code == 0) {
      this.data.deductionRules = res2.data
    }
    this.setData({
      score: this.data.score,
      deductionRules: this.data.deductionRules,
    })
  },
  async bindSave(e) {
    const score = e.detail.value.score;
    if (!score) {
      wx.showToast({
        title: '请输入积分数量',
        icon: 'none'
      })
      return
    }
    const res = await WXAPI.exchangeScoreToGrowth(wx.getStorageSync('token'), score)
    if (res.code == 0) {
      wx.showModal({
        title: '成功',
        content: '恭喜您，成功兑换'+ res.data +'成长值',
        showCancel: false
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  },
})