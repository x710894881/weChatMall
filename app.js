//app.js
var util = require('./utils/utils.js');
var api = require('./api.js');
App({
    onLaunch: function () {
        console.log('设备信息', wx.getSystemInfoSync());
        const access_token = wx.getStorageSync("access_token");
        if (!access_token) {
          this.login();
        }   
    },
    login: function () {
        var pages = getCurrentPages();
        var page = pages[(pages.length - 1)];
        //console.log(page);
        wx.showLoading({
            title: "正在登录",
            mask: true,
        });
        wx.getUserInfo({
          success: (res) => {
            wx.hideLoading();
            this.globalData.userInfo = res.userInfo
          }
        })
        // wx.login({
        //     success: (res) => {
        //         console.log('login', res)
        //         if (res.code) {
        //             const code = res.code
        //             wx.getUserInfo({
        //                 success: (res) => {
        //                     console.log('userInfo',res);
        //                     wx.hideLoading();
        //                     getApp().globalData.userInfo = res.userInfo
        //                     getApp().request({
        //                         url: api.passport.login,
        //                         method: "post",
        //                         data: {
        //                             code: code,
        //                             encrypted_data: res.encryptedData,
        //                             iv: res.iv,
        //                             signature: res.signature
        //                         },
        //                         success: (res) => {
        //                             wx.hideLoading();
        //                             if (res.code) {
        //                                 wx.setStorage("access_token", res.access_token)
        //                             } else {
        //                                 wx.showToast({
        //                                     title: res.msg
        //                                 });
        //                             }
        //                         }
        //                     });
        //                 }
        //             });
        //         }

        //     }
        // });
    },
    request: function (object) {
        const access_token = wx.getStorageSync("access_token");
        if (access_token) {
            if (!object.data)
                object.data = {};
            object.data.access_token = access_token;
        }
        wx.request({
            url: object.url,
            header: object.header || {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: object.data || {},
            method: object.method || "GET",
            dataType: object.dataType || "json",
            success: function (res) {
                if (res.data.code == -1) {
                    getApp().login();
                } else {
                    if (object.success)
                        object.success(res.data);
                }
            },
            fail: function (res) {
                if (object.fail)
                    object.fail(res);
            },
            complete: function (res) {
                if (object.complete)
                    object.complete(res);
            }
        });
    },
    saveFormId: function (form_id) {
        this.request({
            url: api.user.save_form_id,
            data: {
                form_id: form_id,
            }
        });
    },
    globalData: {
      userInfo: null
    }
});