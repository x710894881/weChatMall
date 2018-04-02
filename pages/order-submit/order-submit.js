// order-submit.js
var api = require('../../api.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        total_price: 0,
        address: null,
        express_price: 0.00,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var page = this;
        page.setData({
            options: options,
        });
    },

    orderSubmit: function () {
        var page = this;
        if (!page.data.address || !page.data.address.id) {
            wx.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png",
            });
            return;
        }
        var data = {
            address_id: page.data.address.id,
        };
        if (page.data.cart_id_list) {
            data.cart_id_list = JSON.stringify(page.data.cart_id_list);
        }
        if (page.data.goods_info) {
            data.goods_info = JSON.stringify(page.data.goods_info);
        }
        wx.showLoading({
            title: "正在提交",
            mask: true,
        });

        //提交订单
        app.request({
            url: api.order.submit,
            method: "post",
            data: data,
            success: function (res) {
                wx.hideLoading();
                if (res.code == 0) {
                    setTimeout(function () {
                        page.setData({
                            options: {},
                        });
                    },1);
                    var order_id = res.data.order_id;

                    //获取支付数据
                    app.request({
                        url: api.order.pay_data,
                        data: {
                            order_id: order_id,
                            pay_type: 'WECHAT_PAY',
                        },
                        success: function (res) {
                            if (res.code == 0) {
                                //发起支付
                                wx.requestPayment({
                                    timeStamp: res.data.timeStamp,
                                    nonceStr: res.data.nonceStr,
                                    package: res.data.package,
                                    signType: res.data.signType,
                                    paySign: res.data.paySign,
                                    success: function (e) {
                                        wx.redirectTo({
                                            url: "/pages/order/order?status=1",
                                        });
                                    },
                                    fail: function (e) {
                                    },
                                    complete: function (e) {
                                        if (e.errMsg == "requestPayment:fail" || e.errMsg == "requestPayment:fail cancel") {//支付失败转到待支付订单列表
                                            wx.showModal({
                                                title: "提示",
                                                content: "订单尚未支付",
                                                showCancel: false,
                                                confirmText: "确认",
                                                success: function (res) {
                                                    if (res.confirm) {
                                                        wx.redirectTo({
                                                            url: "/pages/order/order?status=0",
                                                        });
                                                    }
                                                }
                                            });
                                            return;
                                        }
                                        if (e.errMsg == "requestPayment:ok") {
                                            return;
                                        }
                                        wx.redirectTo({
                                            url: "/pages/order/order?status=-1",
                                        });
                                    },
                                });
                                return;
                            }
                            if (res.code == 1) {
                                wx.showToast({
                                    title: res.msg,
                                    image: "/images/icon-warning.png",
                                });
                                return;
                            }
                        }
                    });
                }
                if (res.code == 1) {
                    wx.showToast({
                        title: res.msg,
                        image: "/images/icon-warning.png",
                    });
                    return;
                }
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
        var page = this;
        var address = wx.getStorageSync("picker_address");
        if (address) {
            page.setData({
                address: address,
            });
            wx.removeStorageSync("picker_address");
        }
        page.getOrderData(page.data.options);
    },

    getOrderData: function (options) {
        var page = this;
        var address_id = "";
        if (page.data.address && page.data.address.id)
            address_id = page.data.address.id;
        if (options.cart_id_list) {
            var cart_id_list = JSON.parse(options.cart_id_list);
            wx.showLoading({
                title: "正在加载",
                mask: true,
            });
            app.request({
                url: api.order.submit_preview,
                data: {
                    cart_id_list: options.cart_id_list,
                    address_id: address_id,
                },
                success: function (res) {
                    wx.hideLoading();
                    if (res.code == 0) {
                        page.setData({
                            total_price: parseFloat(res.data.total_price),
                            goods_list: res.data.list,
                            cart_id_list: res.data.cart_id_list,
                            address: res.data.address,
                            express_price: parseFloat(res.data.express_price),
                        });
                    }
                    if (res.code == 1) {
                        wx.showModal({
                            title: "提示",
                            content: res.msg,
                            showCancel: false,
                            confirmText: "返回",
                            success: function (res) {
                                if (res.confirm) {
                                    wx.navigateBack({
                                        delta: 1,
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        if (options.goods_info) {
            wx.showLoading({
                title: "正在加载",
                mask: true,
            });
            app.request({
                url: api.order.submit_preview,
                data: {
                    goods_info: options.goods_info,
                    address_id: address_id,
                },
                success: function (res) {
                    wx.hideLoading();
                    if (res.code == 0) {
                        page.setData({
                            total_price: res.data.total_price,
                            goods_list: res.data.list,
                            goods_info: res.data.goods_info,
                            address: res.data.address,
                            express_price: parseFloat(res.data.express_price),
                        });
                    }
                    if (res.code == 1) {
                        wx.showModal({
                            title: "提示",
                            content: res.msg,
                            showCancel: false,
                            confirmText: "返回",
                            success: function (res) {
                                if (res.confirm) {
                                    wx.navigateBack({
                                        delta: 1,
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
    },

    copyText: function (e) {
        var text = e.currentTarget.dataset.text;
        if (!text)
            return;
        wx.setClipboardData({
            data: text,
            success: function () {
                wx.showToast({
                    title: "已复制内容",
                });
            },
            fail: function () {
                wx.showToast({
                    title: "复制失败",
                    image: "/images/icon-warning.png",
                });
            },
        });
    },

});