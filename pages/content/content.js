// pages/content/content.js
var WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    console.log(id)
    that.setData({
      articleId:id
    })
    wx.request({
      url: 'https://news-at.zhihu.com/api/4/news/'+id,
      headers: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var article = res.data.body;
        WxParse.wxParse('article', 'html', article, that, 5);
        wx.setNavigationBarTitle({
          title: res.data.title
        })
      }
    }),
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/story/' + id + '/short-comments',
        headers: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          that.setData({
            comments: res.data.comments
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  }
})