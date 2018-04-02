// user.js
const api = require('../../api.js')
const app = getApp()
Page({
    data: {
        contact_tel: "",
        show_customer_service: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            store: wx.getStorageSync('store'),
        });

        var page = this;
        var contact_tel = wx.getStorageSync("contact_tel");
        var show_customer_service = wx.getStorageSync("show_customer_service");
        page.setData({
            contact_tel: contact_tel,
            show_customer_service: show_customer_service,
        });
    },
    onShow: function () {
      const user_info = app.globalData.userInfo
      this.setData({
          user_info: user_info,
      });
      console.log(user_info)
      // page.getOrderCountData();
    },

    getOrderCountData: function () {
        var page = this;
        app.request({
            url: api.order.count_data,
            success: function (res) {
                if (res.code == 0) {
                    page.setData({
                        count_data: res.data,
                    });
                }
            }
        });
    },

    callTel: function (e) {
        var tel = e.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: tel, //仅为示例，并非真实的电话号码
        });
    },
});