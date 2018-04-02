// pages/favorite/favorite.js
var api = require('../../api.js');
var app = getApp();
var is_loading_more = false;
var no_more_data = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        show_no_data_tip: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadGoodsList();
    },

    loadGoodsList: function () {
        var page = this;
        var p = parseInt(page.data.page);
        app.request({
            url: api.user.favorite_list,
            data: {
                page: p,
            },
            success: function (res) {
                if (res.code == 0) {
                    page.setData({
                        page: (p + 1),
                        goods_list: res.data.list,
                    });
                    if (res.data.list.length == 0)
                        no_more_data = true;
                }
                page.setData({
                    show_no_data_tip: (page.data.goods_list.length == 0),
                });
            },
        });
    },

    loadMoreGoodsList: function () {
        var page = this;
        if (is_loading_more || no_more_data)
            return;
        var p = parseInt(page.data.page);
        is_loading_more = true;
        page.setData({
            show_loading_bar: true,
        });
        app.request({
            url: api.user.favorite_list,
            data: {
                page: p,
            },
            success: function (res) {
                if (res.code == 0) {
                    var goods_list = page.data.goods_list.concat(res.data.list);
                    page.setData({
                        page: (p + 1),
                        goods_list: goods_list,
                    });
                    if (res.data.list.length == 0)
                        no_more_data = true;
                }
            },
            complete: function () {
                is_loading_more = false;
                page.setData({
                    show_loading_bar: false,
                });
            }
        });
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

    onReachBottom: function () {
        var page = this;
        page.loadMoreGoodsList();
    },
});