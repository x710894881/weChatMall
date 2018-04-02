// goods.js
var api = require('../../api.js');
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: null,
        goods: {},
        show_attr_picker: false,
        form: {
            number: 1,
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            store: wx.getStorageSync('store'),
        });

        var page = this;
        page.setData({
            id: options.id,
        });
        page.getGoods();

    },
    getGoods: function () {
        var page = this;
        app.request({
            url: api.default.goods,
            data: {
                id: page.data.id
            },
            success: function (res) {
                if (res.code == 0) {
                    var detail = res.data.detail;
                    WxParse.wxParse("detail", "html", detail, page);
                    page.setData({
                        goods: res.data,
                        attr_group_list: res.data.attr_group_list,
                    });
                }
                if (res.code == 1) {
                    wx.showModal({
                        title: "提示",
                        content: res.msg,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.switchTab({
                                    url: "/pages/index/index"
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    onGoodsImageClick: function (e) {
        var page = this;
        var urls = [];
        var index = e.currentTarget.dataset.index;
        //console.log(page.data.goods.pic_list);
        for (var i in page.data.goods.pic_list) {
            urls.push(page.data.goods.pic_list[i].pic_url);
        }
        wx.previewImage({
            urls: urls, // 需要预览的图片http链接列表
            current: urls[index],
        });
    },
    showShareTip: function () {
        var page = this;
        page.setData({
            show_share_tip: true,
        });
    },
    hideShareTip: function () {
        var page = this;
        page.setData({
            show_share_tip: false,
        });
    },

    numberSub: function () {
        var page = this;
        var num = page.data.form.number;
        if (num <= 1)
            return true;
        num--;
        page.setData({
            form: {
                number: num,
            }
        });
    },

    numberAdd: function () {
        var page = this;
        var num = page.data.form.number;
        num++;
        page.setData({
            form: {
                number: num,
            }
        });
    },

    numberBlur: function (e) {
        var page = this;
        var num = e.detail.value;
        num = parseInt(num);
        if (isNaN(num))
            num = 1;
        if (num <= 0)
            num = 1;
        page.setData({
            form: {
                number: num,
            }
        });
    },

    addCart: function () {
        this.submit('ADD_CART');
    },

    buyNow: function () {
        this.submit('BUY_NOW');
    },

    submit: function (type) {
        var page = this;
        if (!page.data.show_attr_picker) {
            page.setData({
                show_attr_picker: true,
            });
            return true;
        }
        if (page.data.form.number > page.data.goods.num) {
            wx.showToast({
                title: "商品库存不足，请选择其它规格或数量",
                image: "/images/icon-warning.png",
            });
            return true;
        }
        var attr_group_list = page.data.attr_group_list;
        var checked_attr_list = [];
        for (var i in attr_group_list) {
            var attr = false;
            for (var j in attr_group_list[i].attr_list) {
                if (attr_group_list[i].attr_list[j].checked) {
                    attr = {
                        attr_id: attr_group_list[i].attr_list[j].attr_id,
                        attr_name: attr_group_list[i].attr_list[j].attr_name,
                    };
                    break;
                }
            }
            if (!attr) {
                wx.showToast({
                    title: "请选择" + attr_group_list[i].attr_group_name,
                    image: "/images/icon-warning.png",
                });
                return true;
            } else {
                checked_attr_list.push({
                    attr_group_id: attr_group_list[i].attr_group_id,
                    attr_group_name: attr_group_list[i].attr_group_name,
                    attr_id: attr.attr_id,
                    attr_name: attr.attr_name,
                });
            }
        }
        if (type == 'ADD_CART') {//加入购物车
            wx.showLoading({
                title: "正在提交",
                mask: true,
            });
            app.request({
                url: api.cart.add_cart,
                method: "POST",
                data: {
                    goods_id: page.data.id,
                    attr: JSON.stringify(checked_attr_list),
                    num: page.data.form.number,
                },
                success: function (res) {
                    wx.showToast({
                        title: res.msg,
                        duration: 1500
                    });
                    wx.hideLoading();
                    page.setData({
                        show_attr_picker: false,
                    });

                }
            });
        }
        if (type == 'BUY_NOW') {//立即购买
            page.setData({
                show_attr_picker: false,
            });
            wx.navigateTo({
                url: "/pages/order-submit/order-submit?goods_info=" + JSON.stringify({
                    goods_id: page.data.id,
                    attr: checked_attr_list,
                    num: page.data.form.number,
                }),
            });
        }

    },

    hideAttrPicker: function () {
        var page = this;
        page.setData({
            show_attr_picker: false,
        });
    },
    showAttrPicker: function () {
        var page = this;
        page.setData({
            show_attr_picker: true,
        });
    },

    attrClick: function (e) {
        var page = this;
        var attr_group_id = e.target.dataset.groupId;
        var attr_id = e.target.dataset.id;
        var attr_group_list = page.data.attr_group_list;
        for (var i in attr_group_list) {
            if (attr_group_list[i].attr_group_id != attr_group_id)
                continue;
            for (var j in attr_group_list[i].attr_list) {
                if (attr_group_list[i].attr_list[j].attr_id == attr_id) {
                    attr_group_list[i].attr_list[j].checked = true;
                } else {
                    attr_group_list[i].attr_list[j].checked = false;
                }
            }
        }
        page.setData({
            attr_group_list: attr_group_list,
        });

        var check_attr_list = [];
        var check_all = true;
        for (var i in attr_group_list) {
            var group_checked = false;
            for (var j in attr_group_list[i].attr_list) {
                if (attr_group_list[i].attr_list[j].checked) {
                    check_attr_list.push(attr_group_list[i].attr_list[j].attr_id);
                    group_checked = true;
                    break;
                }
            }
            if (!group_checked) {
                check_all = false;
                break;
            }
        }
        if (!check_all)
            return;
        wx.showLoading({
            title: "正在加载",
            mask: true,
        });
        app.request({
            url: api.default.goods_attr_info,
            data: {
                goods_id: page.data.goods.id,
                attr_list: JSON.stringify(check_attr_list),
            },
            success: function (res) {
                wx.hideLoading();
                if (res.code == 0) {
                    var goods = page.data.goods;
                    goods.price = res.data.price;
                    goods.num = res.data.num;
                    page.setData({
                        goods: goods,
                    });
                }
            }
        });

    },


    favoriteAdd: function () {
        var page = this;
        app.request({
            url: api.user.favorite_add,
            method: "post",
            data: {
                goods_id: page.data.goods.id,
            },
            success: function (res) {
                if (res.code == 0) {
                    var goods = page.data.goods;
                    goods.is_favorite = 1;
                    page.setData({
                        goods: goods,
                    });
                }
            }
        });
    },

    favoriteRemove: function () {
        var page = this;
        app.request({
            url: api.user.favorite_remove,
            method: "post",
            data: {
                goods_id: page.data.goods.id,
            },
            success: function (res) {
                if (res.code == 0) {
                    var goods = page.data.goods;
                    goods.is_favorite = 0;
                    page.setData({
                        goods: goods,
                    });
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

});