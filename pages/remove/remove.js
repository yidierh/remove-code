// pages/remove/remove.js
const MD5 = require('../../utils/md5.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    placeholder: '',
    removeUrl: '',
    icon: '',
    vedioUrl: '',
    showCancel: false,
    percent: '',
    showProgress: false,
    downStart: false
  },

  /**
   * 数据绑定
   */
  removeUrl: function (e) {
    let _this = this
    let _removeUrl = e.detail.value
    if (_removeUrl) {
      _removeUrl = _this.formatUrl(_removeUrl)
      this.setData({
        'removeUrl': _removeUrl,
        'showCancel': true
      })
    } else {
      this.setData({
        'showCancel': false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _type = options.type
    let _typeName = ''
    let _icon = ''
    if (_type === 'douyin') {
      _typeName = '抖音'
      _icon = '../../images/douyin.png'
    } else if (_type === 'weishi') {
      _typeName = '微视'
      _icon = '../../images/weishi.png'
    } else if (_type === 'huoshan') {
      _typeName = '火山'
      _icon = '../../images/huoshan.png'
    } else if (_type === 'kuaishou') {
      _typeName = '快手'
      _icon = '../../images/kuaishou.png'
    } else if (_type === 'meipai') {
      _typeName = '美拍'
      _icon = '../../images/meipai.png'
    } else if (_type === 'pipixia') {
      _typeName = '皮皮虾'
      _icon = '../../images/pipixia.png'
    }
    this.setData({
      type: options.type,
      placeholder: `请输入${_typeName}视频链接`,
      icon: _icon
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.confirmClip()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
  * 获取视频
  */
  getVedio: function (e) {
    if (e.detail.errMsg === "getUserInfo:ok") {
      let _this = this
      let _url = _this.data.removeUrl
      let _type = _this.data.type
      let oppen_id = ''
      if (_url) {
        if (_url.indexOf('rmapi.h5youx.com')>0) {
          wx.showToast({
            title: '请输入正确的链接地址',
            icon: 'none'
          })
          return false
        } else {
          let reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
          if (reg.test(_url)) {
            wx.showLoading({
              title: '正在获取...',
              mask: true
            })
          } else {
            wx.showToast({
              title: '请输入正确的链接地址',
              icon: 'none'
            })
            return false
          }
        }
      } else {
        wx.showToast({
          title: '请输入视频链接地址',
          icon: 'none'
        })
        return false
      }
      wx.request({
        url: 'https://rmapi.h5youx.com/vlink/s.php',
        method: 'GET',
        dataType: 'JSON',
        data: {
          link: _url,
          type: _type,
          sign: MD5.hex_md5(_url + _type + 'xiaochengxv')
        },
        success(res) {
          let _res = JSON.parse(res.data)
          if (_res.succ) {
            _this.setData({
              vedioUrl: _res.data.video
            })
            wx.hideLoading()
          } else {
            wx.hideLoading()
            wx.showToast({
              title: _res.retDesc,
              icon: 'none'
            })
          }
        },
        fail(res) {
          wx.showToast({
            title: '服务器繁忙',
            icon: 'none'
          })
        }
      })
    }
  },

  /**
   * 保存视频
   */
  saveVedio: function () {
    let _this = this
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              _this.saveToAlbum()
            }
          })
        } else {
          _this.saveToAlbum()
        }
      }
    })
  },

  /**
   * 保存视频到相册
   */
  saveToAlbum: function () {
    let _vedioUrl = this.data.vedioUrl
    let _this = this
    wx.showLoading({
      title: '正在保存...',
      mask: true
    })
    const downloadTask = wx.downloadFile({
      url: _vedioUrl,
      success(res) {
        //保存视频到本地
        _this.setData({
          'percent': '100'
        })
        wx.saveVideoToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
            })
            _this.initStat()  
          },
          fail(err) {
            _this.initStat()  
            if (err.errMsg === "saveVideoToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(res) {
                  if (res.authSetting['scope.writePhotosAlbum']) {
                    wx.showToast({
                      title: '请再次保存视频',
                      icon: 'none'
                    })
                  } else {
                    wx.showToast({
                      title: '请先允许授权',
                      icon: 'none'
                    })
                  }
                }
              })
            }
          }
        })
      },
      fail(res) {
        wx.showToast({
          title: '请复制视频链接去外部浏览器下载',
          icon: 'none'
        })
      }
    })
    
    downloadTask.onProgressUpdate((res) => {
      _this.setData({
        'percent': '95',
        downStart: true,
        showProgress: true
      })
    })
  },

  /**
   * 复制前判断剪切板有没有内容
   */
  confirmClip: function () {
    let _this = this
    wx.getClipboardData({
      success(res) {
        let _clipData = res.data
        if (_clipData.indexOf('http') >= 0) {
          wx.showModal({
            title: '提示',
            content: '检测到您的剪贴板有链接是否需要粘贴？',
            success(res) {
              if (res.confirm) {
                _clipData = _this.formatUrl(_clipData)
                _this.setData({
                  'removeUrl': _clipData,
                  'showCancel': true
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 复制
   */
  copyUrl: function () {
    let _type = this.data.type
    let _vedioUrl = this.data.vedioUrl
    wx.setClipboardData({
      data: _vedioUrl,
      success(res) {
        wx.showToast({
          title: '复制成功',
        })
      },
      fail(res) {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 清除视频连接
   */
  clearUrl: function () {
    this.setData({
      'removeUrl': '',
      'showCancel': false
    })
  },

  /**
   * 获取文案中的链接
   */
  formatUrl: function (url) {
    if(url.indexOf('http') >= 0) {
      let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
      let _data = reg.exec(url)
      if(_data) {
        url = encodeURI(_data[0])
      }
    }
    return url
  },

  /**
 * 保存完成状态复原
 */
  initStat: function () {
    wx.hideLoading()
    this.setData({
      showProgress: false
    })
  }
})