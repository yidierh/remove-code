// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: ''
  },
  getUserInfo: function(e) {
    let _this = this
    if (e.detail.errMsg === "getUserInfo:ok") {
      _this.setData({
        'userInfo': e.detail.userInfo
      })
    } else {
      _this.showNeed()
    }
  },

  /**
   * 请求授权
   */
  showNeed: function() {
    wx.showToast({
      title: '点击头像进行登录',
      icon: 'none'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    //查看是否授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              _this.setData({
                'userInfo': res.userInfo
              })
            }
          })
        } else {
          _this.showNeed()
        }
      },
      fail(res) {
        _this.showNeed()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})