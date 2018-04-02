var api = require('../../api.js');
var app = getApp();
Page({
    data: {
        banner_list: [],
        cat_list: [],
        column_list: [],
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            store: wx.getStorageSync('store'),
        });
        var store_name = wx.getStorageSync("store_name");
        if (store_name) {
            wx.setNavigationBarTitle({
                title: store_name,
            });
        }
        var page = this;
        app.request({
            url: api.index,
            success: function (res) {
                console.log('banner', res)
                if (res.code) {
                    page.setData({
                      banner_list: res.banner
                    });
                    // wx.setStorageSync("store_name", res.data.store.name);
                    // wx.setNavigationBarTitle({
                    //     title: res.data.store.name,
                    // });
                }
            }
        });
    },
    onSearchSubmit: function (e) {
        wx.navigateTo({
            url: "/pages/list/list?keyword=" + e.detail.value.keyword,
        });
    },

    openListPage: function (e) {
        //console.log(e);
        var options = e.currentTarget.dataset.options;
        var reload = e.currentTarget.dataset.reload;
        if (reload && reload == "true") {
            reload = true;
        } else {
            reload = false;
        }
        options = JSON.parse(options);
        var url = e.currentTarget.dataset.url;
        wx.setStorageSync("list_page_options", options);
        wx.setStorageSync("list_page_reload", reload);
        wx.switchTab({
            url: url
        });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

        return {
            path: "?refid=1",
        };
    }
});
