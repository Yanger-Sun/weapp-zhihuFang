//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    beforeNews:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'http://news-at.zhihu.com/api/4/news/latest', //获取最新的新闻
      headers: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          banner:res.data.stories
        })
        wx.setNavigationBarTitle({
          title: '仿知乎微信小程序'
        })
      }
    })
    var nowTime = that.makeDate();
    that.setData({
      beforeDate: nowTime
    })
    wx.request({
      url: 'https://news-at.zhihu.com/api/4/news/before/'+ nowTime,//获取该天前一日的新闻
      headers:{
        "content-type":"application/json"
      },
      success: function (res) {
        var result = that.data.beforeNews.concat(res.data)
        that.setData({
          beforeNews: result
        })
      }
    })
  },
  /*页面上拉触底事件的处理函数*/
  onReachBottom: function () {
      var that = this;
      //获取加载前一天对应的新闻数据
      var beforeDate = that.makeBeforeDate(that.data.beforeDate); //true表示获取前一天对应的日期格式
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/news/before/' + beforeDate,//获取该天前一天的新闻内容
        headers: {
          "content-type": "application/json"
        },
        success: function (res) {
          var result = that.data.beforeNews.concat(res.data)
          that.setData({
            beforeNews: result,//将前一天的新闻加入先前的新闻数组中并对其进行页面渲染 
            beforeDate: beforeDate //当前已加载到该日期前一天的新闻   每次加载一次，更改一次数值  20180307  20180306
          })
        }
      })
  }, 
  /* 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {
    var that = this;
    wx.request({
      url: 'http://news-at.zhihu.com/api/4/news/latest', //获取最新的新闻
      headers: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          banner: res.data.stories
        })
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toList:function(e){
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '../content/content?id=' + id
    })
  },
  //获取当前时间
  makeDate:function(){
      var date = new Date();              //  Wed Mar 07 2018 13:40:21 GMT+0800 (中国标准时间)    
      var newYear = date.getFullYear();   //2018
      var newMonth = date.getMonth()+1;   //2 + 1  3  
      var newToday = date.getDate();      //7
      if (newMonth < 10) {                //3    11           
        newMonth = "0" + newMonth;        //03   11
      }          
      if (newToday < 10) {                 //3    11   
        newToday = "0" + newToday;         //03   11
      }                                 
      
      var nowTime = newYear + "" + newMonth + "" + newToday;
      return nowTime                       //20180307
    
  },
  //获去即将加载新闻的日期
  makeBeforeDate: function (date) {
      //20180307 
      var nowYear = date.slice(0, 4);       //2018
      var nowMonth = date.slice(4, 6) - 1;  //03
      var nowday = date.slice(6);           //07
      var newCompare = new Date(nowYear, nowMonth, nowday).getTime() - 86400000;   //减去一天的时间戳差  即为前一天的时间戳 
      var newDate = new Date(newCompare);    //前一天时间戳对应的时间 
      var newYear = newDate.getFullYear();   //前一天时间对应的年  2018 
      var newMonth = newDate.getMonth() + 1; //前一天时间对应的月  2 + 1  3 
      var newToday = newDate.getDate();      //前一天时间对应的日  6
      if (newMonth < 10) {                   //3    11 
        newMonth = "0" + newMonth;           //03   11
      }                                 
      if (newToday < 10) {                   //6    11
        newToday = "0" + newToday;           //06   11
      }                                  

      var nowTime = newYear + "" + newMonth + "" + newToday;    20180306
     
      return nowTime
  }
})
